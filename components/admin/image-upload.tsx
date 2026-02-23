"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  bucket: "project-images" | "blog-images" | "skill-images" | "social-images" | "cert-images" | "event-images";
  onUpload: (url: string) => void;
  value?: string;
  /** Max dimension (px) to which the image is downscaled before encoding.
   *  Keeps the canvas memory and file size sensible. Default: 2400 */
  maxDimension?: number;
  /** WebP quality 0–1. Default 0.92 gives near-lossless visual quality. */
  quality?: number;
}

/** Returns true for HEIC / HEIF files (by MIME type or extension). */
function isHeic(file: File): boolean {
  if (file.type === "image/heic" || file.type === "image/heif") return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext === "heic" || ext === "heif";
}

/**
 * If the file is HEIC/HEIF, convert it to a JPEG Blob via heic2any
 * (dynamic import so the ~180 KB bundle is only loaded when needed).
 * Otherwise return the original file unchanged.
 */
async function normaliseFile(file: File): Promise<Blob> {
  if (!isHeic(file)) return file;

  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 1 });
  // heic2any returns Blob | Blob[] depending on whether the HEIC has
  // multiple images (Live Photo). We always want one Blob.
  return Array.isArray(result) ? result[0] : result;
}

function convertToWebP(
  file: File,
  maxDimension = 2400,
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Downscale if needed, preserving aspect ratio
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas 2D context unavailable")); return; }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("WebP conversion failed"));
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to decode image"));
    };

    img.src = objectUrl;
  });
}

export function ImageUpload({
  bucket,
  onUpload,
  value,
  maxDimension = 2400,
  quality = 0.92,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<"idle" | "converting" | "uploading">("idle");
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset so the same file can be re-selected after removal
    e.target.value = "";

    if (!file.type.startsWith("image/") && !isHeic(file)) {
      toast.error("Please select an image file");
      return;
    }

    // Generous pre-check on raw file (before conversion it can be large)
    if (file.size > 30 * 1024 * 1024) {
      toast.error("File too large — maximum 30 MB before conversion");
      return;
    }

    setUploading(true);

    try {
      // ── Step 1: Decode HEIC → JPEG if needed ────────────────────────────
      setProgress("converting");
      const normalisedBlob = await normaliseFile(file);

      // ── Step 2: Canvas → WebP ────────────────────────────────────────────
      const webpBlob = await convertToWebP(normalisedBlob as File, maxDimension, quality);

      const originalKB  = Math.round(file.size / 1024);
      const convertedKB = Math.round(webpBlob.size / 1024);
      const savings     = Math.round((1 - webpBlob.size / file.size) * 100);

      // ── Step 3: Upload the WebP blob ─────────────────────────────────────
      setProgress("uploading");
      const supabase = createClient();
      const fileName = `${Math.random().toString(36).slice(2)}-${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, webpBlob, { contentType: "image/webp", upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onUpload(publicUrl);

      toast.success(
        savings > 0
          ? `Uploaded ✓  ${originalKB} KB → ${convertedKB} KB (−${savings}% as WebP)`
          : `Uploaded as WebP (${convertedKB} KB)`
      );
    } catch (err: any) {
      toast.error("Upload failed: " + (err?.message ?? "unknown error"));
    } finally {
      setUploading(false);
      setProgress("idle");
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUpload("");
  };

  const statusLabel =
    progress === "converting" ? "Converting…" :
    progress === "uploading"  ? "Uploading…"  : "Upload";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-border bg-muted/20">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={removeImage}
                className="p-1.5 bg-red-500 text-white rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* WebP badge */}
            <span className="absolute bottom-1 left-1 text-[9px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
              webp
            </span>
          </div>
        ) : (
          <label className={`w-32 h-32 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all cursor-pointer
            ${uploading
              ? "border-border bg-muted/10 cursor-wait"
              : "border-border hover:border-foreground/30 hover:bg-accent/20"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground text-center px-2">
                  {statusLabel}
                </span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                  Upload
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}

        <div className="flex-1 space-y-1.5">
          {preview ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-500">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Image ready
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {uploading ? statusLabel : "Select any image to upload"}
            </p>
          )}
          <p className="text-[10px] text-muted-foreground/50 font-mono leading-relaxed">
            Any format accepted (PNG, JPG, HEIC, GIF…)<br />
            Auto-converted to WebP · Max 30 MB
          </p>
        </div>
      </div>
    </div>
  );
}
