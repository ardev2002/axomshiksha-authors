import { Suspense } from "react";
import AuthorPostsPage from "./components/AuthorPostPage";
import BreadCrumb from "@/components/custom/BreadCrumb";
import { BookOpen, Home, Plus, Filter, Layout } from "lucide-react";
import FilterSheet from "./components/FilterSheet";
import AuthorPostCardSkeleton from "./components/AuthorPostCardSkeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SearchForm from "./components/SearchPost";
import { getPaginatedPosts } from "@/utils/post/get/action";
import { DBPost } from "@/utils/types";

export default async function Page({
  searchParams,
}: PageProps<"/dashboard/posts">) {
  const statusPromise = searchParams.then((sp) => sp.status);
  const sortbyPromise = searchParams.then((sp) => sp.sortby);
  
  const [status, sortby] = await Promise.all([statusPromise, sortbyPromise]) as [DBPost['status'] | undefined, "latest" | "oldest" | undefined];
  const initialPostsPromise = getPaginatedPosts({ status: status || "published", sortDirection: sortby });
  
  return (
    <div className="space-y-6">
      <BreadCrumb
        paths={[
          { icon: <Home size={16} />, path: "/", title: "Home" },
          { icon: <Layout size={16} />, path: "/dashboard", title: "Dashboard" },
          {
            icon: <BookOpen size={16} />,
            path: "/dashboard/posts",
            title: "Posts",
          },
        ]}
      />

      {/* Header */}
      <div className="flex sm:flex-row flex-wrap sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500 border border-violet-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="md:text-2xl font-semibold tracking-tight text-foreground">
            Your Posts
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" title="Create New Post">
            <Link href="/dashboard/posts/new" className="flex items-center gap-2">
              <Plus size={16} /> New Post
            </Link>
          </Button>
          <Suspense
            fallback={
              <Button className="bg-violet-600 text-white border border-violet-500/30 hover:cursor-pointer hover:bg-violet-700 flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg">
                <Filter size={16} /> Filter
              </Button>
            }
          >
            <FilterSheet
              statusPromise={statusPromise}
              sortbyPromise={sortbyPromise}
            />
          </Suspense>
        </div>
      </div>
      {/* Search Form */}
      <div>
        <SearchForm />
      </div>

      <Suspense fallback={<AuthorPostCardSkeleton />}>
        <AuthorPostsPage
          statusPromise={statusPromise}
          sortbyPromise={sortbyPromise}
          initialPostsPromise={initialPostsPromise}
        />
      </Suspense>
    </div>
  );
}