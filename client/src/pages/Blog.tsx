import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

// Topic categories with gradient colors
const topics = [
  { name: "AI and Automation", gradient: "from-purple-500 via-violet-500 to-purple-600" },
  { name: "Local Hosting", gradient: "from-green-500 via-emerald-500 to-teal-600" },
  { name: "Beginner Guides", gradient: "from-cyan-400 via-blue-400 to-indigo-500" },
  { name: "Intermediate Guides", gradient: "from-orange-500 via-amber-500 to-yellow-500" },
  { name: "Case Studies", gradient: "from-pink-500 via-rose-500 to-red-500" },
  { name: "Sovereign AI", gradient: "from-violet-600 via-purple-600 to-fuchsia-600" },
  { name: "Free Stuff", gradient: "from-emerald-400 via-green-400 to-lime-500" },
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [visiblePosts, setVisiblePosts] = useState(6);
  
  const { data: blogPosts, isLoading } = trpc.blog.list.useQuery();

  const filteredPosts = (blogPosts || []).filter((post) => {
    // Filter by search query
    const matchesSearch = searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by selected topic
    const matchesTopic = selectedTopic === null ||
      (post.tags || "").toLowerCase().includes(selectedTopic.toLowerCase());
    
    return matchesSearch && matchesTopic;
  });

  const displayedPosts = filteredPosts.slice(0, visiblePosts);
  const hasMore = visiblePosts < filteredPosts.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-6">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="GTM Planetary" className="h-10 w-10" />
            <span className="font-orbitron text-xl font-bold">GTM Planetary Blog</span>
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-orbitron text-3xl font-bold">Topics</h2>
            {selectedTopic && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTopic(null);
                  setVisiblePosts(6);
                }}
              >
                <i className="fas fa-times mr-2"></i>
                Clear Filter
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.name}
                onClick={() => {
                  if (selectedTopic === topic.name) {
                    setSelectedTopic(null); // Deselect if clicking the same topic
                  } else {
                    setSelectedTopic(topic.name);
                    setSearchQuery(""); // Clear search when selecting topic
                  }
                  setVisiblePosts(6); // Reset pagination
                }}
                className={`relative h-32 rounded-lg bg-gradient-to-br ${topic.gradient} overflow-hidden group cursor-pointer transition-all hover:scale-105 ${
                  selectedTopic === topic.name ? 'ring-4 ring-white scale-105' : ''
                }`}
              >
                <div className={`absolute inset-0 transition-colors ${
                  selectedTopic === topic.name ? 'bg-black/10' : 'bg-black/20 group-hover:bg-black/10'
                }`} />
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
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : displayedPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="bg-card border-border hover:border-primary/50 transition-all hover:scale-105 h-full cursor-pointer">
                    <CardContent className="p-6">
                      {/* Date */}
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>

                      {/* Title */}
                      <h3 className="font-orbitron text-xl font-bold mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.description || ""}
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={post.authorAvatar || "https://files.manuscdn.com/user_upload_by_module/session_file/102747574/VfJDjDQfCyAxxTcZ.png"}
                          alt={post.author}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="text-sm">
                          <p className="font-medium">{post.author}</p>
                          {post.authorCompany && (
                            <p className="text-muted-foreground text-xs">{post.authorCompany}</p>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {(post.tags || "").split(',').filter(Boolean).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => setVisiblePosts(prev => prev + 6)}
              >
                Load More
              </Button>
            </div>
          )}
        </div>

        {/* Newsletter Subscription Widget */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="font-orbitron text-2xl font-bold mb-2">Stay Updated</h3>
                <p className="text-muted-foreground">
                  Get the latest AI automation insights, guides, and case studies delivered to your inbox.
                </p>
              </div>
              <NewsletterForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  
  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      setStatus("success");
      setMessage(data.message || "Successfully subscribed!");
      setEmail("");
    },
    onError: (error) => {
      setStatus("error");
      setMessage(error.message || "Failed to subscribe. Please try again.");
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    subscribeMutation.mutate({ email });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="flex-1"
          required
        />
        <Button
          type="submit"
          disabled={status === "loading" || !email}
          className="px-6"
        >
          {status === "loading" ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Subscribing...
            </>
          ) : (
            <>
              <i className="fas fa-envelope mr-2"></i>
              Subscribe
            </>
          )}
        </Button>
      </div>
      
      {status === "success" && (
        <div className="flex items-center gap-2 text-green-500 text-sm">
          <i className="fas fa-check-circle"></i>
          <span>{message}</span>
        </div>
      )}
      
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <i className="fas fa-exclamation-circle"></i>
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}
