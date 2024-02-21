import { Workspace } from "../entities/Workspace";

export interface IWorkspaceService {
  findWorkspaceById(id: string): Promise<Workspace | null>;
  createWorkspace(workspaceData: any): Promise<Workspace | null>;
  
  updateWorkspace(id: string, workspaceData: any): Promise<Workspace | null>;
  deleteWorkspace(id: string): Promise<boolean>;
  addCollaborator(workspaceId: string, userId: string): Promise<boolean>;
  removeCollaborator(workspaceId: string, userId: string): Promise<boolean>;
}
