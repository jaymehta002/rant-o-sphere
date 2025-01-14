import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface CreateCommentProps {
  postId: string;
  parentCommentId?: string;
  onSuccess?: () => void;
}

export const CreateComment = ({
  postId,
  parentCommentId,
  onSuccess,
}: CreateCommentProps) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useSessionContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsLoading(true);
    const { error } = await supabase.from("comments").insert({
      content,
      user_id: session.user.id,
      post_id: parentCommentId ? null : postId,
      parent_comment_id: parentCommentId || null,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error creating comment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Comment added",
        description: "Your comment has been posted!",
      });
      setContent("");
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px]"
      />
      <Button
        type="submit"
        disabled={!content.trim() || isLoading}
        className="bg-vent-primary hover:bg-vent-primary/90"
      >
        {isLoading ? "Posting..." : "Post comment"}
      </Button>
    </form>
  );
};