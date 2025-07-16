"use client";

import { useRef } from "react";
import ReactToPrint from "react-to-print";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import {
  Clock,
  CheckCircle,
  XCircle,
  Download,
  AlertCircle,
  Timer,
  CheckSquare,
  XSquare,
  HelpCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the data structure for exam results
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

interface ExamAnalysisProps {
  studentName: string;
  examDate: Date;
  examType: string;
  results: QuestionResult[];
}

// Generate dummy data
const generateDummyData = (): QuestionResult[] => {
  const difficulties: ("easy" | "medium" | "hard")[] = [
    "easy",
    "easy",
    "medium",
    "medium",
    "hard",
    "easy",
    "medium",
    "medium",
    "hard",
    "hard",
  ];
  const correctAnswers = ["A", "B", "C", "D", "A", "B", "C", "D", "A", "B"];
  const questionTexts = [
    "In the passage, the author primarily focuses on describing...",
    "Based on the passage, which of the following best explains why...",
    "The author mentions the example of the butterfly primarily to...",
    "Which choice provides the best evidence for the answer to the previous question?",
    "As used in line 37, 'charge' most nearly means...",
    "If x² + y² = 25 and x + y = 7, what is the value of xy?",
    "A line passes through the points (2, 5) and (4, 9). Which of the following points also lies on this line?",
    "If f(x) = 3x² - 2x + 1, what is the value of f(f(1))?",
    "In triangle ABC, angle A = 30°, angle B = 45°, and side c = 8. What is the length of side a?",
    "A factory produces x items in t hours. If the factory increases its production rate by 20%, how many items will it produce in t hours?",
  ];

  return Array.from({ length: 10 }, (_, i) => {
    // Randomly determine if question is answered or skipped (10% chance of skipping)
    const isSkipped = Math.random() < 0.1;

    // If not skipped, determine if correct (60% chance of correct if answered)
    const is_correct = isSkipped ? null : Math.random() > 0.4;

    // User answer is null if skipped, otherwise it's either correct or a random wrong answer
    const userAnswer = isSkipped
      ? null
      : is_correct
      ? correctAnswers[i]
      : ["A", "B", "C", "D"].filter((a) => a !== correctAnswers[i])[
          Math.floor(Math.random() * 3)
        ];

    return {
      is_correct,
      time_taken: isSkipped ? 0 : Math.floor(Math.random() * 180) + 30, // 30-210 seconds, 0 if skipped
      question_id: `q-${i + 1}-${Math.random().toString(36).substring(2, 8)}`,
      question_number: i + 1,
      user_answer: userAnswer,
      correct_answer: correctAnswers[i],
      question_text: questionTexts[i],
      difficulty: difficulties[i],
    };
  });
};

export default function ExamAnalysis({
  studentName = "Student",
  examDate = new Date(),
  examType = "SAT Diagnostic Test",
  results = generateDummyData(),
}: ExamAnalysisProps) {
  const printRef = useRef<HTMLDivElement>(null);

  // Calculate summary statistics
  const totalQuestions = results.length;
  const answeredQuestions = results.filter((r) => r.is_correct !== null).length;
  const skippedQuestions = totalQuestions - answeredQuestions;
  const correctAnswers = results.filter((r) => r.is_correct === true).length;
  const incorrectAnswers = results.filter((r) => r.is_correct === false).length;
  const correctPercentage =
    answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;

  // Calculate time statistics (excluding skipped questions)
  const answeredResults = results.filter((r) => r.is_correct !== null);
  const totalTimeTaken = answeredResults.reduce(
    (sum, r) => sum + r.time_taken,
    0
  );
  const averageTimePerQuestion =
    answeredResults.length > 0 ? totalTimeTaken / answeredResults.length : 0;

  // Format time (seconds to mm:ss)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Format total time (seconds to hh:mm:ss)
  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  // Prepare data for time analysis chart
  const timeChartData = results.map((r) => ({
    question: `Q${r.question_number}`,
    timeTaken: r.time_taken,
    status:
      r.is_correct === null
        ? "skipped"
        : r.is_correct
        ? "correct"
        : "incorrect",
  }));

  // Handle print/PDF export
  const handlePrint = () => {
    if (printRef.current) {
      // Using ReactToPrint component approach instead of hook
      const printButton = document.createElement("button");
      document.body.appendChild(printButton);

      /*ReactToPrint({
        content: () => printRef.current,
        documentTitle: `${studentName} - ${examType} Analysis - ${format(
          examDate,
          "yyyy-MM-dd"
        )}`,
        onAfterPrint: () => console.log("PDF generated successfully"),
        trigger: () => printButton,
      });*/

      printButton.click();
      document.body.removeChild(printButton);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header with print button */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Exam Analysis</h1>
            <p className="text-gray-500">
              {examType} - {format(examDate, "MMMM d, yyyy")}
            </p>
          </div>
          <Button
            onClick={handlePrint}
            className="bg-[#DB5461] hover:bg-[#c64854] text-white flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Save as PDF
          </Button>
        </div>
      </header>

      {/* Main content - will be captured for PDF */}
      <div ref={printRef} className="container mx-auto px-4 py-8 space-y-8">
        {/* Student info and summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold">{studentName}</h2>
              <p className="text-gray-500">
                {examType} - {format(examDate, "MMMM d, yyyy")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Score</div>
                  <div className="text-lg font-bold">
                    {correctPercentage.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Total Time</div>
                  <div className="text-lg font-bold">
                    {formatTotalTime(totalTimeTaken)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Correct vs. Incorrect Answers
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={correctPercentage} className="h-3" />
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-green-600 font-medium">
                  {correctAnswers}
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-red-500 font-medium">
                  {incorrectAnswers}
                </span>
                {skippedQuestions > 0 && (
                  <>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-500 font-medium">
                      {skippedQuestions} skipped
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Correct: {correctPercentage.toFixed(0)}%</span>
              <span>Incorrect: {(100 - correctPercentage).toFixed(0)}%</span>
              {skippedQuestions > 0 && (
                <span>
                  Skipped:{" "}
                  {((skippedQuestions / totalQuestions) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Total Questions
                    </span>
                    <span className="font-medium">{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Answered Questions
                    </span>
                    <span className="font-medium">{answeredQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Skipped Questions
                    </span>
                    <span className="font-medium">{skippedQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Correct Answers
                    </span>
                    <span className="font-medium text-green-600">
                      {correctAnswers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Incorrect Answers
                    </span>
                    <span className="font-medium text-red-500">
                      {incorrectAnswers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Score</span>
                    <span className="font-medium">
                      {correctPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Time Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Time</span>
                    <span className="font-medium">
                      {formatTotalTime(totalTimeTaken)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Average Time per Question
                    </span>
                    <span className="font-medium">
                      {formatTime(averageTimePerQuestion)}
                    </span>
                  </div>
                  {answeredResults.length > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Fastest Question
                        </span>
                        <span className="font-medium">
                          {formatTime(
                            Math.min(
                              ...answeredResults.map((r) => r.time_taken)
                            )
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Slowest Question
                        </span>
                        <span className="font-medium">
                          {formatTime(
                            Math.max(
                              ...answeredResults.map((r) => r.time_taken)
                            )
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Difficulty Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["easy", "medium", "hard"].map((difficulty) => {
                    const questionsOfDifficulty = results.filter(
                      (r) =>
                        r.difficulty === difficulty && r.is_correct !== null
                    );
                    const correctOfDifficulty = questionsOfDifficulty.filter(
                      (r) => r.is_correct === true
                    ).length;
                    const percentageCorrect =
                      questionsOfDifficulty.length > 0
                        ? (correctOfDifficulty / questionsOfDifficulty.length) *
                          100
                        : 0;

                    return (
                      <div key={difficulty} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm capitalize">
                            {difficulty}
                          </span>
                          <span className="text-sm font-medium">
                            {correctOfDifficulty}/{questionsOfDifficulty.length}{" "}
                            ({percentageCorrect.toFixed(0)}%)
                          </span>
                        </div>
                        <Progress value={percentageCorrect} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Time Analysis Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Time Analysis</h2>
          <Card>
            <CardHeader>
              <CardTitle>Time Spent per Question</CardTitle>
              <CardDescription>
                Analysis of time spent on each question compared to the average
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="question"
                      angle={0}
                      textAnchor="middle"
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      label={{
                        value: "Time (seconds)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => {
                        if (name === "timeTaken") {
                          return [
                            value === 0 ? "Skipped" : `${formatTime(value)}`,
                            "Time Taken",
                          ];
                        }
                        return [value, name];
                      }}
                      labelFormatter={(label) => `Question ${label}`}
                    />
                    <Legend />
                    <ReferenceLine
                      y={averageTimePerQuestion}
                      stroke="#888"
                      strokeDasharray="3 3"
                      label={{
                        value: `Avg: ${formatTime(averageTimePerQuestion)}`,
                        position: "insideBottomRight",
                        fill: "#888",
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="timeTaken"
                      name="Time Taken"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={(props) => {
                        const { cx, cy, payload } = props;

                        if (payload.status === "skipped") {
                          return (
                            <svg
                              x={cx - 8}
                              y={cy - 8}
                              width={16}
                              height={16}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx={8}
                                cy={8}
                                r={7}
                                fill="#f3f4f6"
                                stroke="#9ca3af"
                                strokeWidth={1.5}
                              />
                              <path
                                d="M5 8h6"
                                stroke="#9ca3af"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                              />
                            </svg>
                          );
                        }

                        if (payload.status === "correct") {
                          return (
                            <circle
                              key={payload.question}
                              cx={cx}
                              cy={cy}
                              r={6}
                              fill="#10b981"
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          );
                        }

                        return (
                          <circle
                            key={payload.question}
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill="#ef4444"
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        );
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4 gap-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Correct Answer</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Incorrect Answer</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-400 mr-2"></div>
                  <span className="text-sm">Skipped Question</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Details Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Question Details</h2>
          <Card>
            <CardHeader>
              <CardTitle>Question-by-Question Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of each question, answer, and time spent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {results.map((question, index) => (
                  <AccordionItem
                    key={question.question_id}
                    value={question.question_id}
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          {question.is_correct === true ? (
                            <CheckSquare className="h-5 w-5 text-green-600" />
                          ) : question.is_correct === false ? (
                            <XSquare className="h-5 w-5 text-red-500" />
                          ) : (
                            <HelpCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="font-medium">
                            Question {question.question_number}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              question.difficulty === "easy"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : question.difficulty === "medium"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {question.difficulty}
                          </Badge>
                          {question.is_correct === null && (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-700 border-gray-300"
                            >
                              Skipped
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Timer className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {question.is_correct === null
                                ? "—"
                                : formatTime(question.time_taken)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-9 space-y-4">
                        <div className="text-gray-700">
                          {question.question_text}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {question.is_correct !== null ? (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">
                                Your Answer
                              </div>
                              <div
                                className={`p-3 rounded-md ${
                                  question.is_correct
                                    ? "bg-green-50 border border-green-200"
                                    : "bg-red-50 border border-red-200"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {question.is_correct ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                                  <span className="font-medium">
                                    Option {question.user_answer}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">
                                Student's Answer
                              </div>
                              <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
                                <div className="flex items-center gap-2">
                                  <HelpCircle className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium text-gray-500">
                                    Question Skipped
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="text-sm font-medium">
                              Correct Answer
                            </div>
                            <div className="p-3 rounded-md bg-green-50 border border-green-200">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="font-medium">
                                  Option {question.correct_answer}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <AlertCircle className="h-4 w-4" />
                          <span>
                            {question.is_correct === true
                              ? "Great job! You answered this question correctly."
                              : question.is_correct === false
                              ? "You answered this question incorrectly. Review the correct answer above."
                              : "You skipped this question. Review the correct answer above."}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
