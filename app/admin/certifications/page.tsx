"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, X, Award, ExternalLink, Save, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import type { Certification } from "@/lib/types";
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

export default function AdminCertifications() {
  const [data, setData] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    title: "", 
    issuer: "", 
    credential_url: "",
    issue_date: "",
    is_visible: true,
  });

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("certifications").select("*").order("display_order");
    if (data) setData(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const {
    optimisticItems: certs,
    archiveItem,
    restoreItem,
    deleteItem,
    bulkArchive,
    bulkRestore,
    bulkDelete,
  } = useAdminActions(data, "certifications", fetchData);

  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ title: "", issuer: "", credential_url: "", issue_date: "", is_visible: true });
    setEditing(null);
    setIsFormOpen(false);
  };

  const handleDisplayDetail = (cert: Certification) => {
    setSelectedCert(cert);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.issuer.trim()) {
      toast.error("Title and issuer are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        title: form.title, 
        issuer: form.issuer,
        credential_url: form.credential_url || null,
        issue_date: form.issue_date || null,
        is_visible: form.is_visible,
      };

      if (editing) {
        const { error } = await supabase.from("certifications").update(payload).eq("id", editing);
        if (error) throw error;
        
        toast.success("Certification updated");
        resetForm();
        fetchData();
        if (selectedCert?.id === editing) {
          const { data: updated } = await supabase.from("certifications").select("*").eq("id", editing).single();
          if (updated) setSelectedCert(updated);
        }
      } else {
        const { error } = await supabase.from("certifications").insert({
          ...payload,
          display_order: data.length,
        });
        if (error) throw error;
        
        toast.success("Certification added");
        resetForm();
        fetchData();
      }
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const startEdit = (cert: Certification) => {
    setEditing(cert.id);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      credential_url: cert.credential_url || "",
      issue_date: cert.issue_date || "",
      is_visible: cert.is_visible,
    });
    setIsFormOpen(true);
  };

  const toggleVisibility = async (cert: Certification) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("certifications")
        .update({ is_visible: !cert.is_visible })
        .eq("id", cert.id);

      if (error) throw error;

      toast.success(cert.is_visible ? "Hidden" : "Visible");
      fetchData();
      if (selectedCert?.id === cert.id) {
        setSelectedCert({ ...selectedCert, is_visible: !cert.is_visible });
      }
    } catch (error: any) {
      toast.error("Error updating visibility");
    } finally {
      setIsSubmitting(false);
    }
  };


  const columns = [
    {
      header: "Certification",
      accessorKey: (cert: Certification) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0 border border-border/50">
            <Award className="w-4 h-4 text-muted-foreground/50" />
          </div>
          <div>
            <p className={cn("font-medium text-sm line-clamp-1", !cert.is_visible && "text-muted-foreground italic")}>{cert.title}</p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">{cert.issuer}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Visibility",
      accessorKey: (cert: Certification) => (
        <button 
          onClick={() => toggleVisibility(cert)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            cert.is_visible ? "text-emerald-500 hover:bg-emerald-500/10" : "text-slate-500 hover:bg-slate-500/10"
          )}
        >
          {cert.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )
    },
    {
      header: "Status",
      accessorKey: (cert: Certification) => (
        <span className={cn(
          "text-[9px] font-mono px-2 py-0.5 rounded tracking-wider",
          cert.is_archived ? "bg-red-500/10 text-red-500/80" : "bg-emerald-500/10 text-emerald-500/80"
        )}>
          {cert.is_archived ? "archived" : "live"}
        </span>
      ),
    },
  ];

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14 w-full rounded-lg" />)}</div>;
  }

  return (
    <div className="pb-20 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-roashe text-foreground">Certifications</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Manage accomplishments & badges</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DrawerContent className="max-w-xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>{editing ? "Edit Certification" : "New Certification"}</DrawerTitle>
            <DrawerDescription>
              Add or update your professional awards and achievements.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerScrollArea>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. AWS Certified Solutions Architect" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Issuer</label>
                <input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="e.g. Amazon Web Services" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Issue Date</label>
                  <input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Credential URL</label>
                  <input value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Visible on Portfolio</label>
                <p className="text-xs text-muted-foreground">Show this certification to the public.</p>
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
            {isSubmitting ? "Processing..." : editing ? "Update Certification" : "Add Certification"}
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

      <Drawer open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        <DrawerContent className="max-w-xl mx-auto">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl font-roashe">{selectedCert?.title}</DrawerTitle>
                <DrawerDescription className="font-mono text-[10px] uppercase tracking-widest mt-1">
                  Credential Verification
                </DrawerDescription>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const c = selectedCert!;
                    setSelectedCert(null);
                    startEdit(c);
                  }}
                  className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const id = selectedCert!.id;
                    setSelectedCert(null);
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
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border/50 bg-muted/30 text-muted-foreground/40 flex items-center justify-center">
                <Award className="w-12 h-12" />
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Issuer</p>
                  <p className="text-sm font-medium">{selectedCert?.issuer}</p>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Issue Date</p>
                  <p className="text-sm font-medium">{selectedCert?.issue_date ? new Date(selectedCert.issue_date).toLocaleDateString() : "N/A"}</p>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Visibility</p>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", selectedCert?.is_visible ? "bg-emerald-500" : "bg-slate-500")} />
                    <p className="text-sm font-medium uppercase tracking-wider">
                      {selectedCert?.is_visible ? "Visible" : "Hidden"}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", selectedCert?.is_archived ? "bg-red-500" : "bg-emerald-500")} />
                    <p className="text-sm font-medium uppercase tracking-wider">
                      {selectedCert?.is_archived ? "Archived" : "Live"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedCert?.credential_url && (
                <a 
                  href={selectedCert.credential_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest text-center hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Verify Credential
                </a>
              )}
            </div>
          </DrawerScrollArea>
        </DrawerContent>
      </Drawer>

      <AdminTable
        data={certs}
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
        searchPlaceholder="Filter certs..."
      />
    </div>
  );
}

