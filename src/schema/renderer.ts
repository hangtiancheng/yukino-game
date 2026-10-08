import { z } from "zod";

export const gameRendererKindSchema = z.union([
  z.literal("dom"),
  z.literal("pixi"),
]);
