"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MasonryGallery } from "@/components/ui/masonry-gallery";
import { createClient } from "@/lib/supabase/client";
import { GalleryItem } from "@/lib/types";

interface GalleryListClientProps {
  initialItems: GalleryItem[];
}

const ITEMS_PER_PAGE = 8;

export default function GalleryListClient({ initialItems }: GalleryListClientProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialItems.length >= ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchMoreItems = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("is_visible", true)
        .eq("is_archived", false)
        .order("display_order", { ascending: true })
        .range(from, to);

      if (error) throw error;

      if (data && data.length > 0) {
        setItems(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
        setHasMore(data.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching more gallery items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchMoreItems, hasMore]);

  const imageUrls = items.map(item => item.image_url);

  return (
    <div className="w-full">
      <MasonryGallery images={imageUrls} isLoading={isLoading} />
      
      {/* Intersection Target */}
      <div ref={observerTarget} className="h-20 w-full flex items-center justify-center">
        {isLoading && (
           <div className="flex flex-col items-center gap-2 opacity-50">
             <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
             <span className="text-[10px] font-mono uppercase tracking-widest">Loading Batch</span>
           </div>
        )}
      </div>
    </div>
  );
}
