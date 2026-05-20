import { useState } from "react";
import { ChevronDown, ChevronRight, Database } from "lucide-react";
import { SCHEMA, type SchemaType } from "../lib/schema";

interface SchemaSidebarProps {
  onInsertField?: (typeName: string, field: string) => void;
}

export function SchemaSidebar({ onInsertField }: SchemaSidebarProps) {
  return (
    <aside className="bg-kite-card border border-kite-border rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-kite-border bg-kite-muted/40 flex items-center gap-1.5">
        <Database className="w-3.5 h-3.5 text-kite-primary" />
        <h3 className="text-xs uppercase tracking-widest font-bold text-kite-fg/65">Schema</h3>
      </div>
      <div className="divide-y divide-kite-border/60">
        {SCHEMA.map((type) => (
          <SchemaTypeRow key={type.name} type={type} onInsertField={onInsertField} />
        ))}
      </div>
      <div className="px-4 py-3 text-[11px] text-kite-fg/45 border-t border-kite-border bg-kite-muted/30">
        Snapshot of <code className="font-mono">ponder.schema.ts</code>. Live introspection lands
        in v0.2.
      </div>
    </aside>
  );
}

function SchemaTypeRow({
  type,
  onInsertField,
}: {
  type: SchemaType;
  onInsertField?: (typeName: string, field: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-2.5 flex items-center gap-1.5 hover:bg-kite-muted/40 transition-colors"
      >
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-kite-fg/40" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-kite-fg/40" />
        )}
        <span className="text-sm font-semibold text-kite-fg">{type.name}</span>
        <span className="text-[11px] font-mono text-kite-fg/45 ml-auto">
          {type.fields.length} fields
        </span>
      </button>
      {open && (
        <div className="pb-2">
          {type.description && (
            <p className="px-7 py-1 text-[11px] text-kite-fg/55">{type.description}</p>
          )}
          {type.fields.map((field) => (
            <button
              key={field.name}
              onClick={() => onInsertField?.(type.name, field.name)}
              className="w-full px-7 py-1.5 flex items-baseline gap-2 hover:bg-kite-primary/5 transition-colors text-left"
            >
              <span className="font-mono text-xs text-kite-fg/85">{field.name}</span>
              <span className="font-mono text-[10px] text-kite-primary">{field.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
