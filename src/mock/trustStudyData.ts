export type PersonaId =
  | "skeptic"
  | "factchecker"
  | "beginner"
  | "explainer"
  | "defender"
  | "consensus";

export type Persona = {
  id: PersonaId;
  name: string;
  role: string;
  emoji: string;
  model: string;
  tagline: string;
  colorVar: string; // tailwind class fragment
};

export const PERSONAS: Record<PersonaId, Persona> = {
  skeptic: {
    id: "skeptic",
    name: "Skeptic AI",
    role: "Skeptic",
    emoji: "🤨",
    model: "Claude Sonnet 4.5",
    tagline: "Questions every claim until proven.",
    colorVar: "persona-skeptic",
  },
  factchecker: {
    id: "factchecker",
    name: "Fact-Checker AI",
    role: "Fact-Checker",
    emoji: "🔍",
    model: "GPT-5",
    tagline: "Verifies sources and definitions.",
    colorVar: "persona-factchecker",
  },
  beginner: {
    id: "beginner",
    name: "Beginner AI",
    role: "Beginner",
    emoji: "🌱",
    model: "Gemini 2.5 Flash",
    tagline: "Asks the obvious questions you forgot.",
    colorVar: "persona-beginner",
  },
  explainer: {
    id: "explainer",
    name: "Explainer AI",
    role: "Explainer",
    emoji: "📖",
    model: "GPT-5 Mini",
    tagline: "Reframes confusing parts in plain words.",
    colorVar: "persona-explainer",
  },
  defender: {
    id: "defender",
    name: "Defender AI",
    role: "Defender",
    emoji: "🛡️",
    model: "Claude Opus 4",
    tagline: "Argues for the original author's intent.",
    colorVar: "persona-defender",
  },
  consensus: {
    id: "consensus",
    name: "Consensus AI",
    role: "Consensus",
    emoji: "🤝",
    model: "Gemini 2.5 Pro",
    tagline: "Summarizes where reviewers agree.",
    colorVar: "persona-consensus",
  },
};

export const PERSONA_LIST = Object.values(PERSONAS);

export type ChatTurn = { role: "user" | "tutor"; text: string };

export const CHAT_SCRIPT: ChatTurn[] = [
  { role: "user", text: "Can you explain recursion in programming?" },
  {
    role: "tutor",
    text:
      "Sure! Recursion is when a function calls itself to solve a smaller version of the same problem. Every recursive function needs two parts: a base case that stops the recursion, and a recursive case that moves toward the base case.",
  },
  { role: "user", text: "What happens if I forget the base case?" },
  {
    role: "tutor",
    text:
      "Then the function keeps calling itself forever and you eventually hit a stack overflow. Each call pushes a new frame onto the call stack, and the stack is finite — typically a few thousand frames in JavaScript.",
  },
  { role: "user", text: "Can you show a tiny example?" },
  {
    role: "tutor",
    text:
      "The classic one is factorial: factorial(0) = 1 (the base case), and factorial(n) = n * factorial(n - 1). So factorial(3) becomes 3 * 2 * 1 * 1 = 6.",
  },
  { role: "user", text: "When should I actually use recursion vs a loop?" },
  {
    role: "tutor",
    text:
      "Recursion shines when the problem is naturally self-similar — trees, file systems, divide-and-conquer algorithms like merge sort. Loops are usually faster and use less memory for linear problems.",
  },
];

export const KEY_CONCEPTS = [
  "Base case",
  "Recursive case",
  "Call stack",
  "Stack overflow",
  "Factorial example",
  "Divide & conquer",
];

export type ClaimStatus = "verified" | "disputed" | "hallucination" | "neutral";

export type Reviewer = {
  persona: PersonaId;
  status: Exclude<ClaimStatus, "neutral">;
  note: string;
};

export type BlogParagraph = {
  id: string;
  text: string;
  status: ClaimStatus;
  /** Substring inside text that gets the colored highlight. */
  highlight?: string;
  reviewers: Reviewer[];
};

export const BLOG_TITLE = "Understanding Recursion: A Beginner's Guide";
export const BLOG_SUBTITLE =
  "Drafted from a tutor chat. Reviewed by 5 AI personas and 12 humans.";

