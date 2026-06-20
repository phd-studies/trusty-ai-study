import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopNav } from "@/components/trust/TopNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PersonaAvatar } from "@/components/trust/PersonaAvatar";
import {
  BLOG_TITLE,
  PERSONAS,
  THREAD,
  type PersonaId,
  type ThreadComment,
} from "@/mock/trustStudyData";
import { AddCommenterModal } from "@/components/trust/AddCommenterModal";
import { ArrowBigDown, ArrowBigUp, Plus, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/thread")({
  head: () => ({
    meta: [
      { title: "Discussion thread · TrustStudy" },
      { name: "description", content: "Reddit-style AI and human discussion of the reviewed post." },
    ],
  }),
  component: ThreadPage,
});

function ThreadPage() {
  const [modal, setModal] = useState(false);
  const [extra, setExtra] = useState<ThreadComment[]>([]);
  const [human, setHuman] = useState("");
  const [humans, setHumans] = useState<ThreadComment[]>([]);

  function handleAdded({
    persona,
    provider,
    model,
  }: {
    persona: PersonaId;
    provider: string;
    model: string;
  }) {
    setExtra((prev) => [
      {
        id: `new-${Date.now()}`,
        persona,
        body: `Just joined as the new ${PERSONAS[persona].role}. I'll start by re-reading paragraph 5 — the Turing claim looks suspicious. (${provider} · ${model})`,
        upvotes: 1,
        timeAgo: "just now",
      },
      ...prev,
    ]);
  }

  function postHuman() {
    if (!human.trim()) return;
    setHumans((prev) => [
      ...prev,
      {
        id: `h-${Date.now()}`,
        persona: "human",
        authorName: "you",
        body: human.trim(),
        upvotes: 1,
        timeAgo: "just now",
      },
    ]);
    setHuman("");
    toast("Comment posted");
  }

  const allComments = [...extra, ...THREAD, ...humans];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Card className="mb-6 p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Discussion thread for
          </div>
          <h1 className="mt-1 font-display text-2xl text-foreground">{BLOG_TITLE}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{allComments.length} comments</Badge>
            <Badge variant="secondary">5 AI reviewers</Badge>
            <Badge variant="secondary">12 humans</Badge>
          </div>
        </Card>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground">Comments</h2>
          <Button size="sm" onClick={() => setModal(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add AI commenter
          </Button>
        </div>

        <div className="space-y-4">
          {allComments.map((c) => (
            <CommentCard key={c.id} c={c} />
          ))}
        </div>

        <Card className="mt-6 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <User className="h-4 w-4" /> Add your comment
          </div>
          <Textarea
            value={human}
            onChange={(e) => setHuman(e.target.value)}
            placeholder="Push back, agree, or ask a question..."
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <Button onClick={postHuman} disabled={!human.trim()}>
              Post
            </Button>
          </div>
        </Card>
      </div>

      <AddCommenterModal open={modal} onOpenChange={setModal} onAdded={handleAdded} />
    </div>
  );
}

function CommentCard({ c, depth = 0 }: { c: ThreadComment; depth?: number }) {
  const isHuman = c.persona === "human";
  const persona = !isHuman ? PERSONAS[c.persona as PersonaId] : null;
  return (
    <div className={depth > 0 ? "ml-6 border-l-2 border-border/60 pl-4" : ""}>
      <Card className="p-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-1">
            <button className="text-muted-foreground hover:text-primary" aria-label="upvote">
              <ArrowBigUp className="h-5 w-5" />
            </button>
            <span className="text-xs font-semibold text-foreground">{c.upvotes}</span>
            <button className="text-muted-foreground hover:text-destructive" aria-label="downvote">
              <ArrowBigDown className="h-5 w-5" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {isHuman ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                </span>
              ) : (
                <PersonaAvatar id={c.persona as PersonaId} size="sm" />
              )}
              <span className="text-sm font-medium text-foreground">
                {isHuman ? c.authorName ?? "human" : persona?.name}
              </span>
              {!isHuman && (
                <Badge variant="outline" className="text-[10px] font-normal">
                  {persona?.model}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">· {c.timeAgo}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{c.body}</p>
            <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
              <button className="hover:text-foreground">Reply</button>
              <button className="hover:text-foreground">Share</button>
              <button className="hover:text-foreground">Flag</button>
            </div>
          </div>
        </div>
      </Card>
      {c.replies && c.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {c.replies.map((r) => (
            <CommentCard key={r.id} c={r} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}