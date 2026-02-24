import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export function AdminBlog() {
  const { user, loading: authLoading, logout } = useAuth();
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
  const [uploading, setUploading] = useState(false);

  const { data: posts, refetch } = trpc.blog.list.useQuery();
  const createMutation = trpc.blog.create.useMutation();
  const updateMutation = trpc.blog.update.useMutation();
  const deleteMutation = trpc.blog.delete.useMutation();

  // Show login button if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access the blog admin panel.
          </p>
          <Button onClick={() => window.location.href = getLoginUrl()} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  // Redirect if authenticated but not admin
  if (!authLoading && user && user.role !== 'admin') {
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
        authorAvatar: "https://files.manuscdn.com/user_upload_by_module/session_file/102747574/VfJDjDQfCyAxxTcZ.png",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        
        // Upload to storage
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image: base64,
            filename: file.name 
          }),
        });

        if (!response.ok) throw new Error('Upload failed');
        
        const { url } = await response.json();
        
        // Insert markdown image syntax at cursor position
        const imageMarkdown = `\n![${file.name}](${url})\n`;
        setContent(prev => prev + imageMarkdown);
        
        toast.success('Image uploaded successfully!');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
      setUploading(false);
    }
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
            <Button 
              variant="outline" 
              onClick={async () => {
                await logout();
                setLocation('/');
                toast.success('Logged out successfully');
              }}
            >
              Logout
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
                <div className="mb-2 flex gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Load Markdown File</label>
                    <input
                      type="file"
                      accept=".md,.markdown"
                      onChange={handleFileUpload}
                      className="block text-sm text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="block text-sm text-muted-foreground"
                    />
                    {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Tip: Upload images to insert them into your content. For videos, paste YouTube/Vimeo embed codes directly.
                </p>
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
