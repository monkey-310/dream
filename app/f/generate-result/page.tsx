import { Routes } from "@/routes/Routes";
import { getDiagnosticByUserId } from "@/supabase/db/diagnostic";
import { getUserProfileByUserId } from "@/supabase/db/user-profile";
import { createSupabaseServerClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function GenerateResult() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  const { data: userData, error: userError } = await getUserProfileByUserId(
    data.user?.id!
  );

  const { data: diagnosticData, error: diagnosticError } =
    await getDiagnosticByUserId(data.user?.id!);

  

  redirect(Routes.BookingPage);
}
