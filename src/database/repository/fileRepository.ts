// FileRepository.ts
import { IFileRepository } from "../../interfaces/IFileRepository";
import { File } from "../../entities/File";
import { File as FileModal } from "../models/File";

export class FileRepository implements IFileRepository {
  async create(folderData: Partial<File>): Promise<File> {
    const newFile = await FileModal.create(folderData);
    return newFile.toObject() as File;
  }

  async update(fileId: string, updates: Partial<File>): Promise<File | null> {
    const updatedFile = await FileModal.findByIdAndUpdate(fileId, updates, {
      new: true,
    });
    if (!updatedFile) return null;
    return updatedFile.toObject() as File;
  }

  // update the content
  async updateContent(fileId: string, updates: string): Promise<File | null> {
    const updatedFile = await FileModal.findByIdAndUpdate(
      fileId,
      { content: updates },
      {
        new: true,
      }
    );
    if (!updatedFile) return null;
    return updatedFile.toObject() as File;
  }

  // move file to Trash
  async moveToTrash(fileId: string): Promise<File | null> {
    const updatedFile = await FileModal.findByIdAndUpdate(
      fileId,
      { inTrash: true },
      {
        new: true,
      }
    );
    if (!updatedFile) return null;
    return updatedFile.toObject() as File;
  }

  async getAllFilesInTrash(): Promise<File[]|[]> {
    return await FileModal.find(
      { inTrash: true },
      { id: "$_id", _id: 0, title: 1, inTrash: 1, folderId: 1 }
    );
  }

  async restoreFile(fileId: string): Promise<File | null> {
    const updatedFile = await FileModal.findByIdAndUpdate(
      fileId,
      { inTrash: false },
      {
        new: true,
      }
    );
    if (!updatedFile) return null;
    return updatedFile.toObject() as File;
  }

  // permenent delete
  async delete(fileId: string): Promise<void> {
    await FileModal.findByIdAndDelete(fileId);
  }

  async findAllFilesInFolder(folderId: string): Promise<File[]> {
    return FileModal.find(
      { folderId },
      { id: "$_id", _id: 0, title: 1, inTrash: 1, folderId: 1 }
    );
  }

  async findById(fileId: string): Promise<File | null> { 
    return FileModal.findById(fileId, {
      id: "$_id",
      _id: 0,
      title: 1,
      inTrash: 1,
      folderId: 1,
      coverImage: 1,
      isPublished: 1,
      content: 1,
    });
  }

  async updateIsPublished(
    fileId: string,
    isPublished: boolean
  ): Promise<File | null> {
    try {
      const updatedFile = await FileModal.findByIdAndUpdate(
        fileId,
        { isPublished },
        { new: true }
      );
        if (!updatedFile) return null;
      return updatedFile.toObject() as File;
    } catch (error) {
      console.error("Error updating isPublished in repository:", error);
      throw error;
    }
  }
}
