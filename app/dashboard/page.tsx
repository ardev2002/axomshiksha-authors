import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";
import BreadCrumb from "@/components/custom/BreadCrumb";
import { Button } from "@/components/ui/button";
import {
  FileText,
  PenLine,
  BookOpen,
  Eye,
  Home,
  BarChart3,
  Layout,
  Clock,
  Plus,
  Sparkles,
  FileClock,
} from "lucide-react";
import Link from "next/link";
import { getAuthorPostStats } from "@/utils/helpers/getAuthorPostStats";
import { formatNumber } from "@/utils/formatNumber";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentPostsCardSkeleton } from "./_components/RecentPostsCardSkeleton";
import { getRecentDraftPosts, getRecentPublishedPosts, getRecentScheduledPosts } from "@/utils/helpers/getRecentPosts";
import { cacheTag } from "next/cache";
import { RecentPostsCard } from "./_components/RecentPostCard";
import RefreshButton from "@/components/custom/RefreshButton";

export default function AuthorDashboardPage() {
  return (
    <>
      <BreadCrumbAndHeader />
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<AllRecentPostCardsSkeleton />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}

async function DashboardContent() {
  "use cache: private"
  cacheTag("author-dashboard")
  const statsResponse = await getAuthorPostStats();
  const publishedResponse = await getRecentPublishedPosts();
  const draftResponse = await getRecentDraftPosts();
  const scheduledResponse = await getRecentScheduledPosts();

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
        totalCount={statsResponse?.totalPublishedPosts}
        posts={publishedResponse}
        viewAllHref="/dashboard/posts/published"
        isPublished={true}
      />

      <RecentPostsCard
        title="Drafted Posts"
        icon={<FileClock className="w-4 h-4 text-amber-400" />}
        badgeVariant="draft"
        totalCount={statsResponse?.totalDraftPosts}
        posts={draftResponse}
        viewAllHref="/dashboard/posts/draft"
      />

      <RecentPostsCard
        title="Scheduled Posts"
        icon={<Clock className="w-4 h-4 text-purple-400" />}
        badgeVariant="scheduled"
        totalCount={statsResponse?.totalScheduledPosts}
        posts={scheduledResponse}
        viewAllHref="/dashboard/posts/scheduled"
      />
    </motion.div>
  )
}

export function BreadCrumbAndHeader() {
  return (
    <>
      <BreadCrumb
        paths={[
          { icon: <Home size={16} />, path: "/", title: "Home" },
          {
            icon: <Layout size={16} />,
            path: "/dashboard",
            title: "Dashboard",
          },
        ]}
      />

      <div className="flex flex-wrap sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500 border border-violet-500/30 shadow-sm">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h1 className="md:text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <RefreshButton />
          <Link href="/dashboard/add-new-post">
            <Button variant="outline" className="flex items-center gap-2 hover:cursor-pointer">
              <Plus size={16} />
              New Post
            </Button>
          </Link>
          <Link href="/dashboard/posts">
            <Button className="flex items-center gap-2 hover:cursor-pointer border-white/20 text-white bg-violet-600 hover:bg-violet-700 transition">
              <FileText size={16} />
              Manage
            </Button>
          </Link>
        </div>
      </div>
    </>

  );
}

async function Stats() {
  "use cache: private"
  cacheTag("author-dashboard")

  const statsData = await getAuthorPostStats();
  const stats = [
    {
      label: "Total Posts",
      value: statsData ? formatNumber(statsData.totalPosts) : "0",
      icon: <FileText className="w-5 h-5 text-sky-400" />,
    },
    {
      label: "Published",
      value: statsData ? formatNumber(statsData.totalPublishedPosts) : "0",
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
    },
    {
      label: "Drafts",
      value: statsData ? formatNumber(statsData.totalDraftPosts) : "0",
      icon: <PenLine className="w-5 h-5 text-amber-400" />,
    },
    {
      label: "Scheduled",
      value: statsData ? formatNumber(statsData.totalScheduledPosts) : "0",
      icon: <Clock className="w-5 h-5 text-purple-400" />,
    },
    {
      label: "Total Views",
      value: statsData ? formatNumber(statsData.totalViews) : "0",
      icon: <Eye className="w-5 h-5 text-indigo-400" />,
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
    >
      {stats.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="bg-background/70 border border-accent shadow-sm hover:shadow-md transition hover:bg-background/80">
            <CardContent className="flex items-center justify-between px-5">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
              <div className="p-2.5 rounded-md bg-white/5 border border-white/10">
                {item.icon}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
      {[...Array(5)].map((_, i) => (
        <Card
          key={i}
          className="bg-background/70 border border-white/10 shadow-sm"
        >
          <CardContent className="flex items-center justify-between px-5">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-12" />
            </div>
            <Skeleton className="p-2.5 rounded-md w-10 h-10" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AllRecentPostCardsSkeleton() {
  const titles = ["Recently Published", "Drafted Posts", "Scheduled Posts"];
  return (
    <motion.div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 overflow-hidden">
      {titles.map((title, idx) => <RecentPostsCardSkeleton key={idx} title={title} />)}
    </motion.div>
  );
}