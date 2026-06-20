import { PERSONAS, type PersonaId } from "@/mock/trustStudyData";
import { cn } from "@/lib/utils";

const RING: Record<PersonaId, string> = {
  skeptic: "bg-persona-skeptic/15 text-persona-skeptic ring-persona-skeptic/30",
  factchecker: "bg-persona-factchecker/15 text-persona-factchecker ring-persona-factchecker/30",
  beginner: "bg-persona-beginner/15 text-persona-beginner ring-persona-beginner/30",
  explainer: "bg-persona-explainer/15 text-persona-explainer ring-persona-explainer/30",
  defender: "bg-persona-defender/15 text-persona-defender ring-persona-defender/30",
  consensus: "bg-persona-consensus/15 text-persona-consensus ring-persona-consensus/30",
};

export function PersonaAvatar({
  id,
  size = "md",
  className,
}: {
  id: PersonaId;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const p = PERSONAS[id];
  const sizes = {
    sm: "h-7 w-7 text-sm",
    md: "h-10 w-10 text-lg",
    lg: "h-14 w-14 text-2xl",
  } as const;
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full ring-2",
        RING[id],
        sizes[size],
        className,
      )}
      aria-label={p.name}
      title={p.name}
    >
      <span>{p.emoji}</span>
    </div>
  );
}

export function personaTextClass(id: PersonaId) {
  return {
    skeptic: "text-persona-skeptic",
    factchecker: "text-persona-factchecker",
    beginner: "text-persona-beginner",
    explainer: "text-persona-explainer",
    defender: "text-persona-defender",
    consensus: "text-persona-consensus",
  }[id];
}