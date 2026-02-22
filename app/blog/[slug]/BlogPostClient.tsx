"use client";

import type { Blog } from "@/lib/types";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

interface Props {
  blog: Blog;
  related: Partial<Blog>[];
}

export default function BlogPostClient({ blog, related }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Back Button */}
          <Link 
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to blog
          </Link>

          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {new Date(blog.published_at || blog.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
              {blog.tags && blog.tags.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <div className="flex gap-2">
                    {blog.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 opacity-60">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <h1 className="text-4xl sm:text-6xl font-roashe tracking-tight leading-tight">
              {blog.title}
            </h1>
            {blog.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed italic border-l-2 border-border/50 pl-4 py-1">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Cover Image */}
          {blog.cover_image && (
            <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-border/30 bg-muted/20 relative">
              <img 
                src={blog.cover_image} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="pt-8 min-h-[400px]">
            <MarkdownRenderer content={blog.content || "No content available."} />
          </div>

          {/* Related / Footer */}
          {related && related.length > 0 && (
            <div className="mt-20 pt-16 border-t border-border/10">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-8">// more stories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((b) => (
                  <Link
                    key={b.id}
                    href={`/blog/${b.slug}`}
                    className="p-6 rounded-2xl border border-border/30 bg-card/30 hover:border-border/60 transition-all hover:-translate-y-1 group"
                  >
                    <h3 className="text-base font-medium mb-2 group-hover:text-foreground transition-colors line-clamp-1">{b.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {b.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
