import { IFolderService } from "../interfaces/IFolderService";
import { Folder } from "../entities/Folder";
import { IFolderRepository } from "../interfaces/IFolderRepository";
import { IWorkspaceService } from "../interfaces/IWorkspaceService";

export class FolderService implements IFolderService {
  private folderRepository: IFolderRepository;
  private workspaceService: IWorkspaceService;
  constructor(
    folderRepository: IFolderRepository,
    workspaceService: IWorkspaceService
  ) {
    this.folderRepository = folderRepository;
    this.workspaceService = workspaceService;
  }
async getFolderById(folderId: string): Promise<Folder | null> {
  
    return this.folderRepository.findById(folderId);
  }
  
  async createFolder(
    userId: string,
    folderData: Partial<Folder>
    ): Promise<Folder> {
      let validWorkspace=await this.workspaceService.checkWorkspaceOwnership(userId,folderData.workspaceId as string)
      if(!validWorkspace){
        throw new Error("Workspace Invalid");
      }
      return this.folderRepository.create(folderData);
    }

    // get all folders of workspace
  async getAllFolders(WorkspaceId: string): Promise<Folder[]> {

    return this.folderRepository.findAllByWorkspaceId(WorkspaceId);
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
