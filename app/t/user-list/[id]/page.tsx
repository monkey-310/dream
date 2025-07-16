import UserDetailView from "@/components/custom/user-detail-view";
import { SupabaseApi } from "@/supabase/SupabaseApi";

export default async function UserDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;
  const { data: diagnosticData, error: diagnosticError } =
    await SupabaseApi.getDiagnosticById(id);
  const { data, error } = await SupabaseApi.getUserById(
    diagnosticData?.user_id ?? ""
  );

  const { data: userProfile, error: userProfileError } =
    await SupabaseApi.getUserProfileByUserId(diagnosticData?.user_id ?? "");

  return (
    <UserDetailView
      userData={data}
      userProfile={userProfile}
      diagnostic={diagnosticData}
    />
  );
}
