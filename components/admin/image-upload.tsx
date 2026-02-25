"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, CheckCircle2, Trash2, Maximize2, Repeat, Pencil } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "@/lib/utils/cropImage";

interface ImageUploadProps {
  bucket: "project-images" | "blog-images" | "skill-images" | "social-images" | "cert-images" | "event-images" | "gallery-images";
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
  const [stats, setStats] = useState<{name: string, originalKB: number, convertedKB: number, savings: number} | null>(null);
  
  // Crop states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with value prop for reordering or external changes
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !isHeic(file)) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("File 30 MB + before conversion isn't supported smoothly by the cropper.");
      return;
    }

    setOriginalFile(file);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setCropImageSrc(reader.result?.toString() || null);
      setCropModalOpen(true);
    });
    reader.readAsDataURL(file);
  };

  const performCropAndUpload = async () => {
    if (!cropImageSrc || !croppedAreaPixels || !originalFile) return;

    try {
      setCropModalOpen(false); // Close modal and start loading state
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Could not process cropping");

      // Wrap the blob so that the existing handleUpload flow deals with a File-like object
      const croppedFile = new File([croppedBlob], originalFile.name, { type: "image/jpeg" });
      
      await handleUpload([croppedFile]);
    } catch (e) {
      console.error(e);
      toast.error("Error cropping image");
    }
  };

  const handleEditExisting = () => {
    if (preview) {
      // If we are editing an already uploaded image, use its URL for the cropper.
      // We create a fake File just to satisfy the dependencies later.
      fetch(preview)
        .then((res) => res.blob())
        .then((blob) => {
          const fakeFile = new File([blob], "edited-image.jpg", { type: blob.type });
          setOriginalFile(fakeFile);
          
          const reader = new FileReader();
          reader.onload = () => {
            setCropImageSrc(reader.result as string);
            setCropModalOpen(true);
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => toast.error("Could not load image for editing"));
    }
  };

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

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
      setStats({
        name: file.name,
        originalKB,
        convertedKB,
        savings
      });
      onUpload(publicUrl);

      toast.success(
        savings > 0
          ? `Uploaded ✓  ${originalKB} KB → ${convertedKB} KB (−${savings}%)`
          : `Uploaded as WebP (${convertedKB} KB)`
      );
    } catch (err: any) {
      toast.error("Upload failed: " + (err?.message ?? "unknown error"));
    } finally {
      setUploading(false);
      setProgress("idle");
    }
  };

  const removeImage = async () => {
    // Delete from Supabase Storage to save space
    if (preview && preview.includes("supabase.co")) {
      try {
        const fileNameMatch = preview.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/);
        if (fileNameMatch && fileNameMatch[1]) {
          const fileName = decodeURIComponent(fileNameMatch[1]);
          const supabase = createClient();
          const { error } = await supabase.storage.from(bucket).remove([fileName]);
          if (error) {
            console.error("Storage deletion error:", error);
          }
        }
      } catch (e) {
        console.error("Error parsing/deleting from storage:", e);
      }
    }

    setPreview(null);
    setStats(null);
    onUpload("");
    toast.success("Image removed");
  };

  const statusLabel =
    progress === "converting" ? "Converting…" :
    progress === "uploading"  ? "Uploading…"  : "Upload";

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          {preview && !uploading ? (
            <div className="relative group w-full rounded-2xl border border-border/50 bg-background/50 overflow-hidden shadow-sm">
              {/* Image Preview Area */}
              <div 
                className="relative aspect-[4/3] w-full bg-muted/30 overflow-hidden cursor-pointer flex items-center justify-center group/img" 
                onClick={() => setIsDrawerOpen(true)}
              >
                <img 
                  src={preview} 
                  alt="preview" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="flex items-center gap-2 text-white bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md">
                     <Maximize2 className="w-4 h-4" />
                     <span className="text-xs font-mono uppercase tracking-widest">Preview</span>
                   </div>
                </div>
              </div>

              {/* Hover Actions */}
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                 <input 
                   type="file" 
                   accept="image/*"
                   className="hidden" 
                   ref={fileInputRef} 
                   onChange={(e) => {
                     if (e.target.files?.length) {
                       handleFileSelect(Array.from(e.target.files));
                     }
                   }} 
                 />
                 <button 
                   onClick={() => fileInputRef.current?.click()} 
                   className="p-2 bg-background/80 hover:bg-background text-foreground backdrop-blur rounded-lg shadow-sm border border-border/50 transition-colors" 
                   title="Change Image"
                 >
                   <Repeat className="w-3.5 h-3.5" />
                 </button>
                 <button 
                   onClick={handleEditExisting} 
                   className="p-2 bg-background/80 hover:bg-background text-foreground backdrop-blur rounded-lg shadow-sm border border-border/50 transition-colors" 
                   title="Edit existing"
                 >
                   <Pencil className="w-3.5 h-3.5" />
                 </button>
                 <button 
                   onClick={removeImage} 
                   className="p-2 bg-red-500/80 hover:bg-red-500 text-white backdrop-blur rounded-lg shadow-sm border border-red-500/50 transition-colors" 
                   title="Remove Image"
                 >
                   <Trash2 className="w-3.5 h-3.5" />
                 </button>
              </div>

              {/* Details */}
              <div className="p-3 border-t border-border/50 bg-muted/10">
                <div className="flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                   <div className="min-w-0 flex-1">
                     {stats ? (
                       <>
                         <p className="text-xs font-medium truncate text-foreground/90">{stats.name}</p>
                         <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                           {stats.convertedKB} KB <span className="text-emerald-500/80">(-{stats.savings}%)</span>
                         </p>
                       </>
                     ) : (
                       <>
                         <p className="text-xs font-medium truncate text-foreground/90">Image Uploaded</p>
                         <p className="text-[10px] font-mono text-muted-foreground mt-0.5 text-emerald-500/80">WebP Optimized</p>
                       </>
                     )}
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <FileUpload 
              value={preview || undefined} 
              loading={uploading} 
              onChange={handleFileSelect} 
            />
          )}
        </div>

        {!preview && (
          <div className="flex-1 space-y-1.5 text-center px-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
              {uploading ? statusLabel : "Select Image to Begin"}
            </p>
            <p className="text-[10px] text-muted-foreground/40 font-mono leading-relaxed max-w-xs mx-auto">
              Auto-optimised for WebP · Pro-grade compression · Max 30MB
            </p>
          </div>
        )}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-5xl mx-auto h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-roashe">Image Preview</DrawerTitle>
            <DrawerDescription className="font-mono text-[10px] uppercase tracking-widest mt-1">
              Full Resolution View
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center bg-muted/10 rounded-2xl border border-border/50 overflow-hidden">
               <img src={preview || ""} alt="Full size preview" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DrawerContent className="max-w-3xl mx-auto h-[80vh] flex flex-col">
          <DrawerHeader className="shrink-0">
            <DrawerTitle>Crop Image</DrawerTitle>
            <DrawerDescription>Adjust your image to the perfect frame before uploading.</DrawerDescription>
          </DrawerHeader>
          <div 
            className="flex-1 relative mx-6 mb-6 rounded-xl overflow-hidden border border-border/50 bg-black"
            data-vaul-no-drag
          >
            {cropImageSrc && (
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={true}
              />
            )}
          </div>
          <DrawerFooter className="shrink-0 pt-0 pb-6">
            <div className="flex items-center gap-4 max-w-sm mx-auto w-full">
              <button 
                onClick={performCropAndUpload}
                 className="flex-1 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
              >
                Crop & Upload
              </button>
              <button 
                onClick={() => setCropModalOpen(false)}
                 className="px-6 py-3 bg-muted text-muted-foreground text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
