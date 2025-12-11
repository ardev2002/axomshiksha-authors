"use client";
import { motion } from "motion/react";
import { AuthorPostStats } from "@/utils/helpers/getAuthorPostStats";
import { RecentPost } from "@/utils/helpers/getRecentPosts";
import { useCallback, useEffect, useState } from "react";
import { RecentPostsCard } from "./RecentPostsCard";
import { Clock, FileClock, Sparkles } from "lucide-react";
// Create a client component for the dynamic content
interface DashboardContentProps {
  stats: AuthorPostStats | null;
  publishedPosts: RecentPost[];
  draftPosts: RecentPost[];
  scheduledPosts: RecentPost[];
}

export default function DashboardContent({ stats, publishedPosts, draftPosts, scheduledPosts }: DashboardContentProps) {
  const [recentPublished, setRecentPublished] = useState<RecentPost[]>(publishedPosts);
  const [recentDrafts, setRecentDrafts] = useState<RecentPost[]>(draftPosts);
  const [recentScheduled, setRecentScheduled] = useState<RecentPost[]>(scheduledPosts);
  const [statsData, setStatsData] = useState<AuthorPostStats | null>(stats);

  // Handler for when a scheduled post is published
  const onPostPublished = useCallback(({ id, title, date, slug }: RecentPost) => {
    setRecentPublished((prev) => [{ id, title, date, slug }, ...prev]);
    setRecentScheduled((prev) => prev.filter((post) => post.id !== id));
  }, []);

  useEffect(() => {
    setStatsData(stats);
    setRecentPublished(publishedPosts);
    setRecentDrafts(draftPosts);
    setRecentScheduled(scheduledPosts);
  }, [stats, publishedPosts, draftPosts, scheduledPosts]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 overflow-hidden"
    >
      <RecentPostsCard
        title="Published Posts"
        icon={<Sparkles className="w-4 h-4 text-emerald-400" />}
        badgeVariant="published"
        totalCount={statsData?.totalPublishedPosts}
        posts={recentPublished}
        viewAllHref="/dashboard/posts/published"
        isPublished={true}
      />

      <RecentPostsCard
        title="Drafted Posts"
        icon={<FileClock className="w-4 h-4 text-amber-400" />}
        badgeVariant="draft"
        totalCount={statsData?.totalDraftPosts}
        posts={recentDrafts}
        viewAllHref="/dashboard/posts/draft"
      />

      <RecentPostsCard
        title="Scheduled Posts"
        icon={<Clock className="w-4 h-4 text-purple-400" />}
        badgeVariant="scheduled"
        totalCount={statsData?.totalScheduledPosts}
        posts={recentScheduled}
        viewAllHref="/dashboard/posts/scheduled"
        onPostStatusChange={({ id, title, date, slug }) => onPostPublished({ id, title, date, slug })}
      />
    </motion.div>
  );
}