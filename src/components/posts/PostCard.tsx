import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsDown, ThumbsUp, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Post, Reaction } from "@/types";
import { CreateComment } from "@/components/comments/CreateComment";
import { CommentList } from "@/components/comments/CommentList";
import { format } from "date-fns";

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
}

export const PostCard = ({ post, onDelete }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const { toast } = useToast();
  const { session } = useSessionContext();

  const handleReaction = async (type: "like" | "dislike") => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to react to posts",
        variant: "destructive",
      });
      return;
    }

    const { data: existingReaction } = await supabase
      .from("reactions")
      .select("*")
      .eq("post_id", post.id)
      .eq("user_id", session.user.id)
      .single();

    if (existingReaction) {
      if (existingReaction.type === type) {
        const { error } = await supabase
          .from("reactions")
          .delete()
          .eq("id", existingReaction.id);

        if (error) {
          toast({
            title: "Error removing reaction",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        const { error } = await supabase
          .from("reactions")
          .update({ type })
          .eq("id", existingReaction.id);

        if (error) {
          toast({
            title: "Error updating reaction",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } else {
      const { error } = await supabase.from("reactions").insert({
        post_id: post.id,
        user_id: session.user.id,
        type,
      });

      if (error) {
        toast({
          title: "Error adding reaction",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!session || session.user.id !== post.user_id) return;

    const { error } = await supabase.from("posts").delete().eq("id", post.id);

    if (error) {
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Post deleted",
        description: "Your post has been removed",
      });
      onDelete?.();
    }
  };

  return (
    <Card className="w-full mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start space-x-4 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.profiles?.avatar_url || undefined} />
          <AvatarFallback>
            {post.profiles?.username?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Posted by {post.profiles?.username || "Anonymous"} •{" "}
              {format(new Date(post.created_at), "PPp")}
            </p>
            {session?.user.id === post.user_id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-lg">{post.content}</p>
        </div>
      </CardHeader>
      <CardFooter className="px-4 py-2 border-t">
        <div className="flex items-center space-x-4 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction("like")}
            className="text-muted-foreground"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {post.reactions_aggregate?.aggregate.count || 0}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction("dislike")}
            className="text-muted-foreground"
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-muted-foreground"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </Button>
        </div>
      </CardFooter>
      {showComments && (
        <CardContent className="pt-4 border-t">
          <CreateComment postId={post.id} />
          <CommentList postId={post.id} />
        </CardContent>
      )}
    </Card>
  );
};