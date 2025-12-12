import { getPaginatedPosts } from "@/utils/post/get/action";
import { DBPost } from "@/utils/types";
import AuthorPostsPage from "../_components/AuthorPostPage";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default async function Page({ params, searchParams }: { params: Promise<{ status: DBPost['status'] }>, searchParams: Promise<{ sortby: string }> }) {
    const sortByPromise = searchParams.then(params => params.sortby as "latest" | "oldest" | undefined);
    return (
        <Suspense fallback={<PageSkeleton />}>
            <StatusPageChild params={params} sortByPromise={sortByPromise} />
        </Suspense>
    )
}

async function StatusPageChild({ params, sortByPromise }: { params: Promise<{ status: DBPost['status'] }>, sortByPromise: Promise<"latest" | "oldest" | undefined> }) {
    const { status } = await params
    const sortDirection = (await sortByPromise) || "latest"
    const { posts, nextKey } = await getPaginatedPosts({ status: status as DBPost["status"], sortDirection });
    
    return (
        <>
            <AuthorPostsPage
                initialPosts={posts}
                initialNextKey={nextKey}
                sortDirection={sortDirection}
            />
        </>
    )
}

function PageSkeleton() {
    return (
        <div className="flex h-32 items-center justify-center">
            <Spinner />
        </div>
    )
}