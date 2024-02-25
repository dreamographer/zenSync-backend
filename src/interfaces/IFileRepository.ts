
import { File } from "../entities/File";

export interface IFileRepository {
  create(title: string, folderId: string): Promise<File>;
  update(fileId: string, updates: Partial<File>): Promise<File | null>;
  delete(fileId: string): Promise<void>;
  findAllFilesInFolder(folderId: string): Promise<File[]>;
}
