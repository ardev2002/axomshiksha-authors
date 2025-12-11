"use client";

import { useBreadcrumb } from "@/components/custom/BreadcrumbContext";
import { DBPost } from "@/utils/types";
import { use, useEffect } from "react";

export default function BreadcrumbSetter({ 
  status
}: { 
  status: string;
}) {
    const { setExtraBreadcrumb } = useBreadcrumb();
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    
    useEffect(() => {
        setExtraBreadcrumb({
            icon: null,
            path: `/dashboard/posts/${status.toLowerCase().replace(/\s+/g, '-')}`,
            title: capitalizedStatus
        });
        
        // Cleanup breadcrumb when component unmounts
        return () => {
            setExtraBreadcrumb(null);
        };
    }, [status, setExtraBreadcrumb]);
    
    return null;
}