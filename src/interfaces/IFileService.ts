import { File } from "../entities/File";
 
export interface IFileService {
  createFile(userId: string, fileData: Partial<File>): Promise<File>;
  getFile(fileId: string): Promise<File | null>;
  updateFile(fileId: string, updates: Partial<File>): Promise<File | null>;
  deleteFile(fileId: string): Promise<void>;
  findAllFilesInFolder(folderId: string): Promise<File[]>;
}

