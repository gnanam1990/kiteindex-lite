import { useCallback, useEffect, useState } from "react";
import { Play, ArrowRight, Database, Zap, Code2, AlertTriangle } from "lucide-react";

import { runQuery, MOCK_MODE, getEndpoint, type QueryResult } from "./lib/graphql-client";
import { PRESET_QUERIES, findPreset, type PresetQuery } from "./lib/preset-queries";

import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { QueryEditor } from "./components/query-editor";
import { PresetPicker } from "./components/preset-picker";
import { SchemaSidebar } from "./components/schema-sidebar";
import { ResultViewer } from "./components/result-viewer";
import { SnippetTabs } from "./components/snippet-tabs";

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function readPath(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname;
}

export default function App() {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const onPop = () => setPath(readPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-kite-bg text-kite-fg">
      <SiteHeader onNavigate={navigate} currentPath={path} />
      {path === "/playground" ? <Playground /> : <Home />}
      <SiteFooter />
    </div>
  );
}

function Home() {
  const sample = PRESET_QUERIES[0];
  return (
    <main className="flex-1">
      <section className="kite-gradient border-b border-kite-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-kite-fg mb-5">
            The data layer for Kite.
          </h1>
          <p className="text-base sm:text-lg text-kite-fg/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Free GraphQL API for any data on Kite Mainnet. No sign-up, no API keys. Rate-limited
            by IP. If you need higher limits, ping us.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/playground")}
              className="h-12 px-6 rounded-xl bg-kite-primary text-kite-bg font-semibold text-sm tracking-tight shadow-sm hover:bg-kite-primary/90 transition-all duration-150 inline-flex items-center gap-2"
            >
              Open the playground <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-kite-fg/45 mt-8 font-mono">
            {MOCK_MODE ? "Currently serving mock data" : `Live at ${getEndpoint()}`}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FeatureCard
            icon={Database}
            title="Indexed in real time"
            body="Blocks and transactions land in Postgres within seconds via Ponder. Address-level aggregates for free."
          />
          <FeatureCard
            icon={Zap}
            title="GraphQL with codegen"
            body="Auto-generated schema, paginated lists, where-clauses. Copy a working curl/fetch/TS snippet right from the playground."
          />
          <FeatureCard
            icon={Code2}
            title="Self-host or use ours"
            body="Indexer is open source. Deploy to Railway, Hetzner, or your own VPS. Or just hit our endpoint."
          />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold tracking-tight text-kite-fg mb-4">Example query</h2>
        <p className="text-sm text-kite-fg/60 mb-4">{sample.description}</p>
        <pre className="bg-kite-card border border-kite-border rounded-xl p-4 text-xs font-mono text-kite-fg/85 leading-relaxed overflow-x-auto">
          {sample.query}
        </pre>
        <div className="mt-5">
          <button
            onClick={() => navigate(`/playground?preset=${sample.id}`)}
            className="text-sm font-semibold text-kite-primary hover:text-kite-fg inline-flex items-center gap-1 transition-colors"
          >
            Run this in the playground <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Database;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-kite-card border border-kite-border rounded-xl p-5">
      <div className="w-9 h-9 rounded-lg bg-kite-primary/15 text-kite-primary flex items-center justify-center mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-kite-fg mb-1.5">{title}</h3>
      <p className="text-sm text-kite-fg/65 leading-relaxed">{body}</p>
    </div>
  );
}

function Playground() {
  // Read initial preset from URL ?preset=foo, else default to the first one.
  const initialPresetId =
    new URLSearchParams(window.location.search).get("preset") ?? PRESET_QUERIES[0].id;
  const initialPreset = findPreset(initialPresetId) ?? PRESET_QUERIES[0];

  const [query, setQuery] = useState(initialPreset.query);
  const [variables, setVariables] = useState<Record<string, unknown> | undefined>(
    initialPreset.variables
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(initialPreset.id);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = useCallback(async () => {
    setRunning(true);
    const r = await runQuery(query, variables, selectedPresetId);
    setResult(r);
    setRunning(false);
  }, [query, variables, selectedPresetId]);

  const handleSelectPreset = (preset: PresetQuery) => {
    setQuery(preset.query);
    setVariables(preset.variables);
    setSelectedPresetId(preset.id);
    const params = new URLSearchParams(window.location.search);
    params.set("preset", preset.id);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  const insertField = (typeName: string, field: string) => {
    setQuery((q) => q + `\n# ${typeName}.${field}\n`);
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {MOCK_MODE && (
        <div className="mb-5 flex items-start gap-2 px-4 py-3 rounded-lg bg-kite-primary/8 border border-kite-primary/30 text-kite-fg/85">
          <AlertTriangle className="w-4 h-4 mt-0.5 text-kite-primary flex-shrink-0" />
          <div className="text-xs leading-relaxed">
            <strong className="font-semibold">Mock mode.</strong> No indexer endpoint configured.
            Preset queries return canned sample data so you can see the shape. To get live results,
            stand up <code className="font-mono">@kiteindex/indexer</code> and set{" "}
            <code className="font-mono">VITE_GRAPHQL_ENDPOINT</code>.
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-kite-fg">
            Playground
          </h1>
          <p className="text-xs sm:text-sm text-kite-fg/60 mt-1 font-mono">
            Endpoint: {getEndpoint()}
          </p>
        </div>
        <button
          onClick={handleRun}
          disabled={running}
          className="h-12 px-6 rounded-xl bg-kite-primary text-kite-bg font-semibold text-sm tracking-tight shadow-sm hover:bg-kite-primary/90 disabled:opacity-60 transition-all duration-150 inline-flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {running ? "Running…" : "Run query"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_280px] gap-4">
        <div className="lg:order-1 order-2">
          <SchemaSidebar onInsertField={insertField} />
        </div>
        <div className="lg:order-2 order-1 space-y-4 min-w-0">
          <QueryEditor value={query} onChange={setQuery} />
          <ResultViewer
            data={result?.data ?? null}
            error={result?.error ?? null}
            loading={running}
            durationMs={result?.durationMs ?? null}
            source={result?.source ?? null}
          />
        </div>
        <div className="lg:order-3 order-3 space-y-4">
          <PresetPicker selectedId={selectedPresetId} onSelect={handleSelectPreset} />
          <SnippetTabs query={query} variables={variables} endpoint={getEndpoint()} />
        </div>
      </div>
    </main>
  );
}
