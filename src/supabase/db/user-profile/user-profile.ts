import { createSupabaseServerClient } from "../../server";
import {
  CreateUserProfile,
  Tables,
  UpdateUserProfile,
  UserProfile,
} from "./schema";

/**
 * Creates a new user profile
 * @param data The user profile data to create
 * @returns The created user profile
 */
export async function createUserProfile(
  data: CreateUserProfile
): Promise<{ data: UserProfile | null; error: Error | null }> {
  try {
    const supabase = await createSupabaseServerClient();

    // Check if a profile already exists for this user
    const { data: existingProfile } = await supabase
      .from(Tables.USER_PROFILES)
      .select()
      .eq("user_id", data.user_id)
      .single();

    if (existingProfile) {
      return {
        data: null,
        error: new Error("A profile already exists for this user"),
      };
    }

    // Create the new profile
    const { data: newProfile, error } = await supabase
      .from(Tables.USER_PROFILES)
      .insert({
        user_id: data.user_id,
        sat_metadata: data.sat_metadata,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error);
      return { data: null, error };
    }

    return { data: newProfile as UserProfile, error: null };
  } catch (error) {
    console.error("Unexpected error creating user profile:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("An unexpected error occurred"),
    };
  }
}

/**
 * Gets a user profile by user ID
 * @param userId The user ID to get the profile for
 * @returns The user profile
 */
export async function getUserProfileByUserId(
  userId: string
): Promise<{ data: UserProfile | null; error: Error | null }> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(Tables.USER_PROFILES)
      .select()
      .eq("user_id", userId)
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as UserProfile, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("An unexpected error occurred"),
    };
  }
}

/**
 * Updates a user profile
 * @param userId The user ID of the profile to update
 * @param data The data to update
 * @returns The updated user profile
 */
export async function updateUserProfileByUserId(
  userId: string,
  data: UpdateUserProfile
): Promise<{ data: UserProfile | null; error: Error | null }> {
  try {
    const supabase = await createSupabaseServerClient();

    // Get the existing profile
    const { data: existingProfile, error: fetchError } =
      await getUserProfileByUserId(userId);

    if (fetchError || !existingProfile) {
      return {
        data: null,
        error: fetchError || new Error("Profile not found"),
      };
    }

    // Merge the existing sat_metadata with the new data
    const updatedSatMetadata = {
      ...existingProfile.sat_metadata,
      ...data.sat_metadata,
    };

    // Update the profile
    const { data: updatedProfile, error } = await supabase
      .from(Tables.USER_PROFILES)
      .update({
        sat_metadata: updatedSatMetadata,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: updatedProfile as UserProfile, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("An unexpected error occurred"),
    };
  }
}
