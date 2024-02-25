import { IFileService } from "../interfaces/IFileService";
import { File } from "../entities/File";
import { IFileRepository } from "../interfaces/IFileRepository";

export class FileService implements IFileService {
  private fileRepository: IFileRepository;

  constructor(fileRepository: IFileRepository) {
    this.fileRepository = fileRepository;
  }
  getFile(fileId: string): Promise<File | null> {
    throw new Error("Method not implemented.");
  }

  async findAllFilesInFolder(folderId: string): Promise<File[]> {
    return this.fileRepository.findAllFilesInFolder(folderId);
  }

  async createFile(title: string, folderId: string): Promise<File> {
    return this.fileRepository.create(title, folderId);
  }

  async updateFile(
    fileId: string,
    updates: Partial<File>
  ): Promise<File | null> {
    return this.fileRepository.update(fileId, updates);
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.fileRepository.delete(fileId);
  }
}
