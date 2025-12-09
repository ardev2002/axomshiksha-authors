"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Edit } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  searchPosts,
} from "@/utils/post/get/action";
import Link from "next/link";
import DeletePost from "./DeletePost";

export default function SearchPost() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<Record<string, any> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Helper function to highlight search terms
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }

    // Split the highlight into words and create a regex that matches any of them
    const words = highlight
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length === 0) {
      return text;
    }

    // Escape special regex characters and join words with OR operator
    const escapedWords = words.map((word) =>
      word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const regex = new RegExp(`(${escapedWords.join("|")})`, "gi");

    const parts = text.split(regex);
    return (
      <span>
        {parts.filter(String).map((part, i) =>
          regex.test(part) ? (
            <span
              key={i}
              className="bg-yellow-200 dark:bg-yellow-800 font-bold"
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close dropdown if clicking on delete dialog or its children
      if (
        event.target instanceof Element &&
        (event.target.closest('[role="dialog"]') ||
          event.target.closest('[data-state="open"]'))
      ) {
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced fetch function
  const fetchResults = useCallback(async (q: string) => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new debounce timer
    debounceTimerRef.current = setTimeout(async () => {
      if (!q.trim()) {
        setResults([]);
        setOpen(false);
        return;
      } else {
        setOpen(true);
      }

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      setLoading(true);

      try {
        const { posts, nextKey } = await searchPosts(q);

        setResults(posts);
        setLastEvaluatedKey(nextKey);
        setHasMore(!!nextKey);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setLoading(false);
          // Keep dropdown open if there's still text in the search field
          if (!q.trim()) {
            setOpen(false);
          }
        }
      }
    }, 300);
  }, []);

  useEffect(() => {
    fetchResults(query);

    // Cleanup function to clear timers and abort requests
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, fetchResults]);

  // Handle input focus to reopen dropdown if there's text in the search field
  const handleInputFocus = () => {
    if (query.trim()) {
      setOpen(true);
    }
  };

  // Load more results
  const loadMore = async () => {
    if (!hasMore || !query.trim()) return;

    setLoading(true);

    try {
      const { posts, nextKey } = await searchPosts(query, lastEvaluatedKey || undefined);

      setResults(prev => [...prev, ...posts]);
      setLastEvaluatedKey(nextKey);
      setHasMore(!!nextKey);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Visible Input */}
      <div className="w-full">
        <InputGroup>
          <InputGroupInput
            ref={inputRef}
            placeholder="Search by title..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onFocus={handleInputFocus}
          />
          <InputGroupAddon>
            <Search className="w-4 h-4" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Custom Dropdown Card */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-2 w-full bg-muted border rounded-md shadow-lg"
        >
          <div className="p-3 space-y-3">
            {loading && results.length === 0 ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No results found
              </p>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.map((item) => (
                    <div
                      key={item.slug}
                      className="p-2 rounded-md border hover:bg-accent"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {highlightText(item.title, query)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.classLevel && <p className="text-sm text-muted-foreground">
                              {"|"} {item.classLevel}
                            </p>}

                            {item.subject && <p className="text-sm text-muted-foreground">
                              {"|"} {item.subject}
                            </p>}

                            <p className="text-xs text-muted-foreground">
                              {new Date(item.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Link
                            href={`/dashboard/posts/edit?slug=${item.slug}`}
                            className="text-sky-400 hover:bg-sky-400/10 rounded-md p-2 transition-colors duration-200"
                            title="Edit Post"
                          >
                            <Edit size={18} />
                          </Link>
                          <div onClick={(e) => e.stopPropagation()}>
                            <DeletePost
                              post={item}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      onClick={loadMore}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}