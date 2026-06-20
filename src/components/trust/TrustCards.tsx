import { CheckCircle2, AlertTriangle, Ghost, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TRUST } from "@/mock/trustStudyData";

export function TrustScoreCard({ score = TRUST.score }: { score?: number }) {
  const circumference = 2 * Math.PI * 32;
  const dash = (score / 100) * circumference;
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
          <circle cx="40" cy="40" r="32" className="fill-none stroke-muted" strokeWidth="8" />
          <circle
            cx="40"
            cy="40"
            r="32"
            className="fill-none stroke-primary transition-[stroke-dasharray] duration-1000 ease-out"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-3xl text-foreground">{score}</span>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Gauge className="h-3.5 w-3.5" /> Trust score
        </div>
        <p className="mt-1 text-sm text-foreground">Solid, but two claims need a closer look.</p>
      </div>
    </Card>
  );
}

type StatVariant = "verified" | "disputed" | "hallucination";

const VARIANT: Record<
  StatVariant,
  { bg: string; text: string; ring: string; Icon: typeof CheckCircle2; label: string }
> = {
  verified: {
    bg: "bg-verified-soft",
    text: "text-verified-foreground",
    ring: "ring-verified/30",
    Icon: CheckCircle2,
    label: "Verified claims",
  },
  disputed: {
    bg: "bg-disputed-soft",
    text: "text-disputed-foreground",
    ring: "ring-disputed/40",
    Icon: AlertTriangle,
    label: "Disputed claims",
  },
  hallucination: {
    bg: "bg-hallucination-soft",
    text: "text-hallucination-foreground",
    ring: "ring-hallucination/40",
    Icon: Ghost,
    label: "Possible hallucinations",
  },
};

export function ClaimStatCard({
  variant,
  count,
}: {
  variant: StatVariant;
  count: number;
}) {
  const v = VARIANT[variant];
  return (
    <Card className={cn("p-5 ring-1", v.bg, v.ring)}>
      <div className={cn("flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider", v.text)}>
        <v.Icon className="h-3.5 w-3.5" /> {v.label}
      </div>
      <div className={cn("mt-3 font-display text-4xl", v.text)}>{count}</div>
    </Card>
  );
}

export function TrustDashboard() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <TrustScoreCard />
      <ClaimStatCard variant="verified" count={TRUST.verified} />
      <ClaimStatCard variant="disputed" count={TRUST.disputed} />
      <ClaimStatCard variant="hallucination" count={TRUST.hallucinations} />
    </div>
  );
}