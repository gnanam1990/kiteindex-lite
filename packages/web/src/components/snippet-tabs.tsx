import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

interface SnippetTabsProps {
  query: string;
  variables: Record<string, unknown> | undefined;
  endpoint: string;
}

type Lang = "curl" | "fetch" | "ts";

const LANGS: { id: Lang; label: string }[] = [
  { id: "curl", label: "curl" },
  { id: "fetch", label: "JS fetch" },
  { id: "ts", label: "TypeScript" },
];

export function SnippetTabs({ query, variables, endpoint }: SnippetTabsProps) {
  const [lang, setLang] = useState<Lang>("curl");
  const [copied, setCopied] = useState(false);

  const snippet = useMemo(
    () => buildSnippet(lang, endpoint, query, variables),
    [lang, endpoint, query, variables]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-kite-card border border-kite-border rounded-xl overflow-hidden">
      <header className="px-4 py-2 border-b border-kite-border bg-kite-muted/40 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-kite-bg border border-kite-border rounded-md p-0.5">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors ${
                lang === l.id
                  ? "bg-kite-primary text-kite-bg"
                  : "text-kite-fg/60 hover:text-kite-fg"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded text-kite-fg/70 hover:text-kite-fg hover:bg-kite-muted transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-kite-accent" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </header>
      <pre className="px-4 py-3 text-xs font-mono text-kite-fg/85 leading-relaxed overflow-x-auto max-h-[260px]">
        {snippet}
      </pre>
    </div>
  );
}

function buildSnippet(
  lang: Lang,
  endpoint: string,
  query: string,
  variables: Record<string, unknown> | undefined
): string {
  const body = JSON.stringify(variables ? { query, variables } : { query }, null, 2);

  if (lang === "curl") {
    const escaped = body.replace(/'/g, `'\\''`);
    return `curl -X POST '${endpoint}' \\
  -H 'Content-Type: application/json' \\
  -d '${escaped}'`;
  }

  if (lang === "fetch") {
    return `await fetch('${endpoint}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: ${formatBody(body)},
}).then(r => r.json())`;
  }

  // ts
  return `import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('${endpoint}');

const QUERY = \`${query.replace(/`/g, "\\`")}\`;

const data = await client.request(QUERY${variables ? `, ${JSON.stringify(variables)}` : ""});`;
}

function formatBody(body: string): string {
  // Indent the JSON body inside the JS object literal nicely.
  return body
    .split("\n")
    .map((line, i) => (i === 0 ? line : "    " + line))
    .join("\n");
}
