"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { X, ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeletons";

interface MasonryGalleryProps {
  images: string[];
  className?: string;
  isAdmin?: boolean;
  isLoading?: boolean;
}

export const MasonryGallery = ({ 
  images, 
  className, 
  isAdmin = false,
  isLoading = false 
}: MasonryGalleryProps) => {
  const containerRef = useRef<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      setColumns(window.innerWidth >= 1024 ? 3 : 2);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Split images across columns dynamically
  const col1Images = images.filter((_, i) => i % columns === 0);
  const col2Images = images.filter((_, i) => i % columns === 1);
  const col3Images = columns === 3 ? images.filter((_, i) => i % columns === 2) : [];

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]); 
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);   
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]); 

  return (
    <div 
      ref={containerRef}
      className={cn("px-4 md:px-10 lg:px-20 relative", className)}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 items-start max-w-7xl mx-auto gap-4 md:gap-6 lg:gap-10">
        {/* Column 1 */}
        <div className="grid gap-4 md:gap-6 lg:gap-10">
          {col1Images.map((url, idx) => (
            <motion.div style={{ y: y1 }} key={"grid-1" + idx}>
              <GalleryCard url={url} idx={idx} onClick={() => setSelectedImage(url)} />
            </motion.div>
          ))}
          {isLoading && <Skeleton className="h-[400px] w-full rounded-2xl" />}
        </div>
        {/* Column 2 */}
        <div className="grid gap-4 md:gap-6 lg:gap-10">
          {col2Images.map((url, idx) => (
            <motion.div style={{ y: y2 }} key={"grid-2" + idx}>
              <GalleryCard url={url} idx={idx} onClick={() => setSelectedImage(url)} />
            </motion.div>
          ))}
          {isLoading && <Skeleton className="h-[300px] w-full rounded-2xl" />}
        </div>
        {/* Column 3 */}
        <div className="grid gap-4 md:gap-6 lg:gap-10 hidden lg:grid">
          {col3Images.map((url, idx) => (
            <motion.div style={{ y: y3 }} key={"grid-3" + idx}>
              <GalleryCard url={url} idx={idx} onClick={() => setSelectedImage(url)} />
            </motion.div>
          ))}
          {isLoading && <Skeleton className="h-[500px] w-full rounded-2xl" />}
        </div>
      </div>

      <Drawer open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DrawerContent className={cn(
          "h-[80vh] mx-auto border-t border-border/50 bg-background/90 backdrop-blur-2xl outline-none overflow-hidden",
          isAdmin ? "max-w-5xl" : "max-w-none w-full border-x-0 rounded-t-[2rem]"
        )}>
          <DrawerHeader className="relative border-b border-white/5 py-4 shrink-0 flex items-center justify-between px-6">
            <div>
              <DrawerTitle className="text-xl font-roashe tracking-tight uppercase">Visual Asset</DrawerTitle>
              <DrawerDescription className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mt-0.5">High Fidelity Preview</DrawerDescription>
            </div>
            <DrawerClose className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden p-6 md:p-10 flex items-center justify-center bg-black/20">
            {selectedImage && (
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 group">
                <Image
                  src={selectedImage}
                  alt="Gallery Preview"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};


const GalleryCard = ({ url, idx, onClick }: { url: string; idx: number; onClick: () => void }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: idx * 0.05,
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className="break-inside-avoid group"
      onClick={onClick}
    >
      <div className="relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-muted/30 hover:border-foreground/20 transition-all duration-500 shadow-sm hover:shadow-2xl min-h-[200px]">
        {!loaded && <Skeleton className="absolute inset-0 z-0" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        
        <Image
          src={url}
          alt="Gallery Image"
          width={800}
          height={1200}
          className={cn(
            "w-full h-auto object-cover transform transition-all duration-700 group-hover:scale-105",
            !loaded ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}
          onLoad={() => setLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        
        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 z-20 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest leading-none">
              Asset View
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};




