import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import matter from "gray-matter";
import { useMDXComponents } from "@/mdx-components";
import rehypePrettyCode from "rehype-pretty-code";

export default async function PostPage({ params }: PageProps<"/[...slug]">) {
  const supabase = await createClient();

  const slugSegments = [...(await params).slug];

  const fullSlugPath = slugSegments.join("/");

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("url", fullSlugPath)
    .maybeSingle();

  if (error) {
    console.error("Fetch Error:", error);
    return notFound();
  }

  if (!post) return notFound();
  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
    Key: post.content_key || undefined,
  });

  const { Body } = await s3Client.send(command);
  const content = await Body?.transformToString();
  
  if (!content) {
    console.error("Failed to retrieve content from S3");
    return notFound();
  }
  
  const { data, content: mdxContent } = matter(content);
  
  return (
    <article className="mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-muted-foreground">{post.desc}</p>
      <MDXRemote
            source={mdxContent}
            components={useMDXComponents()}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [
                    rehypePrettyCode,
                    {
                      theme: "github-dark",
                    },
                  ],
                ],
              },
            }}
          />
    </article>
  );
}
