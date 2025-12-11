import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, HomeIcon, LayoutIcon } from "lucide-react";
import BreadCrumb from "@/components/custom/BreadCrumb";

import { Filter } from "lucide-react";
import FilterSheet from "./_components/FilterSheet";
import SearchPost from "./_components/SearchPost";
import { Spinner } from "@/components/ui/spinner";

export default async function DashboardPostPage({
  children
}: {
  children: React.ReactNode
}) {
  const basePaths = [
    { icon: <HomeIcon size={16} />, path: "/", title: "Home" },
    { icon: <LayoutIcon size={16} />, path: "/dashboard", title: "Dashboard" },
    {
      icon: <BookOpen size={16} />,
      path: "/dashboard/posts",
      title: "Posts",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <BreadCrumb paths={basePaths} />
        <React.Fragment>
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
              <Suspense
                fallback={
                  <Button className="bg-violet-600 text-white border border-violet-500/30 hover:cursor-pointer hover:bg-violet-700 flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg">
                    <Filter size={16} /> Filter
                  </Button>
                }
              >
                <FilterSheet/>
              </Suspense>
            </div>
          </div>

          <div>
            <SearchPost/>
          </div>
        </React.Fragment>
      </div>
      <Suspense fallback={<PostsSkeleton />}>
        {children}
      </Suspense>
    </>
  );
}

function PostsSkeleton(){
  return (
    <div className="h-32 w-full flex items-center justify-center">
      <Spinner />
    </div>
  )
}