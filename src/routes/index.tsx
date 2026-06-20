import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TopNav } from "@/components/trust/TopNav";
import { PERSONA_LIST } from "@/mock/trustStudyData";
import { PersonaAvatar } from "@/components/trust/PersonaAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MessagesSquare, FileText, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrustStudy — Make AI learning trustworthy" },
      {
        name: "description",
        content:
          "Chat with an AI tutor, turn the chat into a blog post, then let other AI models and humans fact-check, debate, and improve it.",
      },
      { property: "og:title", content: "TrustStudy — Make AI learning trustworthy" },
      {
        property: "og:description",
        content:
          "AI made learning faster. Now we need to make it trustworthy.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, oklch(0.92 0.08 280 / 0.6), transparent 50%), radial-gradient(circle at 80% 30%, oklch(0.92 0.08 200 / 0.5), transparent 45%)",
          }}
        />
        <div className="mx-auto max-w-5xl px-6 pb-24 pt-24 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            A new layer between you and the model
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground sm:text-7xl">
            AI made learning <em className="text-primary not-italic">faster.</em>
            <br />
            Now we need to make it <em className="text-primary">trustworthy.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            TrustStudy lets you chat with an AI tutor, turn that chat into a blog post, and then
            invite other AI models — and real humans — to critique, fact-check, debate, and improve
            it.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/chat">
                Try the demo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/review">See a reviewed post</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: MessagesSquare,
              n: "01",
              title: "Chat to learn",
              body: "Ask an AI tutor anything. It walks you through the topic step by step.",
            },
            {
              icon: FileText,
              n: "02",
              title: "Turn it into a post",
              body: "Generate a clean blog post from the conversation in one click.",
            },
            {
              icon: ShieldCheck,
              n: "03",
              title: "Get it reviewed",
              body: "Multiple AIs and humans critique each paragraph — verified, disputed, or hallucinated.",
            },
          ].map((s) => (
            <Card key={s.n} className="p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-2xl text-muted-foreground/50">{s.n}</span>
              </div>
              <h3 className="mt-4 font-display text-2xl text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Personas */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl text-foreground">Meet the reviewers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Six AI personas, each with a job. Mix and match per post.
            </p>
          </div>
          <Link
            to="/thread"
            className="hidden text-sm font-medium text-primary hover:underline sm:inline"
          >
            See them in action →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONA_LIST.map((p) => (
            <Card key={p.id} className="flex items-start gap-3 p-4">
              <PersonaAvatar id={p.id} size="md" />
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-foreground">{p.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {p.model}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{p.tagline}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        TrustStudy · A mock-first design prototype
      </footer>
    </div>
  );
}
