import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useSessionContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsLoading(true);
    const { error } = await supabase.from("posts").insert({
      content,
      user_id: session.user.id,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Post created",
        description: "Your rant has been shared with the world!",
      });
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="What's bothering you today?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      <Button
        type="submit"
        disabled={!content.trim() || isLoading}
        className="w-full bg-vent-primary hover:bg-vent-primary/90"
      >
        {isLoading ? "Posting..." : "Share your rant"}
      </Button>
    </form>
  );
};