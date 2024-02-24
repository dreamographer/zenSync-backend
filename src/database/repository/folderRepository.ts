import { IFolderRepository } from "../../interfaces/IFolderRepository";
import { Folder } from "../../entities/Folder";
import { Folder as folderModel} from "../models/Folder";
export class FolderRepository implements IFolderRepository {
  async findAllByWorkspaceId(userId: string): Promise<Folder[]> {
    // Implementation to find all folders by user ID from the database
    // Example: return database.findFoldersByUserId(userId);
    throw new Error("Method not implemented");
  }

  async findById(folderId: string): Promise<Folder | null> {
    // Implementation to find a folder by its ID from the database
    // Example: return database.findFolderById(folderId);
    throw new Error("Method not implemented");
  }

  async create(userId: string, folderData: Partial<Folder>): Promise<Folder> {
    const Folder = await folderModel.create(folderData);
    console.log(Folder)
    
    throw new Error("Method not implemented");
  }

  async update(
    folderId: string,
    folderData: Partial<Folder>
  ): Promise<Folder | null> {
    // Implementation to update an existing folder in the database
    // Example: return database.updateFolder(folderId, folderData);
    throw new Error("Method not implemented");
  }

  async delete(folderId: string): Promise<void> {
    // Implementation to delete a folder from the database
    // Example: return database.deleteFolder(folderId);
    throw new Error("Method not implemented");
  }
}
