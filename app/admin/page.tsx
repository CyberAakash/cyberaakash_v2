import { createClient } from "@/lib/supabase/server";
import { Layers, Briefcase, FolderKanban, Award, Calendar, FileText } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [skills, experiences, projects, certs, events, blogs] = await Promise.all([
    supabase.from("skills").select("id, is_visible"),
    supabase.from("experiences").select("id, is_visible"),
    supabase.from("projects").select("id, is_visible"),
    supabase.from("certifications").select("id, is_visible"),
    supabase.from("events").select("id, is_visible"),
    supabase.from("blogs").select("id, is_visible"),
  ]);

  const stats = [
    { 
      label: "Skills", 
      total: skills.data?.length || 0, 
      visible: skills.data?.filter(i => i.is_visible).length || 0,
      icon: Layers 
    },
    { 
      label: "Experience", 
      total: experiences.data?.length || 0, 
      visible: experiences.data?.filter(i => i.is_visible).length || 0,
      icon: Briefcase 
    },
    { 
      label: "Projects", 
      total: projects.data?.length || 0, 
      visible: projects.data?.filter(i => i.is_visible).length || 0,
      icon: FolderKanban 
    },
    { 
      label: "Certifications", 
      total: certs.data?.length || 0, 
      visible: certs.data?.filter(i => i.is_visible).length || 0,
      icon: Award 
    },
    { 
      label: "Events", 
      total: events.data?.length || 0, 
      visible: events.data?.filter(i => i.is_visible).length || 0,
      icon: Calendar 
    },
    { 
      label: "Blog Posts", 
      total: blogs.data?.length || 0, 
      visible: blogs.data?.filter(i => i.is_visible).length || 0,
      icon: FileText 
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-roashe">Dashboard</h1>
      <p className="text-sm text-muted-foreground font-mono mt-1">
        Portfolio content overview
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl border border-border/50 bg-card group hover:border-border transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <stat.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="flex items-center gap-1.5 opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono">{stat.visible}</span>
              </div>
            </div>
            <p className="text-3xl font-designer font-bold">{stat.total}</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
