import { z } from "zod";

export const workspaceSchema = z.object({
  title: z.string().min(2,{message:"Minumum 2 characters are required "}),
});

export const validateWorkspace = (data: unknown) => {
  return workspaceSchema.parse(data);
};
