import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { TopBar } from "@/components/sourcerer/TopBar";
import { mockResult, type AgentComment, type ParagraphStatus } from "@/mock/mockData";
import {
  ShieldCheck,
  Search,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  ArrowUp,
  CornerDownLeft,
  ExternalLink,
} from "lucide-react";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/result")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Sourcerer — Result" }] }),
  component: Result,
});

function Result() {
  const { q } = Route.useSearch();
  const { answer, comments, confidence, confidenceLevel } = mockResult;
  const trustPct = Math.round(confidence * 100);

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
              {q ?? "Explain how SSMs compare to Transformers"}
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <TrustBadge pct={trustPct} level={confidenceLevel} />
              <span className="text-xs text-muted-foreground">
                {comments.length} agent reviews
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-[2.25rem]">
              {answer.title}
            </h1>

            <div className="mt-8 space-y-5">
              {answer.paragraphs.map((p) => (
                <Paragraph key={p.id} status={p.status} text={p.text} />
              ))}
            </div>
          </article>

          {/* Sidebar (30%) */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">AI Reviewers</div>
              <div className="text-xs text-muted-foreground">{comments.length} comments</div>
            </div>
            <div className="space-y-3 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
              {comments.map((c) => (
                <AgentCard key={c.id} comment={c} />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function TrustBadge({ pct, level }: { pct: number; level: "high" | "medium" | "low" }) {
  const tone =
    level === "high"
      ? "bg-verified-soft text-verified-foreground"
      : level === "medium"
      ? "bg-disputed-soft text-disputed-foreground"
      : "bg-hallucination-soft text-hallucination-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${tone}`}
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      Trust Score {pct}%
      <span className="ml-1 rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
        {level}
      </span>
    </span>
  );
}

function Paragraph({ status, text }: { status: ParagraphStatus; text: string }) {
  const border =
    status === "verified"
      ? "border-l-verified"
      : status === "disputed"
      ? "border-l-disputed"
      : status === "hallucination"
      ? "border-l-hallucination"
      : "border-l-transparent";

  const bg =
    status === "verified"
      ? "bg-verified-soft/40"
      : status === "disputed"
      ? "bg-disputed-soft/40"
      : status === "hallucination"
      ? "bg-hallucination-soft/40"
      : "";

  return (
    <p
      className={`rounded-r-md border-l-2 ${border} ${bg} px-4 py-2 text-[15px] leading-[1.75] text-foreground/90`}
    >
      {text}
    </p>
  );
}

type IconCfg = { icon: typeof ShieldCheck; tone: string };

function agentVisual(c: AgentComment): IconCfg {
  if (c.agent === "verifier") {
    return { icon: ShieldCheck, tone: "bg-persona-factchecker/15 text-persona-factchecker" };
  }
  if (/fact|skeptic/i.test(c.role)) {
    return { icon: Search, tone: "bg-persona-skeptic/15 text-persona-skeptic" };
  }
  if (/expert|domain/i.test(c.role)) {
    return { icon: GraduationCap, tone: "bg-persona-explainer/15 text-persona-explainer" };
  }
  return { icon: Sparkles, tone: "bg-persona-consensus/15 text-persona-consensus" };
}

function verdictTone(v?: AgentComment["verdict"]) {
  if (v === "supports") return "bg-verified-soft text-verified-foreground";
  if (v === "refutes") return "bg-hallucination-soft text-hallucination-foreground";
  if (v === "unclear") return "bg-disputed-soft text-disputed-foreground";
  return "";
}

function AgentCard({ comment }: { comment: AgentComment }) {
  const { icon: Icon, tone } = agentVisual(comment);
  const [reply, setReply] = useState("");
  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 ring-current/20 ${tone}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="truncate text-sm font-medium text-foreground">{comment.role}</div>
            {comment.claimId && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {comment.claimId}
              </span>
            )}
          </div>
          <div className="text-[11px] capitalize text-muted-foreground">{comment.agent}</div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{comment.content}</p>

      {comment.verdict && (
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${verdictTone(
              comment.verdict,
            )}`}
          >
            {comment.verdict}
          </span>
          {comment.url && (
            <a
              href={comment.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
              source
            </a>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => {
            setVotes((v) => v + (voted ? -1 : 1));
            setVoted((v) => !v);
          }}
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition ${
            voted
              ? "border-foreground/20 bg-foreground text-background"
              : "border-border bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          <ArrowUp className="h-3 w-3" />
          {votes}
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setReply("");
        }}
        className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-foreground/5"
      >
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply…"
          className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Send reply"
        >
          <CornerDownLeft className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
