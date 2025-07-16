"use client";

import QuestionView from "@/components/diagnostic/question-view";
import { Loader } from "@/components/ui/loader";
import { useQuestionControllerStore } from "@/stores/useQuestionControllerStore";
import { ClientApi } from "@/supabase/ClientApi";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function QuestionPage() {
  const { qid } = useParams();
  const { setCurrentQuestion, currentQuestion } = useQuestionControllerStore();

  useEffect(() => {
    const get = async () => {
      const { data, error } = await ClientApi.getQuestionById(qid as string);
      if (data) {
        setCurrentQuestion(data);
      }
    };

    get();
  }, []);

  if (!currentQuestion) return <Loader />;

  return <QuestionView />;
}
