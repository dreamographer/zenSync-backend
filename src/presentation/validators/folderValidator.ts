import { z } from "zod";

export const folderSchema = z.object({
  title: z.string().min(1, "Folder title must not be empty"),
  workspaceId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid workspace ID format"),
});



