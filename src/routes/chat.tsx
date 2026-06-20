import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopNav } from "@/components/trust/TopNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CHAT_SCRIPT, KEY_CONCEPTS, type ChatTurn } from "@/mock/trustStudyData";
import { ArrowRight, BookOpen, GraduationCap, Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Study chat · TrustStudy" },
      { name: "description", content: "Chat with the AI tutor about recursion." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [count, setCount] = useState(2); // start with first user + tutor exchange visible
  const [draft, setDraft] = useState("");
  const visible = CHAT_SCRIPT.slice(0, count);
  const canSend = count < CHAT_SCRIPT.length;

  function send() {
    if (!canSend) return;
    setCount((c) => Math.min(CHAT_SCRIPT.length, c + 2));
    setDraft("");
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px] sm:px-6">
        <Card className="flex h-[calc(100vh-9rem)] flex-col overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <GraduationCap className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-medium text-foreground">AI Tutor</div>
                <div className="text-xs text-muted-foreground">Gemini 2.5 Flash · Tutor mode</div>
              </div>
            </div>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/blog">
                Turn into blog post <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
            {visible.map((m, i) => (
              <Bubble key={i} turn={m} />
            ))}
            {canSend && (
              <p className="text-center text-xs text-muted-foreground">
                Tap <span className="font-medium text-foreground">Send</span> to continue the scripted demo conversation.
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-border/60 bg-muted/30 px-4 py-3"
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={canSend ? "Ask a follow-up..." : "End of demo conversation"}
              className="flex-1 bg-background"
              disabled={!canSend}
            />
            <Button type="submit" size="icon" disabled={!canSend} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        <aside className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" /> Current topic
            </div>
            <h2 className="mt-2 font-display text-2xl leading-tight text-foreground">
              Explain recursion in programming
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The tutor walks through definition, base case, call stack, factorial, and when to use it.
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Key concepts captured
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {KEY_CONCEPTS.map((c, i) => (
                <Badge
                  key={c}
                  variant="secondary"
                  className={
                    i < Math.ceil((count / CHAT_SCRIPT.length) * KEY_CONCEPTS.length)
                      ? "bg-verified-soft text-verified-foreground"
                      : "opacity-50"
                  }
                >
                  {c}
                </Badge>
              ))}
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round((count / CHAT_SCRIPT.length) * 100)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(count / CHAT_SCRIPT.length) * 100}%` }}
                />
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Bubble({ turn }: { turn: ChatTurn }) {
  if (turn.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
          {turn.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <GraduationCap className="h-3.5 w-3.5" />
      </span>
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card px-4 py-2.5 text-sm text-foreground ring-1 ring-border">
        {turn.text}
      </div>
    </div>
  );
}