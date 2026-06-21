export type AgentComment = {
  id: string;
  agent: "generator" | "critic" | "verifier";
  role: string;
  content: string;
  claimId?: string;
  verdict?: "supports" | "refutes" | "unclear";
  url?: string;
};

export type ParagraphStatus = "verified" | "disputed" | "hallucination" | "neutral";

export type PipelineResult = {
  answer: {
    title: string;
    paragraphs: { id: string; text: string; status: ParagraphStatus }[];
  };
  comments: AgentComment[];
  confidence: number;
  confidenceLevel: "high" | "medium" | "low";
};

export const PIPELINE_STAGES = [
  "Drafting initial response...",
  "Domain Expert reviewing...",
  "Skeptical Critic checking claims...",
  "Verifier fetching arXiv sources...",
  "Synthesizing final study post...",
];

export const mockResult: PipelineResult = {
  confidence: 0.88,
  confidenceLevel: "high",
  answer: {
    title: "State Space Models (SSMs) vs. Transformers",
    paragraphs: [
      {
        id: "p1",
        status: "neutral",
        text: "Transformers have dominated AI because of their self-attention mechanism, which allows them to route information across an entire sequence. However, attention scales quadratically (O(N^2)) with sequence length, making it prohibitively expensive for very long contexts.",
      },
      {
        id: "p2",
        status: "verified",
        text: "Structured State Space Models (SSMs), like Mamba, solve this by compressing the context into a hidden state. They achieve linear time scaling (O(N)) for inference and can be computed as either a recurrent network for fast generation or a continuous convolution for parallel training.",
      },
      {
        id: "p3",
        status: "disputed",
        text: "Unlike Transformers, SSMs suffer no performance degradation whatsoever when scaling up to 1-million token context windows, matching exact attention retrieval perfectly.",
      },
    ],
  },
  comments: [
    {
      id: "c1",
      agent: "critic",
      role: "Domain Expert",
      content:
        "Great breakdown of the O(N) scaling. It might be helpful to mention that the 'Selection Mechanism' is what specifically allows modern SSMs to filter out irrelevant information, which older state space models struggled with.",
      claimId: "p2",
    },
    {
      id: "c2",
      agent: "critic",
      role: "Skeptical Fact-Checker",
      content:
        "Wait, the claim about 'no performance degradation whatsoever' at 1M tokens seems overly broad. SSMs still have a fixed hidden state size, which creates an information bottleneck compared to exact attention.",
      claimId: "p3",
    },
    {
      id: "c3",
      agent: "verifier",
      role: "Browser Verifier",
      content:
        "Found evidence supporting the bottleneck concern. The 'needle in a haystack' retrieval accuracy drops on specific exact-match tasks compared to full attention models.",
      claimId: "p3",
      verdict: "refutes",
      url: "https://arxiv.org/abs/2312.00752",
    },
  ],
};
