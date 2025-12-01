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
} from "lucide-react";
import Link from "next/link";
import { getAuthorPostStats } from "@/utils/helpers/getAuthorPostStats";
import { formatNumber } from "@/utils/formatNumber";
import {
  getRecentPublishedPosts,
  getRecentDraftPosts,
} from "@/utils/helpers/getRecentPosts";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
        className="grid sm:grid-cols-2 gap-5 overflow-hidden"
      >
        <Suspense fallback={<RecentlyPublishedPostsSkeleton />}>
          <RecentlyPublishedPosts />
        </Suspense>

        <Suspense fallback={<DraftedPostsSkeleton />}>
          <DraftedPosts />
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
          { icon: <Layout size={16} />, path: "/dashboard", title: "Dashboard" },
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
      label: "Total Likes",
      value: statsData ? formatNumber(statsData.totalLikes) : "0",
      icon: <Heart className="w-5 h-5 text-rose-400" />,
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
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
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
    <Card className="bg-background/70 border border-accent shadow-sm hover:shadow-md transition w-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <CardTitle className="text-base font-semibold text-foreground">
            Recently Published
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
          >
            {statsData ? formatNumber(statsData.totalPublishedPosts) : "0"}{" "}
            posts
          </Badge>
          <Link href="/dashboard/posts?status=published">
            <Button
              size="sm"
              variant="ghost"
              className="text-emerald-400 hover:cursor-pointer hover:bg-emerald-400/10"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-2 max-w-full">
        {recentPublished.length > 0 ? (
          recentPublished.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-md transition w-full min-w-0"
            >
              <p className="text-sm text-foreground truncate flex-1 min-w-0">
                {post.title}
              </p>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {post.date}
                </span>
                <Link
                  href={`/post/${post.url}`}
                  target="_blank"
                  className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition"
                >
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No published posts yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}

async function DraftedPosts() {
  const statsData = await getAuthorPostStats();
  const draftedPosts = await getRecentDraftPosts(3);
  return (
    <Card className="bg-background/70 border border-accent shadow-sm hover:shadow-md transition w-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <FileClock className="w-4 h-4 text-amber-400" />
          <CardTitle className="text-base font-semibold text-foreground">
            Drafted Posts
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-amber-400 border-amber-400/30 bg-amber-400/10"
          >
            {statsData ? formatNumber(statsData.totalDraftPosts) : "0"} drafts
          </Badge>
          <Link href="/dashboard/posts?status=draft">
            <Button
              size="sm"
              variant="ghost"
              className="text-amber-400 hover:cursor-pointer hover:bg-amber-400/10"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-2 max-w-full">
        {draftedPosts.length > 0 ? (
          draftedPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-md transition w-full min-w-0"
            >
              <p className="text-sm text-foreground truncate flex-1 min-w-0">
                {post.title}
              </p>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {post.date}
                </span>
                <Link
                  href={`/dashboard/posts/edit?slug=${post.url}`}
                  className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition"
                >
                  <Edit3 size={14} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No draft posts yet</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
  return (
    <Card className="bg-background/70 border border-white/10 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <CardTitle className="text-base font-semibold">
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DraftedPostsSkeleton() {
  return (
    <Card className="bg-background/70 border border-white/10 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <CardTitle className="text-base font-semibold">
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
