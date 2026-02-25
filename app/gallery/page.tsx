import { createClient } from "@/lib/supabase/server";
import ShimmerText from "@/components/animations/ShimmerText";
import Navbar from "@/components/Navbar";
import GalleryListClient from "./GalleryListClient";
import ConnectAndFooter from "@/components/ConnectAndFooter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery | CyberAakash",
  description: "A visual journey through my work, projects, and inspirations.",
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .order("display_order", { ascending: true })
    .limit(8); // Initial load size

  return (
    <main className="min-h-screen pt-32 pb-20 overflow-hidden relative">
      <Navbar />
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <ShimmerText className="text-4xl md:text-6xl font-roashe tracking-tighter uppercase">
            Gallery
          </ShimmerText>
          <p className="text-muted-foreground font-mono text-sm md:text-base max-w-2xl uppercase tracking-widest">
            A visual collection of moments, projects, and artistic experiments.
          </p>
        </div>
      </div>

      <GalleryListClient initialItems={galleryItems || []} />
      
      <ConnectAndFooter />
    </main>
  );
}

