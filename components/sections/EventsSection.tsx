"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";
import CenterBurst from "@/components/animations/CenterBurst";
import { Calendar, Trophy, Mic, Code, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

const typeIcons: Record<string, typeof Calendar> = {
  hackathon: Trophy,
  conference: Mic,
  workshop: Code,
  default: Calendar,
};

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(0);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);

    const supabase = createClient();
    const from = pageRef.current * 6;
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("is_visible", true)
      .order("event_date", { ascending: false })
      .range(from, from + 5);

    if (data && data.length > 0) {
      setEvents((prev) => {
        // Deduplicate by id
        const existingIds = new Set(prev.map((e) => e.id));
        const newItems = data.filter((d) => !existingIds.has(d.id));
        return [...prev, ...newItems];
      });
      pageRef.current += 1;
      if (data.length < 6) setHasMore(false);
    } else {
      setHasMore(false);
    }
    loadingRef.current = false;
    setLoading(false);
  }, [hasMore]);

  // Initial load
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <section id="events" className="section-padding">
      <div className="max-w-7xl mx-auto w-full">
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // events & activities
          </p>
          <h2 className="text-3xl sm:text-4xl font-roashe tracking-tight mb-12">
            Things I&apos;ve Attended
          </h2>
        </CenterBurst>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {events.map((event, index) => {
            const Icon = typeIcons[event.type?.toLowerCase() || "default"] || typeIcons.default;
            return (
              <CenterBurst key={`${event.id}-${index}`}>
                <Link 
                  href={`/events/${event.slug || event.id}`}
                  className="group block relative h-full rounded-3xl border border-border/10 bg-card/20 hover:border-border/40 hover:bg-card/40 transition-all duration-500 overflow-hidden shadow-2xl shadow-black/20"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-muted/10">
                    {event.images && event.images[0] ? (
                      <img 
                        src={event.images[0]} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground/10 bg-gradient-to-br from-card/30 to-background/30">
                        <Icon className="w-16 h-16 stroke-[1]" />
                        <span className="text-[10px] uppercase font-mono tracking-[0.3em] opacity-50">{event.type}</span>
                      </div>
                    )}
                    
                    {/* Glass Overlay on Bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute bottom-6 left-6 right-6">
                       <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-white/90">
                          {event.type}
                        </div>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                          {new Date(event.event_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                       </div>
                       <h3 className="text-2xl sm:text-3xl font-roashe text-white leading-tight group-hover:text-primary transition-colors duration-300">
                        {event.title}
                       </h3>
                    </div>
                  </div>

                  <div className="p-8 pt-6">
                    {event.description && (
                      <p className="text-muted-foreground/70 leading-relaxed line-clamp-2 text-sm mb-6">
                        {event.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between group/btn">
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/40 group-hover:text-foreground transition-colors">
                        View Story
                      </span>
                      <div className="w-10 h-10 rounded-full border border-border/20 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                        <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </CenterBurst>
            );
          })}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-border/30 border-t-foreground rounded-full animate-spin" />
          </div>
        )}
        <div ref={sentinelRef} className="h-4" />
      </div>
    </section>
  );
}
