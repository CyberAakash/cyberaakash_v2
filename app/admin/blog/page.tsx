"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Blog } from "@/lib/types";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/image-upload";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/utils";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
    is_published: false,
    cover_image: "",
  });
  const [contentPreview, setContentPreview] = useState(false);

  const supabase = createClient();

  const fetchBlogs = async () => {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    setBlogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
      cover_image: form.cover_image || null,
    };
    const { error } = await supabase.from("blogs").insert(payload);
    
    if (error) {
      toast.error("Failed to add blog post: " + error.message);
      return;
    }

    toast.success("Blog post added successfully");
    setForm({ title: "", slug: "", excerpt: "", content: "", tags: "", is_published: false, cover_image: "" });
    fetchBlogs();
  };

  const deleteBlog = async (id: string) => {
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete blog post: " + error.message);
      return;
    }
    toast.success("Blog post deleted");
    fetchBlogs();
  };

  const togglePublish = async (blog: Blog) => {
    const newStatus = !blog.is_published;
    const { error } = await supabase
      .from("blogs")
      .update({
        is_published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null,
      })
      .eq("id", blog.id);

    if (error) {
      toast.error(`Failed to ${newStatus ? "publish" : "unpublish"}: ` + error.message);
      return;
    }

    toast.success(`Post ${newStatus ? "published" : "unpublished"}`);
    fetchBlogs();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 skeleton rounded" />
        <div className="h-64 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-roashe mb-6">Blog Posts</h1>

      {/* Add blog form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl border border-border/30 bg-card/50 mb-8 space-y-6"
      >
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Cover Image
          </label>
          <ImageUpload 
            bucket="blog-images" 
            value={form.cover_image} 
            onUpload={(url) => setForm({ ...form, cover_image: url })} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Post title"
            required
            className="px-4 py-2 rounded-lg bg-background border border-border/30 text-sm focus:outline-none focus:border-foreground/30"
          />
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
            placeholder="url-slug"
            required
            className="px-4 py-2 rounded-lg bg-background border border-border/30 text-sm font-mono focus:outline-none focus:border-foreground/30"
          />
        </div>
        <input
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          placeholder="Short excerpt"
          className="w-full px-4 py-2 rounded-lg bg-background border border-border/30 text-sm focus:outline-none focus:border-foreground/30"
        />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Content (Markdown Supported)</label>
            <div className="flex bg-muted/50 p-1 rounded-md">
              <button 
                type="button"
                onClick={() => setContentPreview(false)}
                className={cn("px-3 py-1 text-[10px] font-mono uppercase rounded transition-colors", !contentPreview ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                Edit
              </button>
              <button 
                type="button"
                onClick={() => setContentPreview(true)}
                className={cn("px-3 py-1 text-[10px] font-mono uppercase rounded transition-colors", contentPreview ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                Preview
              </button>
            </div>
          </div>
          
          {contentPreview ? (
            <div className="min-h-[300px] p-4 rounded-lg border border-border bg-background/50">
              {form.content ? (
                <MarkdownRenderer content={form.content} />
              ) : (
                <p className="text-sm text-muted-foreground italic">No content to preview.</p>
              )}
            </div>
          ) : (
            <textarea 
              value={form.content} 
              onChange={(e) => setForm({ ...form, content: e.target.value })} 
              placeholder="Write your post content here... (Markdown supported)" 
              rows={12} 
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-foreground/30 resize-y font-mono" 
            />
          )}
        </div>
        <input
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="Tags (comma separated)"
          className="w-full px-4 py-2 rounded-lg bg-background border border-border/30 text-sm focus:outline-none focus:border-foreground/30"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="rounded"
            />
            Publish immediately
          </label>
          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Add Post
          </button>
        </div>
      </form>

      {/* Blog list */}
      <div className="space-y-3">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="flex items-center justify-between p-4 rounded-xl border border-border/20 bg-card/30"
          >
            <div className="flex gap-4 items-center flex-1 min-w-0">
              {blog.cover_image && (
                <img src={blog.cover_image} alt={blog.title} className="w-12 h-12 rounded object-cover border border-border/10" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium truncate">{blog.title}</h3>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                      blog.is_published
                        ? "bg-foreground/10 text-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {blog.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/50 font-mono mt-0.5 truncate">
                  /{blog.slug}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => togglePublish(blog)}
                className="text-xs px-3 py-1 rounded-lg border border-border/30 hover:bg-accent transition-colors"
              >
                {blog.is_published ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => deleteBlog(blog.id)}
                className="text-xs px-3 py-1 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
