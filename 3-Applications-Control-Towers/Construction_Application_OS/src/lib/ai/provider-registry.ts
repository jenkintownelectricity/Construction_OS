import type { ModelInfo, ProviderId } from "./provider-types";

export interface ProviderRegistryEntry {
  id: ProviderId;
  name: string;
  description: string;
  defaultModel: string;
  models: ModelInfo[];
  supportsBaseUrl: boolean;
  icon: string;
}

const OPENAI_MODELS: ModelInfo[] = [
  { id: "gpt-4o", name: "GPT-4o", capabilities: ["detail_explainer", "premium_reasoning", "assembly_summarizer", "manufacturer_note_drafter"], contextWindow: 128000, supportsStreaming: true },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", capabilities: ["fast_classification", "observation_classifier", "field_note_cleaner", "artifact_summary"], contextWindow: 128000, supportsStreaming: true },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", capabilities: ["detail_explainer", "related_detail_suggester", "assembly_summarizer"], contextWindow: 128000, supportsStreaming: true },
  { id: "o1", name: "o1", capabilities: ["premium_reasoning"], contextWindow: 200000, supportsStreaming: false },
];

const ANTHROPIC_MODELS: ModelInfo[] = [
  { id: "claude-opus-4-6", name: "Claude Opus 4.6", capabilities: ["premium_reasoning", "detail_explainer", "assembly_summarizer"], contextWindow: 200000, supportsStreaming: true },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", capabilities: ["detail_explainer", "manufacturer_note_drafter", "related_detail_suggester", "assembly_summarizer"], contextWindow: 200000, supportsStreaming: true },
  { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", capabilities: ["fast_classification", "observation_classifier", "field_note_cleaner", "artifact_summary"], contextWindow: 200000, supportsStreaming: true },
];

const GEMINI_MODELS: ModelInfo[] = [
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", capabilities: ["fast_classification", "observation_classifier", "field_note_cleaner"], contextWindow: 1048576, supportsStreaming: true },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", capabilities: ["premium_reasoning", "detail_explainer", "assembly_summarizer", "manufacturer_note_drafter"], contextWindow: 1048576, supportsStreaming: true },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", capabilities: ["fast_classification", "artifact_summary", "related_detail_suggester"], contextWindow: 1048576, supportsStreaming: true },
];

const GROQ_MODELS: ModelInfo[] = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", capabilities: ["fast_classification", "observation_classifier", "field_note_cleaner", "artifact_summary"], contextWindow: 131072, supportsStreaming: true },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", capabilities: ["fast_classification", "field_note_cleaner"], contextWindow: 131072, supportsStreaming: true },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", capabilities: ["fast_classification", "observation_classifier", "related_detail_suggester"], contextWindow: 32768, supportsStreaming: true },
];

export const PROVIDER_REGISTRY: Record<ProviderId, ProviderRegistryEntry> = {
  openai: {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4o, GPT-4 Turbo, and o1 reasoning models",
    defaultModel: "gpt-4o-mini",
    models: OPENAI_MODELS,
    supportsBaseUrl: true,
    icon: "OpenAI",
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude Opus, Sonnet, and Haiku models",
    defaultModel: "claude-sonnet-4-6",
    models: ANTHROPIC_MODELS,
    supportsBaseUrl: false,
    icon: "Anthropic",
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    description: "Gemini 2.5 Pro, Flash, and multimodal models",
    defaultModel: "gemini-2.5-flash",
    models: GEMINI_MODELS,
    supportsBaseUrl: false,
    icon: "Gemini",
  },
  groq: {
    id: "groq",
    name: "Groq",
    description: "Ultra-fast inference with Llama and Mixtral models",
    defaultModel: "llama-3.3-70b-versatile",
    models: GROQ_MODELS,
    supportsBaseUrl: false,
    icon: "Groq",
  },
};

export function getProvider(id: ProviderId): ProviderRegistryEntry {
  return PROVIDER_REGISTRY[id];
}

export function getAllProviders(): ProviderRegistryEntry[] {
  return Object.values(PROVIDER_REGISTRY);
}

export function getModelsForProvider(id: ProviderId): ModelInfo[] {
  return PROVIDER_REGISTRY[id].models;
}
