import { z } from "zod";

// Define the schema for the sat_metadata JSON field
export const satMetadataSchema = z.object({
  exam_date: z.string().datetime(), // ISO date string
  desired_score: z.number().min(400).max(1600),
  motivation: z.string().optional(),
});

// Define the type for the sat_metadata
export type SatMetadata = z.infer<typeof satMetadataSchema>;

// Define the schema for the user_profile table
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime().optional(), // Will be set by Supabase
  updated_at: z.string().datetime().optional(), // Will be set by Supabase
  sat_metadata: satMetadataSchema,
});

// Define the type for the user_profile table
export type UserProfile = z.infer<typeof userProfileSchema>;

// Define the schema for creating a new user profile
export const createUserProfileSchema = z.object({
  user_id: z.string().uuid(),
  sat_metadata: satMetadataSchema,
});

// Define the type for creating a new user profile
export type CreateUserProfile = z.infer<typeof createUserProfileSchema>;

// Define the schema for updating a user profile
export const updateUserProfileSchema = z
  .object({
    sat_metadata: satMetadataSchema.partial(),
  })
  .partial();

// Define the type for updating a user profile
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

// Database tables
export const Tables = {
  USER_PROFILES: "user_profile",
} as const;
