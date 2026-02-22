import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/types";
import BlogListClient from "./BlogListClient";

export const revalidate = 60;

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return <BlogListClient initialBlogs={blogs || []} />;
}
