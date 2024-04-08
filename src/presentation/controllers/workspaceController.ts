import { NextFunction, Request, Response } from "express";
import { IWorkspaceService } from "../../interfaces/IWorkspaceService";
import { User } from "../../entities/User";
import { Server } from "socket.io";


export class WorkspaceController {
  private workspaceService: IWorkspaceService;

  constructor(workspaceService: IWorkspaceService) {
    this.workspaceService = workspaceService;
  }

  async onFindUserWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user as string;
     const io: Server = (req as any).io as Server;

      io.on("workspaceUpdated", async createdWorkspace => {
    
        if (createdWorkspace.workspaceOwner === userId) {
          const workspace = await this.workspaceService.findWorkspaceByUser(
            userId
          );
          
          if (workspace) {
            io.to(userId).emit("userWorkspacesUpdated", workspace);
          }
        }
      });
      const workspace = await this.workspaceService.findWorkspaceByUser(userId);
      
      if (workspace) {
        return res.status(200).json(workspace);
      } else {
        return res.status(404).json({ error: "Workspace not found" });
      }
    } catch (error) {
      next(error);
    }
  }
  async onFindWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const workspace = await this.workspaceService.findWorkspaceById(id);
      if (workspace) {
        return res.status(200).json(workspace);
      } else {
        return res.status(404).json({ error: "Workspace not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async onCreateWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceData ={ ...req.body,'workspaceOwner':req.user};
      const createdWorkspace = await this.workspaceService.createWorkspace(
        workspaceData
      );
       const io: Server = (req as any).io as Server;
       io.emit("workspaceUpdated", createdWorkspace);

      return res.status(201).json(createdWorkspace);
    } catch (error) {
      next(error);
    }
  }

  async onUpdateWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const workspaceData = req.body;
      const updatedWorkspace = await this.workspaceService.updateWorkspace(
        id,
        workspaceData
      );
      if (updatedWorkspace) {
        return res.status(200).json(updatedWorkspace);
      } else {
        return res.status(404).json({ error: "Workspace not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async onDeleteWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await this.workspaceService.deleteWorkspace(id);
      if (deleted) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: "Workspace not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async onGetCollaborators(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const collaborators = await this.workspaceService.getCollaborators(
        workspaceId
      );
      return res.status(200).json(collaborators);
      
    } catch (error) {
      next(error);
    }
  }

  async onAddCollaborator(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const {collaborators}=req.body 
      
      const added = await this.workspaceService.addCollaborator(
        workspaceId,
        collaborators  as string[]
      );
      if (added) {
        return res
          .status(200)
          .json({ message: "Collaborator added successfully",data:added });
      } else {
        return res.status(404).json({ error: "Workspace or user not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async onRemoveCollaborator(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const userIds = req.body.userIds;
      
      
      const removed = await this.workspaceService.removeCollaborator(
        workspaceId,
        userIds
      );
      
      if (removed) {
        return res
          .status(200)
          .json({ message: "Collaborator removed successfully",data:removed });
      } else {
        return res.status(404).json({ error: "Workspace or user not found" });
      }
    } catch (error) {
      next(error);
    }
  }
}
