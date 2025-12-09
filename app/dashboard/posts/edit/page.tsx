import EditPostClient from "@/app/dashboard/posts/edit/EditPostClient";
import type { Section } from "@/app/dashboard/posts/components/sectionTypes";
import { convertMDXToSections } from "@/utils/helpers/mdx-convert";
import { getPost } from "@/utils/post/get/action";
import { extractPostUrlParams } from "@/utils/helpers/slugify";

export default async function EditPostPage({
  searchParams,
}: PageProps<"/dashboard/posts/edit">) {
  const postSlug = (await searchParams).slug as string;

  if (!postSlug) {
    return (
      <div className="text-center text-muted-foreground">Post not found</div>
    );
  }

  const { post, content } = await getPost(postSlug);

  if (!post) {
    return (
      <div className="text-center text-muted-foreground">Post not found</div>
    );
  }

  const sections: Section[] = convertMDXToSections(content || "");

  return <EditPostClient post={post} sections={sections} />;
}