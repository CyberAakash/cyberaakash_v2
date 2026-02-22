"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Pencil, X, ChevronUp, ChevronDown, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import type { Event } from "@/lib/types";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/utils";

const eventTypes = ["hackathon", "talk", "workshop", "achievement", "community"];

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", description: "", content: "", event_date: "", 
    type: "achievement", is_visible: true, images: [] as string[]
  });
  const [contentPreview, setContentPreview] = useState(false);

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ 
      title: "", slug: "", description: "", content: "", 
      event_date: "", type: "achievement", is_visible: true, 
      images: [] 
    });
    setEditing(null);
    setContentPreview(false);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.event_date) {
      toast.error("Title and date are required");
      return;
    }
    const supabase = createClient();
    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substr(2, 4),
      description: form.description || null,
      content: form.content || null,
      event_date: form.event_date,
      type: form.type,
      is_visible: form.is_visible,
      images: form.images.filter(Boolean),
      image_url: form.images[0] || null,
    };

    if (editing) {
      const { error } = await supabase.from("events").update(payload).eq("id", editing);
      if (error) toast.error("Error updating event: " + error.message);
      else toast.success("Event updated");
    } else {
      const { error } = await supabase.from("events").insert(payload);
      if (error) toast.error("Error adding event: " + error.message);
      else toast.success("Event added");
    }
    resetForm();
    fetchData();
  };

  const startEdit = (e: Event) => {
    setEditing(e.id);
    setForm({
      title: e.title,
      slug: e.slug || "",
      description: e.description || "",
      content: e.content || "",
      event_date: e.event_date,
      type: e.type || "achievement",
      is_visible: e.is_visible,
      images: e.images || [],
    });
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error("Error deleting event: " + error.message);
    else {
      setEvents((prev: Event[]) => prev.filter((e: Event) => e.id !== id));
      toast.success("Event deleted");
    }
  };

  const addImage = () => setForm({ ...form, images: [...form.images, ""] });
  const updateImage = (i: number, url: string) => {
    const next = [...form.images];
    next[i] = url;
    setForm({ ...form, images: next });
  };
  const removeImage = (i: number) => {
    setForm({ ...form, images: form.images.filter((_: any, idx: number) => idx !== i) });
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
      <h1 className="text-2xl font-roashe">Events</h1>
      <p className="text-sm text-muted-foreground font-mono mt-1">Manage events, hackathons & achievements</p>

      <div className="mt-6 p-6 rounded-2xl border border-border bg-card space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {editing ? "Edit Event" : "Add Event"}
          </h3>
          {editing && <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>}
        </div>

        {/* Image Gallery */}
        <div className="space-y-4">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Event Gallery</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {form.images.map((img: string, i: number) => (
              <div key={i} className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">Image {i + 1}</span>
                  <div className="flex gap-1">
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
              className="flex flex-col items-center justify-center gap-2 h-[200px] rounded-xl border-2 border-dashed border-border/50 hover:border-foreground/20 hover:bg-accent/30 transition-all text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-6 h-6" />
              <span className="text-[10px] font-mono uppercase">Add Image</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="url-slug" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Date</label>
            <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none">
              {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
            <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} className="rounded accent-foreground" />
            Visible on Portfolio
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase">Short Description (for cards)</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief summary..." rows={2} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none resize-none" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Full Story (Event Detail - Markdown)</label>
            <div className="flex bg-muted/50 p-1 rounded-md">
              <button onClick={() => setContentPreview(false)} className={cn("px-3 py-1 text-[10px] font-mono uppercase rounded", !contentPreview ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}>Edit</button>
              <button onClick={() => setContentPreview(true)} className={cn("px-3 py-1 text-[10px] font-mono uppercase rounded", contentPreview ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}>Preview</button>
            </div>
          </div>
          {contentPreview ? (
            <div className="min-h-[200px] p-4 rounded-lg border border-border bg-background/50">
              <MarkdownRenderer content={form.content} />
            </div>
          ) : (
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Tell the full story of the event... (Markdown supported)" rows={8} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none resize-y font-mono" />
          )}
        </div>

        <button onClick={handleSave} className="w-full py-3 bg-foreground text-background text-sm font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />{editing ? "Update Event" : "Create Event"}
        </button>
      </div>

      <div className="mt-12 space-y-4">
        {events.map((e: Event) => (
          <div key={e.id} className="p-4 rounded-xl border border-border/50 bg-card/30 flex items-start justify-between group hover:bg-card/50 transition-colors">
            <div className="flex gap-4 min-w-0">
              <div className="w-20 h-20 rounded bg-background border border-border/30 flex items-center justify-center overflow-hidden shrink-0">
                {e.images && e.images[0] ? <img src={e.images[0]} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-muted-foreground/20" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm truncate">{e.title}</h3>
                  {!e.is_visible && <EyeOff className="w-3 h-3 text-muted-foreground" />}
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-0.5 uppercase">{e.type} · {new Date(e.event_date).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground/60 line-clamp-1 mt-1">{e.description}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => startEdit(e)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground h-fit"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => deleteItem(e.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground h-fit hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
