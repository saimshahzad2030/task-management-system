import { Step } from "@/global/types";

export function isInvalidCheckPlacement(steps: Step[], index: number) {
  const current = steps[index];
  if (current.type !== "check") return false;

  const prev = steps[index - 1];
  const next = steps[index + 1];

  if (!prev || !next) return false;

  const invalidTypes = ["text", "date"];

  return (
    invalidTypes.includes(prev.type ?? "") &&
    invalidTypes.includes(next.type ?? "")
  );
}
export function getInvalidCheckIndexes(steps: Step[]): number[] {
  const invalid: number[] = [];

  for (let i = 1; i < steps.length - 1; i++) {
    const current = steps[i];
    if (current.type !== "check") continue;

    const prev = steps[i - 1];
    const next = steps[i + 1];

    const invalidTypes = ["text", "date"];

    if (
      invalidTypes.includes(prev.type ?? "") &&
      invalidTypes.includes(next.type ?? "")
    ) {
      invalid.push(i);
    }
  }

  return invalid;
}
