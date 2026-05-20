import { Sparkles } from "lucide-react";
import { PRESET_QUERIES, type PresetQuery } from "../lib/preset-queries";
import { PreviewBadge } from "./preview-badge";

interface PresetPickerProps {
  selectedId: string | null;
  onSelect: (preset: PresetQuery) => void;
}

export function PresetPicker({ selectedId, onSelect }: PresetPickerProps) {
  return (
    <div className="bg-kite-card border border-kite-border rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-kite-border bg-kite-muted/40 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-kite-primary" />
        <h3 className="text-xs uppercase tracking-widest font-bold text-kite-fg/65">Preset queries</h3>
      </div>
      <ul className="divide-y divide-kite-border/60">
        {PRESET_QUERIES.map((preset) => {
          const isActive = selectedId === preset.id;
          return (
            <li key={preset.id}>
              <button
                onClick={() => onSelect(preset)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  isActive ? "bg-kite-primary/10" : "hover:bg-kite-muted/60"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-sm font-semibold ${
                      isActive ? "text-kite-primary" : "text-kite-fg"
                    }`}
                  >
                    {preset.title}
                  </span>
                  {preset.preview && <PreviewBadge />}
                </div>
                <p className="text-xs text-kite-fg/55 leading-relaxed">{preset.description}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
