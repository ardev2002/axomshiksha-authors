"use client";

import { useEffect, useState } from "react";

export default function PostMetaDate({ date }: { date: string }) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    const d = new Date(date);
    setFormatted(
      d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    );
  }, [date]);

  // Use suppressHydrationWarning to handle potential mismatches
  return <span suppressHydrationWarning>{formatted}</span>;
}