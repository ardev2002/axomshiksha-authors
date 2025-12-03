import { getSinglePost } from "@/utils/post/get/action";
import EditPostClient from "@/app/dashboard/posts/edit/EditPostClient";
import { Author } from "@/utils/types";
import { getSession } from "@/utils/helpers/getSession";
import type { Section } from "@/app/dashboard/posts/components/sectionTypes";
import { Tables } from "@/utils/supabase/types";
import { convertMDXToSections } from "@/utils/helpers/mdx-convert";

export default async function EditPostPage({
  searchParams,
}: PageProps<"/dashboard/posts/edit">) {
  const subject = (await searchParams).subject as Tables<"posts">["subject"];
  const classValue = (await searchParams).class as Tables<"posts">["class"];
  const chapterNo = (await searchParams)
    .chapter_no as unknown as Tables<"posts">["chapter_no"];
  const topic = (await searchParams).topic as string;

  if (!topic) {
    return (
      <div className="text-center text-muted-foreground">Post not found</div>
    );
  }

  const { post, content, errMsg } = await getSinglePost({
    filters: { subject, class: classValue, chapter_no: chapterNo, topic },
  });

  if (errMsg || !post) {
    return (
      <div className="text-red-500">Error: {errMsg || "Post not found"}</div>
    );
  }

  const session = await getSession();
  const authorId = session?.user?.email?.split("@")[0] as Author;

  const sections: Section[] = convertMDXToSections(content || "");

  return <EditPostClient post={post} sections={sections} authorId={authorId} />;
}
