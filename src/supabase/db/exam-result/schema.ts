import { z } from "zod";

// Define the schema for the result JSON field
export const ExamResultDataSchema = z.array(
  z.object({
    question_id: z.string().uuid(),
    user_answer: z.string().nullable(),
    time_taken: z.number(),
    is_correct: z.boolean(),
  })
);
export type ExamResultData = z.infer<typeof ExamResultDataSchema>;

// Define the schema for the exam_result table
export const ExamResultSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  exam_id: z.string().uuid(),
  single_result: ExamResultDataSchema,
  result_link: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type ExamResult = z.infer<typeof ExamResultSchema>;
export type CreateExamResult = z.infer<typeof ExamResultSchema>;

// Database table name
export const EXAM_RESULT_TABLE = "exam_results";
