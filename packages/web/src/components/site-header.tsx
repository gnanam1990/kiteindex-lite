import { ExternalLink } from "lucide-react";
import { KiteLogo } from "./kite-logo";

interface SiteHeaderProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export function SiteHeader({ onNavigate, currentPath }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-kite-border bg-kite-bg/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("/");
          }}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <KiteLogo />
          <span className="hidden sm:inline-block h-4 w-px bg-kite-border" />
          <span className="hidden sm:inline-block font-sans text-xs font-bold tracking-widest text-kite-primary uppercase">
            Index Lite
          </span>
        </a>

        <nav className="flex items-center gap-1">
          <NavLink
            href="/"
            label="Home"
            active={currentPath === "/"}
            onNavigate={onNavigate}
          />
          <NavLink
            href="/playground"
            label="Playground"
            active={currentPath === "/playground"}
            onNavigate={onNavigate}
          />
          <a
            href="https://github.com/gnanam1990/kiteindex-lite"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-kite-fg/70 hover:text-kite-fg hover:bg-kite-muted transition-colors"
          >
            GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate: (path: string) => void;
}) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(href);
      }}
      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
        active
          ? "bg-kite-primary/10 text-kite-primary"
          : "text-kite-fg/70 hover:text-kite-fg hover:bg-kite-muted"
      }`}
    >
      {label}
    </a>
  );
}
