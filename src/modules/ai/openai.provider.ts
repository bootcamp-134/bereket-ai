import OpenAI from "openai";

export const OPENAI_CLIENT = Symbol("OPENAI_CLIENT");

export const openAiClientProvider = {
  provide: OPENAI_CLIENT,
  useFactory: () =>
    process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null,
};
