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
      const fileData = req.body
      const userId=req.user as string
      const newFile = await this.fileService.createFile(userId, fileData);
      const io: Server = req.io as Server;
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
      res.status(200).json(updatedFile);
    } catch (error) {
      next(error);
    }
  }
  async moveToTrash(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;
      
      const updatedFile = await this.fileService.moveToTrash(fileId);
      res.status(200).json(updatedFile);
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;
      await this.fileService.deleteFile(fileId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

