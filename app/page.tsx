import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import BlogSection from "@/components/sections/BlogSection";
import CertificationsSection from "@/components/sections/CertificationsSection";
import EventsSection from "@/components/sections/EventsSection";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: about },
    { data: skills },
    { data: experiences },
    { data: certifications },
    { data: configData },
  ] = await Promise.all([
    supabase.from("about").select("*").single(),
    supabase.from("skills").select("*").eq("is_visible", true).order("display_order"),
    supabase.from("experiences").select("*").eq("is_visible", true).order("start_date", { ascending: false }),
    supabase.from("certifications").select("*").eq("is_visible", true).order("display_order"),
    supabase.from("site_config").select("*"),
  ]);

  // Parse config for limits
  const projectsLimit = parseInt(configData?.find(c => c.key === 'featured_projects_limit')?.value || '6');
  const blogsLimit = parseInt(configData?.find(c => c.key === 'featured_blogs_limit')?.value || '6');

  const [
    { data: featuredProjects },
    { data: featuredBlogs },
  ] = await Promise.all([
    supabase.from("projects")
      .select("*")
      .eq("is_visible", true)
      .eq("is_featured", true)
      .order("display_order")
      .limit(projectsLimit),
    supabase.from("blogs")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(blogsLimit),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection about={about} />
      <SkillsSection skills={skills || []} />
      <ProjectsSection projects={featuredProjects || []} />
      <ExperienceSection experiences={experiences || []} />
      <BlogSection blogs={featuredBlogs || []} />
      <CertificationsSection certifications={certifications || []} />
      <EventsSection />
      <Footer about={about} />
    </main>
  );
}
