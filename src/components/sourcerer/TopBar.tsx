import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-zinc-50/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-50/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Sourcerer
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground">
          <a className="hover:text-foreground" href="#">About</a>
          <a className="hover:text-foreground" href="#">Personas</a>
          <a className="hover:text-foreground" href="#">Docs</a>
        </nav>
      </div>
    </header>
  );
}