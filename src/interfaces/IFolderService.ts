import { Folder } from "../entities/Folder";

export interface IFolderService {
  getAllFolders(WorkspaceId: string): Promise<Folder[]>;
  getFolderById(folderId: string): Promise<Folder | null>;
  createFolder(userId: string, folderData: Partial<Folder>): Promise<Folder>;
  updateFolder(
    folderId: string,
    folderData: Partial<Folder>
  ): Promise<Folder | null>;
  deleteFolder(folderId: string): Promise<void>;
}
