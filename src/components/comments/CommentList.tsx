import { useEffect, useState } from "react";
import { Comment } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { CommentCard } from "./CommentCard";

interface CommentListProps {
  postId: string;
  parentCommentId?: string;
}

export const CommentList = ({ postId, parentCommentId }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const query = supabase
        .from("comments")
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
        .order("created_at", { ascending: true });

      if (parentCommentId) {
        query.eq("parent_comment_id", parentCommentId);
      } else {
        query.eq("post_id", postId).is("parent_comment_id", null);
      }

      const { data, error } = await query;

      if (!error && data) {
        setComments(data as Comment[]);
      }
      setLoading(false);
    };

    fetchComments();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("comments-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: parentCommentId
            ? `parent_comment_id=eq.${parentCommentId}`
            : `post_id=eq.${postId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, parentCommentId]);

  if (loading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
};