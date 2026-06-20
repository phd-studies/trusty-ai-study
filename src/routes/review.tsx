import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopNav } from "@/components/trust/TopNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PersonaAvatar } from "@/components/trust/PersonaAvatar";
import { StatusPill, statusHighlight } from "@/components/trust/StatusBits";
import { AddCommenterModal } from "@/components/trust/AddCommenterModal";
import {
  BLOG,
  BLOG_TITLE,
  PERSONAS,
  PERSONA_LIST,
  TRUST,
  type ClaimStatus,
  type PersonaId,
  type Reviewer,
} from "@/mock/trustStudyData";
import { cn } from "@/lib/utils";
import { Plus, Filter } from "lucide-react";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Visual review · TrustStudy" },
      { name: "description", content: "AI reviewers attach speech bubbles to specific paragraphs of the post." },
    ],
  }),
  component: ReviewPage,
});

type StatusFilter = "all" | Exclude<ClaimStatus, "neutral">;

function ReviewPage() {
  const [modal, setModal] = useState(false);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [activePersona, setActivePersona] = useState<PersonaId | "all">("all");
  const [openParagraph, setOpenParagraph] = useState<string | null>("p5");

  function visibleReviewers(rs: Reviewer[]) {
    return rs.filter(
      (r) =>
        (activeStatus === "all" || r.status === activeStatus) &&
        (activePersona === "all" || r.persona === activePersona),
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      {/* Toolbar */}
      <div className="sticky top-14 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Status
          </div>
          <div className="flex flex-wrap gap-1.5">
            {([
              { id: "all", label: "All" },
              { id: "verified", label: "Verified" },
              { id: "disputed", label: "Disputed" },
              { id: "hallucination", label: "Hallucinations" },
            ] as { id: StatusFilter; label: string }[]).map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStatus(s.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  activeStatus === s.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="mx-2 h-5 w-px bg-border" />
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActivePersona("all")}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                activePersona === "all"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              All reviewers
            </button>
            {PERSONA_LIST.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs",
                  activePersona === p.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <span>{p.emoji}</span> {p.role}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <Button size="sm" onClick={() => setModal(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add AI commenter
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Paper column */}
          <Card className="bg-paper p-8 shadow-sm sm:p-12">
            <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Live review · click a highlight
            </div>
            <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
              {BLOG_TITLE}
            </h1>

            <article className="mt-8 space-y-5">
              {BLOG.map((p) => {
                const reviewers = visibleReviewers(p.reviewers);
                const isOpen = openParagraph === p.id;
                const hasReviews = reviewers.length > 0;
                return (
                  <div key={p.id} className="group relative">
                    <p
                      onClick={() => hasReviews && setOpenParagraph(isOpen ? null : p.id)}
                      className={cn(
                        "font-display text-lg leading-relaxed text-ink transition-colors sm:text-xl",
                        hasReviews && "cursor-pointer",
                      )}
                    >
                      {p.highlight && p.text.includes(p.highlight) && p.status !== "neutral" ? (
                        <>
                          {p.text.split(p.highlight)[0]}
                          <mark
                            className={cn(
                              "rounded px-1 py-0.5",
                              statusHighlight(p.status),
                              isOpen && "ring-2 ring-primary/40",
                            )}
                          >
                            {p.highlight}
                          </mark>
                          {p.text.split(p.highlight)[1]}
                        </>
                      ) : (
                        p.text
                      )}
                    </p>

                    {/* persona badges pinned to paragraph */}
                    {hasReviews && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="flex -space-x-2">
                          {reviewers.map((r) => (
                            <PersonaAvatar key={r.persona} id={r.persona} size="sm" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {reviewers.length} {reviewers.length === 1 ? "reviewer" : "reviewers"}
                          {!isOpen && " — tap to read"}
                        </span>
                      </div>
                    )}

                    {/* Inline bubbles on mobile / when open */}
                    {hasReviews && isOpen && (
                      <div className="mt-3 space-y-2 lg:hidden">
                        {reviewers.map((r, i) => (
                          <MarginBubble key={i} reviewer={r} />
                        ))}
                      </div>
                    )}

                    {/* Floating margin bubbles on desktop */}
                    {hasReviews && isOpen && (
                      <div className="pointer-events-none absolute left-full top-0 ml-8 hidden w-[340px] space-y-2 lg:block">
                        {reviewers.map((r, i) => (
                          <div
                            key={i}
                            className="pointer-events-auto animate-in fade-in slide-in-from-left-2 duration-300"
                            style={{ animationDelay: `${i * 60}ms` }}
                          >
                            <MarginBubble reviewer={r} withConnector />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </article>
          </Card>

          {/* Sidebar summary */}
          <aside className="space-y-3 lg:sticky lg:top-32 lg:self-start">
            <Card className="p-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Trust summary
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-5xl text-primary">{TRUST.score}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Verified" value={TRUST.verified} tone="verified" />
                <Row label="Disputed" value={TRUST.disputed} tone="disputed" />
                <Row label="Hallucinations" value={TRUST.hallucinations} tone="hallucination" />
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Reviewers on this post
              </div>
              <div className="mt-3 space-y-2">
                {PERSONA_LIST.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <PersonaAvatar id={p.id} size="sm" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">{p.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{p.model}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full gap-1.5"
                onClick={() => setModal(true)}
              >
                <Plus className="h-3.5 w-3.5" /> Invite another reviewer
              </Button>
            </Card>
          </aside>
        </div>
      </div>

      <AddCommenterModal open={modal} onOpenChange={setModal} />
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "verified" | "disputed" | "hallucination";
}) {
  const dot = {
    verified: "bg-verified",
    disputed: "bg-disputed",
    hallucination: "bg-hallucination",
  }[tone];
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-foreground">
        <span className={cn("h-2 w-2 rounded-full", dot)} /> {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function MarginBubble({
  reviewer,
  withConnector = false,
}: {
  reviewer: Reviewer;
  withConnector?: boolean;
}) {
  const p = PERSONAS[reviewer.persona];
  return (
    <div className="relative">
      {withConnector && (
        <span
          aria-hidden
          className="absolute -left-8 top-5 hidden h-px w-8 bg-border lg:block"
        />
      )}
      <Card className="p-3">
        <div className="flex items-center gap-2">
          <PersonaAvatar id={p.id} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground">{p.name}</span>
              <Badge variant="outline" className="text-[10px] font-normal">
                {p.model}
              </Badge>
            </div>
          </div>
          <StatusPill status={reviewer.status} />
        </div>
        <p className="mt-2 text-sm leading-snug text-foreground">{reviewer.note}</p>
      </Card>
    </div>
  );
}