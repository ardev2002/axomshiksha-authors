// app/dashboard/posts/page.tsx
import { getPaginatedPosts } from "@/utils/post/get/action";
import AuthorPostsPage from "./_components/AuthorPostPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sortby?: string }>;
}) {
  const { sortby } = await searchParams;

  const sortDirection =
    (sortby as "latest" | "oldest" | undefined) ?? "latest";

  const { posts, nextKey } = await getPaginatedPosts({
    status: "all",
    sortDirection,
    limit: 5,
  });

  return (
    <AuthorPostsPage
      initialPosts={posts}
      initialNextKey={nextKey}
      sortDirection={sortDirection}
    />
  );
}