export const BLOG: BlogParagraph[] = [
  {
    id: "p1",
    text:
      "Recursion is one of the most elegant ideas in programming: a function that calls itself to solve a smaller version of the same problem. Once it clicks, you start seeing recursive shapes everywhere — in folders inside folders, comments under comments, and the way merge sort splits a list in half again and again.",
    status: "verified",
    highlight: "a function that calls itself to solve a smaller version of the same problem",
    reviewers: [
      {
        persona: "factchecker",
        status: "verified",
        note: "Matches the standard CS definition (SICP, CLRS).",
      },
    ],
  },
  {
    id: "p2",
    text:
      "Every recursive function has two parts. The base case tells the function when to stop. The recursive case does a little bit of work and then calls itself on a smaller input, moving toward the base case.",
    status: "verified",
    highlight: "The base case tells the function when to stop.",
    reviewers: [
      {
        persona: "explainer",
        status: "verified",
        note: "Clear two-part framing. I'd add: 'smaller input' means strictly closer to the base case.",
      },
    ],
  },
  {
    id: "p3",
    text:
      "If you forget the base case, the function calls itself forever and crashes the program with a stack overflow after roughly 10,000 calls in most JavaScript engines.",
    status: "disputed",
    highlight: "roughly 10,000 calls in most JavaScript engines",
    reviewers: [
      {
        persona: "skeptic",
        status: "disputed",
        note: "The exact limit depends on the engine and frame size. V8 is usually 10k–15k; Safari can be much lower.",
      },
      {
        persona: "factchecker",
        status: "disputed",
        note: "True directionally, but '10,000' should be presented as an order-of-magnitude, not a hard number.",
      },
    ],
  },
  {
    id: "p4",
    text:
      "The classic warm-up example is factorial. factorial(0) returns 1, and for any n > 0, factorial(n) returns n * factorial(n - 1). So factorial(3) unwinds into 3 * 2 * 1 * 1 = 6.",
    status: "verified",
    highlight: "factorial(0) returns 1",
    reviewers: [
      {
        persona: "beginner",
        status: "verified",
        note: "Wait — why is factorial(0) = 1 and not 0? (It's a math convention, but worth saying.)",
      },
    ],
  },
  {
    id: "p5",
    text:
      "Recursion was originally invented by Alan Turing in 1952 specifically to model how human mathematicians think about self-reference.",
    status: "hallucination",
    highlight: "invented by Alan Turing in 1952",
    reviewers: [
      {
        persona: "factchecker",
        status: "hallucination",
        note: "This is fabricated. Recursive functions in math predate Turing (Dedekind, Gödel, Kleene in the 1930s).",
      },
      {
        persona: "skeptic",
        status: "hallucination",
        note: "No source supports this claim. Suggest deleting the entire sentence.",
      },
    ],
  },
  {
    id: "p6",
    text:
      "Recursion is most useful for problems with a naturally self-similar structure — traversing trees, walking a file system, or divide-and-conquer algorithms like merge sort and quicksort. For purely linear work, a loop is usually faster and uses less memory.",
    status: "verified",
    highlight: "divide-and-conquer algorithms like merge sort and quicksort",
    reviewers: [
      {
        persona: "defender",
        status: "verified",
        note: "Good practical heuristic. Tail-call-optimized languages narrow the gap further.",
      },
    ],
  },
  {
    id: "p7",
    text:
      "If you're learning recursion for the first time, trace a small call by hand on paper. Write each call, what it returns, and how the answers combine. Once you've done it twice, the magic disappears and it becomes just another tool.",
    status: "neutral",
    reviewers: [
      {
        persona: "consensus",
        status: "verified",
        note: "All reviewers agree this is sound pedagogical advice.",
      },
    ],
  },
];

export type ThreadComment = {
  id: string;
  persona: PersonaId | "human";
  authorName?: string; // for human
  body: string;
  upvotes: number;
  timeAgo: string;
  replies?: ThreadComment[];
};

export const THREAD: ThreadComment[] = [
  {
    id: "c1",
    persona: "skeptic",
    body:
      "The Turing-1952 line in paragraph 5 is just wrong. Recursive functions in math go back at least to Dedekind in the 1880s, and the formal theory is Kleene and Gödel in the 1930s. Strong suggestion: delete the sentence entirely.",
    upvotes: 42,
    timeAgo: "2h",
    replies: [
      {
        id: "c1r1",
        persona: "defender",
        body:
          "Agreed it's wrong as written. Could we keep a one-line history that's actually accurate? Something like 'Recursion as a formal concept dates to early 20th-century logic.'",
        upvotes: 18,
        timeAgo: "1h",
      },
      {
        id: "c1r2",
        persona: "consensus",
        body:
          "Consensus from 4/5 reviewers: remove the fabricated sentence. Optionally replace with the accurate one-liner Defender suggested.",
        upvotes: 26,
        timeAgo: "55m",
      },
    ],
  },
  {
    id: "c2",
    persona: "factchecker",
    body:
      "Paragraph 3 says 'roughly 10,000 calls in most JavaScript engines.' That's not stable across engines — V8 sits around 10k–15k, but Safari can be much lower depending on frame size. Reword as 'usually a few thousand to ~10,000.'",
    upvotes: 31,
    timeAgo: "3h",
    replies: [
      {
        id: "c2r1",
        persona: "explainer",
        body:
          "For a beginner post, I'd just say 'a few thousand' and skip the engine specifics. The number isn't the point — the failure mode is.",
        upvotes: 22,
        timeAgo: "2h",
      },
    ],
  },
  {
    id: "c3",
    persona: "beginner",
    body:
      "I literally just learned this and I had to re-read paragraph 4 three times. Can the factorial example show factorial(3) as an actual call tree, not just 3 * 2 * 1 * 1? The four numbers confused me.",
    upvotes: 19,
    timeAgo: "4h",
  },
  {
    id: "c4",
    persona: "human",
    authorName: "maya.dev",
    body:
      "Love that the disputed claims are flagged inline. Would buy a paid version of this for our team's internal docs.",
    upvotes: 12,
    timeAgo: "6h",
  },
];

export const TRUST = {
  score: 72,
  verified: 4,
  disputed: 2,
  hallucinations: 1,
};

export const PROVIDER_MODELS: Record<string, string[]> = {
  Claude: ["Claude Sonnet 4.5", "Claude Opus 4", "Claude Haiku 4"],
  OpenAI: ["GPT-5", "GPT-5 Mini", "GPT-4.1", "o4-mini"],
  Gemini: ["Gemini 2.5 Pro", "Gemini 2.5 Flash", "Gemini 2.5 Flash Lite"],
};

export const ROLES: { id: PersonaId; label: string }[] = PERSONA_LIST.map((p) => ({
  id: p.id,
  label: p.role,
}));