import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { getPaginatedPosts } from "@/utils/post/get/action";
import Link from "next/link";
import { Database, Tables } from "@/utils/supabase/types";
import ValidationErrorCard from "@/components/custom/ValidationErrorCard";
import PostMetaDate from "@/components/custom/PostMetaDate";
import { getSession } from "@/utils/helpers/getSession";
import { generatePostUrl } from "@/utils/helpers/generatePostUrl";
import DeletePost from "./DeletePost";

interface AuthorPostsPageProps {
  pagePromise: Promise<string | string[] | undefined>;
  statusPromise: Promise<string | string[] | undefined>;
  classPromise: Promise<string | string[] | undefined>;
  subjectPromise: Promise<string | string[] | undefined>;
  sortbyPromise: Promise<string | string[] | undefined>;
}

export default async function AuthorPostsPage({
  pagePromise,
  statusPromise,
  classPromise,
  subjectPromise,
  sortbyPromise,
}: AuthorPostsPageProps) {
  // Use the params directly instead of resolving promises
  const isPageValid =
    /^(?:|undefined|[1-9]\d*)$/.test((await pagePromise) as string) === true;

  const page = await pagePromise.then(Number);
  const validPage = !isNaN(page) && page > 0 ? Math.floor(page) : 1;

  const status = (await statusPromise) as
    | Database["public"]["Enums"]["Status"]
    | undefined;
  const classParam = (await classPromise) as
    | Database["public"]["Enums"]["Class"]
    | undefined;
  const subjectParam = (await subjectPromise) as
    | Database["public"]["Enums"]["Subject"]
    | undefined;
  const sortby = (await sortbyPromise) as "latest" | "oldest" | undefined;

  const session = await getSession();
  if (!session?.user) return null;
  const authorId = session.user.email?.split("@")[0] as string;

  const { posts, totalPages } = await getPaginatedPosts({
    filters: {
      authorId: authorId,
      class: classParam,
      subject: subjectParam,
      status,
    },
    page: validPage,
    sortOrder: sortby == "latest" ? "descending" : "ascending",
  });

  if (!posts.length)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">No posts found.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {!isPageValid && (
        <ValidationErrorCard
          errors={[
            "Page number must be a positive integer.",
            "Result is shown for page no 1",
          ]}
        />
      )}

      <div className="grid gap-4">
        {posts.map((post: Tables<"posts">) => (
          <PostCard key={post.id} post={post} page={validPage} />
        ))}
      </div>
      {posts.length > 0 && (
        <div className="flex justify-center items-center gap-4 pt-6 border-t border-accent">
          <Button
            variant="ghost"
            size="sm"
            disabled={!validPage || validPage <= 1}
            className="text-violet-500 hover:bg-violet-500/10 flex items-center gap-1"
            asChild
          >
            <Link
              className="flex items-center gap-1"
              href={`/dashboard/posts${
                validPage > 1 ? `?page=${validPage - 1}` : ""
              }${classParam ? `&class=${classParam}` : ""}${
                subjectParam ? `&subject=${subjectParam}` : ""
              }${status ? `&status=${status}` : ""}${
                sortby ? `&sortby=${sortby}` : ""
              }`}
            >
              <ChevronLeft size={16} /> Prev
            </Link>
          </Button>

          <span className="text-sm text-muted-foreground">
            Page <strong className="text-foreground">{validPage}</strong> of{" "}
            {totalPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            disabled={validPage >= totalPages!}
            className="text-violet-500 hover:bg-violet-500/10 flex items-center gap-1"
            asChild
          >
            <Link
              className="flex items-center gap-1"
              href={`/dashboard/posts${
                validPage ? `?page=${validPage + 1}` : ""
              }${classParam ? `&class=${classParam}` : ""}${
                subjectParam ? `&subject=${subjectParam}` : ""
              }${status ? `&status=${status}` : ""}${
                sortby ? `&sortby=${sortby}` : ""
              }`}
            >
              Next <ChevronRight size={16} />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

/* ------------------- PostCard Component ------------------- */
async function PostCard({
  post,
  page,
}: {
  post: Tables<"posts">;
  page: number;
}) {
  const { generatedUrl } = generatePostUrl(
    post.subject,
    post.class,
    post.chapter_no,
    post.topic
  );

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
    <Card className="border border-accent bg-background/70 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:bg-background/80">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
          {/* Left Side */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
                  post.status
                )}`}
              >
                {post.status?.charAt(0).toUpperCase() + post.status!.slice(1)}
              </span>
              <span className="text-xs capitalize border border-white/10 px-2 py-1 rounded-full">
                Class {post.class}
              </span>
              <span className="text-xs capitalize border border-white/10 px-2 py-1 rounded-full">
                {post.subject}
              </span>
            </div>

            <h3 className="font-semibold text-lg text-foreground">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-3">
              {post.desc}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye size={14} /> {post.views}
              </span>
              <PostMetaDate date={post.created_at} />
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-2">
            {/* View Button */}
            <Link
              href={`https://axomshiksha.com/${generatedUrl}`}
              target="_blank"
              className="text-emerald-400 hover:bg-emerald-400/10 rounded-md p-2 transition-colors duration-200"
              title="View Post"
            >
              <Eye size={18} />
            </Link>

            {/* Edit Button */}
            <Link
              href={`/dashboard/posts/edit?${
                post.subject ? `subject=${post.subject}` : ""
              }${post.class ? `&class=${post.class}` : ""}${
                post.chapter_no ? `&chapter_no=${post.chapter_no}` : ""
              }${post.topic ? `&topic=${post.topic}` : ""}`}
              className="text-sky-400 hover:bg-sky-400/10 rounded-md p-2 transition-colors duration-200"
              title="Edit Post"
            >
              <Edit size={18} />
            </Link>

            {/* Delete Button */}
            <DeletePost
              postTitle={post.title}
              subject={post.subject}
              classValue={post.class}
              chapter_no={post.chapter_no}
              topic={post.topic}
              page={page}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
