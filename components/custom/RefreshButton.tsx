"use client";

import { MotionButton } from "./Motion";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tId, setTId] = useState<any>(null);

  const handler = () => {
    setIsRefreshing(true);
    router.refresh();
    const timeOut = setTimeout(() => setIsRefreshing(false), 1000);
    setTId(timeOut);
  };

  useEffect(() => {
    return () => {
      clearTimeout(tId);
    }
  }, [isRefreshing]);

  return (
    <MotionButton 
      variant={'ghost'} 
      size={'icon-lg'}
      disabled={isRefreshing}
      transition={{ duration: 0.2 }}
      onClick={handler}
      className="hover:cursor-pointer"
    >
      <RefreshCcw className={isRefreshing ? "animate-spin" : ""} />
    </MotionButton>
  );
}