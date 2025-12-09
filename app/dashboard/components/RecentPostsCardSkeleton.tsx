import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentPostsCardSkeletonProps {
  title: string;
}

export function RecentPostsCardSkeleton({ title }: RecentPostsCardSkeletonProps) {
  return (
    <Card className="bg-background/70 border border-white/10 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <CardTitle className="text-base font-semibold">
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}