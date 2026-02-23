"use client";

import type { Event } from "@/lib/types";
import CenterBurst from "@/components/animations/CenterBurst";
import { Calendar, Trophy, Mic, Code, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

const typeIcons: Record<string, typeof Calendar> = {
  hackathon: Trophy,
  conference: Mic,
  workshop: Code,
  achievement: Trophy,
  community: Calendar,
  default: Calendar,
};

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground/50 font-mono text-sm">
        No featured events yet.
      </div>
    );
  }

  return (
    <>
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

      {/* View all events link */}
      {events.length > 0 && (
        <div className="flex justify-center mt-12">
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 px-8 py-3 rounded-full border border-border/40 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-border transition-all"
          >
            View all events
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </>
  );
}

export default function EventsSection({ children }: { children?: React.ReactNode }) {
  return (
    <section id="events" className="section-padding">
      <div className="max-w-7xl mx-auto w-full">
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // events &amp; activities
          </p>
          <h2 className="text-3xl sm:text-4xl font-roashe tracking-tight mb-12">
            Things I&apos;ve Attended
          </h2>
        </CenterBurst>

        {children}
      </div>
    </section>
  );
}
