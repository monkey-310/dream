"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuestionControllerStore } from "@/stores/useQuestionControllerStore";
import { useTimerStoreWithInitialization } from "@/stores/useTimerStore";
import { ClientApi } from "@/supabase/ClientApi";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

export default function DiagnosticTestPage() {
  const { id } = useParams();
  const { setExam, examId, exam } = useQuestionControllerStore();
  const [isPending, startTransition] = useTransition();
  const { startTimer } = useTimerStoreWithInitialization();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const get = async () => {
      const { data, error } = await ClientApi.getExamById(id as string);
      if (data) {
        setExam(data);
      }
    };
    if (!examId) {
      get();
    }
  }, []);

  const handleExamStart = () => {
    startTransition(() => {
      startTimer();
      router.push(`${pathName}/q/${exam?.questions[0]}`);
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Confirmation
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-lg mb-4">Are you ready to take the exam?</p>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        <Button
          onClick={() => handleExamStart()}
          variant={"outline"}
          className="w-full transition-all duration-300 ease-in-out"
          isLoading={isPending}
        >
          Yes, I'm ready!
        </Button>
      </CardFooter>
    </Card>
  );
}
