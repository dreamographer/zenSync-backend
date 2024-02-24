import { IFolderRepository } from "../../interfaces/IFolderRepository";
import { Folder } from "../../entities/Folder";
import { Folder as folderModel} from "../models/Folder";
export class FolderRepository implements IFolderRepository {

  // get folder data with workspace Id
  async findAllByWorkspaceId(workspaceId: string): Promise<Folder[]> {
    const folders = await folderModel.find({ workspaceId: workspaceId });
     console.log(folders);
     
    return folders.map(folder => ({
      id: folder.id,
      title: folder.title,
      in_trash: folder.inTrash,
      workspaceId: folder.workspaceId.toString(),
    }));
  }

  async findById(folderId: string): Promise<Folder | null> {
    const folder = await folderModel.findById(folderId);
    if (!folder) return null;
    return {
      id: folder.id,
      title: folder.title,
      in_trash: folder.inTrash,
      workspaceId: folder.workspaceId.toString(),
    };
  }

  async create(userId: string, folderData: Partial<Folder>): Promise<Folder> {
    const Folder = await folderModel.create(folderData);
    return {
      id: Folder.id,
      title: Folder.title,
      in_trash: Folder.inTrash,
      workspaceId: Folder.workspaceId.toString(),
    };
  }

  async update(
    folderId: string,
    folderData: Partial<Folder>
  ): Promise<Folder | null> {
    const updatedFolder = await folderModel.findByIdAndUpdate(
      folderId,
      folderData,
      { new: true }
    );
    if (!updatedFolder) return null;
    return {
      id: updatedFolder.id,
      title: updatedFolder.title,
      in_trash: updatedFolder.inTrash,
      workspaceId: updatedFolder.workspaceId.toString(),
    };
  }

  async delete(folderId: string): Promise<void> {
    await folderModel.findByIdAndDelete(folderId);
  }
}
