"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { About } from "@/lib/types";
import { ImageUpload } from "@/components/admin/image-upload";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerScrollArea
} from "@/components/ui/drawer";
import { toast } from "sonner";


export default function AdminAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("about").select("*").limit(1).single();
      if (data) setAbout(data);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!about) return;
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("about")
        .update({
          name: about.name,
          title: about.title,
          tagline: about.tagline,
          bio: about.bio,
          github_url: about.github_url,
          linkedin_url: about.linkedin_url,
          email: about.email,
          location: about.location,
          avatar_url: about.avatar_url,
          resume_url: about.resume_url,
        })
        .eq("id", about.id);
      
      if (error) throw error;
      toast.success("Profile changes saved successfully");
    } catch (error: any) {
      toast.error("Error saving changes: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const updateField = (field: keyof About, value: string) => {
    if (!about) return;
    setAbout({ ...about, [field]: value });
  };

  if (!about) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-12 w-full rounded-lg" />
        <div className="skeleton h-12 w-full rounded-lg" />
        <div className="skeleton h-32 w-full rounded-lg" />
      </div>
    );
  }

  const fields: { key: keyof About; label: string; type?: string }[] = [
    { key: "name", label: "Name" },
    { key: "title", label: "Title" },
    { key: "tagline", label: "Tagline" },
    { key: "email", label: "Email", type: "email" },
    { key: "location", label: "Location" },
    { key: "github_url", label: "GitHub URL", type: "url" },
    { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-roashe">About</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Edit your profile information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-5 py-2.5 bg-muted text-muted-foreground text-sm font-medium rounded-lg hover:bg-accent transition-all"
          >
            Preview Profile
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSubmitting && <div className="w-3 h-3 border-2 border-background/30 border-t-background rounded-full animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <Drawer open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DrawerContent className="max-w-2xl mx-auto">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-roashe">Profile Preview</DrawerTitle>
            <DrawerDescription className="font-mono text-[10px] uppercase tracking-widest mt-1">
              How you appear to the world
            </DrawerDescription>
          </DrawerHeader>

          <DrawerScrollArea className="py-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 p-1 bg-background shadow-lg">
                <img src={about.avatar_url || ""} alt="" className="w-full h-full object-cover rounded-full" />
              </div>
              
              <div className="space-y-1">
                <h2 className="text-3xl font-roashe text-foreground">{about.name}</h2>
                <p className="text-primary font-mono text-xs uppercase tracking-[0.2em]">{about.title}</p>
                {about.tagline && (
                  <p className="text-muted-foreground text-sm max-w-md italic mt-2">"{about.tagline}"</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="p-4 rounded-2xl border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                  <p className="text-xs font-medium truncate">{about.email}</p>
                </div>
                <div className="p-4 rounded-2xl border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Location</p>
                  <p className="text-xs font-medium">{about.location}</p>
                </div>
              </div>

              <div className="w-full max-w-md p-6 rounded-3xl border border-border/50 bg-background/50 text-left space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">About Me</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{about.bio}</p>
              </div>
            </div>
          </DrawerScrollArea>
        </DrawerContent>
      </Drawer>


      <div className="mt-8 space-y-8 max-w-2xl">
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Avatar Image
            </label>
            <ImageUpload 
              bucket="project-images" 
              value={about.avatar_url || ""} 
              onUpload={(url) => updateField("avatar_url", url)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Resume/CV URL
            </label>
            <input
              type="url"
              value={about.resume_url || ""}
              onChange={(e) => updateField("resume_url", e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
              placeholder="https://..."
            />
            <p className="text-[10px] text-muted-foreground/40 font-mono italic">
              Paste a Google Drive or Cloudinary link for your resume
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ key, label, type }) => (
            <div key={key}>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {label}
              </label>
              <input
                type={type || "text"}
                value={(about[key] as string) || ""}
                onChange={(e) => updateField(key, e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Bio
          </label>
          <textarea
            value={about.bio || ""}
            onChange={(e) => updateField("bio", e.target.value)}
            rows={5}
            className="mt-1 w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition resize-none"
          />
        </div>
      </div>
    </div>
  );
}
