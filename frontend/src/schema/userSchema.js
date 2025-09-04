import {z} from "zod"

export const userSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
  current_password: z.string().min(6, "Password must be at least 6 length"),
  location: z.string().optional(),
   skillsOffered: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),

  skillsWanted: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  availability: z.object({
    weekends: z.boolean().default(false),
    weekdaysEvenings: z.boolean().default(false),
    weekdaysDaytime: z.boolean().default(false),
  }),
  isPublic: z.boolean().default(true),
  bio: z.string().max(500, "Max 500 characters").optional(),
});

