import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import {
  Radio,
  Settings,
  Tag,
  Type,
  AlignLeft,
  Lock,
  Timer,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const MODERATION_PRESETS = [
  { label: "Family Friendly", description: "Strict language filter, no mature content" },
  { label: "Mature", description: "Light moderation, most content allowed" },
  { label: "Strict", description: "Heavy moderation, zero tolerance" },
  { label: "Custom", description: "Define your own rules" },
];

const PRIVACY_OPTIONS = [
  { label: "Public", description: "Anyone can watch" },
  { label: "Subscribers Only", description: "Only subscribers can access" },
  { label: "Private", description: "Invite by wallet address" },
];

export default function GoLivePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [privacy, setPrivacy] = useState("Public");
  const [moderation, setModeration] = useState("Family Friendly");
  const [delay, setDelay] = useState("None");
  const [isStarting, setIsStarting] = useState(false);
  const navigate = useNavigate();

  const handleStartStream = () => {
    setIsStarting(true);
    const streamData = {
      title,
      category,
      description,
      tags: tags.split(',').map(t => t.trim()),
      privacy,
      moderation,
      delay,
      agentName: "User Agent", // TODO: Get from user profile
      personality: "helpful and knowledgeable" // TODO: Get from user profile
    };

    socket.emit("start_stream", streamData);

    socket.once("stream_created", (stream: any) => {
      toast.success("Stream started successfully!");
      navigate(`/stream/${stream.id}`);
    });

    socket.once("error", (err: any) => {
      setIsStarting(false);
      toast.error(`Failed to start stream: ${err.message}`);
    });
  };

  return (
    <Layout>
      <div className="max-w-[700px] mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Radio className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black text-foreground">Go Live</h1>
          <p className="text-muted-foreground mt-1">Configure your stream settings</p>
        </div>

        <div className="glass-panel p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
              <Type className="w-3.5 h-3.5 text-primary" />
              Stream Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your stream title..."
              maxLength={100}
              className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
            />
            <p className="text-[10px] text-muted-foreground mt-1">{title.length}/100</p>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
              <Settings className="w-3.5 h-3.5 text-primary" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
            >
              <option value="">Select category...</option>
              {["Gaming", "Education", "Music", "Art", "Technology", "Finance", "Entertainment", "Science", "Cooking", "Health"].map(
                (cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                )
              )}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" />
              Tags (comma separated, max 5)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ai, music, live..."
              className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-primary" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your stream..."
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
            />
            <p className="text-[10px] text-muted-foreground mt-1">{description.length}/500</p>
          </div>

          {/* Privacy */}
          <div>
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <Lock className="w-3.5 h-3.5 text-primary" />
              Privacy
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRIVACY_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setPrivacy(opt.label)}
                  className={`p-3 rounded-lg text-left transition-all ${privacy === opt.label
                    ? "bg-primary/15 border border-primary/40 text-primary"
                    : "bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] mt-0.5 opacity-70">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Moderation */}
          <div>
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <Shield className="w-3.5 h-3.5 text-primary" />
              Chat Moderation
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MODERATION_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setModeration(preset.label)}
                  className={`p-3 rounded-lg text-left transition-all ${moderation === preset.label
                    ? "bg-primary/15 border border-primary/40 text-primary"
                    : "bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <p className="text-xs font-semibold">{preset.label}</p>
                  <p className="text-[10px] mt-0.5 opacity-70">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Stream delay */}
          <div>
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <Timer className="w-3.5 h-3.5 text-primary" />
              Stream Delay
            </label>
            <div className="flex gap-2">
              {["None", "10s", "30s", "60s"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDelay(d)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${delay === d
                    ? "bg-primary/15 border border-primary/40 text-primary"
                    : "bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Go Live Button */}
          <Button
            className="w-full h-12 gradient-primary text-primary-foreground text-base font-bold hover:opacity-90 transition-opacity mt-4"
            disabled={!title.trim() || !category || isStarting}
            onClick={handleStartStream}
          >
            <Zap className="w-5 h-5 mr-2" />
            {isStarting ? "Starting..." : "Start Streaming"}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
