import { Suspense } from "react";
import AuthorPostCardSkeleton from "./_components/AuthorPostCardSkeleton";
import { BreadcrumbProvider } from "@/components/custom/BreadcrumbContext";
import RouteDetector from "./RouteDetector";

export default async function DashboardPostPage({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <BreadcrumbProvider>
    <Suspense fallback={null}>
      <RouteDetector>
        <Suspense fallback={<AuthorPostCardSkeleton />}>
          {children}
        </Suspense>
      </RouteDetector>
    </Suspense>
    </BreadcrumbProvider>
  );
}
