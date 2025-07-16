import { createSupabaseServerClient } from "../../server";
import { createSupabaseAdminClient } from "../../admin";
import {
  SatQuestion,
  SatQuestionSchema,
  CreateSatQuestion,
  UpdateSatQuestion,
  SAT_QUESTIONS_TABLE,
  Section,
  DifficultyLevel,
} from "./schema";

/**
 * Get a SAT question by ID
 * @param id The ID of the question to get
 * @returns The question data or an error
 */
export async function getSatQuestionById(id: string): Promise<{
  data: SatQuestion | null;
  error: Error | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(SAT_QUESTIONS_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = SatQuestionSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid question data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
  } catch (error) {
    console.error("Error getting SAT question:", error);
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
 * Create a new SAT question
 * @param question The question data to create
 * @returns The created question data or an error
 */
export async function createSatQuestion(question: CreateSatQuestion): Promise<{
  data: SatQuestion | null;
  error: Error | null;
}> {
  try {
    // Use admin client for creating questions (typically an admin operation)
    const supabase = await createSupabaseAdminClient();

    const { data, error } = await supabase
      .from(SAT_QUESTIONS_TABLE)
      .insert(question)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Validate the data against the schema
    const validationResult = SatQuestionSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        data: null,
        error: new Error(
          `Invalid question data: ${validationResult.error.message}`
        ),
      };
    }

    return { data: validationResult.data, error: null };
  } catch (error) {
    console.error("Error creating SAT question:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("An unexpected error occurred"),
    };
  }
}
