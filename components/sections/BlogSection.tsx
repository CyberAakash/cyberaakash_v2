"use client";

import type { Blog } from "@/lib/types";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface BlogSectionProps {
  children?: React.ReactNode;
}

export function BlogList({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) return null;

  return (
    <CenterBurstStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
      {blogs.map((blog) => (
        <CenterBurstItem key={blog.id}>
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
                  <h3 className="text-lg font-medium mb-2 group-hover/card:text-foreground transition-colors">
                    {blog.title}
                  </h3>
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
        </CenterBurstItem>
      ))}
    </CenterBurstStagger>
  );
}

export default function BlogSection({ children }: BlogSectionProps) {
  return (
    <section id="blog" className="section-padding min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // writing
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <h2 className="text-3xl sm:text-4xl font-roashe tracking-tight">
              Latest Thoughts
            </h2>
            <Link 
              href="/blog" 
              className="group flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              View all articles <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </CenterBurst>

        {children}
      </div>
    </section>
  );
}
