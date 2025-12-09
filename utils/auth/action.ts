"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signIn() {
  const sp = await createClient();
  const { data } = await sp.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL!}/auth/v1/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const sp = await createClient();
  await sp.auth.signOut();
  redirect("/");
}
