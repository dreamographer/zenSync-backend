import { IFolderService } from "../interfaces/IFolderService";
import { Folder } from "../entities/Folder";
import { IFolderRepository } from "../interfaces/IFolderRepository";


export class FolderService implements IFolderService {
  private folderRepository: IFolderRepository;

  constructor(folderRepository: IFolderRepository) {
    this.folderRepository = folderRepository;
  }

  async getAllFolders(WorkspaceId: string): Promise<Folder[]> {
    return this.folderRepository.findAllByWorkspaceId(WorkspaceId);
  }

  async getFolderById(folderId: string): Promise<Folder | null> {
    return this.folderRepository.findById(folderId);
  }

  async createFolder(
    userId: string,
    folderData: Partial<Folder>
  ): Promise<Folder> {
      
    return this.folderRepository.create(userId, folderData);
  }

  async updateFolder(
    folderId: string,
    folderData: Partial<Folder>
  ): Promise<Folder | null> {
    return this.folderRepository.update(folderId, folderData);
  }

  async deleteFolder(folderId: string): Promise<void> {
    await this.folderRepository.delete(folderId);
  }
}
