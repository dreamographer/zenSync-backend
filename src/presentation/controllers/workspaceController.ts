import { NextFunction, Request, Response } from "express";
import { IWorkspaceService } from "../../interfaces/IWorkspaceService";

const CLIENT_URL = process.env.CLIENT_URL;

export class WorkspaceController {
  private workspaceService: IWorkspaceService;

  constructor(workspaceService: IWorkspaceService) {
    this.workspaceService = workspaceService;
  }

  async onFindUserWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = await this.workspaceService.findWorkspaceByUser(
        req.user as string
      );
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

  async onAddCollaborator(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, userId } = req.params;
      const added = await this.workspaceService.addCollaborator(
        workspaceId,
        userId
      );
      if (added) {
        return res
          .status(200)
          .json({ message: "Collaborator added successfully" });
      } else {
        return res.status(404).json({ error: "Workspace or user not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async onRemoveCollaborator(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, userId } = req.params;
      const removed =
        await this.workspaceService.removeCollaborator(
          workspaceId,
          userId
        );
      if (removed) {
        return res
          .status(200)
          .json({ message: "Collaborator removed successfully" });
      } else {
        return res.status(404).json({ error: "Workspace or user not found" });
      }
    } catch (error) {
      next(error);
    }
  }
}
