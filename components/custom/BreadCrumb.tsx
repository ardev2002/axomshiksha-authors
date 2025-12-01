import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface CustomBreadCrumbProps {
  paths: { icon: React.ReactNode; path: string; title: string }[];
}

export default function BreadCrumb({ paths }: CustomBreadCrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:flex">
        {paths.map((path, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {paths.length !== index + 1 ? (
                <BreadcrumbLink asChild>
                  <Link href={path.path} className="flex items-center gap-1">
                    {path.icon} {path.title}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <span className="flex items-center gap-1">
                  {path.icon} {path.title}
                </span>
              )}
            </BreadcrumbItem>
            {paths.length > index + 1 && (
              <BreadcrumbSeparator>
                <ChevronRight size={14} />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}