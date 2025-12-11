import EditPostClient from "@/app/dashboard/edit-post/EditPostClient";
import type { Section } from "@/app/dashboard/posts/_components/sectionTypes";
import { convertMDXToSections } from "@/utils/helpers/mdx-convert";
import { getPost } from "@/utils/post/get/action";
import BreadCrumb from "@/components/custom/BreadCrumb";
import { HomeIcon, LayoutIcon, BookOpen } from "lucide-react";

export default async function EditPostPage({
  searchParams,
}: PageProps<"/dashboard/edit-post">) {
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
      {/* Add direct breadcrumb implementation */}
      <BreadCrumb 
        paths={[
          { icon: <HomeIcon size={16} />, path: "/", title: "Home" },
          { icon: <LayoutIcon size={16} />, path: "/dashboard", title: "Dashboard" },
          { icon: null, path: "", title: "Edit Post" }
        ]} 
      />
      <EditPostClient post={post} sections={sections} />
    </>
  );
}