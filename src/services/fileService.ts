import { IFileService } from "../interfaces/IFileService";
import { File } from "../entities/File";
import { IFileRepository } from "../interfaces/IFileRepository";
import { IFolderService } from "../interfaces/IFolderService";
export class FileService implements IFileService {
  private fileRepository: IFileRepository;
  private folderService: IFolderService;
  constructor(fileRepository: IFileRepository, folderService: IFolderService) {
    this.fileRepository = fileRepository;
    this.folderService=folderService
  }

  
  getFile(fileId: string): Promise<File | null> {
    throw new Error("Method not implemented.");
  }

  async findAllFilesInFolder(folderId: string): Promise<File[]> {
    return this.fileRepository.findAllFilesInFolder(folderId);
  }

  async createFile(userId: string, fileData: Partial<File>): Promise<File> {
    let validFolder= await this.folderService.getFolderById(fileData.folderId as string)
    console.log(validFolder);
    
    if(!validFolder){
        throw new Error("Not a Valid Folder");
    }
    return this.fileRepository.create(fileData);
  }

  async updateFile(
    fileId: string,
    updates: Partial<File>
  ): Promise<File | null> {
    return this.fileRepository.update(fileId, updates);
  }
  async moveToTrash(
    fileId: string
  ): Promise<File | null> {
    return this.fileRepository.moveToTrash(fileId);
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.fileRepository.delete(fileId);
  }
}
