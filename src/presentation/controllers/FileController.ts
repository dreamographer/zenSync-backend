import { NextFunction, Request, Response } from "express";
import { IFileService } from "../../interfaces/IFileService";
import { Server } from "socket.io";

export class FileController {
  private fileService: IFileService;

  constructor(fileService: IFileService) {
    this.fileService = fileService;
  }

  async createFile(req: Request, res: Response, next: NextFunction) {
    try {
      const fileData = req.body;
      const userId = req.user as string;
      const newFile = await this.fileService.createFile(userId, fileData);
      const io: Server = (req as any).io as Server;
      io.emit("fileCreated", newFile);
      res.status(201).json(newFile);
    } catch (error) {
      next(error);
    }
  }

  async getAllFilesInFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const { folderId } = req.params;

      const files = await this.fileService.findAllFilesInFolder(folderId);
      res.status(200).json(files);
    } catch (error) {
      next(error);
    }
  }

  async getFile(req: Request, res: Response, next: NextFunction) {
    try {
      const fileId = req.params.fileId;
      const file = await this.fileService.getFile(fileId);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      res.status(200).json(file);
    } catch (error) {
      next(error);
    }
  }

  async updateFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;
      const updates = req.body;
      const updatedFile = await this.fileService.updateFile(fileId, updates);
      const io: Server = (req as any).io as Server;
      io.emit("fileUpdated", updatedFile);
      res.status(200).json(updatedFile);
    } catch (error) {
      next(error);
    }
  }
  async moveToTrash(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;

      const updatedFile = await this.fileService.moveToTrash(fileId);
      const io: Server = (req as any).io as Server;
      io.emit("fileUpdated", updatedFile);
      io.emit("addToTrash", updatedFile);
      res.status(200).json(updatedFile);
    } catch (error) {
      next(error);
    }
  }

  async getAllFilesInTrash(req: Request, res: Response, next: NextFunction) {
    try {
      const filesInTrash = await this.fileService.getAllFilesInTrash();

      res.json(filesInTrash);
    } catch (error) {
      next(error);
    }
  }

  async restoreFile(req: Request, res: Response, next: NextFunction) {
    try {
      const io: Server = (req as any).io as Server;
      const fileId = req.params.fileId;

      const updatedFile = await this.fileService.restoreFile(fileId);
      io.emit("fileUpdated", updatedFile);
      io.emit("removedTrash", updatedFile);
      return res.status(200).json(updatedFile);
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const io: Server = (req as any).io as Server;
      const { fileId } = req.params;
      await this.fileService.deleteFile(fileId);
      io.emit("removedTrash", fileId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  async updateIsPublished(req: Request, res: Response, next: NextFunction) {
    try {
      const fileId = req.params.fileId;
      const isPublished = req.body.isPublished;
      const io: Server = (req as any).io as Server;
      const updatedFile = await this.fileService.updateIsPublished(
        fileId,
        isPublished
      );
      io.emit("fileUpdated", updatedFile);
      return res.status(200).json(updatedFile);
    } catch (error) {
      next(error);
    }
  }
}
