import { useState, useRef, useEffect } from "react";
import { Send, Smile, AtSign, Zap } from "lucide-react";
import { ChatMessage } from "@/types";
import { MOCK_CHAT_MESSAGES, timeAgo } from "@/lib/mockData";

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      userId: "me",
      username: "You",
      message: input,
      type: "text",
      role: "viewer",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const getRoleColor = (role: ChatMessage["role"]) => {
    switch (role) {
      case "agent": return "text-primary";
      case "moderator": return "text-neon-green";
      case "subscriber": return "text-neon-magenta";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Stream Chat</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="viewer-dot" />
          <span>3,420 watching</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`text-sm ${msg.type === "tip" ? "glass-panel p-2 border-glow" : ""} ${msg.type === "subscription" ? "glass-panel p-2 border border-neon-magenta/30" : ""}`}>
            {msg.type === "system" || msg.type === "subscription" ? (
              <p className="text-xs text-center text-neon-magenta">{msg.message}</p>
            ) : (
              <div>
                <span className={`font-semibold text-xs ${getRoleColor(msg.role)}`}>
                  {msg.username}
                </span>
                {msg.type === "tip" && (
                  <span className="ml-1 text-xs font-mono text-primary">
                    <Zap className="w-3 h-3 inline" /> {msg.tipAmount} x402
                  </span>
                )}
                <span className="text-foreground/80 ml-1.5 text-xs">{msg.message}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Send a message..."
              maxLength={500}
              className="w-full h-9 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
