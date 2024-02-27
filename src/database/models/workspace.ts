import mongoose, { Schema} from "mongoose";


const WorkspaceSchema = new Schema(
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
      enum: ["private", "shared"],
      default: "private",
      required: true,
    },
  },
  { timestamps: true }
);

export const Workspace =mongoose.model("Workspace", WorkspaceSchema);
