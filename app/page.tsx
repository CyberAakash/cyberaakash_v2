import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection, { SkillsList } from "@/components/sections/SkillsSection";
import ExperienceSection, { ExperienceList } from "@/components/sections/ExperienceSection";
import ProjectsSection, { ProjectList } from "@/components/sections/ProjectsSection";
import BlogSection, { BlogList } from "@/components/sections/BlogSection";
import CertificationsSection, { CertificationList } from "@/components/sections/CertificationsSection";
import EventsSection from "@/components/sections/EventsSection";
import SocialSection, { SocialList } from "@/components/sections/SocialSection";
import Footer from "@/components/Footer";
import { SectionSkeleton, HeroSkeleton, SkillSkeleton } from "@/components/ui/skeletons";
import { EventList } from "@/components/sections/EventsSection";

export const revalidate = false; // Aggressive caching on frontend

// Nested Loaders
async function SkillsLoader() {
  const supabase = await createClient();
  const { data: skills } = await supabase.from("skills")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .order("display_order");
  return <SkillsList skills={skills || []} />;
}

async function ExperienceLoader() {
  const supabase = await createClient();
  const { data: experiences } = await supabase.from("experiences")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .order("start_date", { ascending: false });
  return <ExperienceList experiences={experiences || []} />;
}

async function ProjectListLoader({ limit }: { limit: number }) {
  const supabase = await createClient();
  const { data: projects } = await supabase.from("projects")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .eq("is_featured", true)
    .order("display_order")
    .limit(limit);
  return <ProjectList projects={projects || []} />;
}

async function BlogListLoader({ limit }: { limit: number }) {
  const supabase = await createClient();
  const { data: blogs } = await supabase.from("blogs")
    .select("*")
    .eq("is_published", true)
    .eq("is_visible", true)
    .eq("is_archived", false)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  return <BlogList blogs={blogs || []} />;
}

async function CertificationsLoader() {
  const supabase = await createClient();
  const { data: certifications } = await supabase.from("certifications")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .order("display_order");
  return <CertificationList certifications={certifications || []} />;
}

async function EventListLoader({ limit }: { limit: number }) {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .eq("is_featured", true)
    .order("event_date", { ascending: false })
    .limit(limit);
  return <EventList events={events || []} />;
}

async function SocialsLoader() {
  const supabase = await createClient();
  const { data: socials } = await supabase.from("socials")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .order("display_order");
  return <SocialList socials={socials || []} />;
}

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch only what's absolutely needed for the initial render shell or SSR parts
  const [
    { data: about },
    { data: configData },
    { count: projectsCount },
    { count: skillsCount },
    { data: experiences }
  ] = await Promise.all([
    supabase.from("about").select("*").single(),
    supabase.from("site_config").select("*"),
    supabase.from("projects").select("*", { count: 'exact', head: true }).eq("is_visible", true),
    supabase.from("skills").select("*", { count: 'exact', head: true }).eq("is_visible", true),
    supabase.from("experiences").select("start_date").order("start_date", { ascending: true })
  ]);

  const projectsLimit = parseInt(configData?.find(c => c.key === 'featured_projects_limit')?.value || '6');
  const blogsLimit = parseInt(configData?.find(c => c.key === 'featured_blogs_limit')?.value || '6');
  const eventsLimit = parseInt(configData?.find(c => c.key === 'featured_events_limit')?.value || '4');
  const coffeeCount = configData?.find(c => c.key === 'coffee_count')?.value || '250+';

  // Calculate years of experience
  let yearsCoding = "3+";
  if (experiences && experiences.length > 0) {
    const start = new Date(experiences[0].start_date);
    const now = new Date();
    const diff = now.getFullYear() - start.getFullYear();
    yearsCoding = `${diff}+`;
  }

  const stats = {
    projects: `${projectsCount || 0}+`,
    tech: `${skillsCount || 0}+`,
    years: yearsCoding,
    coffee: coffeeCount,
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="mx-auto px-4 md:px-8">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection />
        </Suspense>
        
        <AboutSection about={about} stats={stats}>
          {/* About section internal parts can also be suspended if needed, 
              but for now we pass the static about data */}
        </AboutSection>

        <SkillsSection>
          <Suspense fallback={<SkillSkeleton />}>
            <SkillsLoader />
          </Suspense>
        </SkillsSection>

        <ProjectsSection>
          <Suspense fallback={<SectionSkeleton />}>
            <ProjectListLoader limit={projectsLimit} />
          </Suspense>
        </ProjectsSection>

        <ExperienceSection>
          <Suspense fallback={<SectionSkeleton />}>
            <ExperienceLoader />
          </Suspense>
        </ExperienceSection>

        <BlogSection>
          <Suspense fallback={<SectionSkeleton />}>
            <BlogListLoader limit={blogsLimit} />
          </Suspense>
        </BlogSection>

        <CertificationsSection>
          <Suspense fallback={<SectionSkeleton />}>
            <CertificationsLoader />
          </Suspense>
        </CertificationsSection>

        <EventsSection>
          <Suspense fallback={<SectionSkeleton />}>
            <EventListLoader limit={eventsLimit} />
          </Suspense>
        </EventsSection>

        <SocialSection>
          <Suspense fallback={<SectionSkeleton />}>
            <SocialsLoader />
          </Suspense>
        </SocialSection>
      </div>

      <Footer about={about} />
    </main>
  );
}
