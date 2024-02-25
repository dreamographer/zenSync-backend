import mongoose, { Schema, } from "mongoose";

const FolderSchema = new Schema({
  title: { type: String, required: true },
  inTrash: { type: Boolean, default: false },
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
},{timestamps:true});

//Create and export the mongoose model for the Folder
export const Folder = mongoose.model("Folder", FolderSchema);
