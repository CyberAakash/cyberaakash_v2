"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import type { Certification } from "@/lib/types";

export default function AdminCertifications() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", issuer: "", credential_url: "" });

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("certifications").select("*").order("display_order");
    if (data) setCerts(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!form.title.trim() || !form.issuer.trim()) return;
    const supabase = createClient();
    await supabase.from("certifications").insert({
      title: form.title, issuer: form.issuer,
      credential_url: form.credential_url || null,
      display_order: certs.length,
    });
    setForm({ title: "", issuer: "", credential_url: "" });
    fetchData();
  };

  const deleteItem = async (id: string) => {
    const supabase = createClient();
    await supabase.from("certifications").delete().eq("id", id);
    setCerts((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14 w-full rounded-lg" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-roashe">Certifications</h1>
      <p className="text-sm text-muted-foreground font-mono mt-1">Manage certifications</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Certification name" className="mt-1 w-full px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </div>
        <div className="flex-1 w-full">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Issuer</label>
          <input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Issuing organization" className="mt-1 w-full px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </div>
        <div className="flex-1 w-full">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">URL</label>
          <input value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} placeholder="Credential URL (optional)" className="mt-1 w-full px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </div>
        <button onClick={handleAdd} className="px-4 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity shrink-0"><Plus className="w-4 h-4" /></button>
      </div>

      <div className="mt-8 space-y-2">
        {certs.map((cert) => (
          <div key={cert.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card group">
            <div className="flex-1">
              <p className="text-sm font-medium">{cert.title}</p>
              <p className="text-xs text-muted-foreground font-mono">{cert.issuer}</p>
            </div>
            <button onClick={() => deleteItem(cert.id)} className="text-muted-foreground/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
