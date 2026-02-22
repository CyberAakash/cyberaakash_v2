"use client";

import type { Event } from "@/lib/types";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, ExternalLink, ImageIcon } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { useState } from "react";

interface Props {
  event: Event;
}

export default function EventDetailClient({ event }: Props) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/#events"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to events
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[16/10] rounded-3xl border border-border/30 overflow-hidden bg-muted/20 relative group"
            >
              {event.images && event.images[activeImage] ? (
                <img 
                  src={event.images[activeImage]} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground/30">
                  <ImageIcon className="w-16 h-16" />
                  <span className="text-xs uppercase font-mono tracking-widest">No images available</span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail list */}
            {event.images && event.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {event.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "w-20 h-20 rounded-xl border-2 overflow-hidden transition-all shrink-0",
                      activeImage === i ? "border-primary" : "border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-widest border border-primary/20">
                  {event.type}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date(event.event_date).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-roashe tracking-tight leading-tight">
                {event.title}
              </h1>
              {event.description && (
                <p className="text-lg text-muted-foreground leading-relaxed italic border-l-2 border-border/50 pl-4 py-1">
                  {event.description}
                </p>
              )}
              
              {event.link_url && (
                <a 
                  href={event.link_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Visit Official Link <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          </div>
        </div>

        {/* Full Story / Markdown Content */}
        {event.content && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-20 pt-16 border-t border-border/30"
          >
            <div className="max-w-3xl">
              <h2 className="text-2xl font-medium mb-10 text-foreground/80 uppercase tracking-widest text-xs font-mono">// Event Details</h2>
              <MarkdownRenderer content={event.content} />
            </div>
          </motion.div>
        )}
      </article>
    </div>
  );
}

// Utility function duplicated for clarity in this single file or import from lib/utils
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
