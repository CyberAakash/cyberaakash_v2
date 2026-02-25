"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Pencil, X, ChevronUp, ChevronDown, Image as ImageIcon, Eye, EyeOff, Save } from "lucide-react";
import type { Project } from "@/lib/types";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/utils";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdminActions } from "@/lib/hooks/use-admin-actions";
import { deleteImageFromStorage } from "@/lib/supabase/storage";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerFooter,
  DrawerScrollArea
} from "@/components/ui/drawer";

export default function AdminProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", long_description: "", tech_stack: "", category: "web",
    live_url: "", github_url: "", is_featured: false, images: [] as string[], is_visible: true,
  });
  const [longDescPreview, setLongDescPreview] = useState(false);

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("projects").select("*").order("display_order");
    if (data) setData(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const {
    optimisticItems,
    archiveItem,
    restoreItem,
    deleteItem,
    bulkArchive,
    bulkRestore,
    bulkDelete,
  } = useAdminActions(data, "projects", fetchData);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ 
      title: "", description: "", long_description: "", tech_stack: "", 
      category: "web", live_url: "", github_url: "", is_featured: false, 
      images: [], is_visible: true,
    });
    setEditing(null);
    setIsFormOpen(false);
  };

  const handleDisplayDetail = (p: Project) => {
    setSelectedProject(p);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Project title is required");
      return;
    }
    
    setIsSubmitting(true);
    try {
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
        image_url: form.images[0] || null,
        tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
        is_visible: form.is_visible,
        display_order: editing ? undefined : data.length,
      };

      if (editing) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editing);
        if (error) throw error;
        
        toast.success("Project updated");
        resetForm();
        fetchData();
        if (selectedProject?.id === editing) {
          const { data: updated } = await supabase.from("projects").select("*").eq("id", editing).single();
          if (updated) setSelectedProject(updated);
        }
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
        
        toast.success("Project added");
        resetForm();
        fetchData();
      }
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
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
      is_visible: p.is_visible,
    });
    setIsFormOpen(true);
  };

  const toggleVisibility = async (p: Project) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update({ is_visible: !p.is_visible })
      .eq("id", p.id);

    if (error) toast.error("Error updating visibility");
    else {
      toast.success(p.is_visible ? "Hidden" : "Visible");
      fetchData();
      if (selectedProject?.id === p.id) {
        setSelectedProject({ ...selectedProject, is_visible: !p.is_visible });
      }
    }
  };


  const addImage = () => setForm({ ...form, images: [...form.images, ""] });
  const updateImage = (i: number, url: string) => {
    const next = [...form.images];
    next[i] = url;
    setForm({ ...form, images: next });
  };
  const removeImage = async (i: number) => {
    const imageUrl = form.images[i];
    if (imageUrl) {
      await deleteImageFromStorage("project-images", imageUrl);
      toast.success("Image removed from storage");
    }
    setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });
  };
  const moveImage = (i: number, delta: number) => {
    const next = [...form.images];
    const target = i + delta;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    setForm({ ...form, images: next });
  };

  const columns = [
    {
      header: "Project",
      accessorKey: (p: Project) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
            {p.images && p.images[0] ? (
              <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
            )}
          </div>
          <div className="min-w-0">
            <p className={cn("font-medium text-sm truncate", !p.is_visible && "text-muted-foreground italic")}>{p.title}</p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">{p.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Visibility",
      accessorKey: (p: Project) => (
        <button 
          onClick={() => toggleVisibility(p)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            p.is_visible ? "text-emerald-500 hover:bg-emerald-500/10" : "text-slate-500 hover:bg-slate-500/10"
          )}
        >
          {p.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )
    },
    {
      header: "Status",
      accessorKey: (p: Project) => (
        <div className="flex items-center gap-2">
          {p.is_featured && (
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500/80 tracking-wider">featured</span>
          )}
          <span className={cn(
            "text-[9px] font-mono px-2 py-0.5 rounded tracking-wider",
            p.is_archived ? "bg-red-500/10 text-red-500/80" : "bg-emerald-500/10 text-emerald-500/80"
          )}>
            {p.is_archived ? "archived" : "live"}
          </span>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-lg" />)}</div>;
  }

  return (
    <div className="pb-20 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-roashe text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Manage, archive, and organize your work</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DrawerContent className="max-w-5xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>{editing ? "Edit Project" : "New Project"}</DrawerTitle>
            <DrawerDescription>
              Showcase your work with detailed descriptions and images.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerScrollArea className="space-y-6 py-4">
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground text-center block">
                Project Gallery
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {form.images.map((img, i) => (
                  <div key={img || i} className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-3 relative group">
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
                  className="flex flex-col items-center justify-center gap-2 h-auto py-8 rounded-xl border-2 border-dashed border-border/50 hover:border-foreground/20 hover:bg-accent/30 transition-all text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-[10px] font-mono uppercase">Add Screen</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project title" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all">
                  <option value="web">Web</option>
                  <option value="fullstack">Fullstack</option>
                  <option value="backend">Backend</option>
                  <option value="web3">Web3</option>
                  <option value="mobile">Mobile</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Live URL</label>
                <input value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">GitHub URL</label>
                <input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
              <div className="space-y-1.5 col-span-full">
                <label className="text-xs font-mono text-muted-foreground uppercase">Tech Stack (comma separated)</label>
                <input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} placeholder="React, Tailwind, Supabase..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded accent-foreground w-4 h-4" />
                Featured Project
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">Short Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief summary..." rows={2} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all resize-none" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Detailed Description (Markdown)</label>
                <div className="flex bg-muted p-1 rounded-lg gap-1">
                  <button onClick={() => setLongDescPreview(false)} className={cn("px-3 py-1 text-[10px] font-mono uppercase rounded transition-all", !longDescPreview ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground")}>Edit</button>
                  <button onClick={() => setLongDescPreview(true)} className={cn("px-3 py-1 text-[10px] font-mono uppercase rounded transition-all", longDescPreview ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground")}>Preview</button>
                </div>
              </div>
              {longDescPreview ? (
                <div className="min-h-[200px] p-4 rounded-xl border border-border bg-background/50">
                  {form.long_description ? <MarkdownRenderer content={form.long_description} /> : <p className="text-sm text-muted-foreground italic">No content to preview.</p>}
                </div>
              ) : (
                <textarea value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} placeholder="Full technical explanation..." rows={8} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all resize-y font-mono" />
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Visible on Portfolio</label>
                <p className="text-xs text-muted-foreground">Toggle public visibility for this project.</p>
              </div>
              <button 
                 onClick={() => setForm({ ...form, is_visible: !form.is_visible })}
                 className={cn(
                   "w-10 h-5 rounded-full transition-colors relative",
                   form.is_visible ? "bg-primary" : "bg-muted"
                 )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform",
                  form.is_visible ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </div>

          </DrawerScrollArea>
        <DrawerFooter>
          <button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="flex-1 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? "Processing..." : editing ? "Update Project" : "Create Project"}
          </button>
          <button 
            onClick={resetForm} 
            disabled={isSubmitting}
            className="px-8 py-3 bg-muted text-muted-foreground text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accent disabled:opacity-50"
          >
            Cancel
          </button>
        </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DrawerContent className="max-w-5xl mx-auto">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl font-roashe">{selectedProject?.title}</DrawerTitle>
                <DrawerDescription className="font-mono text-[10px] uppercase tracking-widest mt-1">
                  Project Details
                </DrawerDescription>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const p = selectedProject!;
                    setSelectedProject(null);
                    startEdit(p);
                  }}
                  className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const id = selectedProject!.id;
                    setSelectedProject(null);
                    deleteItem(id);
                  }}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </DrawerHeader>

          <DrawerScrollArea className="space-y-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Gallery</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProject?.images?.map((img, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden border border-border/50">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Short Description</h4>
                  <p className="text-sm leading-relaxed">{selectedProject?.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Category</p>
                    <p className="text-sm font-medium uppercase tracking-wider">{selectedProject?.category}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Live URL</p>
                    {selectedProject?.live_url ? (
                      <a href={selectedProject.live_url} target="_blank" className="text-sm font-medium text-primary hover:underline truncate block">
                        {selectedProject.live_url}
                      </a>
                    ) : <p className="text-sm italic text-muted-foreground">Not set</p>}
                  </div>
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2 h-2 rounded-full", selectedProject?.is_archived ? "bg-red-500" : "bg-emerald-500")} />
                      <p className="text-sm font-medium uppercase tracking-wider">
                        {selectedProject?.is_archived ? "Archived" : "Live"}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Featured</p>
                    <p className="text-sm font-medium uppercase tracking-wider">{selectedProject?.is_featured ? "Yes" : "No"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject?.tech_stack.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-foreground/5 text-[10px] font-mono border border-border/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-border/30">
              <h4 className="text-sm font-bold uppercase tracking-widest font-roashe">Detailed Content</h4>
              <div className="p-6 rounded-2xl border border-border/50 bg-background/50 prose prose-invert max-w-none prose-sm">
                {selectedProject?.long_description ? (
                  <MarkdownRenderer content={selectedProject.long_description} />
                ) : (
                  <p className="italic text-muted-foreground">No detailed content provided.</p>
                )}
              </div>
            </div>
          </DrawerScrollArea>
        </DrawerContent>
      </Drawer>

      <AdminTable
        data={optimisticItems}
        columns={columns}
        onEdit={startEdit}
        onView={handleDisplayDetail}
        onArchive={archiveItem}
        onRestore={restoreItem}
        onDelete={deleteItem}
        onBulkArchive={bulkArchive}
        onBulkRestore={bulkRestore}
        onBulkDelete={bulkDelete}
        searchKey="title"
        searchPlaceholder="Filter projects..."
      />

    </div>
  );
}
