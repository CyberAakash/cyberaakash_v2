"use client";

import type { Blog } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Calendar, Tag, ArrowRight, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface Props {
  initialBlogs: Blog[];
}

const ITEMS_PER_PAGE = 6;

export default function BlogListClient({ initialBlogs }: Props) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialBlogs.length === ITEMS_PER_PAGE);
  const observerTarget = useRef(null);
  const supabase = createClient();

  const fetchBlogs = useCallback(async (pageNum: number, search: string, isInitial = false) => {
    setLoading(true);
    let query = supabase
      .from("blogs")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      if (isInitial) {
        setBlogs(data);
      } else {
        setBlogs((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === ITEMS_PER_PAGE);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      setPage(0);
      fetchBlogs(0, debouncedSearch, true);
    }
  }, [debouncedSearch, fetchBlogs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchBlogs(nextPage, debouncedSearch);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page, debouncedSearch, fetchBlogs]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // blog
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-roashe tracking-tight mb-4">
                Thoughts & Writing
              </h1>
              <p className="text-muted-foreground max-w-md">
                Articles on development, technology, and building things that matter.
              </p>
            </div>
            
            <div className="relative w-full md:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-foreground/5 border border-border/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all text-sm"
              />
            </div>
          </div>
        </motion.div>

        {blogs.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground/50 font-mono text-sm">
              No results found for &quot;{searchQuery}&quot;
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i < 6 ? i * 0.08 : 0 }}
              >
                <CardContainer className="w-full">
                  <CardBody className="w-full rounded-2xl border border-border/30 bg-card/50 p-6 group/card hover:border-border/60 transition-colors">
                    <Link href={`/blog/${blog.slug}`}>
                      <CardItem translateZ="10" className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/50 mb-3">
                        <Calendar className="w-3 h-3" />
                        {blog.published_at
                          ? new Date(blog.published_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Draft"}
                      </CardItem>

                      <CardItem translateZ="30">
                        <h2 className="text-lg font-medium mb-2 group-hover/card:text-foreground transition-colors">
                          {blog.title}
                        </h2>
                      </CardItem>

                      <CardItem translateZ="15">
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </CardItem>

                      <CardItem translateZ="10" className="flex items-center justify-between mt-4 pt-4 border-t border-border/20">
                        <div className="flex items-center gap-1 flex-wrap">
                          {blog.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-mono text-muted-foreground/40 flex items-center gap-1">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </CardItem>
                    </Link>
                  </CardBody>
                </CardContainer>
              </motion.div>
            ))}
          </div>
        )}

        {/* Loading / Observer Element */}
        <div ref={observerTarget} className="w-full h-20 flex items-center justify-center mt-8">
          {loading && <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />}
          {!hasMore && blogs.length > 0 && (
            <p className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest">
              End of thoughts
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
