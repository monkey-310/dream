import { z } from "zod";

// Define the section enum
export const SectionEnum = z.enum(["verbal", "math"]);
export type Section = z.infer<typeof SectionEnum>;

// Define the answer enum
export const AnswerEnum = z.enum(["A", "B", "C", "D"]);
export type Answer = z.infer<typeof AnswerEnum>;

// Define the difficulty level enum (0-5)
export const DifficultyLevelEnum = z.enum(["0", "1", "2", "3", "4", "5"]);
export type DifficultyLevel = z.infer<typeof DifficultyLevelEnum>;

// Define the schema for the question JSON field
export const QuestionContentSchema = z.object({
  text: z.string(),
  image_url: z.string().url().optional(),
  explanation: z.string().optional(),
});
export type QuestionContent = z.infer<typeof QuestionContentSchema>;

// Define the schema for the choices JSON field
export const ChoicesSchema = z.any();
export type Choices = z.infer<typeof ChoicesSchema>;

// Define the schema for the sat_questions table
export const SatQuestionSchema = z.object({
  id: z.string().uuid(),
  section: SectionEnum,
  subtopic: z.string(),
  question: z.any(),
  correct_answer: AnswerEnum,
  difficulty_level: z.number().min(1).max(5),
  choices: z.any(),
  created_at: z.any(),
  updated_at: z.any(),
});
export type SatQuestion = z.infer<typeof SatQuestionSchema>;

// Define the schema for creating a new sat question
export const CreateSatQuestionSchema = z.object({
  section: SectionEnum,
  subtopic: z.string(),
  question: QuestionContentSchema,
  correct_answer: AnswerEnum,
  difficulty_level: DifficultyLevelEnum,
  choices: ChoicesSchema,
});
export type CreateSatQuestion = z.infer<typeof CreateSatQuestionSchema>;

// Define the schema for updating a sat question
export const UpdateSatQuestionSchema = CreateSatQuestionSchema.partial();
export type UpdateSatQuestion = z.infer<typeof UpdateSatQuestionSchema>;

// Database table name
export const SAT_QUESTIONS_TABLE = "sat_questions";
