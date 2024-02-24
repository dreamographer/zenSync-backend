import { Workspace } from "../entities/Workspace";

export interface IWorkspaceService {
  checkWorkspaceOwnership(userId: string, workspaceId: string): Promise<boolean> ;
  findWorkspaceById(id: string): Promise<Workspace | null>;
  createWorkspace(workspaceData: any): Promise<Workspace | null>;
  findWorkspaceByUser(id: string): Promise<Workspace[] | null>;
  updateWorkspace(id: string, workspaceData: any): Promise<Workspace | null>;
  deleteWorkspace(id: string): Promise<boolean>;
  addCollaborator(workspaceId: string, userId: string): Promise<boolean>;
  removeCollaborator(workspaceId: string, userId: string): Promise<boolean>;
}
