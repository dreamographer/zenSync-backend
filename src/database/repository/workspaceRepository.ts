import mongoose from "mongoose";
import { User } from "../../entities/User";
import { Workspace } from "../../entities/Workspace";
import { IWorkspaceRepository } from "../../interfaces/IWorkspaceRepository";
import { Workspace as WorkspaceModel } from "../models/workspace";

export class WorkspaceRepository implements IWorkspaceRepository {
  // Validate workspace with user
  async checkWorkspaceOwnership(
    userId: string,
    workspaceId: string
  ): Promise<boolean> {
    const workspace = await WorkspaceModel.findOne({
      _id: workspaceId,
      workspaceOwner: userId,
    });
    return !!workspace;
  }


  // get collaborators of a workspace
  async getCollaborators(workspaceId: string): Promise<Partial<User[]>> {
    try {
      console.log(workspaceId);
      
       const workspace = await WorkspaceModel.aggregate([
         { $match: { _id: new mongoose.Types.ObjectId(workspaceId) } },
         { $unwind: "$collaborators" },
         {
           $lookup: {
             from: "users", // The collection to join with
             localField: "collaborators", // The field from the input documents
             foreignField: "_id", // The field from the documents of the "from" collection
             as: "collaborators", // The output array field
           },
         },
         { $project: { collaborators: 1, _id: 0 } },
         { $unwind: "$collaborators" },
       ]);
       
        return workspace.map(doc => doc.collaborators);
      return [];
    } catch (error) {
      console.error("Error adding collaborator to workspace:", error);
      return [];
    }
  }
  // add new collaborator to the workspace
  async addCollaborator(
    workspaceId: string,
    collaborators: string[]
  ): Promise<boolean> {
    try {
      const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
        workspaceId,
        { $addToSet: { collaborators: [...collaborators] } },
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
  async create(workspaceData: Partial<Workspace>): Promise<Workspace | null> {
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
