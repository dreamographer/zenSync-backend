import { Workspace } from "../entities/Workspace";

export interface IWorkspaceRepository {
  findById(id: string): Promise<Workspace | null>;
  findByTitle(title: string, owner: string): Promise<Workspace | null>;
  create(workspaceData: any): Promise<Workspace | null>;
  update(id: string, data: any): Promise<Workspace | null>;
  delete(id: string): Promise<boolean>;
  findAllByUser(owner: string): Promise<Workspace[] | null>;
  addCollaborator(workspaceId: string, userId: string): Promise<boolean>;
  removeCollaborator(workspaceId: string, userId: string): Promise<boolean>;
}
