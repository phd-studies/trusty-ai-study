import { useState } from "react";
import { PersonaAvatar } from "@/components/trust/PersonaAvatar";
import { PERSONAS, type PersonaId } from "@/mock/trustStudyData";
import { ArrowUp, CornerDownLeft } from "lucide-react";

export type SidebarComment = {
  id: string;
  persona: PersonaId;
  body: string;
  upvotes: number;
  timeAgo: string;
};

export function CommentCard({ comment }: { comment: SidebarComment }) {
  const persona = PERSONAS[comment.persona];
  const [reply, setReply] = useState("");
  const [votes, setVotes] = useState(comment.upvotes);
  const [voted, setVoted] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <PersonaAvatar id={comment.persona} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="truncate text-sm font-medium text-foreground">
              {persona.name}
            </div>
            <div className="text-[11px] text-muted-foreground">{comment.timeAgo}</div>
          </div>
          <div className="text-[11px] text-muted-foreground">{persona.role} · {persona.model}</div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{comment.body}</p>

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