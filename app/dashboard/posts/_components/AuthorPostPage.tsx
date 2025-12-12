"use client";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ChevronLeft, ChevronRight, Edit, ExternalLink } from "lucide-react";
import { getPaginatedPosts } from "@/utils/post/get/action";
import Link from "next/link";
import PostMetaDate from "@/components/custom/PostMetaDate";
import DeletePost from "./DeletePost";
import { DBPost } from "@/utils/types";
import { useEffect, useState } from "react";
import { MotionCard } from "@/components/custom/Motion";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { inter } from "@/utils/fonts";

interface AuthorPostsPageProps {
  initialPosts: Record<string, any>[];
  nextKey: Record<string, any> | undefined,
  status: DBPost['status'] | "all"; 
  sortDirection: "latest" | "oldest" | undefined;
}

export default function AuthorPostsPage({
  initialPosts,
  status,
  nextKey,
  sortDirection,
}: AuthorPostsPageProps) {
  const [posts, setPosts] = useState<Record<string, any>[]>(initialPosts);
  const [nextPaginateKey, setNextPaginateKey] = useState<Record<string, any> | undefined>(nextKey || undefined);
  
  // 1. New State: Stores the 'ExclusiveStartKey' that fetched the current page.
  // For the initial page (Page 1), this key is always undefined.
  const [currentPageKey, setCurrentPageKey] = useState<Record<string, any> | undefined>(undefined);
  
  // 2. State for Navigation History
  const [prevPaginateKeys, setPrevPaginateKeys] = useState<(Record<string, any> | undefined)[]>([]);
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | undefined>(sortDirection);

  // 3. Reset state when initial props change (e.g., sortDirection changes)
  useEffect(() => {
    setPosts(initialPosts);
    setNextPaginateKey(nextKey);
    setPrevPaginateKeys([]);
    setSortBy(sortDirection);
    // Reset the current page's start key to undefined for the first page
    setCurrentPageKey(undefined); 
  }, [initialPosts, nextKey, sortDirection, status]);

  const prevPostsHandler = async () => {
    // We only need to check if there are keys to go back to
    if (prevPaginateKeys.length === 0) return;

    // The key to go back to the previous page (N-1) is the last one in the history array.
    const prevKey = prevPaginateKeys[prevPaginateKeys.length - 1]; 
    const remainingKeys = prevPaginateKeys.slice(0, -1);

    // Fetch posts for the previous page (N-1) using its start key (prevKey)
    const { posts: newPosts, nextKey: newNextKey } = await getPaginatedPosts({
      lastKey: prevKey,
      sortDirection: sortBy,
      limit: 5,
      status
    });

    setPosts(newPosts);
    
    // The key to fetch the NEXT page (N) is now the OLD `currentPageKey`.
    // We set the `nextPaginateKey` to the key that we just left (currentPageKey)
    setNextPaginateKey(currentPageKey);
    
    // The key that fetched the NEW posts (N-1) is now the current key.
    setCurrentPageKey(prevKey); 
    
    // Update navigation history
    setPrevPaginateKeys(remainingKeys);
  };

  const nextPostsHandler = async () => {
    // 1. Store the start key of the CURRENT page (N) into the history array
    setPrevPaginateKeys([...prevPaginateKeys, currentPageKey]); 
    
    // The key to fetch the next page (N+1) is in `nextPaginateKey`.
    const keyForNextPage = nextPaginateKey;
    
    // We must check for existence before using it in the fetch call, 
    // although the disabled prop on the button should prevent this.
    if (!keyForNextPage) return; 

    const { posts: newPosts, nextKey: newNextKey } = await getPaginatedPosts({
      lastKey: keyForNextPage,
      sortDirection: sortBy,
      limit: 5,
      status
    });

    console.log(newPosts);
    setPosts(newPosts);
    setNextPaginateKey(newNextKey);
    
    // 2. Update the key for the NEW current page (N+1)
    setCurrentPageKey(keyForNextPage); 
  };


  if (!posts.length)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">No posts found.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {posts.map((post: Record<string, any>) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 pt-6 border-t border-accent">
        <Button
          variant="ghost"
          size="sm"
          // Check if there are keys in history to go back to
          disabled={prevPaginateKeys.length === 0}
          onClick={prevPostsHandler}
          className="text-violet-500 hover:cursor-pointer hover:bg-violet-500/10 flex items-center gap-1"
        >
          <ChevronLeft size={16} /> Prev
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled={!nextPaginateKey}
          onClick={nextPostsHandler}
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
}: {
  post: Record<string, any>;
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
    <LayoutGroup id="post">
      <AnimatePresence mode="wait">
        <MotionCard layout className="border border-accent bg-background/70 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:bg-background/80">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
                      post.status
                    )}`}
                  >
                    {post.status?.charAt(0).toUpperCase() + post.status!.slice(1)}
                  </span>
                  {post.classLevel && <span className="text-xs capitalize border border-white/10 px-2 py-1 rounded-full">
                    {post.classLevel}
                  </span>}
                  {post.subject && <span className="text-xs capitalize border border-white/10 px-2 py-1 rounded-full">
                    {post.subject}
                  </span>}
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
                {post.status == "published" && <Link
                  href={`https://axomshiksha.com/${post.slug}`}
                  target="_blank"
                  className="text-emerald-400 hover:bg-emerald-400/10 rounded-md p-2 transition-colors duration-200"
                  title="View Post"
                >
                  <ExternalLink size={18} />
                </Link>}

                {/* Edit Button */}
                <Link
                  href={`/dashboard/edit-post?slug=${post.slug}`}
                  className="text-sky-400 hover:bg-sky-400/10 rounded-md p-2 transition-colors duration-200"
                  title="Edit Post"
                >
                  <Edit size={18} />
                </Link>

                <DeletePost
                  post={post}
                />
              </div>
            </div>
          </CardContent>
        </MotionCard>
      </AnimatePresence>
    </LayoutGroup>
  );
}