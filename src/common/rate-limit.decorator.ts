import { SetMetadata } from "@nestjs/common";

export type RateLimitOptions = {
  limit: number;
  windowSeconds: number;
  scope: "ip" | "user" | "session";
};

export const RATE_LIMIT_KEY = "rateLimit";
export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);
