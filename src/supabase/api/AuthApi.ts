import { createSupabaseAdminClient } from "../admin";
import { createSupabaseServerClient } from "../server";

export const AuthApi = {
  signInAnonymously: async (captchaToken?: string) => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInAnonymously({
      options: { captchaToken: captchaToken },
    });
    return { data, error };
  },
  getUserById: async (id: string) => {
    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase.auth.admin.getUserById(id);
    return { data, error };
  },
  signInWithEmail: async (email: string, password: string) => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },
  signOut: async () => {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  },
};
