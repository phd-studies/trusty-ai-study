import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/trust/TopNav";
import { TrustDashboard } from "@/components/trust/TrustCards";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill, statusBorder, statusHighlight } from "@/components/trust/StatusBits";
import { BLOG, BLOG_TITLE, BLOG_SUBTITLE, PERSONAS } from "@/mock/trustStudyData";
import { PersonaAvatar } from "@/components/trust/PersonaAvatar";
import { cn } from "@/lib/utils";
import { ArrowRight, MessagesSquare } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog review · TrustStudy" },
      { name: "description", content: "AI-generated post with trust score, verified, disputed, and hallucinated claims." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          AI-drafted blog post · review v1
        </div>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {BLOG_TITLE}
        </h1>
        <p className="mt-2 text-muted-foreground">{BLOG_SUBTITLE}</p>

        <div className="mt-8">
          <TrustDashboard />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="gap-1.5">
            <Link to="/thread">
              <MessagesSquare className="h-4 w-4" /> Open thread discussion
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-1.5">
            <Link to="/review">
              See visual review <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Card className="mt-10 p-8 sm:p-10">
          <article className="space-y-5">
            {BLOG.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "border-l-4 pl-5 transition-colors",
                  statusBorder(p.status),
                )}
              >
                <p className="font-display text-lg leading-relaxed text-foreground sm:text-xl">
                  {p.highlight && p.text.includes(p.highlight) ? (
                    <>
                      {p.text.split(p.highlight)[0]}
                      <mark
                        className={cn(
                          "rounded px-1 py-0.5",
                          statusHighlight(p.status),
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
                {p.status !== "neutral" && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusPill status={p.status} />
                    <div className="flex -space-x-2">
                      {p.reviewers.map((r) => (
                        <PersonaAvatar key={r.persona} id={r.persona} size="sm" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {p.reviewers.map((r) => PERSONAS[r.persona].name).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </article>
        </Card>
      </div>
    </div>
  );
}