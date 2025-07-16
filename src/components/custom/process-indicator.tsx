"use client";

import { motion } from "framer-motion";
import { Check, BookOpen, Calculator, BarChart, User } from "lucide-react";

interface ProcessIndicatorProps {
  // Instead of a single currentStep, track completion status of each step
  completedSteps: {
    profile: boolean;
    verbal: boolean;
    math: boolean;
    results: boolean;
  };
  // Current active step (if any)
  activeStep?: "profile" | "verbal" | "math" | "results" | null;
}

export default function ProcessIndicator({
  completedSteps,
  activeStep = null,
}: ProcessIndicatorProps) {
  // Define the steps
  const steps = [
    { id: "profile", name: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "verbal", name: "Verbal", icon: <BookOpen className="h-4 w-4" /> },
    { id: "math", name: "Math", icon: <Calculator className="h-4 w-4" /> },
    { id: "results", name: "Results", icon: <BarChart className="h-4 w-4" /> },
  ];

  // Calculate progress percentage
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = (completedCount / (steps.length - 1)) * 100;

  return (
    <div className="relative py-5">
      {/* Progress Bar - positioned in the middle */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />

      {/* Animated Progress Bar */}
      <motion.div
        className="absolute top-1/2 bg-[#DB5461]"
        style={{ width: `${progressPercentage}%` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Steps */}
      <div className="relative flex justify-between ">
        {steps.map((step) => {
          const isCompleted =
            completedSteps[step.id as keyof typeof completedSteps];
          const isCurrent = activeStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${
                  isCompleted
                    ? "bg-[#DB5461] text-white"
                    : isCurrent
                    ? "bg-white border-2 border-[#DB5461] text-[#DB5461]"
                    : "bg-white border-2 border-gray-200 text-gray-400"
                }`}
                initial={{ scale: 1 }}
                animate={{
                  scale: isCurrent ? [1, 1.1, 1] : 1,
                  backgroundColor: isCompleted
                    ? "#DB5461"
                    : isCurrent
                    ? "#FFFFFF"
                    : "#FFFFFF",
                  borderColor: isCompleted
                    ? "#DB5461"
                    : isCurrent
                    ? "#DB5461"
                    : "#E5E7EB",
                }}
                transition={{
                  duration: 0.5,
                  scale: {
                    repeat: isCurrent ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                    duration: 1.5,
                  },
                }}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <div>{step.icon}</div>
                )}
              </motion.div>

              <div className="mt-2 text-xs font-medium text-center">
                <motion.span
                  className={
                    isCompleted
                      ? "text-[#DB5461]"
                      : isCurrent
                      ? "text-gray-900"
                      : "text-gray-500"
                  }
                  animate={{
                    color: isCompleted
                      ? "#DB5461"
                      : isCurrent
                      ? "#111827"
                      : "#6B7280",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {step.name}
                </motion.span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
