import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { AUTHORS } from "@/utils/CONSTANT";
import { Author } from "@/utils/types";

export async function proxy(request: NextRequest) {
  const result = await updateSession(request);
  const { response, user } = result;

  const isAuthor = AUTHORS.map((author) => author.id).includes(
    user?.email?.split("@")[0] as Author
  );

  if (!user || !isAuthor) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
