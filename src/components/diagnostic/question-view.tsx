"use client";

import { updateDiagnostic } from "@/actions/diagnostic-actions";
import { RadioGroup } from "@/components/ui/radio-group";
import { ExamId } from "@/constants/Constants";
import { Routes } from "@/routes/Routes";
import { useResultStore } from "@/stores";
import { useQuestionControllerStore } from "@/stores/useQuestionControllerStore";
import { useTimerStore } from "@/stores/useTimerStore";
import { ClientApi } from "@/supabase/ClientApi";
import { MathJaxContext } from "better-react-mathjax";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import { ChoicesRenderer } from "./question-view/ChoicesRenderer";
import { QuestionTextRenderer } from "./question-view/QuestionTextRenderer";
import { SubmitRenderer } from "./question-view/SubmitRenderer";

export default function QuestionView() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionTimer, setQuestionTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    currentQuestion,
    getNextQuestionId,
    examId,
    exam,
    getCurrentQuestionIndex,
    clearCurrentQuestion,
  } = useQuestionControllerStore();

  const { addResult, getResults } = useResultStore();

  const { resetTimerStore } = useTimerStore.getState();
  const router = useRouter();

  const isLastQuestion =
    getCurrentQuestionIndex() === exam?.questions.length - 1;

  // Start timer when component mounts
  useEffect(() => {
    // Start timer
    timerRef.current = setInterval(() => {
      setQuestionTimer((prev) => prev + 1);
    }, 1000);

    // Reset timer when unmounting
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Reset timer when question changes
  useEffect(() => {
    setQuestionTimer(0);
  }, [currentQuestion?.id]);

  // Handle answer selection
  const handleOptionSelect = (optionId: string) => setSelectedOption(optionId);

  // Handle next question
  const handleNextQuestion = async () => {
    const nextQuestionId = getNextQuestionId();

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    addResult({
      question_id: currentQuestion?.id,
      user_answer: selectedOption,
      time_taken: questionTimer,
      is_correct: selectedOption === currentQuestion?.correct_answer,
    });

    try {
      if (isLastQuestion) {
        clearCurrentQuestion();
        resetTimerStore();

        const results = getResults();

        const { data, error } = await ClientApi.createExamResult(
          examId,
          results
        );

        const { data: exams, error: examError } =
          await ClientApi.getExamsForUser();
        const examArray = exams?.map((exam) => exam.id) ?? [];

        if (data?.id) {
          // Determine which diagnostic type to update based on exam ID
          if (examId === ExamId.math) {
            await updateDiagnostic({
              math_diagnostic_id: data.id,
            });
          } else {
            await updateDiagnostic({
              verbal_diagnostic_id: data.id,
            });
          }
        }

        if (error) {
          console.error(error);
        }

        if (
          examArray?.includes(ExamId.math) &&
          examArray?.includes(ExamId.verbal)
        ) {
          router.push(Routes.GenerateResult);
          return;
        }

        router.push(Routes.DiagnosticTest);
        return;
      }

      if (nextQuestionId) {
        router.push(`/f/diagnostic-test/${examId}/q/${nextQuestionId}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const { question } = currentQuestion;

  const mathConfig = {
    tex: {
      inlineMath: [["**", "**"]],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"],
      ],
      tags: "none",
    },
  };

  return (
    <MathJaxContext config={mathConfig}>
      <div className="flex flex-col">
        {/* Content */}
        <div className="flex flex-col">
          {/* Main question content */}
          <main className="flex-grow container max-w-6xl mx-auto px-4 py-8 min-w-[1024px]">
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              {/* Question Panel - Left Side */}
              <QuestionTextRenderer question={question} />

              {/* Answer Panel - Right Side */}
              <Card className="flex-1 lg:w-1/2">
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Select Your Answer
                  </h3>

                  <RadioGroup
                    value={selectedOption || ""}
                    onValueChange={handleOptionSelect}
                    className="flex-grow"
                  >
                    <div className="space-y-3">
                      <ChoicesRenderer
                        choices={currentQuestion.choices}
                        selectedOption={selectedOption}
                      />
                    </div>
                  </RadioGroup>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <SubmitRenderer
                      handleNextQuestion={handleNextQuestion}
                      selectedOption={selectedOption}
                      isLastQuestion={isLastQuestion}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </MathJaxContext>
  );
}
