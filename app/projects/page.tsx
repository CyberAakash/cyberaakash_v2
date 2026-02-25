import { createClient } from "@/lib/supabase/server";
import ProjectsListClient from "./ProjectsListClient";
import ConnectAndFooter from "@/components/ConnectAndFooter";

export const revalidate = 60;

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .order("display_order", { ascending: true })
    .limit(6);

  return (
    <>
      <ProjectsListClient initialProjects={projects || []} />
      <ConnectAndFooter />
    </>
  );
}
