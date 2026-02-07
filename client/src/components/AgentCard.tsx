import { Link } from "react-router-dom";
import { BadgeCheck, Users, Eye } from "lucide-react";
import { Agent } from "@/types";
import { formatViewerCount } from "@/lib/mockData";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link
      to={agent.isLive ? `/stream/stream-${agent.id}` : `/agent/${agent.id}`}
      className="stream-card group block p-4 min-w-[200px]"
    >
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-3">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-16 h-16 rounded-full border-2 border-border/50"
          />
          {agent.isLive && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 live-badge text-[9px] px-1.5 py-0.5">
              LIVE
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold flex items-center gap-1 text-foreground">
          {agent.name}
          {agent.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary" />}
        </h3>

        {/* Category */}
        <span className="text-xs text-muted-foreground mt-0.5">{agent.category}</span>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {formatViewerCount(agent.followers)}
          </span>
          {agent.isLive && agent.currentViewers && (
            <span className="flex items-center gap-1 text-primary">
              <Eye className="w-3 h-3" />
              {formatViewerCount(agent.currentViewers)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
