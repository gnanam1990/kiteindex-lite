import { MOCK_RESPONSES } from "./mock-data";

const ENDPOINT = (import.meta.env.VITE_GRAPHQL_ENDPOINT as string | undefined) ?? "";

export const MOCK_MODE = !ENDPOINT;

export interface QueryResult {
  data: unknown | null;
  error: string | null;
  durationMs: number;
  source: "live" | "mock";
}

export async function runQuery(
  query: string,
  variables: Record<string, unknown> | undefined,
  presetId: string | null
): Promise<QueryResult> {
  const start = performance.now();

  if (MOCK_MODE) {
    // Slight artificial delay so the UI feels real.
    await new Promise((r) => setTimeout(r, 250));
    const data = presetId && MOCK_RESPONSES[presetId] ? MOCK_RESPONSES[presetId] : null;
    return {
      data,
      error: data
        ? null
        : "Mock mode: pick a preset query (custom queries need a live VITE_GRAPHQL_ENDPOINT).",
      durationMs: performance.now() - start,
      source: "mock",
    };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) {
      return {
        data: null,
        error: `HTTP ${res.status} ${res.statusText}`,
        durationMs: performance.now() - start,
        source: "live",
      };
    }
    const json = (await res.json()) as { data?: unknown; errors?: { message: string }[] };
    if (json.errors && json.errors.length > 0) {
      return {
        data: json.data ?? null,
        error: json.errors.map((e) => e.message).join("; "),
        durationMs: performance.now() - start,
        source: "live",
      };
    }
    return {
      data: json.data ?? null,
      error: null,
      durationMs: performance.now() - start,
      source: "live",
    };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : "Network error",
      durationMs: performance.now() - start,
      source: "live",
    };
  }
}

export function getEndpoint(): string {
  return ENDPOINT || "(none — mock mode)";
}
