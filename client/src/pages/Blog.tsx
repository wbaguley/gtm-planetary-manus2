import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Topic categories with gradient colors (OpenAI Cookbook style)
const topics = [
  { name: "HVAC", gradient: "from-orange-400 via-red-400 to-pink-400" },
  { name: "Dental", gradient: "from-blue-400 via-purple-400 to-pink-400" },
  { name: "Electrical", gradient: "from-green-400 via-emerald-400 to-teal-400" },
  { name: "Plumbing", gradient: "from-purple-400 via-violet-400 to-indigo-400" },
  { name: "AI Automation", gradient: "from-orange-500 via-amber-500 to-yellow-400" },
  { name: "Case Studies", gradient: "from-cyan-400 via-blue-400 to-indigo-500" },
];

// Blog posts data (will be populated from database later)
const blogPosts = [
  {
    id: "recursive-large-model-cookbook",
    title: "Recursive Large Model Cookbook",
    excerpt: "A comprehensive guide to building recursive AI systems for trade automation.",
    date: "Jan 15, 2026",
    author: {
      name: "Wyatt Baguley",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wyatt",
    },
    tags: ["AI Automation", "Technical"],
    category: "AI Automation",
  },
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visiblePosts, setVisiblePosts] = useState(6);

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayedPosts = filteredPosts.slice(0, visiblePosts);
  const hasMore = visiblePosts < filteredPosts.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-6">
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.svg" alt="GTM Planetary" className="h-10 w-10" />
              <span className="font-orbitron text-xl font-bold">GTM Planetary Blog</span>
            </a>
          </Link>
        </div>
      </header>

      <div className="container py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <Input
            type="search"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 text-lg"
          />
        </div>

        {/* Topic Tiles */}
        <div className="mb-16">
          <h2 className="font-orbitron text-3xl font-bold mb-8">Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.name}
                className={`relative h-32 rounded-lg bg-gradient-to-br ${topic.gradient} overflow-hidden group cursor-pointer transition-transform hover:scale-105`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative h-full flex items-center justify-center">
                  <h3 className="font-orbitron text-2xl font-bold text-white drop-shadow-lg">
                    {topic.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="mb-16">
          <h2 className="font-orbitron text-3xl font-bold mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <a>
                  <Card className="bg-card border-border hover:border-primary/50 transition-all hover:scale-105 h-full">
                    <CardContent className="p-6">
                      {/* Date */}
                      <p className="text-sm text-muted-foreground mb-3">{post.date}</p>

                      {/* Title */}
                      <h3 className="font-orbitron text-xl font-bold mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-muted-foreground">
                          {post.author.name}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setVisiblePosts(prev => prev + 6)}
                variant="outline"
                size="lg"
              >
                Load More
              </Button>
            </div>
          )}

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No articles found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
