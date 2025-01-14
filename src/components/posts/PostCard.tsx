import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2 } from "lucide-react";

interface PostCardProps {
  content: string;
  author: string;
  timestamp: string;
  votes: number;
  comments: number;
}

export const PostCard = ({ content, author, timestamp, votes: initialVotes, comments }: PostCardProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      setUserVote(null);
      setVotes(initialVotes);
    } else {
      setUserVote(type);
      setVotes(initialVotes + (type === "up" ? 1 : -1));
    }
  };

  return (
    <Card className="w-full mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <div className="flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote("up")}
            className={`p-0 ${userVote === "up" ? "text-vent-secondary" : ""}`}
          >
            <ArrowBigUp className="h-6 w-6" />
          </Button>
          <span className="font-bold">{votes}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote("down")}
            className={`p-0 ${userVote === "down" ? "text-destructive" : ""}`}
          >
            <ArrowBigDown className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            Posted by {author} • {timestamp}
          </p>
          <p className="mt-2 text-lg">{content}</p>
        </div>
      </CardHeader>
      <CardFooter className="px-4 py-2 border-t">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <MessageSquare className="h-4 w-4 mr-2" />
            {comments} Comments
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};