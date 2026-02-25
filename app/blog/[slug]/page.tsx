import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import ConnectAndFooter from "@/components/ConnectAndFooter";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!blog) notFound();

  // Get related blogs
  const { data: related } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, published_at, created_at")
    .neq("id", blog.id)
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(2);

  return (
    <>
      <BlogPostClient blog={blog} related={related || []} />
      <ConnectAndFooter />
    </>
  );
}
