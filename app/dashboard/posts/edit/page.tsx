import EditPostClient from "@/app/dashboard/posts/edit/EditPostClient";
import type { Section } from "@/app/dashboard/posts/_components/sectionTypes";
import { convertMDXToSections } from "@/utils/helpers/mdx-convert";
import { getPost } from "@/utils/post/get/action";
import BreadcrumbSetter from "../[status]/BreadcrumbSetter";

export default async function EditPostPage({
  searchParams,
}: PageProps<"/dashboard/posts/edit">) {
  const postSlug = (await searchParams).slug as string;

  if (!postSlug) {
    return <span>Slug is required</span>
  };

  const { post, content } = await getPost(postSlug);

  if (!post) {
    return (
      <div className="text-center text-muted-foreground">Post not found</div>
    );
  }

  const sections: Section[] = convertMDXToSections(content || "");

  return (
    <>
      <BreadcrumbSetter status={"Edit Post"} />
      <EditPostClient post={post} sections={sections} />
    </>
  );
}