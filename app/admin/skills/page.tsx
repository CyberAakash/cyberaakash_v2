"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { Skill } from "@/lib/types";
import { toast } from "sonner";

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ name: "", category: "" });
  const [customCategory, setCustomCategory] = useState("");

  // Derive categories dynamically from existing skills
  const categories = useMemo(() => {
    const cats = new Set(skills.map((s) => s.category.toLowerCase()));
    return Array.from(cats).sort();
  }, [skills]);

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

  // Set initial category once skills load
  useEffect(() => {
    if (categories.length > 0 && !newSkill.category) {
      setNewSkill((prev) => ({ ...prev, category: categories[0] }));
    }
  }, [categories, newSkill.category]);

  const addSkill = async () => {
    const category = customCategory.trim() || newSkill.category;
    if (!newSkill.name.trim() || !category) {
      toast.error("Skill name and category are required");
      return;
    }
    const supabase = createClient();
    await supabase.from("skills").insert({
      name: newSkill.name,
      category: category.toLowerCase(),
      display_order: skills.filter((s) => s.category === category).length,
    });
    setNewSkill({ name: "", category: category.toLowerCase() });
    setCustomCategory("");
    toast.success(`Added "${newSkill.name}" to ${category}`);
    fetchSkills();
  };

  const deleteSkill = async (id: string) => {
    const supabase = createClient();
    await supabase.from("skills").delete().eq("id", id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
    toast.success("Skill deleted");
  };

  const toggleVisibility = async (skill: Skill) => {
    const supabase = createClient();
    await supabase
      .from("skills")
      .update({ is_visible: !skill.is_visible })
      .eq("id", skill.id);
    setSkills((prev) =>
      prev.map((s) =>
        s.id === skill.id ? { ...s, is_visible: !s.is_visible } : s
      )
    );
    toast.success(skill.is_visible ? "Skill hidden" : "Skill visible");
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
    <div>
      <h1 className="text-2xl font-roashe">Skills</h1>
      <p className="text-sm text-muted-foreground font-mono mt-1">
        Manage your tech stack
      </p>

      {/* Add new skill */}
      <div className="mt-6 flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Skill Name
          </label>
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            className="mt-1 w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
            placeholder="e.g. React"
          />
        </div>
        <div className="min-w-[140px]">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Category
          </label>
          <select
            value={newSkill.category}
            onChange={(e) => {
              setNewSkill({ ...newSkill, category: e.target.value });
              if (e.target.value !== "__new__") setCustomCategory("");
            }}
            className="mt-1 w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="__new__">+ New category</option>
          </select>
        </div>

        {/* Custom category input — shows when "+ New category" selected */}
        {newSkill.category === "__new__" && (
          <div className="min-w-[140px]">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              New Category
            </label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
              placeholder="e.g. devops"
            />
          </div>
        )}

        <button
          onClick={addSkill}
          className="px-4 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Skills list by category */}
      <div className="mt-8 space-y-8">
        {categories.map((category) => {
          const categorySkills = skills.filter((s) => s.category === category);
          if (categorySkills.length === 0) return null;
          return (
            <div key={category}>
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                {category} <span className="text-muted-foreground/30">({categorySkills.length})</span>
              </h3>
              <div className="space-y-2">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card group"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab" />
                    <span
                      className={`flex-1 text-sm ${
                        !skill.is_visible ? "line-through text-muted-foreground/40" : ""
                      }`}
                    >
                      {skill.name}
                    </span>
                    <button
                      onClick={() => toggleVisibility(skill)}
                      className={`text-xs font-mono px-2 py-1 rounded border transition-colors ${
                        skill.is_visible
                          ? "border-border text-muted-foreground"
                          : "border-border/30 text-muted-foreground/30"
                      }`}
                    >
                      {skill.is_visible ? "visible" : "hidden"}
                    </button>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="text-muted-foreground/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
