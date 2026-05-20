import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface AddressDisplayProps {
  address: string;
  className?: string;
}

export function AddressDisplay({ address, className = "" }: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);
  const short = `${address.slice(0, 6)}…${address.slice(-4)}`;

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs ${className}`}>
      <span className="text-kite-fg/85">{short}</span>
      <button
        onClick={copy}
        className="p-0.5 rounded text-kite-fg/40 hover:text-kite-fg hover:bg-kite-muted transition-colors"
        title="Copy"
      >
        {copied ? <Check className="w-3 h-3 text-kite-accent" /> : <Copy className="w-3 h-3" />}
      </button>
    </span>
  );
}
