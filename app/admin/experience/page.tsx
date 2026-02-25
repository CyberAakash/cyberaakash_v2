"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Pencil, X, Save, Briefcase, Eye, EyeOff } from "lucide-react";
import type { Experience } from "@/lib/types";
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

export default function AdminExperience() {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    role: "", company: "", type: "full-time", start_date: "", end_date: "",
    bullets: [""] as string[], tech_stack: "", is_visible: true,
  });

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("experiences").select("*").order("display_order");
    if (data) setData(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const {
    optimisticItems: experiences,
    archiveItem,
    restoreItem,
    deleteItem,
    bulkArchive,
    bulkRestore,
    bulkDelete,
  } = useAdminActions(data, "experiences", fetchData);

  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ role: "", company: "", type: "full-time", start_date: "", end_date: "", bullets: [""], tech_stack: "", is_visible: true });
    setEditing(null);
    setIsFormOpen(false);
  };

  const handleDisplayDetail = (exp: Experience) => {
    setSelectedExperience(exp);
  };

  const handleSave = async () => {
    if (!form.role.trim() || !form.company.trim() || !form.start_date) {
      toast.error("Role, company, and start date are required");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        role: form.role, 
        company: form.company, 
        type: form.type,
        start_date: form.start_date, 
        end_date: form.end_date || null,
        description: form.bullets.filter(Boolean),
        tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
        is_visible: form.is_visible,
      };

      if (editing) {
        const { error } = await supabase.from("experiences").update(payload).eq("id", editing);
        if (error) throw error;
        
        toast.success("Experience updated");
        resetForm();
        fetchData();
        if (selectedExperience?.id === editing) {
          const { data: updated } = await supabase.from("experiences").select("*").eq("id", editing).single();
          if (updated) setSelectedExperience(updated);
        }
      } else {
        const { error } = await supabase.from("experiences").insert({
          ...payload,
          display_order: data.length,
        });
        if (error) throw error;
        
        toast.success("Experience added");
        resetForm();
        fetchData();
      }
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const startEdit = (exp: Experience) => {
    setEditing(exp.id);
    const bullets = Array.isArray(exp.description) ? exp.description : exp.description ? [String(exp.description)] : [""];
    setForm({
      role: exp.role, 
      company: exp.company, 
      type: exp.type || "full-time",
      start_date: exp.start_date.split('T')[0], 
      end_date: exp.end_date ? exp.end_date.split('T')[0] : "",
      bullets: bullets.length > 0 ? bullets : [""],
      tech_stack: exp.tech_stack.join(", "),
      is_visible: exp.is_visible,
    });
    setIsFormOpen(true);
  };

  const toggleVisibility = async (exp: Experience) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("experiences")
        .update({ is_visible: !exp.is_visible })
        .eq("id", exp.id);

      if (error) throw error;

      toast.success(exp.is_visible ? "Hidden" : "Visible");
      fetchData();
      if (selectedExperience?.id === exp.id) {
        setSelectedExperience({ ...selectedExperience, is_visible: !exp.is_visible });
      }
    } catch (error: any) {
      toast.error("Error updating visibility");
    } finally {
      setIsSubmitting(false);
    }
  };


  const updateBullet = (index: number, value: string) => {
    const updated = [...form.bullets];
    updated[index] = value;
    setForm({ ...form, bullets: updated });
  };

  const addBullet = () => {
    setForm({ ...form, bullets: [...form.bullets, ""] });
  };

  const removeBullet = (index: number) => {
    if (form.bullets.length <= 1) {
      updateBullet(0, "");
      return;
    }
    setForm({ ...form, bullets: form.bullets.filter((_, i) => i !== index) });
  };

  const columns = [
    {
      header: "Role / Company",
      accessorKey: (exp: Experience) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0 border border-border/50">
            <Briefcase className="w-4 h-4 text-muted-foreground/50" />
          </div>
          <div>
            <p className={cn("font-medium text-sm line-clamp-1", !exp.is_visible && "text-muted-foreground italic")}>{exp.role}</p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">{exp.company} · {exp.type}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Visibility",
      accessorKey: (exp: Experience) => (
        <button 
          onClick={() => toggleVisibility(exp)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            exp.is_visible ? "text-emerald-500 hover:bg-emerald-500/10" : "text-slate-500 hover:bg-slate-500/10"
          )}
        >
          {exp.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )
    },
    {
      header: "Status",
      accessorKey: (exp: Experience) => (
        <span className={cn(
          "text-[9px] font-mono px-2 py-0.5 rounded tracking-wider",
          exp.is_archived ? "bg-red-500/10 text-red-500/80" : "bg-emerald-500/10 text-emerald-500/80"
        )}>
          {exp.is_archived ? "archived" : "live"}
        </span>
      ),
    },
  ];

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-lg" />)}</div>;
  }

  return (
    <div className="pb-20 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-roashe text-foreground">Experience</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Manage work experience</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DrawerContent className="max-w-3xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>{editing ? "Edit Experience" : "New Experience"}</DrawerTitle>
            <DrawerDescription>
              Details about your professional journey and key technical contributions.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerScrollArea>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Role</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Company</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all">
                  <option value="full-time">Full-time</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Tech Stack</label>
                <input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} placeholder="React, TS, Node..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Start Date</label>
                <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">End Date</label>
                <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Description Points</label>
              <div className="space-y-3">
                {form.bullets.map((bullet, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      value={bullet}
                      onChange={(e) => updateBullet(i, e.target.value)}
                      placeholder={`Major achievement ${i + 1}`}
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-background/50 text-sm focus:outline-none transition-all"
                    />
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => removeBullet(i)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addBullet} className="text-[10px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                  <Plus className="w-3 h-3" /> Add milestone
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Visible on Portfolio</label>
                <p className="text-xs text-muted-foreground">Show this experience in the public timeline.</p>
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
            {isSubmitting ? "Processing..." : editing ? "Update Experience" : "Add Experience"}
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

      <Drawer open={!!selectedExperience} onOpenChange={(open) => !open && setSelectedExperience(null)}>
        <DrawerContent className="max-w-3xl mx-auto">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl font-roashe">{selectedExperience?.role}</DrawerTitle>
                <DrawerDescription className="font-mono text-[10px] uppercase tracking-widest mt-1">
                  {selectedExperience?.company} · Work Record
                </DrawerDescription>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const e = selectedExperience!;
                    setSelectedExperience(null);
                    startEdit(e);
                  }}
                  className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const id = selectedExperience!.id;
                    setSelectedExperience(null);
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Employment</p>
                    <p className="text-sm font-medium uppercase">{selectedExperience?.type}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Duration</p>
                    <p className="text-xs font-medium">
                      {selectedExperience?.start_date && new Date(selectedExperience.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {selectedExperience?.end_date ? new Date(selectedExperience.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Present"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Achievement & Impact</h4>
                  <ul className="space-y-2">
                    {selectedExperience?.description.map((bullet, i) => (
                      <li key={i} className="text-sm border-l-2 border-primary/20 pl-4 py-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", selectedExperience?.is_archived ? "bg-red-500" : "bg-emerald-500")} />
                    <p className="text-sm font-medium uppercase tracking-wider">
                      {selectedExperience?.is_archived ? "Archived" : "Active"}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Visibility</p>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", selectedExperience?.is_visible ? "bg-emerald-500" : "bg-slate-500")} />
                    <p className="text-sm font-medium uppercase tracking-wider">
                      {selectedExperience?.is_visible ? "Visible" : "Hidden"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Technical Arsenal</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedExperience?.tech_stack.map(tech => (
                      <span key={tech} className="px-2 py-0.5 rounded-md bg-foreground/5 text-[10px] font-mono border border-border/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DrawerScrollArea>
        </DrawerContent>
      </Drawer>

      <AdminTable
        data={experiences}
        columns={columns}
        onEdit={startEdit}
        onView={handleDisplayDetail}
        onArchive={archiveItem}
        onRestore={restoreItem}
        onDelete={deleteItem}
        onBulkArchive={bulkArchive}
        onBulkRestore={bulkRestore}
        onBulkDelete={bulkDelete}
        searchKey="role"
        searchPlaceholder="Filter positions..."
      />
    </div>
  );
}

