import { createSupabaseServerClient } from "../../server";
import {
  CreateExamResult,
  EXAM_RESULT_TABLE,
  ExamResult,
  ExamResultData,
  ExamResultSchema,
} from "./schema";

/**
 * Get an exam result by ID
 * @param id The ID of the exam result to get
 * @returns The exam result data or an error
 */
export async function getExamResultById(id: string): Promise<{
  data: ExamResult | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(EXAM_RESULT_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error getting exam result:", error);
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = ExamResultSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid exam result data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
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
 * Get exam results by user ID
 * @param userId The user ID to get results for
 * @param limit The maximum number of results to return
 * @returns The exam results data or an error
 */
export async function getExamResultsByUserId(
  userId: string,
  limit: number = 10
): Promise<{
  data: ExamResult[] | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(EXAM_RESULT_TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate each result against the schema
    const validResults: ExamResult[] = [];
    for (const result of data) {
      const validationResult = ExamResultSchema.safeParse(result);
      if (validationResult.success) {
        validResults.push(validationResult.data);
      } else {
        console.warn(
          `Invalid exam result data (ID: ${result.id}):`,
          validationResult.error.message
        );
      }
    }

    return { data: validResults, error: null };
  } catch (error) {
    console.error("Error getting exam results:", error);
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
 * Get exam results by exam ID
 * @param examId The exam ID to get results for
 * @param limit The maximum number of results to return
 * @returns The exam results data or an error
 */
export async function getExamResultsByExamId(
  examId: string,
  limit: number = 10
): Promise<{
  data: ExamResult[] | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(EXAM_RESULT_TABLE)
      .select("*")
      .eq("exam_id", examId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate each result against the schema
    const validResults: ExamResult[] = [];
    for (const result of data) {
      const validationResult = ExamResultSchema.safeParse(result);
      if (validationResult.success) {
        validResults.push(validationResult.data);
      } else {
        console.warn(
          `Invalid exam result data (ID: ${result.id}):`,
          validationResult.error.message
        );
      }
    }

    return { data: validResults, error: null };
  } catch (error) {
    console.error("Error getting exam results:", error);
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
 * Create a new exam result
 * @param examResult The exam result data to create
 * @returns The created exam result data or an error
 */
export async function createExamResult(examResult: CreateExamResult): Promise<{
  data: ExamResult | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(EXAM_RESULT_TABLE)
      .insert(examResult)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = ExamResultSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid exam result data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
  } catch (error) {
    console.error("Error creating exam result:", error);
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
 * Update only the result field of an exam result
 * @param id The ID of the exam result to update
 * @param result The new result data
 * @returns The updated exam result data or an error
 */
export async function updateExamResultData(
  id: string,
  result: Partial<ExamResultData>
): Promise<{
  data: ExamResult | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    // First, get the current result
    const { data: currentData, error: fetchError } = await supabase
      .from(EXAM_RESULT_TABLE)
      .select("result")
      .eq("id", id)
      .single();

    if (fetchError) {
      return { data: null, error: new Error(fetchError.message) };
    }

    // Merge the current result with the new result data
    const updatedResult = {
      ...currentData.result,
      ...result,
    };

    // Update the result
    const { data, error } = await supabase
      .from(EXAM_RESULT_TABLE)
      .update({ result: updatedResult, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = ExamResultSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid exam result data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
  } catch (error) {
    console.error("Error updating exam result data:", error);
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
 * Delete an exam result
 * @param id The ID of the exam result to delete
 * @returns Success or error
 */
export async function deleteExamResult(id: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from(EXAM_RESULT_TABLE)
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting exam result:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error("An unexpected error occurred"),
    };
  }
}
