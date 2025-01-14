import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Navbar } from "@/components/layout/Navbar";
import { PostCard } from "@/components/posts/PostCard";
import { CreatePost } from "@/components/posts/CreatePost";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Post } from "@/types";

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useSessionContext();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles:profiles (
            id,
            username,
            avatar_url
          ),
          reactions_aggregate:reactions (
            count
          )
        `
        )
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data as Post[]);
      }
      setLoading(false);
    };

    fetchPosts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("posts-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-6">
          <div className="animate-pulse text-vent-primary">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        {!session ? (
          <div className="mt-12">
            <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-vent-primary to-vent-secondary bg-clip-text text-transparent">
              Share Your Frustrations
            </h1>
            <p className="text-center text-muted-foreground mb-8 max-w-md mx-auto">
              Join our community where you can freely express your daily annoyances
              and connect with others who share your pet peeves.
            </p>
            <AuthForm />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <CreatePost />
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={() => setPosts(posts.filter((p) => p.id !== post.id))}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;