"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, X, Globe, Share2, Save, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import type { Social } from "@/lib/types";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/image-upload";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdminActions } from "@/lib/hooks/use-admin-actions";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerFooter,
  DrawerScrollArea
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export default function AdminSocials() {
  const [data, setData] = useState<Social[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    url: "",
    image_url: "",
    is_visible: true,
  });

  const fetchSocials = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("socials")
      .select("*")
      .order("display_order");
    if (data) setData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const {
    optimisticItems: socials,
    archiveItem,
    restoreItem,
    deleteItem,
    bulkArchive,
    bulkRestore,
    bulkDelete,
  } = useAdminActions(data, "socials", fetchSocials);

  const [selectedSocial, setSelectedSocial] = useState<Social | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ name: "", description: "", url: "", image_url: "", is_visible: true });
    setEditing(null);
    setIsFormOpen(false);
  };

  const handleDisplayDetail = (social: Social) => {
    setSelectedSocial(social);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.url.trim()) {
      toast.error("Name and URL are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        url: form.url.trim(),
        image_url: form.image_url || null,
        is_visible: form.is_visible,
      };

      if (editing) {
        const { error } = await supabase.from("socials").update(payload).eq("id", editing);
        if (error) throw error;
        
        toast.success("Social link updated");
        resetForm();
        fetchSocials();
        if (selectedSocial?.id === editing) {
          const { data: updated } = await supabase.from("socials").select("*").eq("id", editing).single();
          if (updated) setSelectedSocial(updated);
        }
      } else {
        const { error } = await supabase.from("socials").insert({
          ...payload,
          display_order: data.length,
        });
        if (error) throw error;
        
        toast.success("Social link added");
        resetForm();
        fetchSocials();
      }
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const startEdit = (social: Social) => {
    setEditing(social.id);
    setForm({
      name: social.name,
      description: social.description || "",
      url: social.url,
      image_url: social.image_url || "",
      is_visible: social.is_visible,
    });
    setIsFormOpen(true);
  };

  const toggleVisibility = async (social: Social) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("socials")
        .update({ is_visible: !social.is_visible })
        .eq("id", social.id);

      if (error) throw error;

      toast.success(social.is_visible ? "Hidden" : "Visible");
      fetchSocials();
      if (selectedSocial?.id === social.id) {
        setSelectedSocial({ ...selectedSocial, is_visible: !social.is_visible });
      }
    } catch (error: any) {
      toast.error("Error updating visibility");
    } finally {
      setIsSubmitting(false);
    }
  };


  const columns = [
    {
      header: "Platform",
      accessorKey: (social: Social) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/50 p-1">
            {social.image_url ? (
              <img src={social.image_url} alt={social.name} className="w-full h-full object-contain" />
            ) : (
              <Share2 className="w-4 h-4 text-muted-foreground/40" />
            )}
          </div>
          <div>
            <p className={cn("font-medium text-sm", !social.is_visible && "text-muted-foreground italic")}>{social.name}</p>
            <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[200px]">{social.url}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Visibility",
      accessorKey: (social: Social) => (
        <button 
          onClick={() => toggleVisibility(social)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            social.is_visible ? "text-emerald-500 hover:bg-emerald-500/10" : "text-slate-500 hover:bg-slate-500/10"
          )}
        >
          {social.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )
    },
    {
      header: "Status",
      accessorKey: (social: Social) => (
        <span className={cn(
          "text-[9px] font-mono px-2 py-0.5 rounded tracking-wider",
          social.is_archived ? "bg-red-500/10 text-red-500/80" : "bg-emerald-500/10 text-emerald-500/80"
        )}>
          {social.is_archived ? "archived" : "live"}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded" />
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14 w-full rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-roashe text-foreground">Social Links</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Manage your online presence</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Social
        </button>
      </div>

      <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DrawerContent className="max-w-xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>{editing ? "Edit Social Link" : "New Social Link"}</DrawerTitle>
            <DrawerDescription>
              Manage how others connect with you across platforms.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerScrollArea>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block text-center md:text-left">
                Icon/Logo
              </label>
              <div className="max-w-[200px] mx-auto md:mx-0">
                <ImageUpload 
                  bucket="social-images" 
                  value={form.image_url} 
                  onUpload={(url) => setForm({ ...form, image_url: url })} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Platform Name</label>
                <input 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="e.g. LinkedIn" 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Profile URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                  <input 
                    value={form.url} 
                    onChange={(e) => setForm({ ...form, url: e.target.value })} 
                    placeholder="https://..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Description (Optional)</label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  placeholder="e.g. Let's connect professionally" 
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all resize-none" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Visible on Portfolio</label>
                <p className="text-xs text-muted-foreground">Toggle this link visibility to the public.</p>
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
            className="flex-1 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? "Processing..." : editing ? "Update Social" : "Add Social"}
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

      <Drawer open={!!selectedSocial} onOpenChange={(open) => !open && setSelectedSocial(null)}>
        <DrawerContent className="max-w-xl mx-auto">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl font-roashe">{selectedSocial?.name}</DrawerTitle>
                <DrawerDescription className="font-mono text-[10px] uppercase tracking-widest mt-1">
                  Social Presence
                </DrawerDescription>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const s = selectedSocial!;
                    setSelectedSocial(null);
                    startEdit(s);
                  }}
                  className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const id = selectedSocial!.id;
                    setSelectedSocial(null);
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
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border/50 bg-muted/30 p-4 flex items-center justify-center">
                {selectedSocial?.image_url ? (
                  <img src={selectedSocial.image_url} alt="" className="w-full h-full object-contain" />
                ) : (
                  <Share2 className="w-10 h-10 text-muted-foreground/20" />
                )}
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm leading-relaxed max-w-sm mx-auto">{selectedSocial?.description || "No description provided."}</p>
                <a 
                  href={selectedSocial?.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-primary hover:underline underline-offset-4"
                >
                  <Globe className="w-3 h-3" />
                  {selectedSocial?.url}
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Visibility</p>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", selectedSocial?.is_visible ? "bg-emerald-500" : "bg-slate-500")} />
                    <p className="text-sm font-medium uppercase tracking-wider">
                      {selectedSocial?.is_visible ? "Visible" : "Hidden"}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", selectedSocial?.is_archived ? "bg-red-500" : "bg-emerald-500")} />
                    <p className="text-sm font-medium uppercase tracking-wider">
                      {selectedSocial?.is_archived ? "Archived" : "Live"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DrawerScrollArea>
        </DrawerContent>
      </Drawer>

      <AdminTable
        data={socials}
        columns={columns}
        onEdit={startEdit}
        onView={handleDisplayDetail}
        onArchive={archiveItem}
        onRestore={restoreItem}
        onDelete={deleteItem}
        onBulkArchive={bulkArchive}
        onBulkRestore={bulkRestore}
        onBulkDelete={bulkDelete}
        searchKey="name"
        searchPlaceholder="Filter socials..."
      />

    </div>
  );
}
