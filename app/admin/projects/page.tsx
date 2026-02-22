"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Pencil, X, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react";
import type { Project } from "@/lib/types";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/utils";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", long_description: "", tech_stack: "", category: "web",
    live_url: "", github_url: "", is_featured: false, images: [] as string[],
  });
  const [longDescPreview, setLongDescPreview] = useState(false);

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("projects").select("*").order("display_order");
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ 
      title: "", description: "", long_description: "", tech_stack: "", 
      category: "web", live_url: "", github_url: "", is_featured: false, 
      images: [],
    });
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Project title is required");
      return;
    }
    const supabase = createClient();
    const payload = {
      title: form.title, 
      description: form.description, 
      long_description: form.long_description || null,
      category: form.category,
      live_url: form.live_url || null, 
      github_url: form.github_url || null,
      is_featured: form.is_featured,
      images: form.images.filter(Boolean),
      image_url: form.images[0] || null, // Keep first as main for compatibility
      tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
      display_order: editing ? undefined : projects.length,
    };

    if (editing) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing);
      if (error) toast.error("Error updating project: " + error.message);
      else toast.success("Project updated");
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) toast.error("Error adding project: " + error.message);
      else toast.success("Project added");
    }
    resetForm();
    fetchData();
  };

  const startEdit = (p: Project) => {
    setEditing(p.id);
    setForm({
      title: p.title, 
      description: p.description || "", 
      long_description: p.long_description || "",
      category: p.category || "web",
      live_url: p.live_url || "", 
      github_url: p.github_url || "",
      is_featured: p.is_featured, 
      tech_stack: p.tech_stack.join(", "),
      images: p.images || [],
    });
  };

  const deleteItem = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error("Error deleting project: " + error.message);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    }
  };

  const addImage = () => setForm({ ...form, images: [...form.images, ""] });
  const updateImage = (i: number, url: string) => {
    const next = [...form.images];
    next[i] = url;
    setForm({ ...form, images: next });
  };
  const removeImage = (i: number) => {
    setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });
  };
  const moveImage = (i: number, delta: number) => {
    const next = [...form.images];
    const target = i + delta;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    setForm({ ...form, images: next });
  };

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-lg" />)}</div>;
  }

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-roashe">Projects</h1>
      <p className="text-sm text-muted-foreground font-mono mt-1">Manage your projects & gallery</p>

      <div className="mt-6 p-6 rounded-2xl border border-border bg-card space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {editing ? "Edit Project" : "Add Project"}
          </h3>
          {editing && <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>}
        </div>

        {/* Image Gallery Admin */}
        <div className="space-y-4">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Project Gallery (Mobile Screenshots)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {form.images.map((img, i) => (
              <div key={i} className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">Screen {i + 1}</span>
                  <div className="flex gap-1">
                    <button onClick={() => moveImage(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-accent disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                    <button onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1} className="p-1 rounded hover:bg-accent disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                    <button onClick={() => removeImage(i)} className="p-1 rounded hover:bg-red-500/20 text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
                <ImageUpload 
                  bucket="project-images" 
                  value={img} 
                  onUpload={(url) => updateImage(i, url)} 
                />
              </div>
            ))}
            <button 
              onClick={addImage}
              className="flex flex-col items-center justify-center gap-2 h-[200px] rounded-xl border-2 border-dashed border-border/50 hover:border-foreground/20 hover:bg-accent/30 transition-all text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-6 h-6" />
              <span className="text-[10px] font-mono uppercase">Add Screen</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project title" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20">
              <option value="web">Web</option>
              <option value="fullstack">Fullstack</option>
              <option value="backend">Backend</option>
              <option value="web3">Web3</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Live URL</label>
            <input value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">GitHub URL</label>
            <input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div className="space-y-1.5 col-span-full">
            <label className="text-xs font-mono text-muted-foreground uppercase">Tech Stack (comma separated)</label>
            <input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} placeholder="React, Tailwind, Supabase..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded accent-foreground" />
            Featured Project
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase">Short Description (for cards)</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief summary..." rows={2} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Long Description (Project Details)</label>
            <div className="flex bg-muted/50 p-1 rounded-md">
              <button 
                onClick={() => setLongDescPreview(false)}
                className={cn("px-3 py-1 text-[10px] font-mono uppercase rounded transition-colors", !longDescPreview ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                Edit
              </button>
              <button 
                onClick={() => setLongDescPreview(true)}
                className={cn("px-3 py-1 text-[10px] font-mono uppercase rounded transition-colors", longDescPreview ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                Preview
              </button>
            </div>
          </div>
          
          {longDescPreview ? (
            <div className="min-h-[200px] p-4 rounded-lg border border-border bg-background/50">
              {form.long_description ? (
                <MarkdownRenderer content={form.long_description} />
              ) : (
                <p className="text-sm text-muted-foreground italic">No content to preview.</p>
              )}
            </div>
          ) : (
            <textarea 
              value={form.long_description} 
              onChange={(e) => setForm({ ...form, long_description: e.target.value })} 
              placeholder="Full explanation, technical details, challenges... (Markdown supported)" 
              rows={8} 
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y font-mono" 
            />
          )}
        </div>

        <button onClick={handleSave} className="w-full py-3 bg-foreground text-background text-sm font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />{editing ? "Update Project" : "Create Project"}
        </button>
      </div>

      <div className="mt-12 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground ml-1">Existing Projects ({projects.length})</h3>
        {projects.map((p) => (
          <div key={p.id} className="p-4 rounded-xl border border-border/50 bg-card/30 flex items-start justify-between group hover:bg-card/50 transition-colors">
            <div className="flex gap-4 min-w-0">
              <div className="w-20 h-20 rounded bg-background border border-border/30 flex items-center justify-center overflow-hidden shrink-0">
                {p.images && p.images[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground/20" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm truncate">{p.title}</h3>
                  {p.is_featured && <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-foreground/10 text-foreground/60 tracking-wider">featured</span>}
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-0.5 tracking-tight uppercase">{p.category}</p>
                <p className="text-xs text-muted-foreground/60 line-clamp-1 mt-1">{p.description}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => deleteItem(p.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
