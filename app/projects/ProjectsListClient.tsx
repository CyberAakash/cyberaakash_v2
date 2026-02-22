"use client";

import type { Project } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ExternalLink, Github, Monitor, Smartphone, Layout, Search, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { MobileFrame } from "@/components/ui/mobile-frame";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface Props {
  initialProjects: Project[];
}

const ITEMS_PER_PAGE = 6;

export default function ProjectsListClient({ initialProjects }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProjects.length === ITEMS_PER_PAGE);
  const observerTarget = useRef(null);
  const supabase = createClient();

  const fetchProjects = useCallback(async (pageNum: number, search: string, isInitial = false) => {
    setLoading(true);
    let query = supabase
      .from("projects")
      .select("*")
      .eq("is_visible", true)
      .order("display_order", { ascending: true })
      .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tech_stack.cs.{${search}}`);
    }

    const { data, error } = await query;

    if (!error && data) {
      if (isInitial) {
        setProjects(data);
      } else {
        setProjects((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === ITEMS_PER_PAGE);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      setPage(0);
      fetchProjects(0, debouncedSearch, true);
    }
  }, [debouncedSearch, fetchProjects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProjects(nextPage, debouncedSearch);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page, debouncedSearch, fetchProjects]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
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
            // projects
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-roashe tracking-tight mb-4">
                Selected Works
              </h1>
              <p className="text-muted-foreground max-w-md">
                A collection of projects I&apos;ve built, ranging from web apps to blockchain solutions.
              </p>
            </div>
            
            <div className="relative w-full md:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-foreground/5 border border-border/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all text-sm"
              />
            </div>
          </div>
        </motion.div>

        {projects.length === 0 && !loading ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i < 6 ? i * 0.08 : 0 }}
              >
                <CardContainer className="w-full">
                  <CardBody className="relative w-full h-full rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-6 group/card hover:border-border/60 transition-colors flex flex-col">
                    <Link href={`/projects/${project.slug || project.id}`} className="flex-1 flex flex-col">
                      <div className="mb-6 relative h-[320px] overflow-hidden rounded-xl bg-background/30 flex items-center justify-center p-4">
                        <div className="scale-[0.5] origin-center">
                          <MobileFrame>
                            {project.images && project.images[0] ? (
                              <img 
                                src={project.images[0]} 
                                alt={project.title} 
                                className="w-full h-full object-cover pt-6"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground/30">
                                <Layout className="w-12 h-12" />
                                <span className="text-[10px] uppercase font-mono tracking-widest text-center px-4">No Preview Available</span>
                              </div>
                            )}
                          </MobileFrame>
                        </div>
                      </div>

                      <CardItem translateZ="30" className="flex items-center justify-between w-full mb-4">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-lg font-medium group-hover/card:text-foreground transition-colors">
                            {project.title}
                          </h3>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{project.category}</span>
                        </div>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                            >
                              <Github className="w-4 h-4 text-muted-foreground" />
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </a>
                          )}
                        </div>
                      </CardItem>

                      <CardItem translateZ="20" className="flex-1">
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      </CardItem>
                    </Link>

                    <CardItem translateZ="10" className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-border/10">
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono text-muted-foreground/60 px-2 py-0.5 rounded border border-border/30 bg-background/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </motion.div>
            ))}
          </div>
        )}

        <div ref={observerTarget} className="w-full h-20 flex items-center justify-center mt-8">
          {loading && <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />}
          {!hasMore && projects.length > 0 && (
            <p className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest">
              End of projects
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
