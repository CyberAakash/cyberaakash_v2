"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Layers, BookOpen, CalendarDays, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ConfigKey {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  min: number;
  max: number;
  defaultValue: number;
  accent: string;
}

const CONFIG_KEYS: ConfigKey[] = [
  {
    key: "featured_projects_limit",
    label: "Featured Projects",
    description: "Max number of featured projects shown on the homepage Projects section.",
    icon: <Layers className="w-5 h-5" />,
    min: 1,
    max: 12,
    defaultValue: 6,
    accent: "from-violet-500/10 to-violet-500/5 border-violet-500/20",
  },
  {
    key: "featured_blogs_limit",
    label: "Featured Blog Posts",
    description: "Max number of featured posts shown on the homepage Blog section.",
    icon: <BookOpen className="w-5 h-5" />,
    min: 1,
    max: 12,
    defaultValue: 6,
    accent: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
  },
  {
    key: "featured_events_limit",
    label: "Featured Events",
    description: "Max number of featured events shown on the homepage Events section.",
    icon: <CalendarDays className="w-5 h-5" />,
    min: 1,
    max: 12,
    defaultValue: 4,
    accent: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminConfig() {
  const supabase = createClient();

  const [values, setValues] = useState<Record<string, number>>({
    featured_projects_limit: 6,
    featured_blogs_limit: 6,
    featured_events_limit: 4,
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load current config values from Supabase
  const loadConfig = useCallback(async () => {
    const { data } = await supabase
      .from("site_config")
      .select("key, value")
      .in("key", CONFIG_KEYS.map((c) => c.key));

    if (data) {
      const map: Record<string, number> = { ...values };
      data.forEach((row) => {
        map[row.key] = parseInt(row.value, 10) || map[row.key];
      });
      setValues(map);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  // Save a single config key
  const saveKey = async (key: string, value: number) => {
    setSaving(key);
    const { error } = await supabase
      .from("site_config")
      .upsert({ key, value: String(value) }, { onConflict: "key" });

    if (error) {
      toast.error(`Failed to save: ${error.message}`);
    } else {
      toast.success("Saved! Changes will reflect on the homepage immediately.");
    }
    setSaving(null);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-roashe text-foreground flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          Homepage Configuration
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">
          Control how many featured items are shown in each homepage section.
        </p>
      </div>

      {/* Config Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CONFIG_KEYS.map((cfg) => (
          <div
            key={cfg.key}
            className={`rounded-2xl border bg-gradient-to-br ${cfg.accent} p-6 space-y-5`}
          >
            {/* Card header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center text-foreground/70 border border-border/40">
                {cfg.icon}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground leading-tight">
                  {cfg.label}
                </h2>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {cfg.key}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {cfg.description}
            </p>

            {/* Input + Save */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* Decrement */}
                <button
                  onClick={() =>
                    setValues((v) => ({
                      ...v,
                      [cfg.key]: Math.max(cfg.min, (v[cfg.key] ?? cfg.defaultValue) - 1),
                    }))
                  }
                  className="w-9 h-9 rounded-lg border border-border bg-background/60 text-foreground/70 hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center text-lg font-bold select-none"
                >
                  −
                </button>

                {/* Number display */}
                <div className="flex-1 text-center">
                  {loading ? (
                    <div className="h-10 rounded-xl bg-background/30 animate-pulse" />
                  ) : (
                    <input
                      type="number"
                      min={cfg.min}
                      max={cfg.max}
                      value={values[cfg.key] ?? cfg.defaultValue}
                      onChange={(e) => {
                        const n = Math.min(cfg.max, Math.max(cfg.min, parseInt(e.target.value) || cfg.min));
                        setValues((v) => ({ ...v, [cfg.key]: n }));
                      }}
                      className="w-full h-10 text-center text-2xl font-bold bg-background/60 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                    />
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                    min {cfg.min} · max {cfg.max}
                  </p>
                </div>

                {/* Increment */}
                <button
                  onClick={() =>
                    setValues((v) => ({
                      ...v,
                      [cfg.key]: Math.min(cfg.max, (v[cfg.key] ?? cfg.defaultValue) + 1),
                    }))
                  }
                  className="w-9 h-9 rounded-lg border border-border bg-background/60 text-foreground/70 hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center text-lg font-bold select-none"
                >
                  +
                </button>
              </div>

              {/* Save button */}
              <button
                onClick={() => saveKey(cfg.key, values[cfg.key] ?? cfg.defaultValue)}
                disabled={saving === cfg.key || loading}
                className="w-full py-2.5 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                {saving === cfg.key ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-border/50 bg-muted/20 p-5 space-y-1.5">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">How it works</p>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Items shown on the homepage must be marked <strong className="text-foreground">Featured</strong> in their respective admin list.</li>
          <li>If fewer items are featured than the limit, only the available featured items are shown.</li>
          <li>Changes take effect immediately on the next homepage visit (no redeploy needed).</li>
        </ul>
      </div>
    </div>
  );
}
