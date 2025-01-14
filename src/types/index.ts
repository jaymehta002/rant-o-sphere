export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  reactions_aggregate?: {
    aggregate: {
      count: number;
    };
  };
}

export interface Comment {
  id: string;
  post_id: string | null;
  parent_comment_id: string | null;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  replies?: Comment[];
  reactions_aggregate?: {
    aggregate: {
      count: number;
    };
  };
}

export interface Reaction {
  id: string;
  user_id: string;
  post_id: string | null;
  comment_id: string | null;
  type: 'like' | 'dislike';
  created_at: string;
}