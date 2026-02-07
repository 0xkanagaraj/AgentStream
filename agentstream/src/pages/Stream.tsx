import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Share2,
  BadgeCheck,
  Users,
  Eye,
  Clock,
  Heart,
  Bell,
  Zap,
  MessageSquare,
  ChevronRight,
  Signal,
  PictureInPicture2,
  Columns,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import ChatPanel from "@/components/ChatPanel";
import TipPanel from "@/components/TipPanel";
import { useQuery } from "@tanstack/react-query";
import { fetchStreamById } from "@/lib/api";
import { socket } from "@/lib/socket";
import { MOCK_AGENTS, formatViewerCount, formatEarnings } from "@/lib/mockData";
import { useEffect } from "react";
import { toast } from "sonner";

type Tab = "chat" | "tip";

export default function StreamPage() {
  const { streamId } = useParams();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [theaterMode, setTheaterMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Find agent from stream
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { data: stream, isLoading } = useQuery({
    queryKey: ["stream", streamId],
    queryFn: () => fetchStreamById(streamId || ""),
    enabled: !!streamId,
  });

  const agentId = stream?.agentId || "1";
  const agent = MOCK_AGENTS.find((a) => a.id === agentId) || MOCK_AGENTS[0];

  useEffect(() => {
    if (!streamId) return;

    socket.emit("join_stream", streamId);
    console.log("Joined stream:", streamId);

    const handleThought = (data: any) => {
      console.log("Agent thought:", data);
      toast.info(`Agent Thought: ${data.thought}`, {
        duration: 5000,
        position: "bottom-left"
      });
    };

    const handleCommentary = (data: any) => {
      console.log("Agent commentary:", data);
    }

    // Listen for agent thoughts
    socket.on("agent_thought", handleThought);
    socket.on("agent_commentary", handleCommentary);

    return () => {
      socket.off("agent_thought", handleThought);
      socket.off("agent_commentary", handleCommentary);
      socket.emit("leave_stream", streamId); // Optional: if backend supports it
    };
  }, [streamId]);

  if (isLoading) return <div>Loading stream...</div>;
  if (!stream) return <div>Stream not found</div>;

  return (
    <Layout>
      <div className={`max-w-[1600px] mx-auto ${theaterMode ? "px-0" : "px-4"} py-4`}>
        <div className={`flex flex-col ${theaterMode ? "" : "lg:flex-row"} gap-4`}>
          {/* Video + Info */}
          <div className="flex-1 min-w-0">
            {/* Video Player */}
            <div className="relative aspect-video bg-background rounded-lg overflow-hidden border border-border/30 group">
              {/* Video placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={`https://picsum.photos/seed/${agentId}/1280/720`}
                  alt="Stream"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/30" />
              </div>

              {/* Live badge */}
              <div className="absolute top-4 left-4 live-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                LIVE
              </div>

              {/* Latency */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-mono text-foreground/70 glass-panel-strong px-2 py-1">
                <Signal className="w-3 h-3 text-neon-green" />
                <span>1.2s</span>
              </div>

              {/* Controls overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Progress bar */}
                <div className="w-full h-1 bg-muted/50 rounded-full mb-3 cursor-pointer">
                  <div className="h-full bg-primary rounded-full w-[65%]" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-8 h-8 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-xs font-mono text-muted-foreground ml-1">2:34:12</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono text-muted-foreground mr-2">1080p</span>
                    <button
                      onClick={() => setTheaterMode(!theaterMode)}
                      className="w-8 h-8 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                      aria-label="Theater mode"
                    >
                      <Columns className="w-4 h-4" />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                      aria-label="Picture in picture"
                    >
                      <PictureInPicture2 className="w-4 h-4" />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                      aria-label="Fullscreen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream Info Bar */}
            <div className="mt-4 flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex gap-3 flex-1 min-w-0">
                <Link to={`/agent/${agent.id}`}>
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-12 h-12 rounded-full border-2 border-primary/30 shrink-0"
                  />
                </Link>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-foreground truncate">
                    {stream.title || agent.streamTitle || "Live Stream"}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Link
                      to={`/agent/${agent.id}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {agent.name}
                      {agent.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary" />}
                    </Link>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatViewerCount(stream.viewers || agent.currentViewers || 0)}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{agent.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={
                    isFollowing
                      ? "border-primary/30 text-primary hover:bg-primary/10"
                      : "gradient-primary text-primary-foreground hover:opacity-90"
                  }
                >
                  <Heart className={`w-4 h-4 mr-1.5 ${isFollowing ? "fill-primary" : ""}`} />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/50 text-muted-foreground hover:text-foreground"
                >
                  <Bell className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/50 text-muted-foreground hover:text-foreground"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Agent Stats */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Followers", value: formatViewerCount(agent.followers), icon: Users },
                { label: "Total Views", value: formatViewerCount(agent.totalViews), icon: Eye },
                { label: "Earnings", value: `${formatEarnings(agent.totalEarnings)} x402`, icon: Zap },
                { label: "Streams", value: "247", icon: Clock },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="stat-card">
                    <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-sm font-bold font-mono text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="mt-4 glass-panel p-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {agent.description}
              </p>
              {agent.tags && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {agent.tags.map((tag) => (
                    <span key={tag} className="category-chip text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Chat / Tip */}
          <div
            className={`${theaterMode ? "w-full mt-4" : "lg:w-[360px]"
              } glass-panel-strong h-[600px] lg:h-[calc(100vh-6rem)] flex flex-col shrink-0`}
          >
            {/* Tab switcher */}
            <div className="flex border-b border-border/50">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${activeTab === "chat"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab("tip")}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${activeTab === "tip"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Zap className="w-4 h-4" />
                Tip
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "chat" ? (
                <ChatPanel />
              ) : (
                <div className="h-full overflow-y-auto scrollbar-thin">
                  <TipPanel />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
