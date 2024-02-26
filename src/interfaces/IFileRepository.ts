
import { File } from "../entities/File";

export interface IFileRepository {
  create(folderData: Partial<File>): Promise<File>;
  update(fileId: string, updates: Partial<File>): Promise<File | null>;
  delete(fileId: string): Promise<void>;
  findAllFilesInFolder(folderId: string): Promise<File[]>;
}
