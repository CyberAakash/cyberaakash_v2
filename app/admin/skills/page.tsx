"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Pencil, X, Save, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import type { Skill } from "@/lib/types";
import { cn } from "@/lib/utils";
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

export default function AdminSkills() {
  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    image_url: "",
    is_visible: true,
  });

  const fetchSkills = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("category")
      .order("display_order");
    if (data) setData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const {
    optimisticItems: skills,
    archiveItem,
    restoreItem,
    deleteItem,
    bulkArchive,
    bulkRestore,
    bulkDelete,
  } = useAdminActions(data, "skills", fetchSkills);

  const categories = useMemo(() => {
    const cats = new Set(data.map((s) => s.category.toLowerCase()));
    return Array.from(cats).sort();
  }, [data]);

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ name: "", category: "", image_url: "", is_visible: true });
    setEditing(null);
    setIsFormOpen(false);
  };

  const handleDisplayDetail = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category.trim()) {
      toast.error("Skill name and category are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        name: form.name.trim(),
        category: form.category.trim().toLowerCase(),
        image_url: form.image_url || null,
        is_visible: form.is_visible,
      };

      if (editing) {
        const { error } = await supabase.from("skills").update(payload).eq("id", editing);
        if (error) throw error;
        
        toast.success("Skill updated");
        resetForm();
        fetchSkills();
        if (selectedSkill?.id === editing) {
          const { data: updated } = await supabase.from("skills").select("*").eq("id", editing).single();
          if (updated) setSelectedSkill(updated);
        }
      } else {
        const { error } = await supabase.from("skills").insert({
          ...payload,
          display_order: data.filter((s) => s.category === payload.category).length,
        });
        if (error) throw error;
        
        toast.success("Skill added");
        resetForm();
        fetchSkills();
      }
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const startEdit = (skill: Skill) => {
    setEditing(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      image_url: skill.image_url || "",
      is_visible: skill.is_visible,
    });
    setIsFormOpen(true);
  };

  const toggleVisibility = async (skill: Skill) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("skills")
        .update({ is_visible: !skill.is_visible })
        .eq("id", skill.id);

      if (error) throw error;

      toast.success(skill.is_visible ? "Skill hidden" : "Skill visible");
      fetchSkills();
      if (selectedSkill?.id === skill.id) {
        setSelectedSkill({ ...selectedSkill, is_visible: !skill.is_visible });
      }
    } catch (error: any) {
      toast.error("Error updating visibility");
    } finally {
      setIsSubmitting(false);
    }
  };



  const columns = [
    {
      header: "Skill",
      accessorKey: (skill: Skill) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
            {skill.image_url ? (
              <img src={skill.image_url} alt={skill.name} className="w-full h-full object-contain p-1" />
            ) : (
              <ImageIcon className="w-3 h-3 text-muted-foreground/40" />
            )}
          </div>
          <p className={cn("font-medium text-sm", !skill.is_visible && "text-muted-foreground/50 italic")}>{skill.name}</p>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: (skill: Skill) => (
        <span className="text-[10px] font-mono text-muted-foreground uppercase">{skill.category}</span>
      ),
    },
    {
      header: "Visibility",
      accessorKey: (skill: Skill) => (
        <button 
          onClick={() => toggleVisibility(skill)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            skill.is_visible ? "text-emerald-500 hover:bg-emerald-500/10" : "text-slate-500 hover:bg-slate-500/10"
          )}
          title={skill.is_visible ? "Visible on Portfolio" : "Hidden from Portfolio"}
        >
          {skill.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )
    },
    {
      header: "Status",
      accessorKey: (skill: Skill) => (
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[9px] font-mono px-2 py-0.5 rounded tracking-wider",
            skill.is_archived ? "bg-red-500/10 text-red-500/80" : "bg-emerald-500/10 text-emerald-500/80"
          )}>
            {skill.is_archived ? "archived" : "live"}
          </span>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded" />
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-14 w-full rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-roashe text-foreground">Skills</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Manage your tech stack & visuals</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DrawerContent className="max-w-xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>{editing ? "Edit Skill" : "New Skill"}</DrawerTitle>
            <DrawerDescription>
              {editing ? "Update your skill details and visibility." : "Add a new skill to your portfolio tech stack."}
            </DrawerDescription>
          </DrawerHeader>

          <DrawerScrollArea className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                Media
              </label>
              <ImageUpload 
                bucket="skill-images" 
                value={form.image_url} 
                onUpload={(url) => setForm({ ...form, image_url: url })} 
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Skill Name</label>
                <input 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="e.g. React" 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Category</label>
                <input 
                  value={form.category} 
                  onChange={(e) => setForm({ ...form, category: e.target.value })} 
                  placeholder="e.g. frontend" 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" 
                />
                {categories.length > 0 && !editing && (
                  <p className="text-[10px] text-muted-foreground/50 font-mono mt-1 px-1">
                    Suggestions: {categories.join(", ")}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Visible on Portfolio</label>
                  <p className="text-xs text-muted-foreground">Toggle this skill visibility to the public.</p>
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
            className="flex-1 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              editing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />
            )}
            {isSubmitting ? "Processing..." : editing ? "Update Skill" : "Add Skill"}
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

      <Drawer open={!!selectedSkill} onOpenChange={(open) => !open && setSelectedSkill(null)}>
        <DrawerContent className="max-w-xl mx-auto">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl font-roashe">{selectedSkill?.name}</DrawerTitle>
                <DrawerDescription className="font-mono text-[10px] uppercase tracking-widest mt-1">
                  Skill Details
                </DrawerDescription>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const s = selectedSkill!;
                    setSelectedSkill(null);
                    startEdit(s);
                  }}
                  className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const id = selectedSkill!.id;
                    setSelectedSkill(null);
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
              <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border/50 p-4">
                {selectedSkill?.image_url ? (
                  <img src={selectedSkill.image_url} alt={selectedSkill.name} className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground/20" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30 text-center">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Category</p>
                  <p className="text-sm font-medium uppercase tracking-wider">{selectedSkill?.category}</p>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30 text-center">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Visibility</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", selectedSkill?.is_visible ? "bg-emerald-500" : "bg-slate-500")} />
                    <p className="text-sm font-medium uppercase tracking-wider">
                      {selectedSkill?.is_visible ? "Visible" : "Hidden"}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30 text-center">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", selectedSkill?.is_archived ? "bg-red-500" : "bg-emerald-500")} />
                    <p className="text-sm font-medium uppercase tracking-wider">
                      {selectedSkill?.is_archived ? "Archived" : "Live"}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30 text-center">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Created At</p>
                  <p className="text-sm font-medium">{selectedSkill?.created_at ? new Date(selectedSkill.created_at).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            </div>
          </DrawerScrollArea>
        </DrawerContent>
      </Drawer>

      <AdminTable
        data={skills}
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
        searchPlaceholder="Filter skills..."
      />

    </div>
  );
}
