import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Folder document
export interface FolderDocument extends Document {
  title: string;
  inTrash: boolean;
  workspaceId: Schema.Types.ObjectId;
}

// Define the mongoose schema for the Folder
const FolderSchema = new Schema({
  title: { type: String, required: true },
  inTrash: { type: Boolean, default: false },
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
},{timestamps:true});

// Create and export the mongoose model for the Folder
export const Folder = mongoose.model<FolderDocument>("Folder", FolderSchema);
