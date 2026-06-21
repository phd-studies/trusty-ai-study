import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { TopBar } from "@/components/sourcerer/TopBar";
import { CommentCard, type SidebarComment } from "@/components/sourcerer/CommentCard";
import { BLOG, BLOG_TITLE, TRUST, THREAD, type BlogParagraph, type PersonaId } from "@/mock/trustStudyData";
import { ShieldCheck, CheckCircle2, AlertTriangle, AlertOctagon, ArrowLeft } from "lucide-react";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/result")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [{ title: "Sourcerer — Result" }],
  }),
  component: Result,
});

function Result() {
  const { q } = Route.useSearch();

  // Flatten thread + reviewer notes into sidebar comments
  const sidebar: SidebarComment[] = [
    ...THREAD.filter((c) => c.persona !== "human").map((c) => ({
      id: c.id,
      persona: c.persona as PersonaId,
      body: c.body,
      upvotes: c.upvotes,
      timeAgo: c.timeAgo,
    })),
    ...BLOG.flatMap((p) =>
      p.reviewers.map((r, i) => ({
        id: `${p.id}-r${i}`,
        persona: r.persona,
        body: r.note,
        upvotes: 5 + i * 3,
        timeAgo: `${i + 1}h`,
      })),
    ),
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-foreground">
      <TopBar />
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> New question
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          {/* Article (70%) */}
          <article className="rounded-2xl border border-border bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
              Question
            </div>
            <div className="mb-6 text-base text-foreground">
              {q ?? "Can you explain recursion in programming?"}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {BLOG_TITLE}
            </h1>

            <TrustStrip />

            <div className="mt-8 space-y-5">
              {BLOG.map((p) => (
                <Paragraph key={p.id} p={p} />
              ))}
            </div>
          </article>

          {/* Sidebar (30%) */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">
                AI Reviewers
              </div>
              <div className="text-xs text-muted-foreground">{sidebar.length} comments</div>
            </div>
            <div className="space-y-3 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
              {sidebar.map((c) => (
                <CommentCard key={c.id} comment={c} />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function TrustStrip() {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-zinc-50 px-3 py-1 text-xs font-medium text-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Trust score {TRUST.score}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-verified-soft px-3 py-1 text-xs font-medium text-verified-foreground">
        <CheckCircle2 className="h-3.5 w-3.5" /> {TRUST.verified} verified
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-disputed-soft px-3 py-1 text-xs font-medium text-disputed-foreground">
        <AlertTriangle className="h-3.5 w-3.5" /> {TRUST.disputed} disputed
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-hallucination-soft px-3 py-1 text-xs font-medium text-hallucination-foreground">
        <AlertOctagon className="h-3.5 w-3.5" /> {TRUST.hallucinations} hallucination
      </span>
    </div>
  );
}

function Paragraph({ p }: { p: BlogParagraph }) {
  const renderText = () => {
    if (!p.highlight || p.status === "neutral") return p.text;
    const idx = p.text.indexOf(p.highlight);
    if (idx === -1) return p.text;
    const before = p.text.slice(0, idx);
    const hl = p.text.slice(idx, idx + p.highlight.length);
    const after = p.text.slice(idx + p.highlight.length);
    const hlClass =
      p.status === "verified"
        ? "bg-verified-soft text-verified-foreground"
        : p.status === "disputed"
        ? "bg-disputed-soft text-disputed-foreground"
        : "bg-hallucination-soft text-hallucination-foreground";
    return (
      <>
        {before}
        <mark className={`rounded px-1 ${hlClass}`}>{hl}</mark>
        {after}
      </>
    );
  };

  const border =
    p.status === "verified"
      ? "border-l-verified"
      : p.status === "disputed"
      ? "border-l-disputed"
      : p.status === "hallucination"
      ? "border-l-hallucination"
      : "border-l-transparent";

  return (
    <p
      className={`border-l-2 ${border} pl-4 text-[15px] leading-[1.75] text-foreground/90`}
    >
      {renderText()}
    </p>
  );
}
