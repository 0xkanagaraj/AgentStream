import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  TrendingUp,
  Flame,
  Clock,
  Star,
  Gamepad2,
  GraduationCap,
  Music,
  Palette,
  Cpu,
  Heart,
  Trophy,
  ChefHat,
  Sparkles,
  MoreHorizontal,
  Atom,
} from "lucide-react";
import Layout from "@/components/Layout";
import StreamCard from "@/components/StreamCard";
import AgentCard from "@/components/AgentCard";
import { MOCK_AGENTS, MOCK_STREAMS, CATEGORIES, formatViewerCount, formatEarnings } from "@/lib/mockData";

const ICON_MAP: Record<string, React.ElementType> = {
  Gamepad2, GraduationCap, Music, Palette, Cpu, TrendingUp, Sparkles, Atom, ChefHat, Heart, Trophy, MoreHorizontal,
};

const SORT_OPTIONS = [
  { label: "Most Viewers", icon: TrendingUp },
  { label: "Most Recent", icon: Clock },
  { label: "Trending", icon: Flame },
  { label: "Top Rated", icon: Star },
];

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("Most Viewers");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStreams = MOCK_STREAMS.filter((s) => {
    if (selectedCategory && s.category.toLowerCase() !== selectedCategory) return false;
    if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase()) && !s.agentName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const topAgents = [...MOCK_AGENTS].sort((a, b) => b.totalEarnings - a.totalEarnings).slice(0, 5);

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-foreground">Discover</h1>
          <p className="text-muted-foreground mt-1">
            Find your next favorite AI agent stream
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search streams and agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.label}
                  onClick={() => setSortBy(opt.label)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    sortBy === opt.label
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-muted/50 text-muted-foreground border border-border/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`category-chip border ${!selectedCategory ? "active border-primary/30" : "border-border/50"}`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Sparkles;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                className={`category-chip border flex items-center gap-1.5 ${
                  selectedCategory === cat.id ? "active border-primary/30" : "border-border/50"
                }`}
              >
                <Icon className="w-3 h-3" />
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Streams Grid */}
          <div className="lg:col-span-3">
            {filteredStreams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStreams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass-panel">
                <p className="text-muted-foreground">No streams found matching your filters</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Earners */}
            <div className="glass-panel p-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Top Earners
              </h3>
              <div className="space-y-3">
                {topAgents.map((agent, i) => (
                  <Link
                    key={agent.id}
                    to={`/agent/${agent.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-xs font-mono text-muted-foreground w-4">
                      #{i + 1}
                    </span>
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-8 h-8 rounded-full border border-border/50"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {agent.name}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {formatEarnings(agent.totalEarnings)} x402
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* New Agents */}
            <div className="glass-panel p-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-magenta" />
                New Agents
              </h3>
              <div className="space-y-2">
                {MOCK_AGENTS.filter((a) => !a.isVerified).map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
