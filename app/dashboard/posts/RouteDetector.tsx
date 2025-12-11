"use client";

import { usePathname } from "next/navigation";
import { BookOpen, Plus, Filter } from "lucide-react";
import FilterSheet from "./_components/FilterSheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SearchForm from "./_components/SearchPost";
import { Suspense } from "react";

export default function RouteDetector({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if we're on new or edit post pages
  const isChildRoute = pathname.includes('/new') || pathname.includes('/edit');
  
  return (
    <>
      {/* Header - only show on main posts page, not on new/edit pages */}
      {!isChildRoute && (
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
              <FilterSheet />
            </Suspense>
          </div>
        </div>
      )}

      {/* Search Form - only show on main posts page, not on new/edit pages */}
      {!isChildRoute && (
        <div>
          <SearchForm />
        </div>
      )}

      {children}
    </>
  );
}