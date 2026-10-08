import { z } from "zod";

const sentryEnvSchema = z.looseObject({
  VITE_SENTRY_DSN: z.union([z.string().url(), z.literal("")]).optional(),
  VITE_SENTRY_TRACES_SAMPLE_RATE: z.union([z.string(), z.number()]).optional(),
  MODE: z.string().optional(),
});

const tracesRateSchema = z.coerce.number().min(0).max(1);

let initPromise: Promise<typeof import("@sentry/react") | null> | null = null;

export function initializeSentry(): Promise<
  typeof import("@sentry/react") | null
> {
  if (initPromise !== null) {
    return initPromise;
  }
  initPromise = bootstrapSentry();
  return initPromise;
}

export async function captureException(error: unknown): Promise<void> {
  const sentry = await initializeSentry();
  if (sentry === null) {
    return;
  }
  sentry.captureException(error);
}

async function bootstrapSentry(): Promise<
  typeof import("@sentry/react") | null
> {
  const envResult = sentryEnvSchema.safeParse(import.meta.env);
  if (!envResult.success) {
    console.warn("Sentry disabled: invalid environment", envResult.error);
    return null;
  }
  const env = envResult.data;
  const dsn = env.VITE_SENTRY_DSN;
  if (dsn === undefined || dsn.length === 0) {
    return null;
  }
  const tracesResult = tracesRateSchema.safeParse(
    env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1,
  );
  const tracesSampleRate = tracesResult.success ? tracesResult.data : 0.1;
  const sentry = await import("@sentry/react");
  sentry.init({
    dsn,
    environment: env.MODE,
    release: __APP_VERSION__,
    tracesSampleRate,
  });
  return sentry;
}
