/** Shown when a module has no CMS “due” label (self-paced tracks). */
export const SELF_PACED_LABEL = "Self-paced";

export function pacingLabelFromDue(dueDate: string | undefined | null): string {
  const t = dueDate?.trim();
  return t ? t : SELF_PACED_LABEL;
}
