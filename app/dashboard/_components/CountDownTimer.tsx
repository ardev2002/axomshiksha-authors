"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function CountdownTimer({ publishTime }: { publishTime?: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!publishTime) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const publishDate = new Date(publishTime);
      const difference = publishDate.getTime() - now.getTime();

      if (difference <= 0) {
        router.refresh();
        return "Published";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        return `${days}d ${hours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === "Published") {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [publishTime]);

  if (!publishTime) return null;

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-xs font-mono bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30"
    >
      {timeLeft}
    </motion.span>
  );
}

