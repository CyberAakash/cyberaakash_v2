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
  type: "number" | "text";
  min?: number;
  max?: number;
  defaultValue: string | number;
  accent: string;
}

const CONFIG_KEYS: ConfigKey[] = [
  // --- Limits ---
  {
    key: "featured_projects_limit",
    label: "Featured Projects",
    description: "Max number of featured projects shown on the homepage Projects section.",
    icon: <Layers className="w-5 h-5" />,
    type: "number",
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
    type: "number",
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
    type: "number",
    min: 1,
    max: 12,
    defaultValue: 4,
    accent: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
  },
  // --- About Stats ---
  {
    key: "stat_projects_value",
    label: "Projects Built Stat",
    description: "Value shown for 'Projects Built' in the About section (e.g. '15+').",
    icon: <Layers className="w-5 h-5" />,
    type: "text",
    defaultValue: "15+",
    accent: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
  },
  {
    key: "stat_technologies_value",
    label: "Technologies Stat",
    description: "Value shown for 'Technologies' in the About section (e.g. '20+').",
    icon: <Layers className="w-5 h-5" />,
    type: "text",
    defaultValue: "20+",
    accent: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/20",
  },
  {
    key: "stat_years_coding_value",
    label: "Years Coding Stat",
    description: "Value shown for 'Years Coding' in the About section (e.g. '3+').",
    icon: <Layers className="w-5 h-5" />,
    type: "text",
    defaultValue: "3+",
    accent: "from-pink-500/10 to-pink-500/5 border-pink-500/20",
  },
  {
    key: "stat_coffee_value",
    label: "Cups of Coffee Stat",
    description: "Value shown for 'Cups of Coffee' in the About section (e.g. '∞').",
    icon: <Layers className="w-5 h-5" />,
    type: "text",
    defaultValue: "∞",
    accent: "from-amber-500/10 to-amber-500/5 border-amber-500/20",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminConfig() {
  const supabase = createClient();

  const [values, setValues] = useState<Record<string, string | number>>({
    featured_projects_limit: 6,
    featured_blogs_limit: 6,
    featured_events_limit: 4,
    stat_projects_value: "15+",
    stat_technologies_value: "20+",
    stat_years_coding_value: "3+",
    stat_coffee_value: "∞",
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
      const map: Record<string, string | number> = { ...values };
      data.forEach((row) => {
        const config = CONFIG_KEYS.find(c => c.key === row.key);
        if (config?.type === "number") {
          map[row.key] = parseInt(row.value, 10) || config.defaultValue as number;
        } else {
          map[row.key] = row.value || config?.defaultValue as string;
        }
      });
      setValues(map);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  // Save a single config key
  const saveKey = async (key: string, value: string | number) => {
    setSaving(key);
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert({ key, value: String(value) }, { onConflict: "key" });

      if (error) throw error;
      toast.success("Saved! Changes will reflect on the homepage immediately.");
    } catch (error: any) {
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setSaving(null);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CONFIG_KEYS.map((cfg) => (
          <div
            key={cfg.key}
            className="rounded-2xl border border-border/50 bg-card/30 p-6 space-y-5 shadow-sm hover:border-border transition-colors group"
          >
            {/* Card header */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground border border-border/40 transition-colors group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20">
                {cfg.icon}
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground leading-tight tracking-tight">
                  {cfg.label}
                </h2>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
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
              {cfg.type === "number" ? (
                <div className="flex items-center gap-3">
                  {/* Decrement */}
                  <button
                    onClick={() =>
                      setValues((v) => ({
                        ...v,
                        [cfg.key]: Math.max(cfg.min!, (Number(v[cfg.key]) ?? cfg.defaultValue) - 1),
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
                          const n = Math.min(cfg.max!, Math.max(cfg.min!, parseInt(e.target.value) || cfg.min!));
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
                        [cfg.key]: Math.min(cfg.max!, (Number(v[cfg.key]) ?? cfg.defaultValue) + 1),
                      }))
                    }
                    className="w-9 h-9 rounded-lg border border-border bg-background/60 text-foreground/70 hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center text-lg font-bold select-none"
                  >
                    +
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {loading ? (
                    <div className="h-10 rounded-xl bg-background/30 animate-pulse" />
                  ) : (
                    <input
                      type="text"
                      value={values[cfg.key] ?? cfg.defaultValue}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, [cfg.key]: e.target.value }));
                      }}
                      placeholder="Enter value..."
                      className="w-full h-10 px-4 text-center text-xl font-bold bg-background/60 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                    />
                  )}
                  <p className="text-[10px] text-muted-foreground text-center font-mono">
                    Stat value (text)
                  </p>
                </div>
              )}

              {/* Save button */}
              <button
                onClick={() => saveKey(cfg.key, values[cfg.key] ?? cfg.defaultValue)}
                disabled={saving === cfg.key || loading}
                className="w-full py-2.5 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                {saving === cfg.key ? (
                  <div className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
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
