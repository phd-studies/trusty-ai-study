import type { ClaimStatus } from "@/mock/trustStudyData";
import { cn } from "@/lib/utils";

export const STATUS_LABEL: Record<ClaimStatus, string> = {
  verified: "Verified",
  disputed: "Disputed",
  hallucination: "Hallucination",
  neutral: "Unreviewed",
};

export function statusHighlight(status: ClaimStatus) {
  return {
    verified: "bg-verified-soft text-verified-foreground decoration-verified",
    disputed: "bg-disputed-soft text-disputed-foreground decoration-disputed",
    hallucination:
      "bg-hallucination-soft text-hallucination-foreground decoration-hallucination underline decoration-wavy underline-offset-4",
    neutral: "",
  }[status];
}

export function statusBorder(status: ClaimStatus) {
  return {
    verified: "border-l-verified",
    disputed: "border-l-disputed",
    hallucination: "border-l-hallucination",
    neutral: "border-l-transparent",
  }[status];
}

export function StatusPill({ status, className }: { status: ClaimStatus; className?: string }) {
  const tone = {
    verified: "bg-verified-soft text-verified-foreground",
    disputed: "bg-disputed-soft text-disputed-foreground",
    hallucination: "bg-hallucination-soft text-hallucination-foreground",
    neutral: "bg-muted text-muted-foreground",
  }[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        tone,
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}