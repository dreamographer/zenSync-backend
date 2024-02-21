export interface Workspace {
  id: string;
  workspaceOwner: string; 
  title: string;
  collaborators: string[]; 
  workspaceType: string;
}
