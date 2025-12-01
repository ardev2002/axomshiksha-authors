import "server-only";
import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { Session } from "@supabase/supabase-js";

export const getSession = cache(async (): Promise<Session | null> => {
  const sp = await createClient();
  const {
    data: { session },
    error,
  } = await sp.auth.getSession();
  if (error) return null;
  return session;
});
