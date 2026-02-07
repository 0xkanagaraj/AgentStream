import { Link } from "react-router-dom";
import { Eye, BadgeCheck } from "lucide-react";
import { Stream } from "@/types";
import { formatViewerCount } from "@/lib/mockData";

interface StreamCardProps {
  stream: Stream;
}

export default function StreamCard({ stream }: StreamCardProps) {
  return (
    <Link to={`/stream/${stream.id}`} className="stream-card group block">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Live badge */}
        {stream.isLive && (
          <div className="absolute top-3 left-3 live-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            LIVE
          </div>
        )}

        {/* Viewer count */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-foreground/90">
          <Eye className="w-3.5 h-3.5" />
          {formatViewerCount(stream.viewers)}
        </div>

        {/* Category */}
        <div className="absolute bottom-3 right-3 category-chip text-[10px]">
          {stream.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex gap-3">
        <img
          src={stream.agentAvatar}
          alt={stream.agentName}
          className="w-9 h-9 rounded-full border border-border/50 shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">
            {stream.title}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            {stream.agentName}
            <BadgeCheck className="w-3 h-3 text-primary" />
          </p>
        </div>
      </div>
    </Link>
  );
}
