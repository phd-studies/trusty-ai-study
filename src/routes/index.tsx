import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/sourcerer/TopBar";
import { ArrowUp, Sparkles } from "lucide-react";
import { PIPELINE_STAGES } from "@/mock/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sourcerer — AI you can trust" },
      {
        name: "description",
        content:
          "Ask anything. Sourcerer drafts an answer, then has other AI models fact-check, debate, and improve it.",
      },
      { property: "og:title", content: "Sourcerer" },
      {
        property: "og:description",
        content: "AI made learning faster. Now we need to make it trustworthy.",
      },
    ],
  }),
  component: Home,
});

const SUGGESTIONS = [
  "Explain how SSMs compare to Transformers",
  "Explain recursion in programming",
  "How does mRNA vaccine technology work?",
  "What caused the 2008 financial crisis?",
];

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(
      () => setStatusIdx((i) => Math.min(i + 1, PIPELINE_STAGES.length - 1)),
      1500,
    );
    const done = setTimeout(() => {
      navigate({ to: "/result", search: { q: query } });
    }, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [loading]);

  const submit = (text: string) => {
    if (!text.trim() || loading) return;
    setQuery(text);
    setStatusIdx(0);
    setLoading(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-foreground">
      <TopBar />
      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col items-center justify-center px-6 pb-20">
        {!loading ? (
          <>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs text-muted-foreground shadow-sm">
              <Sparkles className="h-3 w-3" />
              AI made learning faster. Now we make it trustworthy.
            </div>
            <h1 className="text-center text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              What do you want to learn?
            </h1>
            <p className="mt-3 text-center text-base text-muted-foreground">
              Ask anything. A panel of AI reviewers will critique the answer.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(query);
              }}
              className="mt-10 w-full"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 shadow-md transition focus-within:border-foreground/20 focus-within:shadow-lg">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask Sourcerer…"
                  className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background transition hover:opacity-90 disabled:opacity-30"
                  aria-label="Submit"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs text-muted-foreground shadow-sm transition hover:border-foreground/20 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        ) : (
          <LoadingState statusIdx={statusIdx} query={query} />
        )}
      </main>
    </div>
  );
}

function LoadingState({ statusIdx, query }: { statusIdx: number; query: string }) {
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Question</div>
        <div className="mt-1 text-base text-foreground">{query}</div>
      </div>

      <div className="space-y-3">
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-3 w-full animate-pulse rounded-full bg-zinc-200" />
        <div className="h-3 w-11/12 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-3 w-9/12 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-3 w-10/12 animate-pulse rounded-full bg-zinc-200" />
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
        </span>
        <span key={statusIdx} className="animate-in fade-in duration-300">
          {PIPELINE_STAGES[statusIdx]}
        </span>
      </div>
    </div>
  );
}
