import "server-only";

import crypto from "crypto";
import { headers } from "next/headers";

export async function getVisitorIP() {
  const h = await headers();

  let ip =
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "0.0.0.0";

  if (ip === "::1") ip = "127.0.0.1";

  return ip;
}

export function hashIP(ip: string) {
  return crypto.createHash("sha256").update(ip).digest("hex");
}
