"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Filter, RotateCcw } from "lucide-react";
import { MotionButton } from "@/components/custom/Motion";
import { getPostsByFilter } from "@/utils/post/get/action";
import { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUSES } from "@/utils/CONSTANT";

export default function FilterSheet() {
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [selectedSortOrder, setSelectedSortOrder] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);

  const resetFilters = () => {
    setSelectedStatus("");
    setSelectedSortOrder("");
    formRef.current?.reset();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <MotionButton className="bg-violet-600 text-white border border-violet-500/30 hover:cursor-pointer hover:bg-violet-700 flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg">
          <Filter size={16} /> Filter
        </MotionButton>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-background/95 backdrop-blur border-violet-500/20 p-0 w-full sm:w-[400px] flex flex-col max-h-screen"
      >
        {/* Header */}
        <SheetHeader className="p-6 border-b border-white/10 bg-linear-to-r from-violet-900/20 to-background shrink-0">
          <SheetTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Filter className="text-violet-500" size={20} /> Filter Posts
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Filter and sort your posts by class, subject, status, or date.
          </SheetDescription>
        </SheetHeader>

        {/* Form Scroll Container */}
        <form
          ref={formRef}
          action={getPostsByFilter}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">
                Status
              </h3>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(value)
                }
              >
                <SelectTrigger className="w-full hover:cursor-pointer">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">
                Sort By
              </h3>
              <Select
                value={selectedSortOrder}
                onValueChange={(value) => setSelectedSortOrder(value as "latest" | "oldest")}
              >
                <SelectTrigger className="w-full hover:cursor-pointer">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hidden Inputs */}
          <input type="hidden" name="status" value={selectedStatus || ""} />
          <input type="hidden" name="sortby" value={selectedSortOrder || ""} />

          {/* Sticky Footer */}
          <SheetFooter className="p-6 bg-background/95 border-t border-white/10 flex gap-3 sticky bottom-0 shrink-0">
            <MotionButton
              onClick={resetFilters}
              type="button"
              className="flex-1 bg-background/80 border border-white/20 hover:cursor-pointer hover:bg-white/10 text-foreground flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Reset
            </MotionButton>

            <SheetClose asChild>
              <MotionButton
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-violet-600 hover:cursor-pointer hover:bg-violet-700 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                Apply Filters
              </MotionButton>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
