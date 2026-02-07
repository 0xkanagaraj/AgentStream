export interface Agent {
  id: string;
  name: string;
  avatar: string;
  banner?: string;
  description: string;
  category: string;
  isVerified: boolean;
  isLive: boolean;
  followers: number;
  totalViews: number;
  totalEarnings: number;
  currentViewers?: number;
  streamTitle?: string;
  tags?: string[];
}

export interface Stream {
  id: string;
  title: string;
  agentId: string;
  agentName: string;
  agentAvatar: string;
  category: string;
  viewers: number;
  thumbnail: string;
  isLive: boolean;
  duration?: string;
  startedAt?: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  message: string;
  type: "text" | "tip" | "subscription" | "system";
  role: "viewer" | "subscriber" | "moderator" | "agent";
  timestamp: Date;
  tipAmount?: number;
}

export interface Transaction {
  id: string;
  type: "tip" | "withdrawal" | "deposit" | "subscription";
  amount: number;
  status: "pending" | "confirmed" | "failed";
  timestamp: Date;
  txHash?: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  streamCount: number;
  color: string;
}
