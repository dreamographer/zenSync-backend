import { Request, Response, NextFunction } from "express";
import { IFolderService } from "../../interfaces/IFolderService";
import { Server } from "socket.io";

export class FolderController {
  private folderService: IFolderService;

  constructor(folderService: IFolderService) {
    this.folderService = folderService;
  }

  async getAllFolders(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.workspaceId;
      if(workspaceId=="undefined"){
        return res.status(404).json({ error: "NO Workspace Id" });
      }
      
      const folders = await this.folderService.getAllFolders(workspaceId);
      res.json(folders);
    } catch (error) {
      next(error);
    }
  }

  async getFolderById(req: Request, res: Response, next: NextFunction) {
    try {
      const folderId = req.params.id;
      const folder = await this.folderService.getFolderById(folderId);
      if (!folder) {
        return res.status(404).json({ error: "Folder not found" });
      }
      res.json(folder);
    } catch (error) {
      next(error);
    }
  }

  async createFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user as string;
      const folderData = req.body;
      const folder = await this.folderService.createFolder(userId, folderData);
      const io: Server = req.io as Server;
      io.emit("folderCreated", folder);
      res.status(201).json(folder);
    } catch (error) {
      next(error);
    }
  }

  async updateFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const folderId = req.params.id;
      const folderData = req.body;
      const updatedFolder = await this.folderService.updateFolder(
        folderId,
        folderData
      );
        const io: Server = req.io as Server;
        io.emit("folderUpdated", updatedFolder);
      if (!updatedFolder) {
        return res.status(404).json({ error: "Folder not found" });
      }
      
      res.json(updatedFolder);
    } catch (error) {
      next(error);
    }
  }

  async deleteFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const folderId = req.params.id;
      
      await this.folderService.deleteFolder(folderId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}
