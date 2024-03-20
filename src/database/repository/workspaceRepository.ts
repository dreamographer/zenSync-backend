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
      const workspace = await WorkspaceModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(workspaceId) } },
        { $unwind: "$collaborators" },
        {
          $lookup: {
            from: "users",
            localField: "collaborators",
            foreignField: "_id",
            as: "collaborators",
          },
        },
        { $project: { collaborators: 1, _id: 0 } },
        { $unwind: "$collaborators" },
        {
          $project: {
            id: "$collaborators._id",
            fullname: "$collaborators.fullname",
            email: "$collaborators.email",
            profile: "$collaborators.profile",
            _id: 0,
          },
        },
      ]);

      return workspace;
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
  ): Promise<Workspace | null> {
    try {
      const updatedWorkspace= await WorkspaceModel.findByIdAndUpdate(
        workspaceId,
        {
          $addToSet: { collaborators: [...collaborators] },
          workspaceType: "shared",
        },
        { new: true }
      );
      if (updatedWorkspace) {
      const workspaceData: Workspace = {
        id: updatedWorkspace._id.toString(),
        workspaceOwner: updatedWorkspace.workspaceOwner.toString(),
        title: updatedWorkspace.title,
        collaborators: updatedWorkspace.collaborators.map((collaborator: any) =>
          collaborator.toString()
        ),
        workspaceType: updatedWorkspace.workspaceType,
      };
      return workspaceData;
    }
    return null
    } catch (error) {
      console.error("Error adding collaborator to workspace:", error);
      return null;
    }
  }


  //   remove collaborator from workspace
  async removeCollaborator(
    workspaceId: string,
    userIds: string[]
  ): Promise<Workspace | null> {
    try {
      const objectIds = userIds.map(id => new mongoose.Types.ObjectId(id));
      let updatedWorkspace= await WorkspaceModel.findByIdAndUpdate(
        workspaceId,
        { $pull: { collaborators: { $in: objectIds } } },
        { new: true }
      );
      if (updatedWorkspace?.collaborators.length === 0) {
        updatedWorkspace=await WorkspaceModel.findOneAndUpdate(
          { _id: workspaceId, collaborators: { $size: 0 } },
          { workspaceType: "private" },
          { new: true }
        );
      }
      if (updatedWorkspace) {
        const workspaceData: Workspace = {
          id: updatedWorkspace._id.toString(),
          workspaceOwner: updatedWorkspace.workspaceOwner.toString(),
          title: updatedWorkspace.title,
          collaborators: updatedWorkspace.collaborators.map(
            (collaborator: any) => collaborator.toString()
          ),
          workspaceType: updatedWorkspace.workspaceType,
        };
        return workspaceData;
      }
      return null
    } catch (error) {
      console.error("Error removing collaborators from workspace:", error);
      return null;
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
      $or: [{ workspaceOwner: owner }, { collaborators: { $in: [owner] } }],
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
