"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Pencil, X, ChevronUp, ChevronDown } from "lucide-react";
import type { Experience } from "@/lib/types";
import { toast } from "sonner";

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    role: "", company: "", type: "full-time", start_date: "", end_date: "",
    bullets: [""] as string[], tech_stack: "",
  });

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("experiences").select("*").order("display_order");
    if (data) setExperiences(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ role: "", company: "", type: "full-time", start_date: "", end_date: "", bullets: [""], tech_stack: "" });
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.role.trim() || !form.company.trim() || !form.start_date) {
      toast.error("Role, company, and start date are required");
      return;
    }
    const supabase = createClient();
    const payload = {
      role: form.role, company: form.company, type: form.type,
      start_date: form.start_date, end_date: form.end_date || null,
      description: form.bullets.filter(Boolean),
      tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
      display_order: editing ? undefined : experiences.length,
    };

    if (editing) {
      await supabase.from("experiences").update(payload).eq("id", editing);
      toast.success("Experience updated");
    } else {
      await supabase.from("experiences").insert(payload);
      toast.success("Experience added");
    }
    resetForm();
    fetchData();
  };

  const startEdit = (exp: Experience) => {
    setEditing(exp.id);
    const bullets = Array.isArray(exp.description) ? exp.description : exp.description ? [String(exp.description)] : [""];
    setForm({
      role: exp.role, company: exp.company, type: exp.type || "full-time",
      start_date: exp.start_date, end_date: exp.end_date || "",
      bullets: bullets.length > 0 ? bullets : [""],
      tech_stack: exp.tech_stack.join(", "),
    });
  };

  const deleteItem = async (id: string) => {
    const supabase = createClient();
    await supabase.from("experiences").delete().eq("id", id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    toast.success("Experience deleted");
  };

  // Bullet point helpers
  const updateBullet = (index: number, value: string) => {
    const updated = [...form.bullets];
    updated[index] = value;
    setForm({ ...form, bullets: updated });
  };

  const addBullet = () => {
    setForm({ ...form, bullets: [...form.bullets, ""] });
  };

  const removeBullet = (index: number) => {
    if (form.bullets.length <= 1) return;
    setForm({ ...form, bullets: form.bullets.filter((_, i) => i !== index) });
  };

  const moveBullet = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= form.bullets.length) return;
    const updated = [...form.bullets];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setForm({ ...form, bullets: updated });
  };

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-lg" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-roashe">Experience</h1>
      <p className="text-sm text-muted-foreground font-mono mt-1">Manage work experience</p>

      {/* Form */}
      <div className="mt-6 p-5 rounded-xl border border-border/50 bg-card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{editing ? "Edit Experience" : "Add Experience"}</h3>
          {editing && <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20">
            <option value="full-time">Full-time</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
          <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} placeholder="End date (empty = present)" className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          <input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} placeholder="Tech stack (comma separated)" className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </div>

        {/* Bullet points */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Description (bullet points)
          </label>
          {form.bullets.map((bullet, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground/40 w-5 text-right shrink-0">{i + 1}.</span>
              <input
                value={bullet}
                onChange={(e) => updateBullet(i, e.target.value)}
                placeholder={`Point ${i + 1}`}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
              <div className="flex gap-0.5 shrink-0">
                <button onClick={() => moveBullet(i, -1)} disabled={i === 0} className="p-1.5 rounded hover:bg-accent/50 disabled:opacity-20 transition-colors">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button onClick={() => moveBullet(i, 1)} disabled={i === form.bullets.length - 1} className="p-1.5 rounded hover:bg-accent/50 disabled:opacity-20 transition-colors">
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button onClick={() => removeBullet(i)} disabled={form.bullets.length <= 1} className="p-1.5 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-500 disabled:opacity-20 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={addBullet} className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mt-1">
            <Plus className="w-3 h-3" /> Add point
          </button>
        </div>

        <button onClick={handleSave} className="px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-4 h-4" />{editing ? "Update" : "Add"}
        </button>
      </div>

      {/* List */}
      <div className="mt-8 space-y-3">
        {experiences.map((exp) => (
          <div key={exp.id} className="p-4 rounded-xl border border-border/50 bg-card flex items-start justify-between group">
            <div>
              <h3 className="font-medium text-sm">{exp.role}</h3>
              <p className="text-xs text-muted-foreground font-mono">{exp.company} · {exp.type}</p>
              {Array.isArray(exp.description) && exp.description.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {exp.description.map((point, i) => (
                    <li key={i} className="text-xs text-muted-foreground/60 flex gap-2">
                      <span className="text-muted-foreground/30 shrink-0">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              {exp.tech_stack.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">{exp.tech_stack.map((t) => <span key={t} className="text-xs font-mono px-2 py-0.5 rounded border border-border/50 text-muted-foreground/60">{t}</span>)}</div>
              )}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(exp)} className="text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => deleteItem(exp.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
