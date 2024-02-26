import { Folder } from "../entities/Folder";

export interface IFolderRepository {
  findAllByWorkspaceId(userId: string): Promise<Folder[]>;
  findById(folderId: string): Promise<Folder | null>;
  create(folderData: Partial<Folder>): Promise<Folder>;
  update(folderId: string, folderData: Partial<Folder>): Promise<Folder | null>;
  delete(folderId: string): Promise<void>;
}
