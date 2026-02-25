import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Project } from "@/lib/types";
import ProjectDetailClient from "./ProjectDetailClient";
import ConnectAndFooter from "@/components/ConnectAndFooter";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Try slug first, then id
  let { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!project) {
    const { data: byId } = await supabase
      .from("projects")
      .select("*")
      .eq("id", slug)
      .eq("is_visible", true)
      .single();
    project = byId;
  }

  if (!project) notFound();

  // Get related projects (same category)
  const { data: related } = await supabase
    .from("projects")
    .select("id, title, slug, description, tech_stack, tags, category")
    .eq("category", project.category)
    .neq("id", project.id)
    .eq("is_visible", true)
    .limit(3);

  return (
    <>
      <ProjectDetailClient project={project} related={related || []} />
      <ConnectAndFooter />
    </>
  );
}
