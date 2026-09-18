import type { IconName } from "@/components/ui/Icon";

/**
 * Saarthi: the assistant's interface.
 * The interface is real, the answers are not connected yet, and the panel
 * says so plainly rather than pretending.
 */
export const assistant = {
  name: "Saarthi",
  meaning: "the one who steers",
  tagline: "Ask anything. Counselling, colleges, or whatever else is on your mind.",
  status: "Preview",
  statusNote: "The interface is here. Answers switch on in the next phase.",
};

export type AssistantTool = {
  id: string;
  label: string;
  icon: IconName;
  hint: string;
  prompts: string[];
};

export const tools: AssistantTool[] = [
  {
    id: "ask",
    label: "Ask",
    icon: "sparkles",
    hint: "Anything at all",
    prompts: [
      "What is the difference between freeze, float and slide?",
      "My rank is 18,000 in JEE Main. What is realistic for me?",
      "Explain home state quota like I am new to this.",
    ],
  },
  {
    id: "colleges",
    label: "Colleges",
    icon: "landmark",
    hint: "Find and shortlist",
    prompts: [
      "Which NITs take JEE Main ranks around 12,000 for CSE?",
      "Show IITs in south India with under 2 lakh fees.",
      "Compare NIT Trichy and IIIT Hyderabad for me.",
    ],
  },
  {
    id: "counselling",
    label: "Counselling",
    icon: "compass",
    hint: "Rounds and dates",
    prompts: [
      "What do I need ready before JoSAA reporting?",
      "Should I register for CSAB if I already have a seat?",
      "Walk me through UPTAC round by round.",
    ],
  },
  {
    id: "study",
    label: "Beyond",
    icon: "brain",
    hint: "Life outside counselling",
    prompts: [
      "How do I explain a drop year to my parents?",
      "What does a day in a CSE first year actually look like?",
      "Write me a study plan for the next 40 days.",
    ],
  },
];

/** Shown once, above the first question. */
export const assistantNotes = [
  { icon: "shield" as IconName, text: "Answers will cite the official source they came from." },
  { icon: "hand-heart" as IconName, text: "For a real decision, a mentor still reads your case." },
  { icon: "lock" as IconName, text: "Your questions stay on this device until you send them to us." },
];
