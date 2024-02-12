// import { z } from "zod";
// import { User } from "../../entities/User";


// export const userSchema = z.object({
//   id: z.string(),
//   fullname: z.string().min(2, "Full name must be at least   2 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be at least   8 characters")
//     .refine(password => /[A-Za-z]/.test(password), {
//       message: "Password must contain at least one letter",
//     }),
// });

// export const validateUser = (data: unknown): User => {
//   return userSchema.parse(data);
// };
