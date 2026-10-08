import { z } from "zod";

export const difficultySchema = z.union([
  z.literal("low"),
  z.literal("medium"),
  z.literal("high"),
  z.literal("hell"),
]);

export type Difficulty = z.infer<typeof difficultySchema>;
