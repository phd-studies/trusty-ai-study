import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVIDER_MODELS, ROLES, PERSONAS, type PersonaId } from "@/mock/trustStudyData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

type Provider = keyof typeof PROVIDER_MODELS;

const PROVIDERS: { id: Provider; label: string; mark: string }[] = [
  { id: "Claude", label: "Claude", mark: "✦" },
  { id: "OpenAI", label: "ChatGPT", mark: "◎" },
  { id: "Gemini", label: "Gemini", mark: "✺" },
];

export function AddCommenterModal({
  open,
  onOpenChange,
  onAdded,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdded?: (args: { persona: PersonaId; provider: Provider; model: string }) => void;
}) {
  const [provider, setProvider] = useState<Provider>("Claude");
  const [model, setModel] = useState(PROVIDER_MODELS.Claude[0]);
  const [role, setRole] = useState<PersonaId>("skeptic");
  const [apiKey, setApiKey] = useState("");

  function handleAdd() {
    const persona = PERSONAS[role];
    onAdded?.({ persona: role, provider, model });
    toast.success(`${persona.name} joined`, {
      description: `${provider} · ${model}`,
    });
    setApiKey("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Add an AI commenter</DialogTitle>
          <DialogDescription>
            Pick a model and a role. They'll critique the post from that perspective.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Provider
            </Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setProvider(p.id);
                    setModel(PROVIDER_MODELS[p.id][0]);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all",
                    provider === p.id
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40",
                  )}
                >
                  <span className="text-xl">{p.mark}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Model
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDER_MODELS[provider].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Reviewer role
              </Label>
              <Select value={role} onValueChange={(v) => setRole(v as PersonaId)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {PERSONAS[r.id].emoji}  {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              API key
            </Label>
            <div className="relative mt-2">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pl-9"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Used locally for this demo. Not stored or sent anywhere.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add commenter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}