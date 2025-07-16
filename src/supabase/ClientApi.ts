"use client";

import { createClient } from "./client";
import {
  ExamResult,
  ExamResultData,
  ExamResultSchema,
} from "./db/exam-result/schema";
import { Exam } from "./db/exam/schema";
import { SatQuestion } from "./db/sat-questions/schema";

export const ClientApi = {
  async getExamById(
    id: string
  ): Promise<{ data: Exam | null; error: Error | null }> {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
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
  },

  async getExamsForUser(
    limit: number = 10
  ): Promise<{ data: Exam[] | null; error: Error | null }> {
    try {
      const supabase = createClient();

      // Get the current user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        return { data: null, error: new Error(userError.message) };
      }

      const userId = userData.user?.id;
      if (!userId) {
        return { data: null, error: new Error("User not authenticated") };
      }

      // Get exams associated with the user through exam_results
      const { data, error } = await supabase
        .from("exam_results")
        .select("exam_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      if (data.length === 0) {
        return { data: [], error: null };
      }

      // Get unique exam IDs
      const examIds = [...new Set(data.map((result) => result.exam_id))];

      // Fetch the actual exam data
      const { data: exams, error: examsError } = await supabase
        .from("exams")
        .select("*")
        .in("id", examIds);

      if (examsError) {
        return { data: null, error: new Error(examsError.message) };
      }

      return { data: exams, error: null };
    } catch (error) {
      console.error("Error getting exams for user:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred"),
      };
    }
  },

  async getQuestionById(
    id: string
  ): Promise<{ data: SatQuestion | null; error: Error | null }> {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("sat_questions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error getting question:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred"),
      };
    }
  },

  async createExamResult(
    examId: string,
    examResult: ExamResultData
  ): Promise<{
    data: ExamResult | null;
    error: Error | null;
  }> {
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const examResultRecord = {
        user_id: userData.user?.id,
        exam_id: examId,
        single_result: examResult,
      };

      const { data, error } = await supabase
        .from("exam_results")
        .insert(examResultRecord)
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
  },

  async getExamResultById(
    id: string
  ): Promise<{ data: ExamResult | null; error: Error | null }> {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("exam_results")
        .select("*")
        .eq("id", id)
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
      console.error("Error getting exam result:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("An unexpected error occurred"),
      };
    }
  },

  // Add other client-side methods as needed
};
