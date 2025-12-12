import { getPaginatedPosts } from "@/utils/post/get/action";
import AuthorPostsPage from "./_components/AuthorPostPage";

export default async function AuthorPostPage({searchParams}: { searchParams: Promise<{ sortby: string }> }) {
  const sortDirection = await searchParams.then(params => params.sortby) as "latest" | "oldest" | undefined;
  const { posts, nextKey } = await getPaginatedPosts({ status: "all", sortDirection: sortDirection || "latest" });
  console.log(posts, nextKey);
  return (
    <>
      <AuthorPostsPage
        initialPosts={posts}
        nextKey={nextKey}
        status={"all"}
        sortDirection={sortDirection}
      />
    </>
  )
}