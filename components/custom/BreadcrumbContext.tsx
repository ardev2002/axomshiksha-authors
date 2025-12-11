"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import BreadCrumb from "@/components/custom/BreadCrumb";
import { Home, Layout, BookOpen } from "lucide-react";

// Define the breadcrumb item type
interface BreadcrumbItem {
  icon: React.ReactNode | null;
  path: string;
  title: string;
}

// Define the context type
interface BreadcrumbContextType {
  extraBreadcrumb: BreadcrumbItem | null;
  setExtraBreadcrumb: (item: BreadcrumbItem | null) => void;
}

// Create the context
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

// Provider component
export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [extraBreadcrumb, setExtraBreadcrumb] = useState<BreadcrumbItem | null>(null);

  // Define base breadcrumb paths
  const basePaths = [
    { icon: <Home size={16} />, path: "/", title: "Home" },
    { icon: <Layout size={16} />, path: "/dashboard", title: "Dashboard" },
    {
      icon: <BookOpen size={16} />,
      path: "/dashboard/posts",
      title: "Posts",
    },
  ];

  // Add the extra breadcrumb if it exists (without icon for leaf segment)
  const allPaths = extraBreadcrumb 
    ? [...basePaths, { ...extraBreadcrumb, icon: null }] 
    : basePaths;

  return (
    <BreadcrumbContext.Provider value={{ extraBreadcrumb, setExtraBreadcrumb }}>
      <div className="space-y-6">
        <BreadCrumb paths={allPaths} />
        {children}
      </div>
    </BreadcrumbContext.Provider>
  );
}

// Hook to use the breadcrumb context
export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
}