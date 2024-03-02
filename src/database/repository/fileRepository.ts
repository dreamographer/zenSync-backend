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

  // move file to Trash
  async  moveToTrash(fileId: string): Promise<File | null> {
    const updatedFile = await FileModal.findByIdAndUpdate(fileId, {inTrash:true}, {
      new: true,
    });
    if (!updatedFile) return null;
    return updatedFile.toObject() as File;
  }


  async delete(fileId: string): Promise<void> {
    await FileModal.findByIdAndDelete(fileId);
  }

  async findAllFilesInFolder(folderId: string): Promise<File[]> {
    return FileModal.find(
      { folderId },
      { id: "$_id", _id: 0, title: 1, inTrash: 1, folderId: 1 }
    );
  }
}
