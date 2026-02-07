import { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  ExternalLink,
  Download,
  QrCode,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { MOCK_TRANSACTIONS } from "@/lib/mockData";

const STATUS_MAP = {
  confirmed: { icon: CheckCircle, color: "text-neon-green", label: "Confirmed" },
  pending: { icon: Loader2, color: "text-primary", label: "Pending" },
  failed: { icon: AlertCircle, color: "text-destructive", label: "Failed" },
};

const TYPE_ICON = {
  tip: Zap,
  withdrawal: ArrowUpRight,
  deposit: ArrowDownLeft,
  subscription: TrendingUp,
};

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"all" | "tips" | "deposits" | "withdrawals">("all");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const balance = 142.5;
  const pendingTips = 3.2;
  const usdEquivalent = (balance * 2.45).toFixed(2);

  const filteredTx = MOCK_TRANSACTIONS.filter((tx) => {
    if (activeTab === "all") return true;
    if (activeTab === "tips") return tx.type === "tip";
    if (activeTab === "deposits") return tx.type === "deposit";
    if (activeTab === "withdrawals") return tx.type === "withdrawal";
    return true;
  });

  return (
    <Layout>
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-foreground mb-6">Wallet</h1>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel p-6 neon-glow-cyan">
            <p className="text-xs text-muted-foreground mb-1">x402 Balance</p>
            <p className="text-3xl font-bold font-mono text-primary">{balance}</p>
            <p className="text-xs text-muted-foreground mt-1">≈ ${usdEquivalent} USD</p>
          </div>
          <div className="glass-panel p-6">
            <p className="text-xs text-muted-foreground mb-1">Pending Tips</p>
            <p className="text-2xl font-bold font-mono text-foreground">{pendingTips}</p>
            <p className="text-xs text-muted-foreground mt-1">Processing...</p>
          </div>
          <div className="glass-panel p-6">
            <p className="text-xs text-muted-foreground mb-1">Withdrawable</p>
            <p className="text-2xl font-bold font-mono text-foreground">{(balance - pendingTips).toFixed(1)}</p>
            <p className="text-xs text-neon-green mt-1">Available now</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Deposit */}
          <div className="glass-panel p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-neon-green" />
              Deposit
            </h3>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/50">
              <QrCode className="w-12 h-12 text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Your Wallet Address</p>
                <p className="text-xs font-mono text-foreground truncate">
                  0x1a2b3c4d5e6f7890abcdef1234567890abcdef12
                </p>
              </div>
              <button
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="Copy address"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Send x402 tokens on Axiom network. Min deposit: 0.1 x402
            </p>
          </div>

          {/* Withdraw */}
          <div className="glass-panel p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-secondary" />
              Withdraw
            </h3>
            <input
              type="number"
              placeholder="Amount to withdraw..."
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all mb-2"
            />
            <input
              type="text"
              placeholder="Destination address (0x...)"
              className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all mb-2"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>Gas estimate: ~0.002 x402</span>
              <span>Min: 1 x402</span>
            </div>
            <Button className="w-full gradient-secondary text-secondary-foreground font-semibold hover:opacity-90">
              Withdraw
            </Button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="glass-panel">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Transaction History
            </h3>
            <div className="flex gap-1.5">
              {(["all", "tips", "deposits", "withdrawals"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === tab
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border/30">
            {filteredTx.map((tx) => {
              const StatusInfo = STATUS_MAP[tx.status];
              const StatusIcon = StatusInfo.icon;
              const TypeIcon = TYPE_ICON[tx.type];
              const isPositive = tx.amount > 0;

              return (
                <div key={tx.id} className="p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isPositive ? "bg-neon-green/10" : "bg-muted"}`}>
                    <TypeIcon className={`w-4 h-4 ${isPositive ? "text-neon-green" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                      <StatusIcon className={`w-3 h-3 ${StatusInfo.color} ${tx.status === "pending" ? "animate-spin" : ""}`} />
                      {StatusInfo.label}
                      <span>·</span>
                      {tx.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-mono font-semibold ${isPositive ? "text-neon-green" : "text-foreground"}`}>
                      {isPositive ? "+" : ""}{tx.amount} x402
                    </p>
                    {tx.txHash && (
                      <a
                        href="#"
                        className="text-[10px] text-primary hover:underline flex items-center gap-0.5 justify-end"
                      >
                        {tx.txHash} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
