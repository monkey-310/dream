import { z } from "zod";

// Define the exam type enum
export const ExamTypeEnum = z.enum([
  "verbal",
  "math",
  "verbal_diagnostic",
  "math_diagnostic",
]);
export type ExamType = z.infer<typeof ExamTypeEnum>;

// Define the schema for the metadata JSON field
export const ExamMetadataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  duration_minutes: z.number().int().positive().optional(),
  total_points: z.number().int().positive().optional(),
  difficulty_level: z.number().int().min(0).max(5).optional(),
  tags: z.array(z.string()).optional(),
  instructions: z.string().optional(),
  is_published: z.boolean().optional().default(false),
});
export type ExamMetadata = z.infer<typeof ExamMetadataSchema>;

// Define the schema for the exam table
export const ExamSchema = z.object({
  id: z.string().uuid(),
  type: ExamTypeEnum,
  questions: z.array(z.string().uuid()),
  metadata: ExamMetadataSchema,
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});
export type Exam = z.infer<typeof ExamSchema>;

// Define the schema for creating a new exam
export const CreateExamSchema = z.object({
  type: ExamTypeEnum,
  questions: z.array(z.string().uuid()),
  metadata: ExamMetadataSchema,
});
export type CreateExam = z.infer<typeof CreateExamSchema>;

// Define the schema for updating an exam
export const UpdateExamSchema = z.object({
  type: ExamTypeEnum.optional(),
  questions: z.array(z.string().uuid()).optional(),
  metadata: ExamMetadataSchema.partial().optional(),
});
export type UpdateExam = z.infer<typeof UpdateExamSchema>;

// Database table name
export const EXAM_TABLE = "exams";
