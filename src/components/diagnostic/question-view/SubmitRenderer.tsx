"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type SubmitRendererProps = {
  handleNextQuestion: () => void;
  selectedOption: string | null;
  isLastQuestion: boolean;
};

export const SubmitRenderer = (props: SubmitRendererProps) => {
  const { handleNextQuestion, selectedOption, isLastQuestion } = props;

  return (
    <>
      <Button
        onClick={handleNextQuestion}
        disabled={!selectedOption}
        className="w-full bg-[#DB5461] hover:bg-[#c64854] text-white flex items-center justify-center gap-2 py-6"
        size="lg"
      >
        {!isLastQuestion ? (
          <>
            Submit & Continue
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          "Submit & Finish Section"
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 mt-2">
        {!selectedOption
          ? "Please select an answer to continue"
          : "Your answer will be saved automatically"}
      </p>
    </>
  );
};
