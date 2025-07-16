import DataTable from "@/components/custom/user-data-table";
import { SupabaseApi } from "@/supabase/SupabaseApi";

export default async function UserList() {
  const { data, error } = await SupabaseApi.getDiagnostics();

  // Create promises for each user
  const userPromises =
    data?.map(async (diagnostic) => {
      const { data, error } = await SupabaseApi.getUserById(diagnostic.user_id);

      if (error) {
        console.error(error);
      }

      return {
        id: diagnostic.id,
        userId: diagnostic.user_id,
        email: data?.user?.email ?? "Email not found",
        createdAt: diagnostic.created_at
          ? new Date(diagnostic.created_at)
          : new Date(),
      };
    }) || [];

  // Resolve all promises
  const tableData = await Promise.all(userPromises);

  return <DataTable data={tableData} />;
}
