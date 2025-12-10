import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthorPostCardSkeleton() {
  return (
    <div className="space-y-4">
      {Array(2)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="border bg-background/70 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
                {/* Left Section */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-[26px] w-16 rounded-full" />
                    <Skeleton className="h-[26px] w-16 rounded-full" />
                  </div>

                  {/* Title */}
                  <Skeleton className="h-6 w-3/4 rounded-md" />

                  {/* Description */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className=" md:hidden h-4 w-96 rounded-md" />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-2">
                    <Skeleton className="h-4 w-10 rounded-md" />
                    <Skeleton className="h-4 w-10 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                </div>

                {/* Right Section (Edit/Delete buttons) */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-[34px] w-9 rounded-md" />
                  <Skeleton className="h-[34px] w-9 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
