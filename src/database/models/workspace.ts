import mongoose, { Document, Schema, Model } from "mongoose";

export interface WorkspaceDocument extends Document {
  workspaceOwner: Schema.Types.ObjectId;
  title: string;
  collaborators: Schema.Types.ObjectId[];
  workspaceType: "Private" | "Collaborative";
}

const WorkspaceSchema = new Schema<WorkspaceDocument>(
  {
    workspaceOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    workspaceType: {
      type: String,
      enum: ["Private", "Collaborative"],
      default: "Private",
      required: true,
    },
  },
  { timestamps: true }
);

export const Workspace: Model<WorkspaceDocument> =
  mongoose.model<WorkspaceDocument>("Workspace", WorkspaceSchema);
