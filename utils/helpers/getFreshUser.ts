import "server-only";
import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export const getFreshUser = cache(async (): Promise<User | null> => {
  const sp = await createClient();
  const {
    data: { user },
    error,
  } = await sp.auth.getUser();
  if (error) return null;
  return user;
});
