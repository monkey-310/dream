"use server";

import { Roles } from "@/constants/Roles";
import { createSupabaseAdminClient } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";
import { SupabaseApi } from "@/supabase/SupabaseApi";
import jwt from "jsonwebtoken";
import { decodeJWT } from "../../middleware";

// Define the input type for the updateUserProfile action
type UpdateUserProfileInput = {
  firstName: string;
  lastName: string;
  email: string;
  examDate: Date;
  desiredScore: number;
  motivation?: string;
};

/**
 * Server action to update a user's profile
 */
export async function updateUserProfile(data: UpdateUserProfileInput) {
  try {
    // Get the server-side Supabase client
    const supabase = await createSupabaseAdminClient();
    const { data: loggedInUser } = await supabase.auth.getUser();

    // Update the user metadata and email
    const { data: userData, error } = await supabase.auth.admin.updateUserById(
      loggedInUser?.user?.id ?? "",
      {
        user_metadata: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
        email: data.email,
      }
    );

    if (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error?.message };
    }

    const { data: userProfileData, error: userProfileError } =
      await SupabaseApi.createUserProfile({
        user_id: userData.user?.id ?? "",
        sat_metadata: {
          exam_date: data.examDate.toISOString(),
          desired_score: data.desiredScore,
          motivation: data.motivation,
        },
      });

    if (userProfileError) {
      console.error("Error creating user profile:", userProfileError);
      return { success: false, error: userProfileError?.message };
    }

    // Return success
    return { success: true, data: userData, userProfileData };
  } catch (error) {
    console.error("Unexpected error updating user:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function loginAction(
  email: string,
  password: string,
  captchaToken?: string
): Promise<any> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  });

  if (error) {
    return JSON.stringify({
      success: false,
      data: {
        msg: error.message,
        name: error.name,
        status: error?.status,
      },
    });
  }

  const secret = process.env.SUPABASE_JWT_SECRET as string;
  const decodedToken: any = jwt.verify(data.session?.access_token, secret);
  const userRole = decodedToken.user_role;

  if (userRole !== Roles.TUTOR) {
    return JSON.stringify({
      success: false,
      data: { msg: "Unauthorized" },
    });
  }

  return JSON.stringify({
    success: true,
    data: {
      ...data.user,
      userRole,
    },
  });
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUserAction() {
  try {
    const SupabaseServer = await createSupabaseServerClient();
    const { data, error } = await SupabaseServer.auth.getUser();
    const { data: session, error: sessionError } =
      await SupabaseServer.auth.getSession();

    const decodedToken = decodeJWT(session?.session?.access_token ?? "");

    return {
      ...data.user,
      userRole: decodedToken.user_role,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}
