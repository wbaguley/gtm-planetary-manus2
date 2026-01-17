import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [showMarkdown, setShowMarkdown] = useState(false);
  
  const slug = params?.slug || "";
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const downloadMarkdown = () => {
    if (!post) return;
    const blob = new Blob([post.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${post.slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Markdown downloaded!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Generate structured data for SEO
  const structuredData = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description || "",
    "author": {
      "@type": "Person",
      "name": post.author,
      "jobTitle": "AI Automation Specialist",
      "worksFor": {
        "@type": "Organization",
        "name": post.authorCompany || "GTM Planetary"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "GTM Planetary",
      "logo": {
        "@type": "ImageObject",
        "url": "https://app.gtmplanetary.com/logo.png"
      }
    },
    "datePublished": new Date(post.publishedAt).toISOString(),
    "dateModified": new Date(post.updatedAt).toISOString(),
    "keywords": post.tags || "",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://app.gtmplanetary.com/blog/${post.slug}`
    }
  } : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-orbitron text-4xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-6">
          <Link href="/blog" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="GTM Planetary" className="h-10 w-10" />
            <span className="font-orbitron text-xl font-bold">GTM Planetary Cookbook</span>
          </Link>
        </div>
      </header>

      <div className="container py-12 max-w-4xl">
        {/* Date */}
        <p className="text-muted-foreground mb-4">
          {new Date(post.publishedAt).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>

        {/* Title */}
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-6">
          {post.title}
        </h1>

        {/* Author & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar || "/Circuit2.png"}
              alt={post.author}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium">{post.author}</p>
              {post.authorCompany && (
                <p className="text-sm text-muted-foreground">{post.authorCompany}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMarkdown(true)}
            >
              <i className="fas fa-file-code mr-2"></i>
              View as Markdown
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(post.tags || "").split(',').filter(Boolean).map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
            >
              {tag.trim()}
            </span>
          ))}
        </div>

        {/* Content */}
        <article className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => (
                <h1 className="font-orbitron text-4xl font-bold mt-12 mb-6 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="font-orbitron text-3xl font-bold mt-10 mb-5">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-orbitron text-2xl font-bold mt-8 mb-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-6 leading-relaxed text-base">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mb-6 ml-6 space-y-2 list-disc">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-6 ml-6 space-y-2 list-decimal">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">
                  {children}
                </li>
              ),
              a: ({ href, children }: any) => {
                // Auto-embed YouTube and Vimeo videos
                if (href) {
                  const youtubeMatch = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
                  const vimeoMatch = href.match(/vimeo\.com\/(\d+)/);
                  
                  if (youtubeMatch) {
                    return (
                      <div className="my-8 aspect-video rounded-lg overflow-hidden border border-border">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                          title="YouTube video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    );
                  }
                  
                  if (vimeoMatch) {
                    return (
                      <div className="my-8 aspect-video rounded-lg overflow-hidden border border-border">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                          title="Vimeo video"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    );
                  }
                }
                
                return (
                  <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                );
              },
              code: ({ inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');
                
                if (!inline && match) {
                  return (
                    <div className="relative my-6 rounded-lg border border-border bg-black/50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-black/30">
                        <span className="text-xs text-muted-foreground font-mono">{match[1]}</span>
                        <button
                          onClick={() => copyCode(codeString)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                          <i className="fas fa-copy"></i>
                          Copy
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                }
                
                return (
                  <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-sm" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </div>

      {/* Markdown Modal */}
      <Dialog open={showMarkdown} onOpenChange={setShowMarkdown}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Markdown Source</DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadMarkdown}
              >
                <i className="fas fa-download mr-2"></i>
                Download
              </Button>
            </div>
          </DialogHeader>
          <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono">{post.content}</code>
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
