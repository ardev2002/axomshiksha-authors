"use client";

import { MotionCard } from "@/components/custom/Motion";
import PostMetaDate from "@/components/custom/PostMetaDate";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { inter } from "@/utils/fonts";
import { getPaginatedPosts } from "@/utils/post/get/action";
import { DBPost } from "@/utils/types";
import { ChevronLeft, ChevronRight, Edit, ExternalLink, Eye } from "lucide-react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import DeletePost from "./DeletePost";

export default function PostsView({
  initialPosts,
  initialNextKey,
  sortDirection,
}: {
  initialPosts: any[];
  initialNextKey: any | null;
  sortDirection: "latest" | "oldest";
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [nextKey, setNextKey] = useState(initialNextKey);
  const [status, setStatus] = useState<DBPost['status'] | "all">("all");

  const [prevStack, setPrevStack] = useState<any[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setPosts(initialPosts);
    setNextKey(initialNextKey);
  }, [initialPosts, initialNextKey]);
  const goNext = () => {
    if (!nextKey) return;

    startTransition(async () => {
      const { posts: newPosts, nextKey: newNextKey } =
        await getPaginatedPosts({
          lastKey: nextKey,
          sortDirection,
          status: status,
        });

      setPrevStack((prev) => [...prev, nextKey]);
      setPosts(newPosts);
      setNextKey(newNextKey ?? null);
    });
  };

  // PREVIOUS PAGE
  const goPrev = () => {
    if (prevStack.length === 0) return;
    const previousKey = prevStack[prevStack.length - 2];
    startTransition(async () => {
      const { posts: newPosts, nextKey: newNextKey } =
        await getPaginatedPosts({
          lastKey: previousKey,
          sortDirection,
          status: status,
        });

      setPrevStack((prev) => prev.slice(0, -1));
      setPosts(newPosts);
      setNextKey(newNextKey ?? null);
    });
  };


  if (!posts.length)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">No posts found.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <LayoutGroup>
        <div className="grid gap-4">
          <AnimatePresence>
            {posts.map((post: Record<string, any>, index: number) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      <div className="flex justify-center items-center gap-4 pt-6 border-t border-accent">
        <Button
          variant="ghost"
          size="sm"
          disabled={prevStack.length === 0 || pending}
          onClick={goPrev}
          className="text-violet-500 hover:cursor-pointer hover:bg-violet-500/10 flex items-center gap-1"
        >
          <ChevronLeft size={16} /> Prev
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled={!nextKey || pending}
          onClick={goNext}
          className="text-violet-500 hover:cursor-pointer hover:bg-violet-500/10 flex items-center gap-1"
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// ... PostCard remains unchanged
function PostCard({
  post,
  index,
}: {
  post: Record<string, any>;
  index: number;
}) {

  const getStatusBadgeClass = (status: string | null) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-500 border border-green-500/30";
      case "draft":
        return "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30";
      case "scheduled":
        return "bg-purple-500/20 text-purple-500 border border-purple-500/30";
      default:
        return "bg-blue-500/20 text-blue-500 border border-blue-500/30";
    }
  };

  return (
    <AnimatePresence>
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          delay: index * 0.05,
          ease: "easeOut"
        }}
        className="border border-accent bg-background/70 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden rounded-xl"
      >
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
                    post.status
                  )}`}
                >
                  {post.status?.charAt(0).toUpperCase() + post.status!.slice(1)}
                </span>

                {post.classLevel && (
                  <span className="text-xs capitalize border border-white/10 px-2 py-1 rounded-full">
                    {post.classLevel}
                  </span>
                )}

                {post.subject && (
                  <span className="text-xs capitalize border border-white/10 px-2 py-1 rounded-full">
                    {post.subject}
                  </span>
                )}
              </div>

              <h3 className={`font-semibold text-lg text-foreground truncate ${inter.className}`}>
                {post.title}
              </h3>

              <p className={`text-sm text-muted-foreground line-clamp-2 mt-2 mb-3 truncate ${inter.className}`}>
                {post.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                </span>
                <PostMetaDate date={post.entryTime} />
              </div>
            </div>

            {/* Right Side Buttons */}
            <div className="flex items-center gap-2">
              {post.status == "published" && (
                <Link
                  href={`https://axomshiksha.com/${post.slug}`}
                  target="_blank"
                  className="text-emerald-400 hover:bg-emerald-400/10 rounded-md p-2 transition-colors duration-200"
                  title="View Post"
                >
                  <ExternalLink size={18} />
                </Link>
              )}

              <Link
                href={`/dashboard/edit-post?slug=${post.slug}`}
                className="text-sky-400 hover:bg-sky-400/10 rounded-md p-2 transition-colors duration-200"
                title="Edit Post"
              >
                <Edit size={18} />
              </Link>

              <DeletePost post={post} />
            </div>
          </div>
        </CardContent>
      </MotionCard>
    </AnimatePresence>
  );
}