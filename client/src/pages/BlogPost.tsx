import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";

// Blog posts data (will match the data in Blog.tsx)
const blogPosts: Record<string, {
  title: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    company?: string;
  };
  tags: string[];
  content: string;
  githubUrl?: string;
}> = {
  "recursive-large-model-cookbook": {
    title: "Recursive Large Model Cookbook",
    date: "Jan 15, 2026",
    author: {
      name: "Wyatt Baguley",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wyatt",
      company: "GTM Planetary",
    },
    tags: ["AI Automation", "Technical", "Advanced"],
    content: "", // Will be populated from markdown file
    githubUrl: "https://github.com/wbaguley/GTM_Planetary_Site2/blob/main/blog/recursive-large-model-cookbook.md",
  },
};

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  
  const slug = params?.slug || "";
  const post = blogPosts[slug];

  useEffect(() => {
    if (post) {
      fetch(`/blog/${slug}.md`)
        .then(res => res.text())
        .then(text => {
          setContent(text);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load blog content:", err);
          setLoading(false);
        });
    }
  }, [slug, post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-orbitron text-4xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog">
            <a>
              <Button>Back to Blog</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-6">
          <Link href="/blog">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.svg" alt="GTM Planetary" className="h-10 w-10" />
              <span className="font-orbitron text-xl font-bold">GTM Planetary Cookbook</span>
            </a>
          </Link>
        </div>
      </header>

      <div className="container py-12 max-w-4xl">
        {/* Date */}
        <p className="text-muted-foreground mb-4">{post.date}</p>

        {/* Title */}
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-6">
          {post.title}
        </h1>

        {/* Author & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium">{post.author.name}</p>
              {post.author.company && (
                <p className="text-sm text-muted-foreground">{post.author.company}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {post.githubUrl && (
              <a href={post.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <i className="fab fa-github"></i>
                  Open in GitHub
                </Button>
              </a>
            )}
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowMarkdown(true)}
            >
              <i className="fas fa-code"></i>
              View as Markdown
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // Custom styling for markdown elements
              h1: ({ children }) => (
                <h1 className="font-orbitron text-3xl font-bold mt-8 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="font-orbitron text-2xl font-bold mt-6 mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-orbitron text-xl font-bold mt-4 mb-2">{children}</h3>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              code: ({ className, children }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-sm font-mono">
                    {children}
                  </code>
                ) : (
                  <code className={className}>{children}</code>
                );
              },
            }}
          >
            {loading ? "Loading..." : content}
          </ReactMarkdown>
        </article>

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/blog">
            <a>
              <Button variant="outline">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Blog
              </Button>
            </a>
          </Link>
        </div>
      </div>

      {/* Markdown View Dialog */}
      <Dialog open={showMarkdown} onOpenChange={setShowMarkdown}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Markdown Source</DialogTitle>
          </DialogHeader>
          <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono">{post.content}</code>
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
