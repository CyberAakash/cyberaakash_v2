"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Pencil, X, ImageIcon, Eye, EyeOff, Save } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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

export default function AdminGallery() {
  const [data, setData] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    image_url: "",
    title: "",
    description: "",
    is_visible: true,
  });

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("gallery").select("*").order("display_order");
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
  } = useAdminActions(data, "gallery", fetchData);

  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ 
      image_url: "",
      title: "",
      description: "",
      is_visible: true,
    });
    setEditing(null);
    setIsFormOpen(false);
  };

  const handleDisplayDetail = (item: GalleryItem) => {
    setSelectedGalleryItem(item);
  };

  const handleSave = async () => {
    if (!form.image_url.trim()) {
      toast.error("Image is required");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        image_url: form.image_url,
        title: form.title || null,
        description: form.description || null,
        is_visible: form.is_visible,
        display_order: editing ? undefined : data.length,
      };

      if (editing) {
        const { error } = await supabase.from("gallery").update(payload).eq("id", editing);
        if (error) throw error;
        
        toast.success("Gallery updated");
        resetForm();
        fetchData();
        if (selectedGalleryItem?.id === editing) {
          const { data: updated } = await supabase.from("gallery").select("*").eq("id", editing).single();
          if (updated) setSelectedGalleryItem(updated);
        }
      } else {
        const { error } = await supabase.from("gallery").insert(payload);
        if (error) throw error;
        
        toast.success("Image added to gallery");
        resetForm();
        fetchData();
      }
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (item: GalleryItem) => {
    setEditing(item.id);
    setForm({
      image_url: item.image_url,
      title: item.title || "",
      description: item.description || "",
      is_visible: item.is_visible,
    });
    setIsFormOpen(true);
  };

  const toggleVisibility = async (item: GalleryItem) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("gallery")
        .update({ is_visible: !item.is_visible })
        .eq("id", item.id);

      if (error) throw error;

      toast.success(item.is_visible ? "Hidden" : "Visible");
      fetchData();
      if (selectedGalleryItem?.id === item.id) {
        setSelectedGalleryItem({ ...selectedGalleryItem, is_visible: !item.is_visible });
      }
    } catch (error: any) {
      toast.error("Error updating visibility");
    } finally {
      setIsSubmitting(false);
    }
  };



  const columns = [
    {
      header: "Image",
      accessorKey: (item: GalleryItem) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title || "Gallery Item"} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
            )}
          </div>
          <div className="min-w-0">
            <p className={cn("font-medium text-sm truncate", !item.is_visible && "text-muted-foreground italic")}>
              {item.title || "Untitled Image"}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase truncate">
              {item.description || "No description"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Visibility",
      accessorKey: (item: GalleryItem) => (
        <button 
          onClick={() => toggleVisibility(item)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            item.is_visible ? "text-emerald-500 hover:bg-emerald-500/10" : "text-slate-500 hover:bg-slate-500/10"
          )}
        >
          {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )
    },
  ];

  return (
    <div className="pb-20 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-roashe text-foreground">Gallery</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Manage visual content for your portfolio</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>
      </div>

      <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DrawerContent className="max-w-2xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>{editing ? "Edit Gallery Item" : "New Gallery Item"}</DrawerTitle>
            <DrawerDescription>
              Upload and manage your gallery images.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerScrollArea className="space-y-6 py-4">
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground text-center block">
                Gallery Image
              </label>
              <div className="max-w-xs mx-auto">
                <ImageUpload 
                  bucket="gallery-images" 
                  value={form.image_url} 
                  onUpload={(url) => setForm({ ...form, image_url: url })} 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Title</label>
                <input 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  placeholder="Image title" 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" 
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  placeholder="Optional description..." 
                  rows={3} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all resize-none" 
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Visible on Gallery</label>
                  <p className="text-xs text-muted-foreground">Toggle public visibility for this image.</p>
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
              {isSubmitting ? "Processing..." : editing ? "Update Item" : "Add to Gallery"}
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

      <Drawer open={!!selectedGalleryItem} onOpenChange={(open) => !open && setSelectedGalleryItem(null)}>
        <DrawerContent className="max-w-2xl mx-auto">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl font-roashe">{selectedGalleryItem?.title || "Untitled Image"}</DrawerTitle>
                <DrawerDescription className="font-mono text-[10px] uppercase tracking-widest mt-1">
                  Gallery Item Details
                </DrawerDescription>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const item = selectedGalleryItem!;
                    setSelectedGalleryItem(null);
                    startEdit(item);
                  }}
                  className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const id = selectedGalleryItem!.id;
                    setSelectedGalleryItem(null);
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
              <div className="w-full aspect-video rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border/50">
                {selectedGalleryItem?.image_url ? (
                  <img src={selectedGalleryItem.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30 text-center col-span-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Description</p>
                  <p className="text-sm leading-relaxed">{selectedGalleryItem?.description || "No description provided."}</p>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30 text-center">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Visibility</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", selectedGalleryItem?.is_visible ? "bg-emerald-500" : "bg-slate-500")} />
                    <p className="text-sm font-medium uppercase tracking-wider">
                      {selectedGalleryItem?.is_visible ? "Visible" : "Hidden"}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30 text-center">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", selectedGalleryItem?.is_archived ? "bg-red-500" : "bg-emerald-500")} />
                    <p className="text-sm font-medium uppercase tracking-wider">
                      {selectedGalleryItem?.is_archived ? "Archived" : "Live"}
                    </p>
                  </div>
                </div>
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
        searchPlaceholder="Filter images..."
      />

    </div>
  );
}
