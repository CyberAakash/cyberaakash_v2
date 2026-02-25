"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Pencil, X, ChevronUp, ChevronDown, Image as ImageIcon, Save, Calendar, Eye, EyeOff } from "lucide-react";
import type { Event } from "@/lib/types";
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

const eventTypes = ["hackathon", "talk", "workshop", "achievement", "community"];

export default function AdminEvents() {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", description: "", content: "", event_date: "", 
    type: "achievement", is_visible: true, is_featured: false, images: [] as string[]
  });
  const [contentPreview, setContentPreview] = useState(false);

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    if (data) setData(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const {
    optimisticItems: events,
    archiveItem,
    restoreItem,
    deleteItem,
    bulkArchive,
    bulkRestore,
    bulkDelete,
  } = useAdminActions(data, "events", fetchData);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ 
      title: "", slug: "", description: "", content: "", 
      event_date: "", type: "achievement", is_visible: true, is_featured: false,
      images: [] 
    });
    setEditing(null);
    setContentPreview(false);
    setIsFormOpen(false);
  };

  const handleDisplayDetail = (e: Event) => {
    setSelectedEvent(e);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.event_date) {
      toast.error("Title and date are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substr(2, 4),
        description: form.description || null,
        content: form.content || null,
        event_date: form.event_date,
        type: form.type,
        is_visible: form.is_visible,
        is_featured: form.is_featured,
        images: form.images.filter(Boolean),
        image_url: form.images[0] || null,
      };

      if (editing) {
        const { error } = await supabase.from("events").update(payload).eq("id", editing);
        if (error) throw error;
        
        toast.success("Event updated");
        resetForm();
        fetchData();
        if (selectedEvent?.id === editing) {
          const { data: updated } = await supabase.from("events").select("*").eq("id", editing).single();
          if (updated) setSelectedEvent(updated);
        }
      } else {
        const { error } = await supabase.from("events").insert({
          ...payload,
          is_archived: false
        });
        if (error) throw error;
        
        toast.success("Event added");
        resetForm();
        fetchData();
      }
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const startEdit = (e: Event) => {
    setEditing(e.id);
    setForm({
      title: e.title,
      slug: e.slug || "",
      description: e.description || "",
      content: e.content || "",
      event_date: e.event_date ? e.event_date.split('T')[0] : "",
      type: e.type || "achievement",
      is_visible: e.is_visible,
      is_featured: e.is_featured ?? false,
      images: e.images || [],
    });
    setIsFormOpen(true);
  };

  const toggleVisibility = async (e: Event) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("events")
        .update({ is_visible: !e.is_visible })
        .eq("id", e.id);

      if (error) throw error;

      toast.success(e.is_visible ? "Hidden" : "Visible");
      fetchData();
      if (selectedEvent?.id === e.id) {
        setSelectedEvent({ ...selectedEvent, is_visible: !e.is_visible });
      }
    } catch (error: any) {
      toast.error("Error updating visibility");
    } finally {
      setIsSubmitting(false);
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
      await deleteImageFromStorage("project-images", imageUrl); // Note: Events currently use "project-images" bucket in the code
      toast.success("Image removed from storage");
    }
    setForm({ ...form, images: form.images.filter((_: any, idx: number) => idx !== i) });
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
      header: "Event",
      accessorKey: (e: Event) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0 border border-border/50 overflow-hidden">
            {e.images && e.images[0] ? (
              <img src={e.images[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <Calendar className="w-5 h-5 text-muted-foreground/50" />
            )}
          </div>
          <div className="min-w-0">
            <p className={cn("font-medium text-sm truncate", !e.is_visible && "text-muted-foreground italic")}>{e.title}</p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">{e.type} · {new Date(e.event_date).toLocaleDateString()}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Visibility",
      accessorKey: (e: Event) => (
        <button 
          onClick={() => toggleVisibility(e)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            e.is_visible ? "text-emerald-500 hover:bg-emerald-500/10" : "text-slate-500 hover:bg-slate-500/10"
          )}
        >
          {e.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )
    },
    {
      header: "Status",
      accessorKey: (e: Event) => (
        <span className={cn(
          "text-[9px] font-mono px-2 py-0.5 rounded tracking-wider uppercase",
          e.is_archived ? "bg-red-500/10 text-red-500/80" : "bg-emerald-500/10 text-emerald-500/80"
        )}>
          {e.is_archived ? "archived" : "active"}
        </span>
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
          <h1 className="text-2xl font-roashe text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Manage events, achievements & community</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DrawerContent className="max-w-5xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>{editing ? "Edit Event" : "New Event"}</DrawerTitle>
            <DrawerDescription>
              Share your milestones, talks, and community contributions.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerScrollArea className="space-y-8">
            {/* Gallery Upload */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground text-center block">Gallery & Assets</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {form.images.map((img: string, i: number) => (
                  <div key={img || i} className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-3 relative group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase">Slot {i + 1}</span>
                      <div className="flex gap-1 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveImage(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-accent disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                        <button onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1} className="p-1 rounded hover:bg-accent disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                        <button onClick={() => removeImage(i)} className="p-1 rounded hover:bg-red-500/20 text-red-500"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <ImageUpload bucket="project-images" value={img} onUpload={(url) => updateImage(i, url)} />
                  </div>
                ))}
                <button 
                  onClick={addImage}
                  className="flex flex-col items-center justify-center gap-2 h-auto py-8 rounded-xl border-2 border-dashed border-border/50 hover:border-foreground/20 hover:bg-accent/30 transition-all text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-mono uppercase">Add Media</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Hackathon Winning Entry" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Date</label>
                <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Category</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all">
                  {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Slug (optional)</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="hackathon-2024" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">One-line Pitch (Card Description)</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A brief summary for the preview card..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none transition-all" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Full Story (Markdown)</label>
                <div className="flex bg-muted p-1 rounded-lg gap-1">
                  <button onClick={() => setContentPreview(false)} className={cn("px-4 py-1.5 text-[10px] font-mono uppercase rounded-sm transition-all", !contentPreview ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground")}>Draft</button>
                  <button onClick={() => setContentPreview(true)} className={cn("px-4 py-1.5 text-[10px] font-mono uppercase rounded-sm transition-all", contentPreview ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground")}>Review</button>
                </div>
              </div>
              {contentPreview ? (
                <div className="min-h-[300px] p-6 rounded-xl border border-border bg-background/50 prose prose-invert prose-sm max-w-none">
                  <MarkdownRenderer content={form.content} />
                </div>
              ) : (
                <textarea 
                  value={form.content} 
                  onChange={(e) => setForm({ ...form, content: e.target.value })} 
                  placeholder="The full narrative of your achievement..." 
                  rows={15} 
                  className="w-full px-4 py-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-foreground/30 transition-all font-mono resize-y" 
                />
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Visible on Portfolio</label>
                <p className="text-xs text-muted-foreground">Toggle public visibility for this event.</p>
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

            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Featured on Homepage</label>
                <p className="text-xs text-muted-foreground">Show this event in the homepage events section.</p>
              </div>
              <button 
                 onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                 className={cn(
                   "w-10 h-5 rounded-full transition-colors relative",
                   form.is_featured ? "bg-primary" : "bg-muted"
                 )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform",
                  form.is_featured ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </div>
          </DrawerScrollArea>
        <DrawerFooter>
          <button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="flex-1 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? "Processing..." : editing ? "Update Event" : "Create Event"}
          </button>
          <button 
            onClick={resetForm} 
            disabled={isSubmitting}
            className="px-8 py-3 bg-muted text-muted-foreground text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accent disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
        </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DrawerContent className="max-w-4xl mx-auto">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl font-roashe">{selectedEvent?.title}</DrawerTitle>
                <DrawerDescription className="font-mono text-[10px] uppercase tracking-widest mt-1">
                  {selectedEvent?.type} · Event Log
                </DrawerDescription>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const e = selectedEvent!;
                    setSelectedEvent(null);
                    startEdit(e);
                  }}
                  className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const id = selectedEvent!.id;
                    setSelectedEvent(null);
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
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Quick Summary</h4>
                  <p className="text-sm leading-relaxed">{selectedEvent?.description || "No short description."}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Media Assets</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedEvent?.images.map((img, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden border border-border/50 bg-muted/30">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {(!selectedEvent?.images || selectedEvent.images.length === 0) && (
                      <div className="aspect-video rounded-lg overflow-hidden border border-border/50 bg-muted/30 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Event Date</p>
                    <p className="text-sm font-medium">{selectedEvent?.event_date && new Date(selectedEvent.event_date).toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2 h-2 rounded-full", selectedEvent?.is_archived ? "bg-red-500" : "bg-emerald-500")} />
                      <p className="text-sm font-medium uppercase tracking-wider">
                        {selectedEvent?.is_archived ? "Archived" : "Active"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Visibility</p>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", selectedEvent?.is_visible ? "bg-emerald-500" : "bg-slate-500")} />
                    <p className="text-sm font-medium uppercase tracking-wider">
                      {selectedEvent?.is_visible ? "Visible" : "Hidden"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-border/30">
              <h4 className="text-sm font-bold uppercase tracking-widest font-roashe text-foreground">Detailed Content</h4>
              <div className="p-6 rounded-2xl border border-border/50 bg-background/50 prose prose-invert max-w-none prose-sm">
                {selectedEvent?.content ? (
                  <MarkdownRenderer content={selectedEvent.content} />
                ) : (
                  <p className="italic text-muted-foreground">No detailed content provided.</p>
                )}
              </div>
            </div>
          </DrawerScrollArea>
        </DrawerContent>
      </Drawer>

      <AdminTable
        data={events}
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
        searchPlaceholder="Filter events..."
      />

    </div>
  );
}
