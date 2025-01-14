import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { PostCard } from "@/components/posts/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { Profile as ProfileType, Post } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (!profileError && profileData) {
        setProfile(profileData as ProfileType);
      }

      const { data: postsData, error: postsError } = await supabase
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
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (!postsError && postsData) {
        setPosts(postsData as Post[]);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [id]);

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-6">
          <div className="text-center text-muted-foreground">
            Profile not found
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback>
                {profile.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              <p className="text-sm text-muted-foreground">
                Joined {format(new Date(profile.created_at), "PP")}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={() => setPosts(posts.filter((p) => p.id !== post.id))}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;