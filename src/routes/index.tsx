import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TopBar } from "@/components/sourcerer/TopBar";
import {
  ArrowLeft,
  ArrowUp,
  CornerDownLeft,
  ExternalLink,
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  PIPELINE_STAGES,
  mockResult,
  type AgentComment,
  type ParagraphStatus,
} from "@/mock/mockData";

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

type AppState = "home" | "chat" | "loading" | "workspace";

type ChatMsg = { role: "user" | "ai"; text: string };

const SSM_SEED: ChatMsg[] = [
  {
    role: "ai",
    text: "Sure! Transformers use self-attention, which lets every token attend to every other token — powerful, but it scales as O(N²) with sequence length.",
  },
  { role: "user", text: "And SSMs like Mamba are supposed to be faster, right?" },
  {
    role: "ai",
    text: "Right. Structured SSMs compress context into a hidden state, giving O(N) scaling. They can run as a recurrence for fast inference, or as a convolution for parallel training.",
  },
  { role: "user", text: "Do they actually match Transformers on long-context tasks?" },
  {
    role: "ai",
    text: "On many language modeling benchmarks, yes — but exact-retrieval tasks at very long contexts are still contested. Want me to turn this into a verifiable blog post?",
  },
];

const SUGGESTIONS = [
  "Explain how State Space Models compare to Transformers",
  "What caused the 2008 financial crisis?",
  "How do mRNA vaccines actually work?",
  "Is intermittent fasting backed by evidence?",
];

function Home() {
  const [state, setState] = useState<AppState>("home");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const [statusIdx, setStatusIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, state]);

  useEffect(() => {
    if (state !== "loading") return;
    setStatusIdx(0);
    const interval = setInterval(
      () => setStatusIdx((i) => Math.min(i + 1, PIPELINE_STAGES.length - 1)),
      1500,
    );
    const done = setTimeout(() => setState("workspace"), 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [state]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "Good question — I can dig deeper. Or hit ✨ Convert to Verifiable Blog Post and I'll have a panel of critics review my full answer.",
        },
      ]);
    }, 600);
  };

  const startFromHome = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const isSSM = /ssm|state space|mamba|transformer/i.test(q);
    const seed: ChatMsg[] = isSSM
      ? [{ role: "user", text: q }, ...SSM_SEED]
      : [
          { role: "user", text: q },
          {
            role: "ai",
            text: "Great question. Let me start with the high-level picture, and we can dig into the contested parts together — then I'll have a panel of critics review my answer.",
          },
        ];
    setMessages(seed);
    setDraft("");
    setState("chat");
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-foreground">
      <TopBar />
      {state === "home" && <HomeView onStart={startFromHome} />}
      {state === "chat" && (
        <ChatView
          messages={messages}
          draft={draft}
          setDraft={setDraft}
          onSend={sendMessage}
          onConvert={() => setState("loading")}
          onHome={() => {
            setMessages([]);
            setState("home");
          }}
          scrollRef={scrollRef}
        />
      )}
      {state === "loading" && <LoadingView statusIdx={statusIdx} />}
      {state === "workspace" && (
        <WorkspaceView
          onBack={() => setState("chat")}
          onHome={() => {
            setMessages([]);
            setState("home");
          }}
        />
      )}
    </div>
  );
}

function HomeView({ onStart }: { onStart: (q: string) => void }) {
  const [q, setQ] = useState("");
  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-2xl flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Ask something worth trusting.
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          AI made learning faster. Sourcerer makes it trustworthy.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onStart(q);
        }}
        className="w-full"
      >
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 shadow-md focus-within:border-foreground/20 focus-within:shadow-lg">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask anything — Sourcerer will draft an answer and have it reviewed."
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={!q.trim()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background transition hover:opacity-90 disabled:opacity-30"
            aria-label="Start chat"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onStart(s)}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-muted-foreground transition hover:border-foreground/20 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </main>
  );
}

function ChatView({
  messages,
  draft,
  setDraft,
  onSend,
  onConvert,
  onHome,
  scrollRef,
}: {
  messages: ChatMsg[];
  draft: string;
  setDraft: (v: string) => void;
  onSend: (text: string) => void;
  onConvert: () => void;
  onHome: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="animate-in fade-in duration-300">
      <main className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-3xl flex-col px-6">
        <div className="pt-4">
          <button
            onClick={onHome}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> New question
          </button>
        </div>
        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto py-8">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-foreground text-background"
                    : "border border-border bg-white text-foreground"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend(draft);
          }}
          className="sticky bottom-6 mb-6"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 shadow-md focus-within:border-foreground/20 focus-within:shadow-lg">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message Sourcerer…"
              className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background transition hover:opacity-90 disabled:opacity-30"
              aria-label="Send"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </form>
      </main>

      <button
        onClick={onConvert}
        className="fixed bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-lg ring-4 ring-foreground/5 transition hover:scale-[1.02] hover:shadow-xl"
      >
        <span className="inline-flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          Convert to Verifiable Blog Post
        </span>
      </button>
    </div>
  );
}

function LoadingView({ statusIdx }: { statusIdx: number }) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-2xl flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <div className="w-full rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="h-7 w-3/4 animate-pulse rounded-md bg-zinc-200" />
        <div className="mt-3 flex gap-2">
          <div className="h-5 w-24 animate-pulse rounded-full bg-zinc-200" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-200" />
        </div>
        <div className="mt-6 space-y-2.5">
          <div className="h-3 w-full animate-pulse rounded-full bg-zinc-200" />
          <div className="h-3 w-11/12 animate-pulse rounded-full bg-zinc-200" />
          <div className="h-3 w-10/12 animate-pulse rounded-full bg-zinc-200" />
        </div>
        <div className="mt-5 space-y-2.5">
          <div className="h-3 w-full animate-pulse rounded-full bg-zinc-200" />
          <div className="h-3 w-9/12 animate-pulse rounded-full bg-zinc-200" />
          <div className="h-3 w-11/12 animate-pulse rounded-full bg-zinc-200" />
          <div className="h-3 w-8/12 animate-pulse rounded-full bg-zinc-200" />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 text-sm">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
        </span>
        <span
          key={statusIdx}
          className="animate-in fade-in slide-in-from-bottom-1 duration-500 bg-gradient-to-r from-foreground via-foreground/60 to-foreground bg-[length:200%_100%] bg-clip-text font-medium text-transparent [animation:shimmer_2s_linear_infinite]"
          style={{ animation: "shimmer 2s linear infinite" }}
        >
          {PIPELINE_STAGES[statusIdx]}
        </span>
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </main>
  );
}

function WorkspaceView({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  const { answer, comments, confidence, confidenceLevel } = mockResult;
  const trustPct = Math.round(confidence * 100);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Chat
          </button>
          <button
            onClick={onHome}
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            New question
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <article className="rounded-2xl border border-border bg-white p-8 shadow-sm sm:p-10">
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

function agentVisual(c: AgentComment) {
  if (c.agent === "verifier")
    return { icon: ShieldCheck, tone: "bg-persona-factchecker/15 text-persona-factchecker" };
  if (/fact|skeptic/i.test(c.role))
    return { icon: Search, tone: "bg-persona-skeptic/15 text-persona-skeptic" };
  if (/expert|domain/i.test(c.role))
    return { icon: GraduationCap, tone: "bg-persona-explainer/15 text-persona-explainer" };
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
          placeholder="Reply to this critic…"
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
