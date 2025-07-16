import { ExamResult } from "@/supabase/db/exam-result/schema";
import {
  DifficultyLevel,
  SatQuestion,
} from "@/supabase/db/sat-questions/schema";

// Interface structure expected by the ExamAnalysis component
interface QuestionResult {
  is_correct: boolean | null; // null means skipped
  time_taken: number; // in seconds
  question_id: string;
  question_number: number;
  user_answer: string | null; // null means skipped
  correct_answer: string;
  question_text: string;
  difficulty: "easy" | "medium" | "hard";
}

interface PreparedExamData {
  studentName: string;
  examDate: Date;
  examType: string;
  results: QuestionResult[];
}

/**
 * Converts difficulty level from SatQuestion to the expected format in ExamAnalysis
 */
function mapDifficultyLevel(level: number) {
  // Map the 0-5 scale to easy, medium, hard
  switch (level) {
    case 1:
    case 2:
      return "easy";
    case 3:
    case 4:
      return "medium";
    case 5:
      return "hard";
    default:
      return "medium"; // Default fallback
  }
}

/**
 * Server-side version of the prepareExamData function that uses the server API
 * instead of the client API
 */
export async function prepareExamDataServer(
  examResult: ExamResult,
  studentName: string,
  examType: string,
  getSatQuestionById: (
    id: string
  ) => Promise<{ data: SatQuestion | null; error: Error | null }>
): Promise<PreparedExamData> {
  if (!examResult || !examResult.single_result) {
    throw new Error("Invalid exam result data");
  }

  // Initialize results array
  const preparedResults: QuestionResult[] = [];

  // Process each question in the exam result
  for (let i = 0; i < examResult.single_result.length; i++) {
    const resultItem = examResult.single_result[i];

    // Get the question details from the question ID
    const { data: questionData, error } = await getSatQuestionById(
      resultItem.question_id
    );

    if (error || !questionData) {
      console.error(
        `Error fetching question ${resultItem.question_id}:`,
        error
      );
      // Add a placeholder question if we can't fetch the actual data
      preparedResults.push({
        is_correct: resultItem.is_correct,
        time_taken: resultItem.time_taken,
        question_id: resultItem.question_id,
        question_number: i + 1,
        user_answer: resultItem.user_answer,
        correct_answer: questionData?.correct_answer || "Unknown",
        question_text: questionData?.question?.text || "Unknown",
        difficulty: mapDifficultyLevel(questionData?.difficulty_level as any),
      });
      continue;
    }

    // Map the question data to the expected format
    preparedResults.push({
      is_correct: resultItem.is_correct,
      time_taken: resultItem.time_taken,
      question_id: resultItem.question_id,
      question_number: i + 1,
      user_answer: resultItem.user_answer,
      correct_answer: questionData.correct_answer,
      question_text: questionData.question.text,
      difficulty: mapDifficultyLevel(questionData.difficulty_level as any),
    });
  }

  return {
    studentName,
    examDate: new Date(examResult.created_at || Date.now()),
    examType,
    results: preparedResults,
  };
}
