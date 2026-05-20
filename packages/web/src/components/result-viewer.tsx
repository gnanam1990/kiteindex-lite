import { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { AlertTriangle, Loader2, Table2, Braces } from "lucide-react";
import { AddressDisplay } from "./address-display";
import { isAddress, isHash, relativeFromUnix, shortHash } from "../lib/format";

interface ResultViewerProps {
  data: unknown;
  error: string | null;
  loading: boolean;
  durationMs: number | null;
  source: "live" | "mock" | null;
}

type Mode = "table" | "json";

export function ResultViewer({ data, error, loading, durationMs, source }: ResultViewerProps) {
  const [mode, setMode] = useState<Mode>("table");

  const itemsContainer = useMemo(() => extractItems(data), [data]);
  const hasTable = itemsContainer && itemsContainer.items.length > 0;

  return (
    <div className="bg-kite-card border border-kite-border rounded-xl overflow-hidden flex flex-col min-h-[200px]">
      <header className="px-4 py-2 border-b border-kite-border bg-kite-muted/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-bold text-kite-fg/65">
            Result
          </span>
          {source && (
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                source === "mock"
                  ? "bg-kite-primary/15 text-kite-primary"
                  : "bg-kite-accent/15 text-kite-accent"
              }`}
              title={
                source === "mock"
                  ? "Mock data — set VITE_GRAPHQL_ENDPOINT for live results"
                  : "Live response from the indexer"
              }
            >
              {source}
            </span>
          )}
          {durationMs !== null && (
            <span className="text-[11px] font-mono text-kite-fg/50 tabular-nums">
              {Math.round(durationMs)}ms
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-kite-bg border border-kite-border rounded-md p-0.5">
          <ModeButton
            active={mode === "table"}
            onClick={() => setMode("table")}
            icon={Table2}
            label="Table"
            disabled={!hasTable}
          />
          <ModeButton
            active={mode === "json"}
            onClick={() => setMode("json")}
            icon={Braces}
            label="JSON"
          />
        </div>
      </header>

      <div className="flex-1 min-h-[180px]">
        {loading && (
          <div className="flex items-center gap-2 px-4 py-8 text-sm text-kite-fg/60">
            <Loader2 className="w-4 h-4 animate-spin text-kite-primary" />
            Running query…
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-3 px-4 py-5 text-sm text-kite-destructive">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold mb-0.5">Query error</div>
              <div className="text-xs font-mono break-all text-kite-fg/70">{error}</div>
            </div>
          </div>
        )}

        {!loading && !error && data === null && (
          <div className="px-4 py-8 text-sm text-kite-fg/55 text-center">
            Pick a preset query on the right and hit Run.
          </div>
        )}

        {!loading && !error && data !== null && mode === "table" && hasTable && (
          <TableView items={itemsContainer.items} />
        )}

        {!loading && !error && data !== null && mode === "table" && !hasTable && (
          <div className="px-4 py-5 text-xs text-kite-fg/55">
            Response doesn't have a list of items. Switch to JSON to inspect it.
          </div>
        )}

        {!loading && !error && data !== null && mode === "json" && (
          <CodeMirror
            value={JSON.stringify(data, null, 2)}
            readOnly
            extensions={[json()]}
            theme="light"
            basicSetup={{ lineNumbers: false, foldGutter: true, highlightActiveLine: false }}
            height="320px"
          />
        )}
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon: Icon,
  label,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Table2;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded transition-colors ${
        active
          ? "bg-kite-primary text-kite-bg"
          : "text-kite-fg/60 hover:text-kite-fg disabled:opacity-40 disabled:cursor-not-allowed"
      }`}
    >
      <Icon className="w-3 h-3" /> {label}
    </button>
  );
}

interface ItemsContainer {
  items: Record<string, unknown>[];
}

function extractItems(data: unknown): ItemsContainer | null {
  if (!data || typeof data !== "object") return null;
  for (const value of Object.values(data as Record<string, unknown>)) {
    if (
      value &&
      typeof value === "object" &&
      "items" in (value as Record<string, unknown>) &&
      Array.isArray((value as { items: unknown }).items)
    ) {
      const items = (value as { items: unknown[] }).items;
      if (items.every((it) => it && typeof it === "object" && !Array.isArray(it))) {
        return { items: items as Record<string, unknown>[] };
      }
    }
  }
  return null;
}

function TableView({ items }: { items: Record<string, unknown>[] }) {
  const columns = useMemo(() => {
    const set = new Set<string>();
    for (const row of items.slice(0, 50)) {
      for (const k of Object.keys(row)) set.add(k);
    }
    return Array.from(set);
  }, [items]);

  return (
    <div className="overflow-auto max-h-[420px]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-kite-muted/80 backdrop-blur-sm">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-kite-fg/55 border-b border-kite-border"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-kite-border/40 hover:bg-kite-muted/40 transition-colors"
            >
              {columns.map((col) => (
                <td key={col} className="px-3 py-2 align-top text-kite-fg/85">
                  <CellValue field={col} value={row[col]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CellValue({ field, value }: { field: string; value: unknown }) {
  if (value === null || value === undefined) {
    return <span className="text-kite-fg/30">—</span>;
  }
  if (typeof value === "string") {
    if (isAddress(value)) return <AddressDisplay address={value} />;
    if (isHash(value)) {
      return (
        <span className="font-mono text-kite-fg/75" title={value}>
          {shortHash(value, 8, 6)}
        </span>
      );
    }
    if (field.includes("timestamp")) {
      return (
        <span className="font-mono text-kite-fg/75" title={value}>
          {relativeFromUnix(value)}
        </span>
      );
    }
    return <span className="font-mono text-kite-fg/85 break-all">{value}</span>;
  }
  if (typeof value === "number") {
    return <span className="font-mono tabular-nums text-kite-fg/85">{value.toLocaleString()}</span>;
  }
  if (typeof value === "boolean") {
    return <span className="font-mono text-kite-fg/75">{String(value)}</span>;
  }
  return (
    <span className="font-mono text-kite-fg/70 break-all">
      {JSON.stringify(value)}
    </span>
  );
}
