"use client";

import { useQuestionControllerStore } from "@/stores/useQuestionControllerStore";
import { SkipForward } from "lucide-react";
import { useRouter } from "next/navigation";
import Timer from "../timer/Timer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
export default function QuestionViewHeader() {
  const {
    getCurrentQuestionIndex,
    getTotalQuestions,
    currentQuestion,
    getNextQuestionId,
    examId,
  } = useQuestionControllerStore((state) => state);

  const router = useRouter();

  // Handle skip question
  const handleSkipQuestion = () => {
    const nextQuestionId = getNextQuestionId();

    if (nextQuestionId) {
      router.push(`/f/diagnostic-test/${examId}/q/${nextQuestionId}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      <div className="container max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Timer />
          </div>
          <div className="flex items-center space-x-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <SkipForward className="w-4 h-4" />
                  <span className="hidden sm:inline">Skip</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Skip this question?</AlertDialogTitle>
                  <AlertDialogDescription>
                    If you do not know the answer, you can skip this question.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSkipQuestion}>
                    Skip Question
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            {currentQuestion && (
              <>
                <span>
                  {`Question ${
                    getCurrentQuestionIndex() + 1
                  } of ${getTotalQuestions()}`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
