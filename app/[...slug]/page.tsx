import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import matter from "gray-matter";
import { useMDXComponents } from "@/mdx-components";
import rehypePrettyCode from "rehype-pretty-code";
import PostMetaDate from "@/components/custom/PostMetaDate";
import Image from "next/image";
import { getSignedUrlForDownload } from "@/utils/s3/action";
import { db } from "@/lib/dynamoClient";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export default async function PostPage({ params }: PageProps<"/[...slug]">) {
  const slugSegments = [...(await params).slug];

  const fullSlugPath = slugSegments.join("/");

  const {Item: post} = await db.send(new GetCommand({ 
    TableName: process.env.AWS_POST_TABLE!,
    Key: { slug: fullSlugPath } 
  }));

  if (!post) return notFound();
  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
    Key: post.contentKey,
  });

  const { Body } = await s3Client.send(command);
  const content = await Body?.transformToString();

  const { data, content: mdxContent } = matter(content as string);

  const { signedUrl } = await getSignedUrlForDownload(post.thumbnailKey);

  return (
    <article className="mx-auto space-y-4">
      <header className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {data.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <PostMetaDate date={post.created_at} />
          {post.readingTime && <span>{data.readingTime} min read</span>}
          {data.classLevel && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              Class {data.classLevel}
            </span>
          )}
        </div>

        <div className="relative aspect-21/9 w-full rounded-lg overflow-hidden">
          <Image
            src={signedUrl}
            alt={data.title}
            fill
            className="object-cover"
          />
        </div>

        {data.description && (
          <div className="border-l-4 border-primary/50 pl-4 py-2 rounded-l-lg">
            <p className="text-muted-foreground italic">{data.description}</p>
          </div>
        )}
      </header>
      <div className="prose prose-gray dark:prose-invert max-w-none relative">
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
      </div>
    </article>
  );
}
