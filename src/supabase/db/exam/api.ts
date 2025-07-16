import { createSupabaseServerClient } from "../../server";
import { createSupabaseAdminClient } from "../../admin";
import {
  Exam,
  ExamSchema,
  CreateExam,
  UpdateExam,
  EXAM_TABLE,
  ExamType,
} from "./schema";

/**
 * Get an exam by ID
 * @param id The ID of the exam to get
 * @returns The exam data or an error
 */
export async function getExamById(id: string): Promise<{
  data: Exam | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(EXAM_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = ExamSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid exam data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
  } catch (error) {
    console.error("Error getting exam:", error);
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
 * Get exams by type
 * @param type The type of exams to get
 * @param limit The maximum number of exams to return
 * @returns The exams data or an error
 */
export async function getExamsByType(
  type: ExamType,
  limit: number = 10
): Promise<{
  data: Exam[] | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(EXAM_TABLE)
      .select("*")
      .eq("type", type)
      .limit(limit);

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate each exam against the schema
    const validExams: Exam[] = [];
    for (const exam of data) {
      const validationResult = ExamSchema.safeParse(exam);
      if (validationResult.success) {
        validExams.push(validationResult.data);
      } else {
        console.warn(
          `Invalid exam data (ID: ${exam.id}):`,
          validationResult.error.message
        );
      }
    }

    return { data: validExams, error: null };
  } catch (error) {
    console.error("Error getting exams:", error);
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
 * Create a new exam
 * @param exam The exam data to create
 * @returns The created exam data or an error
 */
export async function createExam(exam: CreateExam): Promise<{
  data: Exam | null;
  error: Error | null;
}> {
  try {
    // Use admin client for creating exams (typically an admin operation)
    const supabase = await createSupabaseAdminClient();

    const { data, error } = await supabase
      .from(EXAM_TABLE)
      .insert(exam)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = ExamSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid exam data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
  } catch (error) {
    console.error("Error creating exam:", error);
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
 * Update an existing exam
 * @param id The ID of the exam to update
 * @param exam The exam data to update
 * @returns The updated exam data or an error
 */
export async function updateExam(
  id: string,
  exam: UpdateExam
): Promise<{
  data: Exam | null;
  error: Error | null;
}> {
  try {
    // Use admin client for updating exams (typically an admin operation)
    const supabase = await createSupabaseAdminClient();

    const { data, error } = await supabase
      .from(EXAM_TABLE)
      .update(exam)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = ExamSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid exam data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
  } catch (error) {
    console.error("Error updating exam:", error);
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
 * Delete an exam
 * @param id The ID of the exam to delete
 * @returns Success or error
 */
export async function deleteExam(id: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    // Use admin client for deleting exams (typically an admin operation)
    const supabase = await createSupabaseAdminClient();

    const { error } = await supabase.from(EXAM_TABLE).delete().eq("id", id);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting exam:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error("An unexpected error occurred"),
    };
  }
}
