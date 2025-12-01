"use server";

import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { getSession } from "./getSession";
import { getFreshUser } from "./getFreshUser";

export async function hasUserLiked(postId: number) {
  const supabase = await createClient();
  const session = await getSession();
  if (!session?.user) return false;

  const { data } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", session.user.id)
    .maybeSingle();

  return Boolean(data);
}

export async function updateLikes(postId: number, prevLikes: number) {
  const supabase = await createClient();

  try {
    const user = await getFreshUser();
    if (!user) {
      return { status: "unauthenticated", message: "Login required" };
    }

    // Check already liked
    const { data: exists } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (exists)
      return { status: "alreadyLiked", message: "You already liked this" };

    // Insert like
    const { error: likeInsertErr } = await supabase
      .from("post_likes")
      .insert([{ post_id: postId, user_id: user.id }]);

    if (likeInsertErr) throw likeInsertErr;

    // Update count in posts table
    const { error: updateErr } = await supabase
      .from("posts")
      .update({ likes: prevLikes + 1 })
      .eq("id", postId);

    if (updateErr) throw updateErr;

    return {
      status: "newlyLiked",
      message: "Thanks for liking!",
    };
  } catch (err) {
    if (err instanceof PostgrestError) {
      return { status: "error", message: err.message };
    }
    return { status: "error", message: "Something went wrong" };
  }
}
