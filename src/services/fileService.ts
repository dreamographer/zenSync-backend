import { IFileService } from "../interfaces/IFileService";
import { File } from "../entities/File";
import { IFileRepository } from "../interfaces/IFileRepository";
import { IFolderService } from "../interfaces/IFolderService";
export class FileService implements IFileService {
  private fileRepository: IFileRepository;
  private folderService: IFolderService;
  constructor(fileRepository: IFileRepository, folderService: IFolderService) {
    this.fileRepository = fileRepository;
    this.folderService = folderService; 
  }

  getFile(fileId: string): Promise<File | null> {
    return this.fileRepository.findById(fileId);
  }

  async findAllFilesInFolder(folderId: string): Promise<File[]> {
    return this.fileRepository.findAllFilesInFolder(folderId);
  }

  async createFile(userId: string, fileData: Partial<File>): Promise<File> {
    let validFolder = await this.folderService.getFolderById(
      fileData.folderId as string
    );

    if (!validFolder) {
      throw new Error("Not a Valid Folder");
    }
    return this.fileRepository.create(fileData);
  }

  async updateContent(fileId: string, updates: string): Promise<File | null> {
    try {
      const updatedFile = await this.fileRepository.updateContent(
        fileId,
        updates
      );

      return updatedFile;
    } catch (error) {
      console.error("Error updating file content:", error);
      return null;
    }
  }

  async updateFile(
    fileId: string,
    updates: Partial<File>
  ): Promise<File | null> {
    return this.fileRepository.update(fileId, updates);
  }

  async moveToTrash(fileId: string): Promise<File | null> {
    return this.fileRepository.moveToTrash(fileId);
  }

  async getAllFilesInTrash(): Promise<File[]> {
    return await this.fileRepository.getAllFilesInTrash();
  }

  async restoreFile(fileId: string): Promise<File | null> {
    return await this.fileRepository.restoreFile(fileId);
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.fileRepository.delete(fileId);
  }
  async updateIsPublished(
    fileId: string,
    isPublished: boolean
  ): Promise<File | null> {
    return await this.fileRepository.updateIsPublished(fileId, isPublished);
  
  }
}
