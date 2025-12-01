import "server-only";
import { createClient } from "@/utils/supabase/server";
import { getSession } from "./getSession";

interface EndUserPostStats {
    totalViews: number;
    totalLikes: number;
}

export async function getEndUserPostStats(): Promise<EndUserPostStats | null> {
    const sp = await createClient();
    const session = await getSession();
    
    if (!session?.user) return null;
    
    const userId = session.user.id;
    
    if (!userId) return null;

    const { data: likedPosts, error: likedPostsError } = await sp
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId);

    if (likedPostsError) {
        console.error("Error fetching liked posts:", likedPostsError);
        return null;
    }

    const totalViews = 0;
    
    const totalLikes = likedPosts.length;
    

    return {
        totalViews,
        totalLikes,
    };
}