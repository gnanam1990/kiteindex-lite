export function shortHash(hash: string, lead = 6, trail = 4): string {
  if (!hash) return "";
  if (hash.length <= lead + trail) return hash;
  return `${hash.slice(0, lead)}…${hash.slice(-trail)}`;
}

export function isAddress(v: unknown): v is string {
  return typeof v === "string" && /^0x[a-fA-F0-9]{40}$/.test(v);
}

export function isHash(v: unknown): v is string {
  return typeof v === "string" && /^0x[a-fA-F0-9]{40,}$/.test(v);
}

export function relativeFromUnix(timestamp: string | number): string {
  const sec =
    typeof timestamp === "string" ? parseInt(timestamp, 10) : Math.floor(timestamp);
  if (!Number.isFinite(sec)) return String(timestamp);
  const diff = Math.floor(Date.now() / 1000) - sec;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
