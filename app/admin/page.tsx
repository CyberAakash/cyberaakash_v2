import { createClient } from "@/lib/supabase/server";
import { Layers, Briefcase, FolderKanban, Award, Calendar, FileText } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [skills, experiences, projects, certs, events, blogs] = await Promise.all([
    supabase.from("skills").select("id", { count: "exact" }),
    supabase.from("experiences").select("id", { count: "exact" }),
    supabase.from("projects").select("id", { count: "exact" }),
    supabase.from("certifications").select("id", { count: "exact" }),
    supabase.from("events").select("id", { count: "exact" }),
    supabase.from("blogs").select("id", { count: "exact" }),
  ]);

  const stats = [
    { label: "Skills", count: skills.count || 0, icon: Layers },
    { label: "Experience", count: experiences.count || 0, icon: Briefcase },
    { label: "Projects", count: projects.count || 0, icon: FolderKanban },
    { label: "Certifications", count: certs.count || 0, icon: Award },
    { label: "Events", count: events.count || 0, icon: Calendar },
    { label: "Blog Posts", count: blogs.count || 0, icon: FileText },
  ];

  return (
    <div>
      <h1 className="text-2xl font-roashe">Dashboard</h1>
      <p className="text-sm text-muted-foreground font-mono mt-1">
        Portfolio content overview
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl border border-border/50 bg-card"
          >
            <stat.icon className="w-5 h-5 text-muted-foreground mb-3" />
            <p className="text-3xl font-designer font-bold">{stat.count}</p>
            <p className="text-xs font-mono text-muted-foreground mt-1 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
