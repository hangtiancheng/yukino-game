import { z } from "zod";
import { difficultySchema } from "./difficulty";

export const playerNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(16)
  .regex(/^[A-Za-z0-9 _-]+$/);

export const leaderboardEntrySchema = z.object({
  createdAt: z.string().min(1),
  difficulty: difficultySchema,
  id: z.string().min(1),
  level: z.number().int().positive(),
  lines: z.number().int().nonnegative(),
  playerName: playerNameSchema,
  score: z.number().int().nonnegative(),
});

export const leaderboardSchema = z.array(leaderboardEntrySchema).max(10);

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
export type PlayerName = z.infer<typeof playerNameSchema>;
