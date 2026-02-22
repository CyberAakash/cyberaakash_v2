import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
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
    { data: projects },
    { data: certifications },
  ] = await Promise.all([
    supabase.from("about").select("*").single(),
    supabase.from("skills").select("*").eq("is_visible", true).order("display_order"),
    supabase.from("experiences").select("*").eq("is_visible", true).order("start_date", { ascending: false }),
    supabase.from("projects").select("*").eq("is_visible", true).order("display_order"),
    supabase.from("certifications").select("*").eq("is_visible", true).order("display_order"),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection about={about} />
      <SkillsSection skills={skills || []} />
      <ExperienceSection experiences={experiences || []} />
      <ProjectsSection projects={projects || []} />
      <CertificationsSection certifications={certifications || []} />
      <EventsSection />
      <Footer about={about} />
    </main>
  );
}
