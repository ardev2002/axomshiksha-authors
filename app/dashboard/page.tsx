import * as motion from "motion/react-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import BreadCrumb from "@/components/custom/BreadCrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  PenLine,
  BookOpen,
  Eye,
  Heart,
  Sparkles,
  FileClock,
  ExternalLink,
  Edit3,
  Home,
  BarChart3,
  Layout,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { getAuthorPostStats } from "@/utils/helpers/getAuthorPostStats";
import { formatNumber } from "@/utils/formatNumber";
import {
  getRecentPublishedPosts,
  getRecentDraftPosts,
  getRecentScheduledPosts,
} from "@/utils/helpers/getRecentPosts";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentPostsCard } from "./components/RecentPostsCard";
import { RecentPostsCardSkeleton } from "./components/RecentPostsCardSkeleton";

export default async function AuthorDashboardPage() {
  return (
    <>
      <BreadCrumbAndHeader />
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 overflow-hidden"
      >
        <Suspense fallback={<RecentlyPublishedPostsSkeleton />}>
          <RecentlyPublishedPosts />
        </Suspense>

        <Suspense fallback={<DraftedPostsSkeleton />}>
          <DraftedPosts />
        </Suspense>
        
        <Suspense fallback={<RecentlyScheduledPostsSkeleton />}>
          <RecentlyScheduledPosts />
        </Suspense>
      </motion.div>
    </>
  );
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
      {/* Header */}
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

async function RecentlyPublishedPosts() {
  const statsData = await getAuthorPostStats();
  const recentPublished = await getRecentPublishedPosts(3);
  return (
    <RecentPostsCard
      title="Recently Published"
      icon={<Sparkles className="w-4 h-4 text-emerald-400" />}
      badgeVariant="published"
      totalCount={statsData?.totalPublishedPosts}
      posts={recentPublished}
      viewAllHref="/dashboard/posts?status=published"
      isPublished={true}
    />
  );
}

async function DraftedPosts() {
  const statsData = await getAuthorPostStats();
  const draftedPosts = await getRecentDraftPosts(3);
  return (
    <RecentPostsCard
      title="Drafted Posts"
      icon={<FileClock className="w-4 h-4 text-amber-400" />}
      badgeVariant="draft"
      totalCount={statsData?.totalDraftPosts}
      posts={draftedPosts}
      viewAllHref="/dashboard/posts?status=draft"
    />
  );
}

async function RecentlyScheduledPosts() {
  const statsData = await getAuthorPostStats();
  const scheduledPosts = await getRecentScheduledPosts(3);
  return (
    <RecentPostsCard
      title="Scheduled Posts"
      icon={<Clock className="w-4 h-4 text-purple-400" />}
      badgeVariant="scheduled"
      totalCount={statsData?.totalScheduledPosts}
      posts={scheduledPosts}
      viewAllHref="/dashboard/posts?status=scheduled"
    />
  );
}

function StatsSkeleton() {
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

function RecentlyPublishedPostsSkeleton() {
  return <RecentPostsCardSkeleton title="Recently Published" />;
}

function DraftedPostsSkeleton() {
  return <RecentPostsCardSkeleton title="Drafted Posts" />;
}

function RecentlyScheduledPostsSkeleton() {
  return <RecentPostsCardSkeleton title="Scheduled Posts" />;
}
