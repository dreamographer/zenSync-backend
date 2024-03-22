
import { File } from "../entities/File";

export interface IFileRepository {
  create(folderData: Partial<File>): Promise<File>;
  update(fileId: string, updates: Partial<File>): Promise<File | null>;
  updateContent(fileId: string, updates: string): Promise<File | null>;
  moveToTrash(fileId: string): Promise<File | null>;
  delete(fileId: string): Promise<void>;
  findAllFilesInFolder(folderId: string): Promise<File[]>;
  findById(fileId: string): Promise<File | null>;
  getAllFilesInTrash(): Promise<File[]>;
  restoreFile(fileId: string): Promise<File | null>;
  updateIsPublished(fileId: string, isPublished: boolean): Promise<File | null>;
}
