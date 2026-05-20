import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";

interface QueryEditorProps {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}

// Treat the GraphQL editor as plain mono text — full language support would pull
// in cm6-graphql which is heavier than v0.1 needs. The result viewer uses JSON below.
export function QueryEditor({ value, onChange, readOnly }: QueryEditorProps) {
  return (
    <div className="border border-kite-border rounded-lg overflow-hidden bg-kite-bg">
      <div className="px-3 py-1.5 border-b border-kite-border bg-kite-muted/60 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest font-bold text-kite-fg/55">
          GraphQL
        </span>
        <span className="text-[10px] font-mono text-kite-fg/45">{value.length} chars</span>
      </div>
      <CodeMirror
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        extensions={[EditorView.lineWrapping]}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: true,
          autocompletion: false,
        }}
        height="320px"
        theme="light"
      />
    </div>
  );
}
