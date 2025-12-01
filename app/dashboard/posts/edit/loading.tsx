import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/custom/BreadCrumb";
import { Home, UserPen, BookOpen, Edit, FileText, Pencil, FilePenLine, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditPostLoading() {
  return (
    <>
      {/* Breadcrumb */}
      <BreadCrumb
        paths={[
          { icon: <Home size={16} />, path: "/", title: "Home" },
          { icon: <UserPen size={16} />, path: "/author", title: "Author" },
          {
            icon: <BookOpen size={16} />,
            path: "/author/posts",
            title: "Posts",
          },
          { icon: <Edit size={16} />, path: "#", title: "Edit Post" },
        ]}
      />

      {/* Form */}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500 border border-violet-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="md:text-2xl font-semibold tracking-tight text-foreground">
              Edit Post
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 hover:cursor-pointer text-white flex items-center gap-2"
            >
              <FilePenLine size={16}/>
            </Button>
          </div>
        </div>

        {/* Post Details Card */}
        <Card className="bg-background/70 border border-white/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* URL Input */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Skeleton className="h-9 flex-1 rounded-l-md rounded-r-none" />
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <Skeleton className="h-[115px] w-full rounded-md" />
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>

            {/* Educational Metadata Fields - Class and Subject Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-white/10" />

        {/* Content Editor */}
        <Card className="bg-background/70 border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-base">
              <Layers3 className="w-4 h-4 text-violet-400" />
              Post Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}