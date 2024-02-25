import { z } from "zod";

export const fileSchema = z.object({
  title: z.string().min(1, "File title must not be empty"),
  workspaceId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Folder ID format"),
});
