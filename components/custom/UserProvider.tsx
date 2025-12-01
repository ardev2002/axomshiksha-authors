"use client";
import { Session } from "@supabase/supabase-js";
import { createContext } from "react";
export const UserContext = createContext<Promise<Session | null>>(Promise.resolve(null));
export default function UserProvider({
  sessionPromise,
  children,
}: {
  sessionPromise: Promise<Session | null>;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={sessionPromise}>{children}</UserContext.Provider>;
}
