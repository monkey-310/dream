"use client";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MathJax } from "better-react-mathjax";
import { QuestionUtils } from "@/utils/QuestionUtils";

export const ChoicesRenderer = (props: {
  choices: any[];
  selectedOption: string | null;
}) => {
  const { choices, selectedOption } = props;
  return (
    <>
      {choices.map((option: any) => (
        <div
          key={option.value}
          className={`border rounded-lg p-4 transition-colors ${
            selectedOption === option.value
              ? "border-gray-300 bg-gray-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-start">
            <RadioGroupItem
              value={option.value}
              id={`option-${option.value}`}
              className="mt-1"
            />
            <Label
              htmlFor={`option-${option.value}`}
              className="ml-3 cursor-pointer flex-grow"
            >
              {option?.math ? (
                <MathJax inline>
                  <p className="text-gray-600 mt-1">
                    {QuestionUtils.replaceMathExpressions(
                      option?.display_text,
                      option?.math,
                      "latex"
                    )}
                  </p>
                </MathJax>
              ) : (
                <div className="text-gray-600 mt-1">{option.display_text}</div>
              )}
            </Label>
          </div>
        </div>
      ))}
    </>
  );
};
