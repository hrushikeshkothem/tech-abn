import { z } from "zod";

export const addSourceSchema = z.object({
  sourceName: z.string().min(3, "Name must be at least 3 characters").max(50),
  rssUrl: z.string().url("Enter a valid RSS URL"),
  bannerUrl: z
    .string()
    .url("Enter a valid Banner URL")
    .optional()
    .or(z.literal("")),
});

export const editSourceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  url: z.string().url("Enter a valid RSS URL"),
  bannerUrl: z
    .string()
    .url("Enter a valid Banner URL")
    .optional()
    .or(z.literal("")),
});

export const serverConfigSchema = z.object({
  proxyServer: z.string().url("Enter a valid URL"),
  retentionPeriod: z.number().min(1).max(365),
  relaxationTime: z.number().min(0.5).max(60),
});