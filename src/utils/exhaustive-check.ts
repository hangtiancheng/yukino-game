export function exhaustiveCheck(value: never): never {
  throw new Error(`Unhandled case: ${String(value)}`);
}
