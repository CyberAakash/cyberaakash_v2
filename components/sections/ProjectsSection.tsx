"use client";

import type { Project } from "@/lib/types";
import CenterBurst, { CenterBurstStagger, CenterBurstItem } from "@/components/animations/CenterBurst";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ExternalLink, Github, Monitor, Smartphone, Layout } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MobileFrame } from "@/components/ui/mobile-frame";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="section-padding min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <CenterBurst>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // projects
          </p>
          <h2 className="text-3xl sm:text-4xl font-roashe tracking-tight mb-12 text-center">
            Things I&apos;ve Built
          </h2>
        </CenterBurst>

        <CenterBurstStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.08}>
          {projects.map((project) => (
            <CenterBurstItem key={project.id}>
              <CardContainer className="w-full">
                <CardBody className="relative w-full h-full rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-6 group/card hover:border-border/60 transition-colors flex flex-col">
                  <Link href={`/projects/${project.slug || project.id}`} className="flex-1 flex flex-col">
                    {/* Visual Preview (Mobile Frame) */}
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

                    {/* Header */}
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

                    {/* Description */}
                    <CardItem translateZ="20" className="flex-1">
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </CardItem>
                  </Link>

                  {/* Tech stack */}
                  <CardItem translateZ="10" className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-border/10">
                    {project.tech_stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono text-muted-foreground/60 px-2 py-0.5 rounded border border-border/30 bg-background/50"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <span className="text-[10px] font-mono text-muted-foreground/40 px-2 py-0.5">+{project.tech_stack.length - 4} more</span>
                    )}
                  </CardItem>

                  {/* Featured badge */}
                  {project.is_featured && (
                    <CardItem translateZ="50" className="absolute -top-2 -right-2">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-foreground text-background font-bold shadow-lg">
                        FEATURED
                      </span>
                    </CardItem>
                  )}
                </CardBody>
              </CardContainer>
            </CenterBurstItem>
          ))}
        </CenterBurstStagger>
      </div>
    </section>
  );
}
