import { createSupabaseServerClient } from "../../server";
import {
  CreateDiagnostic,
  Diagnostic,
  DIAGNOSTIC_TABLE,
  DiagnosticSchema,
  UpdateDiagnostic,
} from "./schema";

/**
 * Get a diagnostic record by ID
 * @param id The ID of the diagnostic record to get
 * @returns The diagnostic data or an error
 */
export async function getDiagnosticById(id: string): Promise<{
  data: Diagnostic | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(DIAGNOSTIC_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = DiagnosticSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid diagnostic data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
  } catch (error) {
    console.error("Error getting diagnostic:", error);
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
 * Get a diagnostic record by ID
 * @param id The ID of the diagnostic record to get
 * @returns The diagnostic data or an error
 */
export async function getDiagnostics(): Promise<{
  data: Diagnostic[] | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.from(DIAGNOSTIC_TABLE).select("*");

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Diagnostic[], error: null };
  } catch (error) {
    console.error("Error getting diagnostic:", error);
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
 * Get a diagnostic record by user ID
 * @param userId The user ID to get the diagnostic for
 * @returns The diagnostic data or an error
 */
export async function getDiagnosticByUserId(userId: string): Promise<{
  data: Diagnostic | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(DIAGNOSTIC_TABLE)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned, which is not an error in this context
        return { data: null, error: null };
      }
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = DiagnosticSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid diagnostic data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
  } catch (error) {
    console.error("Error getting diagnostic by user ID:", error);
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
 * Create a new diagnostic record
 * @param diagnostic The diagnostic data to create
 * @returns The created diagnostic data or an error
 */
export async function createDiagnostic(userId: string): Promise<{
  data: Diagnostic | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();
    const diagnostic: CreateDiagnostic = {
      user_id: userId,
    };

    const { data, error } = await supabase
      .from(DIAGNOSTIC_TABLE)
      .insert(diagnostic)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = DiagnosticSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid diagnostic data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
  } catch (error) {
    console.error("Error creating diagnostic:", error);
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
 * Update an existing diagnostic record
 * @param id The ID of the diagnostic record to update
 * @param diagnostic The diagnostic data to update
 * @returns The updated diagnostic data or an error
 */
export async function updateDiagnostic(
  id: string,
  diagnostic: UpdateDiagnostic
): Promise<{
  data: Diagnostic | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(DIAGNOSTIC_TABLE)
      .update(diagnostic)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = DiagnosticSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid diagnostic data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
  } catch (error) {
    console.error("Error updating diagnostic:", error);
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
 * Update the user profile ID of a diagnostic record
 * @param id The ID of the diagnostic record to update
 * @param userProfileId The user profile ID to set
 * @returns The updated diagnostic data or an error
 */
export async function updateDiagnosticUserProfile(
  id: string,
  userProfileId: string
): Promise<{
  data: Diagnostic | null;
  error: Error | null;
}> {
  return updateDiagnostic(id, { user_profile_id: userProfileId });
}

/**
 * Update the math diagnostic ID of a diagnostic record
 * @param id The ID of the diagnostic record to update
 * @param mathDiagnosticId The math diagnostic ID to set
 * @returns The updated diagnostic data or an error
 */
export async function updateDiagnosticMathResult(
  id: string,
  mathDiagnosticId: string
): Promise<{
  data: Diagnostic | null;
  error: Error | null;
}> {
  return updateDiagnostic(id, { math_diagnostic_id: mathDiagnosticId });
}

/**
 * Update the verbal diagnostic ID of a diagnostic record
 * @param id The ID of the diagnostic record to update
 * @param verbalDiagnosticId The verbal diagnostic ID to set
 * @returns The updated diagnostic data or an error
 */
export async function updateDiagnosticVerbalResult(
  id: string,
  verbalDiagnosticId: string
): Promise<{
  data: Diagnostic | null;
  error: Error | null;
}> {
  return updateDiagnostic(id, { verbal_diagnostic_id: verbalDiagnosticId });
}

/**
 * Delete a diagnostic record
 * @param id The ID of the diagnostic record to delete
 * @returns Success or error
 */
export async function deleteDiagnostic(id: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from(DIAGNOSTIC_TABLE)
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting diagnostic:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error("An unexpected error occurred"),
    };
  }
}
