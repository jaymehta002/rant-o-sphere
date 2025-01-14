import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Comment } from "@/types";
import { CreateComment } from "./CreateComment";
import { CommentList } from "./CommentList";
import { format } from "date-fns";

interface CommentCardProps {
  comment: Comment;
}

export const CommentCard = ({ comment }: CommentCardProps) => {
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { toast } = useToast();
  const { session } = useSessionContext();

  const handleReaction = async (type: "like" | "dislike") => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to react to comments",
        variant: "destructive",
      });
      return;
    }

    const { data: existingReaction } = await supabase
      .from("reactions")
      .select("*")
      .eq("comment_id", comment.id)
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
        comment_id: comment.id,
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
    if (!session || session.user.id !== comment.user_id) return;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", comment.id);

    if (error) {
      toast({
        title: "Error deleting comment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.profiles?.avatar_url || undefined} />
            <AvatarFallback>
              {comment.profiles?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {comment.profiles?.username || "Anonymous"} •{" "}
                {format(new Date(comment.created_at), "PPp")}
              </p>
              {session?.user.id === comment.user_id && (
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
            <p className="mt-2">{comment.content}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 border-t">
        <div className="flex items-center space-x-4 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction("like")}
            className="text-muted-foreground"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {comment.reactions_aggregate?.aggregate.count || 0}
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
            onClick={() => setShowReply(!showReply)}
            className="text-muted-foreground"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Reply
          </Button>
        </div>
      </CardFooter>
      {showReply && (
        <CardContent className="pt-4 border-t">
          <CreateComment
            postId={comment.post_id!}
            parentCommentId={comment.id}
            onSuccess={() => setShowReply(false)}
          />
        </CardContent>
      )}
      {comment.parent_comment_id === null && (
        <CardContent className="pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
            className="text-muted-foreground"
          >
            {showReplies ? "Hide replies" : "Show replies"}
          </Button>
          {showReplies && <CommentList postId={comment.post_id!} parentCommentId={comment.id} />}
        </CardContent>
      )}
    </Card>
  );
};