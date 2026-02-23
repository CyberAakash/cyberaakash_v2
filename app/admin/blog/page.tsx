"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Blog } from "@/lib/types";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/image-upload";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/utils";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdminActions } from "@/lib/hooks/use-admin-actions";
import { Plus, X, Image as ImageIcon, Eye, EyeOff, Save } from "lucide-react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerFooter,
  DrawerScrollArea
} from "@/components/ui/drawer";

export default function AdminBlogPage() {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
    is_published: false,
    cover_image: "",
    is_visible: true,
  });
  const [contentPreview, setContentPreview] = useState(false);

  const fetchBlogs = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const {
    optimisticItems,
    archiveItem,
    restoreItem,
    deleteItem,
    bulkArchive,
    bulkRestore,
    bulkDelete,
  } = useAdminActions(data, "blogs", fetchBlogs);

  const resetForm = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "", tags: "", is_published: false, cover_image: "", is_visible: true });
    setEditing(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
      cover_image: form.cover_image || null,
      is_visible: form.is_visible,
    };

    if (editing) {
      const { error } = await supabase.from("blogs").update(payload).eq("id", editing);
      if (error) toast.error("Failed to update blog: " + error.message);
      else {
        toast.success("Blog updated");
        resetForm();
        fetchBlogs();
      }
    } else {
      const { error } = await supabase.from("blogs").insert(payload);
      if (error) toast.error("Failed to add blog: " + error.message);
      else {
        toast.success("Blog added");
        resetForm();
        fetchBlogs();
      }
    }
  };

  const startEdit = (blog: Blog) => {
    setEditing(blog.id);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      tags: blog.tags.join(", "),
      is_published: blog.is_published,
      cover_image: blog.cover_image || "",
      is_visible: blog.is_visible,
    });
    setIsFormOpen(true);
  };

  const toggleVisibility = async (blog: Blog) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("blogs")
      .update({ is_visible: !blog.is_visible })
      .eq("id", blog.id);

    if (error) toast.error("Error updating visibility");
    else {
      toast.success(blog.is_visible ? "Hidden" : "Visible");
      fetchBlogs();
    }
  };

  const columns = [
    {
      header: "Post",
      accessorKey: (blog: Blog) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
            {blog.cover_image ? (
              <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
            )}
          </div>
          <div className="min-w-0">
            <p className={cn("font-medium text-sm truncate", !blog.is_visible && "text-muted-foreground italic")}>{blog.title}</p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">/{blog.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Visibility",
      accessorKey: (blog: Blog) => (
        <button 
          onClick={() => toggleVisibility(blog)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            blog.is_visible ? "text-emerald-500 hover:bg-emerald-500/10" : "text-slate-500 hover:bg-slate-500/10"
          )}
        >
          {blog.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )
    },
    {
      header: "Status",
      accessorKey: (blog: Blog) => (
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[9px] font-mono px-2 py-0.5 rounded tracking-wider",
            blog.is_published ? "bg-foreground/10 text-foreground" : "bg-muted text-muted-foreground"
          )}>
            {blog.is_published ? "published" : "draft"}
          </span>
          <span className={cn(
            "text-[9px] font-mono px-2 py-0.5 rounded tracking-wider",
            blog.is_archived ? "bg-red-500/10 text-red-500/80" : "bg-emerald-500/10 text-emerald-500/80"
          )}>
            {blog.is_archived ? "archived" : "live"}
          </span>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 skeleton rounded" />
        <div className="h-64 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-roashe text-foreground">Blog Posts</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Manage articles, guides, and updates</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DrawerContent className="max-w-5xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>{editing ? "Edit Post" : "New Post"}</DrawerTitle>
            <DrawerDescription>
              Write and publish engaging content for your readers.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerScrollArea>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Post title"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="url-slug"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">Excerpt</label>
              <input
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Short summary for cards..."
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Content (Markdown)</label>
                <div className="flex bg-muted p-1 rounded-lg gap-1">
                  <button 
                    type="button"
                    onClick={() => setContentPreview(false)}
                    className={cn("px-3 py-1 text-[10px] font-mono uppercase rounded transition-all", !contentPreview ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground")}
                  >
                    Edit
                  </button>
                  <button 
                    type="button"
                    onClick={() => setContentPreview(true)}
                    className={cn("px-3 py-1 text-[10px] font-mono uppercase rounded transition-all", contentPreview ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground")}
                  >
                    Preview
                  </button>
                </div>
              </div>
              
              {contentPreview ? (
                <div className="min-h-[300px] p-4 rounded-xl border border-border bg-background/50">
                  {form.content ? <MarkdownRenderer content={form.content} /> : <p className="text-sm text-muted-foreground italic">No content to preview.</p>}
                </div>
              ) : (
                <textarea 
                  value={form.content} 
                  onChange={(e) => setForm({ ...form, content: e.target.value })} 
                  placeholder="Write your article here..." 
                  rows={20} 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all resize-y font-mono" 
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase">Tags (comma separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Next.js, Tailwind, Tutorial..."
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="rounded accent-foreground w-4 h-4"
                />
                Publish immediately
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Visible on Portfolio</label>
                <p className="text-xs text-muted-foreground">Toggle this post visibility to the public.</p>
              </div>
              <button 
                 type="button"
                 onClick={() => setForm({ ...form, is_visible: !form.is_visible })}
                 className={cn(
                   "w-10 h-5 rounded-full transition-colors relative",
                   form.is_visible ? "bg-primary" : "bg-muted"
                 )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform",
                  form.is_visible ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </div>

          </DrawerScrollArea>
        <DrawerFooter>
          <button type="button" onClick={handleSubmit} className="flex-1 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            {editing ? "Update Post" : "Add Post"}
          </button>
          <button type="button" onClick={resetForm} className="px-8 py-3 bg-muted text-muted-foreground text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accent">
            Cancel
          </button>
        </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AdminTable
        data={optimisticItems}
        columns={columns}
        onEdit={startEdit}
        onArchive={archiveItem}
        onRestore={restoreItem}
        onDelete={deleteItem}
        onBulkArchive={bulkArchive}
        onBulkRestore={bulkRestore}
        onBulkDelete={bulkDelete}
        searchKey="title"
        searchPlaceholder="Filter articles..."
      />
    </div>
  );
}
