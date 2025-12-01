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
import { Database } from "@/utils/supabase/types";
import { useRef, useState, use } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASSES, SUBJECTS, STATUSES } from "@/utils/CONSTANT";

interface FilterSheetProps {
  pagePromise: Promise<string | string[] | undefined>;
  statusPromise: Promise<string | string[] | undefined>;
  classPromise: Promise<string | string[] | undefined>;
  subjectPromise: Promise<string | string[] | undefined>;
  sortbyPromise: Promise<string | string[] | undefined>;
}

export default function FilterSheet({
  pagePromise,
  statusPromise,
  classPromise,
  subjectPromise,
  sortbyPromise,
}: FilterSheetProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    (use(statusPromise) as string) || ""
  );
  const [selectedClass, setSelectedClass] = useState<string | undefined>(
    (use(classPromise) as string) || ""
  );
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    (use(subjectPromise) as string) || ""
  );
  const [selectedSortOrder, setSelectedSortOrder] = useState<string | undefined>(
    (use(sortbyPromise) as string) || ""
  );
  const [currentPage, setCurrentPage] = useState<string | undefined>(
    (use(pagePromise) as string) || ""
  );

  const formRef = useRef<HTMLFormElement>(null);

  const resetFilters = () => {
    setSelectedStatus("");
    setSelectedClass("");
    setSelectedSubject("");
    setSelectedSortOrder("");
    setCurrentPage("");
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
            {/* Class */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">
                Class
              </h3>
              <Select
                value={selectedClass}
                onValueChange={(value) =>
                  setSelectedClass(value as Database["public"]["Enums"]["Class"])
                }
              >
                <SelectTrigger className="w-full hover:cursor-pointer">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map(({ id, name }) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">
                Subject
              </h3>
              <Select
                value={selectedSubject}
                onValueChange={(value) =>
                  setSelectedSubject(
                    value as Database["public"]["Enums"]["Subject"]
                  )
                }
              >
                <SelectTrigger className="w-full hover:cursor-pointer">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">
                Status
              </h3>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(
                    value as Database["public"]["Enums"]["Status"]
                  )
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
                onValueChange={(value) =>
                  setSelectedSortOrder(value as "latest" | "oldest")
                }
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
          <input type="hidden" name="page" value={currentPage || ""} />
          <input type="hidden" name="class" value={selectedClass || ""} />
          <input type="hidden" name="subject" value={selectedSubject || ""} />
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
