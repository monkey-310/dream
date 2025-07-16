"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuestionControllerStore } from "@/stores";
import { QuestionUtils } from "@/utils/QuestionUtils";
import { MathJax } from "better-react-mathjax";

export const QuestionTextRenderer = (props: { question: any }) => {
  const { question } = props;
  const { getCurrentQuestionIndex } = useQuestionControllerStore();

  const text = QuestionUtils.replaceMathExpressions(
    question.text,
    question?.math,
    "latex"
  );

  return (
    <Card className="flex-1 lg:w-1/2 overflow-hidden">
      <div className="p-6 flex flex-col h-full">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Question {getCurrentQuestionIndex() + 1}
          </h2>
        </div>

        <Separator className="mb-4" />

        {/* Scrollable Question Container */}
        <div className="overflow-y-auto flex-grow pr-2 mb-4 max-h-[calc(100vh-300px)]">
          <MathJax inline>
            <p className="text-gray-800 text-lg leading-relaxed">{text}</p>
          </MathJax>
        </div>
      </div>
    </Card>
  );
};
