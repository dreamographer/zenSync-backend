import mongoose, { Schema } from "mongoose";

const FileSchema = new Schema(
  {
    title: { type: String, required: true },
    inTrash: { type: Boolean, default: false },
    content: { type: String },
    coverImage: { type: String },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//Create and export the mongoose model for the Folder
export const File = mongoose.model("File", FileSchema);
