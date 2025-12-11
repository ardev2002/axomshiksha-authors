"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Edit3 } from "lucide-react";
import { formatNumber } from "@/utils/formatNumber";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RecentPost {
  id: number;
  title: string;
  date: string;
  slug: string;
  publishTime?: string; // Add publishTime for scheduled posts
}

interface RecentPostsCardProps {
  title: string;
  icon: React.ReactNode;
  badgeVariant: "published" | "draft" | "scheduled";
  totalCount?: number;
  posts: RecentPost[];
  viewAllHref: string;
  isPublished?: boolean;
  // Add refresh function prop
  onPostStatusChange?: ({ id, title, date, slug }: RecentPost) => void;
}

// CountdownTimer component for scheduled posts
export function CountdownTimer({ publishTime, onPostPublished }: { publishTime?: string; onPostPublished?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    if (!publishTime) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const publishDate = new Date(publishTime);
      const difference = publishDate.getTime() - now.getTime();

      if (difference <= 0) {
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

    // Set initial time left
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Show dialog and clear interval if post is published
      if (newTimeLeft === "Published") {
        clearInterval(timer);
        // Call the callback to notify parent component
        if (onPostPublished) {
          onPostPublished();
          router.refresh();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [publishTime, onPostPublished]);

  if (!publishTime) return null;

  return (
    <>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs font-mono bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30"
      >
        {timeLeft}
      </motion.span>
    </>
  );
}

export function RecentPostsCard({
  title,
  icon,
  badgeVariant,
  totalCount = 0,
  posts,
  viewAllHref,
  isPublished = false,
  onPostStatusChange,
}: RecentPostsCardProps) {
  const getBadgeClass = () => {
    switch (badgeVariant) {
      case "published":
        return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
      case "draft":
        return "text-amber-400 border-amber-400/30 bg-amber-400/10";
      case "scheduled":
        return "text-purple-400 border-purple-400/30 bg-purple-400/10";
      default:
        return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
    }
  };

  const getButtonClass = () => {
    switch (badgeVariant) {
      case "published":
        return "text-emerald-400 hover:cursor-pointer hover:bg-emerald-400/10";
      case "draft":
        return "text-amber-400 hover:cursor-pointer hover:bg-amber-400/10";
      case "scheduled":
        return "text-purple-400 hover:cursor-pointer hover:bg-purple-400/10";
      default:
        return "text-emerald-400 hover:cursor-pointer hover:bg-emerald-400/10";
    }
  };

  const getBadgeText = () => {
    switch (badgeVariant) {
      case "published":
        return totalCount ? `${formatNumber(totalCount)} posts` : "No posts";
      case "draft":
        return totalCount ? `${formatNumber(totalCount)} posts` : "No posts";
      case "scheduled":
        return totalCount ? `${formatNumber(totalCount)} posts` : "No posts";
      default:
        return totalCount ? `${formatNumber(totalCount)} posts` : "No posts";
    }
  };

  return (
    <Card className="bg-background/70 border border-accent shadow-sm hover:shadow-md transition w-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-base font-semibold text-foreground truncate">
            {title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={getBadgeClass()}
          >
            {getBadgeText()}
          </Badge>
          <Link href={viewAllHref}>
            <Button
              size="sm"
              variant="ghost"
              className={getButtonClass()}
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-5 space-y-2 max-w-full">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={`${badgeVariant}-${post.id}-${post.slug}`}
              className="flex items-center justify-between px-2 rounded-md transition w-full min-w-0"
            >
              <p className="text-sm text-foreground truncate flex-1 min-w-0">
                {post.title}
              </p>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                {badgeVariant === "scheduled" && post.publishTime ? (
                  <CountdownTimer 
                    publishTime={post.publishTime} 
                    onPostPublished={() => onPostStatusChange?.(post)} // Pass the callback
                  />
                ) : (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {post.date}
                  </span>
                )}
                <Link
                  href={
                    isPublished
                      ? `https://axomshiksha.com/${post.slug}`
                      : `/dashboard/edit-post?slug=${post.slug}`
                  }
                  {...(isPublished ? { target: "_blank" } : {})}
                  className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition"
                >
                  {isPublished ? (
                    <ExternalLink size={14} />
                  ) : (
                    <Edit3 size={14} />
                  )}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground px-2 flex justify-center">
            {badgeVariant === "published"
              ? "No published posts yet"
              : badgeVariant === "draft"
                ? "No draft posts yet"
                : "No scheduled posts yet"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}