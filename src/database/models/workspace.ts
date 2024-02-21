import mongoose from "mongoose";

const WorkspaceSchema = new mongoose.Schema(
  {
    workspaceOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    workspaceType: {
      type: String,
      enum: ["Private", "Collaborative"],
      default: "Private",
      required: true,
    },
  },
  { timestamps: true }
);

export const Workspace = mongoose.model("Workspace", WorkspaceSchema);
