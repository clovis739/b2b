export type WorkspaceDraft = {
  id: number;
  title: string;
  type: string;
  fields: Record<string, string>;
};
export function normalizeDrafts(value: unknown): WorkspaceDraft[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (d): d is WorkspaceDraft =>
      Boolean(d) &&
      typeof d === "object" &&
      typeof d.id === "number" &&
      Number.isFinite(d.id) &&
      typeof d.title === "string" &&
      typeof d.type === "string" &&
      d.fields !== null &&
      typeof d.fields === "object" &&
      !Array.isArray(d.fields) &&
      Object.values(d.fields).every((v) => typeof v === "string"),
  );
}
export function draftToText(draft: WorkspaceDraft) {
  return [
    draft.title,
    `Type: ${draft.type}`,
    "Private draft — not sent or published",
    "",
    ...Object.entries(draft.fields).map(
      ([key, value]) =>
        `${key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}: ${value}`,
    ),
  ].join("\n");
}
export function downloadDraft(draft: WorkspaceDraft) {
  const url = URL.createObjectURL(
    new Blob([draftToText(draft)], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `globy-${draft.type}-${draft.id}.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
