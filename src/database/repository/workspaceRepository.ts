import { Workspace } from "../../entities/Workspace";
import { IWorkspaceRepository } from "../../interfaces/IWorkspaceRepository";
import { Workspace as WorkspaceModel } from "../models/workspace";

export class WorkspaceRepository implements IWorkspaceRepository {
  // add new collaborator to the workspace
  async addCollaborator(workspaceId: string, userId: string): Promise<boolean> {
    try {
      const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
        workspaceId,
        { $addToSet: { collaborators: userId } },
        { new: true }
      );
      return !!updatedWorkspace;
    } catch (error) {
      console.error("Error adding collaborator to workspace:", error);
      return false;
    }
  }

  //   remove collaborator from workspace
  async removeCollaborator(
    workspaceId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
        workspaceId,
        { $pull: { collaborators: userId } },
        { new: true }
      );
      return !!updatedWorkspace;
    } catch (error) {
      console.error("Error removing collaborator from workspace:", error);
      return false;
    }
  }

  //   find workspace by id
  async findById(id: string): Promise<Workspace | null> {
    const workspace = await WorkspaceModel.findOne({ _id: id });
    if (workspace) {
      const workspaceData: Workspace = {
        id: workspace._id.toString(),
        workspaceOwner: workspace.workspaceOwner.toString(),
        title: workspace.title,
        collaborators: workspace.collaborators.map((collaborator: any) =>
          collaborator.toString()
        ),
        workspaceType: workspace.workspaceType,
        // Include other fields as needed
      };
      return workspaceData;
    }
    return null;
  }

  // find workspace by title
  async findAllByUser(owner: string): Promise<Workspace[] | null> {
    const workspaces = await WorkspaceModel.find({
      workspaceOwner: owner,
    });

    if (workspaces && workspaces.length > 0) {
      const workspaceData: Workspace[] = workspaces.map(workspace => ({
        id: workspace._id.toString(),
        workspaceOwner: workspace.workspaceOwner.toString(),
        title: workspace.title,
        collaborators: workspace.collaborators.map((collaborator: any) =>
          collaborator.toString()
        ),
        workspaceType: workspace.workspaceType,
      }));
      return workspaceData;
    }
    return null;
  }
  // find workspace by title
  async findByTitle(title: string, owner: string): Promise<Workspace | null> {
    const workspace = await WorkspaceModel.findOne({
      title: title,
      workspaceOwner: owner,
    });
    if (workspace) {
      const workspaceData: Workspace = {
        id: workspace._id.toString(),
        workspaceOwner: workspace.workspaceOwner.toString(),
        title: workspace.title,
        collaborators: workspace.collaborators.map((collaborator: any) =>
          collaborator.toString()
        ),
        workspaceType: workspace.workspaceType,
      };
      return workspaceData;
    }
    return null;
  }

  //   create new workspace
  async create(workspaceData: any): Promise<Workspace | null> {
    const newWorkspace = await WorkspaceModel.create(workspaceData);
    if (newWorkspace) {
      return {
        id: newWorkspace._id.toString(),
        workspaceOwner: newWorkspace.workspaceOwner.toString(),
        title: newWorkspace.title,
        collaborators: newWorkspace.collaborators.map((collaborator: any) =>
          collaborator.toString()
        ),
        workspaceType: newWorkspace.workspaceType,
        // Include other fields as needed
      };
    }
    return null;
  }

  //   update the workspace details
  async update(id: string, data: any): Promise<Workspace | null> {
    const updatedWorkspace = await WorkspaceModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );
    if (updatedWorkspace) {
      return {
        id: updatedWorkspace._id.toString(),
        workspaceOwner: updatedWorkspace.workspaceOwner.toString(),
        title: updatedWorkspace.title,
        collaborators: updatedWorkspace.collaborators.map((collaborator: any) =>
          collaborator.toString()
        ),
        workspaceType: updatedWorkspace.workspaceType,
        // Include other fields as needed
      };
    }
    return null;
  }

  //   delete workspace
  async delete(id: string): Promise<boolean> {
    const deletedWorkspace = await WorkspaceModel.deleteOne({ _id: id });
    return deletedWorkspace.deletedCount !== 0;
  }
}
