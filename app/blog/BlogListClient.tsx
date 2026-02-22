"use client";

import type { Blog } from "@/lib/types";
import { motion } from "framer-motion";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Props {
  blogs: Blog[];
}

export default function BlogListClient({ blogs }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-roashe tracking-tight mb-4">
            Thoughts & Writing
          </h1>
          <p className="text-muted-foreground max-w-md">
            Articles on development, technology, and building things that matter.
          </p>
        </motion.div>

        {blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground/50 font-mono text-sm">
              No posts yet. Coming soon...
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <CardContainer className="w-full">
                  <CardBody className="w-full rounded-2xl border border-border/30 bg-card/50 p-6 group/card hover:border-border/60 transition-colors">
                    <Link href={`/blog/${blog.slug}`}>
                      {/* Date */}
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

                      {/* Title */}
                      <CardItem translateZ="30">
                        <h2 className="text-lg font-medium mb-2 group-hover/card:text-foreground transition-colors">
                          {blog.title}
                        </h2>
                      </CardItem>

                      {/* Excerpt */}
                      <CardItem translateZ="15">
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </CardItem>

                      {/* Tags + Read more */}
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
      </main>
    </div>
  );
}
