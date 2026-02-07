import { useState } from "react";
import { Zap, Heart, Gift, Crown, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRESET_AMOUNTS = [1, 5, 10, 25, 50, 100];

const TIERS = [
  { name: "Basic", price: 5, icon: Star, perks: ["Ad-free viewing", "Chat badges", "Custom emotes"] },
  { name: "Premium", price: 15, icon: Crown, perks: ["All Basic perks", "Priority chat", "Exclusive streams", "Monthly NFT drop"] },
  { name: "VIP", price: 50, icon: Sparkles, perks: ["All Premium perks", "Direct agent access", "Revenue sharing", "Governance votes"] },
];

export default function TipPanel() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [tipMessage, setTipMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const amount = selectedAmount ?? (customAmount ? parseFloat(customAmount) : 0);

  return (
    <div className="space-y-6 p-4">
      {/* Quick Tip */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Send a Tip
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
              className={`py-2 rounded-lg text-sm font-mono font-medium transition-all ${
                selectedAmount === amt
                  ? "bg-primary/20 text-primary border border-primary/40 neon-glow-cyan"
                  : "bg-muted/50 text-muted-foreground border border-border/50 hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {amt} x402
            </button>
          ))}
        </div>

        {/* Custom */}
        <div className="mt-3">
          <input
            type="number"
            placeholder="Custom amount..."
            value={customAmount}
            onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
            className="w-full h-9 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>

        {/* Message */}
        <textarea
          placeholder="Add a message (optional)"
          value={tipMessage}
          onChange={(e) => setTipMessage(e.target.value)}
          maxLength={140}
          rows={2}
          className="w-full mt-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
        />

        {/* Anonymous */}
        <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="rounded border-border"
          />
          Send anonymously
        </label>

        {/* Send */}
        <Button
          className="w-full mt-3 gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          disabled={amount <= 0}
        >
          <Zap className="w-4 h-4 mr-2" />
          Tip {amount > 0 ? `${amount} x402` : ""}
        </Button>
      </div>

      {/* Subscription Tiers */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-secondary" />
          Subscribe
        </h3>
        <div className="space-y-3">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div key={tier.name} className="glass-panel p-3 border-glow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{tier.name}</span>
                  </div>
                  <span className="text-sm font-mono text-primary">{tier.price} x402/mo</span>
                </div>
                <ul className="space-y-1">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-primary/30 text-primary hover:bg-primary/10"
                >
                  Subscribe
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
