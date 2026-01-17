import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

export function AdminBlog() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("Wyatt Baguley");
  const [authorCompany, setAuthorCompany] = useState("GTM Planetary");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0]);

  const { data: posts, refetch } = trpc.blog.list.useQuery();
  const createMutation = trpc.blog.create.useMutation();
  const updateMutation = trpc.blog.update.useMutation();
  const deleteMutation = trpc.blog.delete.useMutation();

  // Redirect if not admin
  if (!authLoading && (!user || user.role !== 'admin')) {
    setLocation('/');
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setAuthor("Wyatt Baguley");
    setAuthorCompany("GTM Planetary");
    setDescription("");
    setContent("");
    setTags("");
    setPublishedAt(new Date().toISOString().split('T')[0]);
    setEditingPost(null);
    setShowForm(false);
  };

  const handleEdit = (post: any) => {
    setTitle(post.title);
    setSlug(post.slug);
    setAuthor(post.author);
    setAuthorCompany(post.authorCompany || "GTM Planetary");
    setDescription(post.description || "");
    setContent(post.content);
    setTags(post.tags || "");
    setPublishedAt(new Date(post.publishedAt).toISOString().split('T')[0]);
    setEditingPost(post);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        title,
        slug,
        author,
        authorAvatar: "/Circuit2.png",
        authorCompany,
        description,
        content,
        tags,
        publishedAt: new Date(publishedAt),
      };

      if (editingPost) {
        await updateMutation.mutateAsync({ id: editingPost.id, ...data });
        toast.success("Blog post updated successfully!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Blog post created successfully!");
      }

      refetch();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to save blog post");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Blog post deleted successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog post");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text);
      toast.success("Markdown file loaded!");
    };
    reader.readAsText(file);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/logo.png" alt="GTM Planetary" className="h-10" />
              <span className="font-orbitron text-xl font-bold">Blog Admin</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog">
              <Button variant="outline">View Blog</Button>
            </Link>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "New Post"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {showForm ? (
          <Card className="p-6 mb-8">
            <h2 className="font-orbitron text-2xl font-bold mb-6">
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingPost) {
                        setSlug(generateSlug(e.target.value));
                      }
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Author *</label>
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <Input
                    value={authorCompany}
                    onChange={(e) => setAuthorCompany(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="AI Automation, Technical, Advanced"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Published Date *</label>
                <Input
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content (Markdown) *</label>
                <div className="mb-2">
                  <input
                    type="file"
                    accept=".md,.markdown"
                    onChange={handleFileUpload}
                    className="text-sm text-muted-foreground"
                  />
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        ) : null}

        <div className="space-y-4">
          <h2 className="font-orbitron text-2xl font-bold">All Blog Posts</h2>
          {posts?.map((post) => (
            <Card key={post.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-orbitron text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    By {post.author} • {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.split(',').map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
