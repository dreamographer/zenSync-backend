import { User } from "../entities/User";
import { Workspace } from "../entities/Workspace";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IWorkspaceRepository } from "../interfaces/IWorkspaceRepository";
import { IWorkspaceService } from "../interfaces/IWorkspaceService";
export class WorkspaceService implements IWorkspaceService {
  private workspaceRepository: IWorkspaceRepository;
  constructor(workspaceRepository: IWorkspaceRepository) {
    this.workspaceRepository = workspaceRepository;
  }

  async checkWorkspaceOwnership(
    userId: string,
    workspaceId: string
  ): Promise<boolean> {
    return await this.workspaceRepository.checkWorkspaceOwnership(
      userId,
      workspaceId
    );
  }

  async findWorkspaceById(id: string): Promise<Workspace | null> {
    return await this.workspaceRepository.findById(id);
  }
  async findWorkspaceByUser(id: string): Promise<Workspace[] | null> {
    return await this.workspaceRepository.findAllByUser(id);
  }

  async createWorkspace(
    workspaceData: Partial<Workspace>
  ): Promise<Workspace | null> {
    const existingWorkspace = await this.workspaceRepository.findByTitle(
      workspaceData.title as string,
      workspaceData.workspaceOwner as string
    );
    if (existingWorkspace) {
      throw new Error("Title already exists");
    }
    return await this.workspaceRepository.create(workspaceData);
  }

  async updateWorkspace(
    id: string,
    workspaceData: Partial<Workspace>
  ): Promise<Workspace | null> {
    return await this.workspaceRepository.update(id, workspaceData);
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    return await this.workspaceRepository.delete(id);
  }

  async addCollaborator(
    workspaceId: string,
    collaborators: string[]
  ): Promise<Workspace | null> {
    return await this.workspaceRepository.addCollaborator(
      workspaceId,
      collaborators
    );
  }
  async getCollaborators(workspaceId: string): Promise<Partial<User[]>> {
    return await this.workspaceRepository.getCollaborators(workspaceId);
  }

  async removeCollaborator(
    workspaceId: string,
    userIds: string[]
  ): Promise<Workspace | null> {
    return await this.workspaceRepository.removeCollaborator(
      workspaceId,
      userIds
    );
  }
}
