"use client";

import type { Event } from "@/lib/types";
import { motion } from "framer-motion";
import { Calendar, Trophy, Mic, Code, ArrowLeft, ArrowRight, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  initialEvents: Event[];
}

const typeIcons: Record<string, typeof Calendar> = {
  hackathon: Trophy,
  talk: Mic,
  workshop: Code,
  achievement: Trophy,
  community: Calendar,
  default: Calendar,
};

const ITEMS_PER_PAGE = 12;

const eventTypes = ["All", "hackathon", "talk", "workshop", "achievement", "community"];

export default function EventsListClient({ initialEvents }: Props) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialEvents.length === ITEMS_PER_PAGE);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const offsetRef = useRef(initialEvents.length);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Filter client-side by search + type
  const filtered = events.filter((e) => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === "All" || e.type === selectedType;
    return matchSearch && matchType;
  });

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("is_visible", true)
      .eq("is_archived", false)
      .order("event_date", { ascending: false })
      .range(offsetRef.current, offsetRef.current + ITEMS_PER_PAGE - 1);

    if (data && data.length > 0) {
      setEvents((prev) => {
        const ids = new Set(prev.map((e) => e.id));
        return [...prev, ...data.filter((d) => !ids.has(d.id))];
      });
      offsetRef.current += data.length;
      if (data.length < ITEMS_PER_PAGE) setHasMore(false);
    } else {
      setHasMore(false);
    }
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-3">
            // events & activities
          </p>
          <h1 className="text-4xl sm:text-5xl font-roashe tracking-tight mb-4">
            Things I&apos;ve Attended
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Hackathons, talks, workshops and community milestones I&apos;ve been part of.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          {/* Search */}
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
            />
          </div>

          {/* Type filter */}
          <div className="flex gap-2 flex-wrap">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all ${
                  selectedType === type
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground font-mono text-sm">
            No events found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((event, idx) => {
              const Icon = typeIcons[event.type?.toLowerCase() || "default"] || typeIcons.default;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={`/events/${event.slug || event.id}`}
                    className="group block relative rounded-3xl border border-border/10 bg-card/20 hover:border-border/40 hover:bg-card/40 transition-all duration-500 overflow-hidden shadow-2xl shadow-black/20 h-full"
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
                        <h3 className="text-xl font-roashe text-white leading-tight group-hover:text-primary transition-colors duration-300">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 pt-5">
                      {event.description && (
                        <p className="text-muted-foreground/70 leading-relaxed line-clamp-2 text-sm mb-4">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between group/btn">
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/40 group-hover:text-foreground transition-colors">
                          View Story
                        </span>
                        <div className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                          <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load more sentinel */}
        <div ref={sentinelRef} className="h-8 mt-8 flex justify-center items-center">
          {isLoadingMore && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
        </div>
      </main>
    </div>
  );
}
