import ExamAnalysis from "@/components/custom/exam-analysis";
import { SupabaseApi } from "@/supabase/SupabaseApi";
import { createSupabaseAdminClient } from "@/supabase/admin";
import { getExamById } from "@/supabase/db/exam/api";
import { getSatQuestionById } from "@/supabase/db/sat-questions/api";
import { prepareExamDataServer } from "@/utils/prepare-exam-data";

export default async function ExamPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  // Fetch the exam result
  const { data: examResult, error: examResultError } =
    await SupabaseApi.getExamResultById(id);

  if (examResultError || !examResult) {
    // Handle error case
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">
          Error Loading Exam Result
        </h2>
        <p>
          {examResultError?.message ||
            "Could not find the specified exam result."}
        </p>
      </div>
    );
  }

  // Fetch the exam to get exam type
  const { data: examData, error: examError } = await getExamById(
    examResult.exam_id
  );
  const examType = examData?.metadata?.title || "Exam";

  // Get user info for the student name
  const supabase = await createSupabaseAdminClient();
  const { data: userData } = await supabase.auth.admin.getUserById(
    examResult.user_id
  );

  // Get student name from user data or use default
  const studentName =
    userData?.user?.user_metadata?.first_name +
      " " +
      userData?.user?.user_metadata?.last_name || "Student";

  // Prepare data for the ExamAnalysis component
  const analysisData = await prepareExamDataServer(
    examResult,
    studentName,
    examType,
    getSatQuestionById
  );

  // Return the ExamAnalysis component with the prepared data
  return <ExamAnalysis {...analysisData} studentName={studentName} />;
}
