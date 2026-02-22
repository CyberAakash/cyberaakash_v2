"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, GripVertical, Pencil, X, Save, Eye, EyeOff } from "lucide-react";
import type { Skill } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/image-upload";

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    image_url: "",
  });

  const fetchSkills = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("category")
      .order("display_order");
    if (data) setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Derive unique categories for auto-suggestions or groupings
  const categories = useMemo(() => {
    const cats = new Set(skills.map((s) => s.category.toLowerCase()));
    return Array.from(cats).sort();
  }, [skills]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.category.trim()) {
      toast.error("Skill name and category are required");
      return;
    }

    const supabase = createClient();
    const payload = {
      name: form.name.trim(),
      category: form.category.trim().toLowerCase(),
      image_url: form.image_url || null,
    };

    if (editing) {
      const { error } = await supabase
        .from("skills")
        .update(payload)
        .eq("id", editing);
      
      if (error) {
        toast.error("Error updating skill: " + error.message);
      } else {
        toast.success("Skill updated");
        setEditing(null);
      }
    } else {
      const { error } = await supabase
        .from("skills")
        .insert({
          ...payload,
          display_order: skills.filter((s) => s.category === payload.category).length,
        });

      if (error) {
        toast.error("Error adding skill: " + error.message);
      } else {
        toast.success("Skill added");
      }
    }

    setForm({ name: "", category: "", image_url: "" });
    fetchSkills();
  };

  const startEdit = (skill: Skill) => {
    setEditing(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      image_url: skill.image_url || "",
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: "", category: "", image_url: "" });
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) {
      toast.error("Error deleting skill");
    } else {
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success("Skill deleted");
    }
  };

  const toggleVisibility = async (skill: Skill) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("skills")
      .update({ is_visible: !skill.is_visible })
      .eq("id", skill.id);

    if (error) {
      toast.error("Error updating visibility");
    } else {
      setSkills((prev) =>
        prev.map((s) =>
          s.id === skill.id ? { ...s, is_visible: !s.is_visible } : s
        )
      );
      toast.success(skill.is_visible ? "Skill hidden" : "Skill visible");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-roashe">Skills</h1>
      <p className="text-sm text-muted-foreground font-mono mt-1">
        Manage your tech stack & visuals
      </p>

      {/* Add/Edit Form */}
      <div className="mt-6 p-6 rounded-2xl border border-border bg-card space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {editing ? "Edit Skill" : "Add New Skill"}
          </h3>
          {editing && (
            <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-40 shrink-0">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-2">
              Skill Media
            </label>
            <ImageUpload 
              bucket="skill-images" 
              value={form.image_url} 
              onUpload={(url) => setForm({ ...form, image_url: url })} 
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Skill Name</label>
                <input 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="e.g. React" 
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Category</label>
                <input 
                  value={form.category} 
                  onChange={(e) => setForm({ ...form, category: e.target.value })} 
                  placeholder="e.g. frontend" 
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" 
                />
                 {categories.length > 0 && !editing && (
                   <p className="text-[10px] text-muted-foreground/50 font-mono mt-1">
                     Suggestions: {categories.join(", ")}
                   </p>
                 )}
              </div>
            </div>

            <button 
              onClick={handleSave} 
              className="w-full py-3 bg-foreground text-background text-sm font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {editing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editing ? "Update Skill" : "Add Skill"}
            </button>
          </div>
        </div>
      </div>

      {/* Skills list by category */}
      <div className="mt-12 space-y-10">
        {categories.length === 0 ? (
          <p className="text-center text-muted-foreground font-mono text-sm py-12">No skills added yet.</p>
        ) : (
          categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            if (categorySkills.length === 0) return null;
            return (
              <div key={category} className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  {category} ({categorySkills.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/30 group hover:bg-card/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-background border border-border/30 flex items-center justify-center overflow-hidden shrink-0">
                        {skill.image_url ? (
                          <img src={skill.image_url} alt={skill.name} className="w-full h-full object-contain p-1.5" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground/30 font-mono uppercase">
                            icon
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          "text-sm font-medium block truncate",
                          !skill.is_visible && "opacity-40 line-through"
                        )}>
                          {skill.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleVisibility(skill)}
                          className={cn(
                            "p-1.5 rounded-md hover:bg-accent text-muted-foreground",
                            !skill.is_visible && "text-muted-foreground/40"
                          )}
                          title={skill.is_visible ? "Hide skill" : "Show skill"}
                        >
                          {skill.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => startEdit(skill)}
                          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"
                          title="Edit skill"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSkill(skill.id)}
                          className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                          title="Delete skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
