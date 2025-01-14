import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Navbar } from "@/components/layout/Navbar";
import { PostCard } from "@/components/posts/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const SAMPLE_POSTS = [
  {
    content: "Why do people still use Comic Sans in professional emails? It's 2024!",
    author: "FontEnthusiast",
    timestamp: "2 hours ago",
    votes: 42,
    comments: 15,
  },
  {
    content: "My neighbor's cat keeps judging me through the window. I can feel its disapproval.",
    author: "CatParanoid",
    timestamp: "4 hours ago",
    votes: 128,
    comments: 32,
  },
  {
    content: "Just spent 3 hours debugging only to find a missing semicolon. I need a vacation.",
    author: "TiredDev",
    timestamp: "6 hours ago",
    votes: 256,
    comments: 45,
  },
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-vent-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        {!user ? (
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
            {SAMPLE_POSTS.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;