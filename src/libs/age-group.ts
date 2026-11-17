export type AgeGroup =
  | "ADULT"
  | "CHILD_4_7"
  | "CHILD_UNDER_4";

export const AGE_GROUPS: AgeGroup[] = [
  "ADULT",
  "CHILD_4_7",
  "CHILD_UNDER_4",
];

export const AGE_GROUP_OPTIONS: {
  value: AgeGroup;
  label: string;
  shortLabel: string;
}[] = [
  {
    value: "ADULT",
    label: "Adulto",
    shortLabel: "Adulto",
  },
  {
    value: "CHILD_4_7",
    label: "4 a 7 anos",
    shortLabel: "4–7 anos",
  },
  {
    value: "CHILD_UNDER_4",
    label: "Menos de 4 anos",
    shortLabel: "< 4 anos",
  },
];

export function isAgeGroup(
  value: unknown,
): value is AgeGroup {
  return (
    typeof value === "string" &&
    AGE_GROUPS.includes(value as AgeGroup)
  );
}

export function getAgeGroupLabel(
  value: AgeGroup | string | null | undefined,
  short = false,
): string {
  const option = AGE_GROUP_OPTIONS.find(
    (item) => item.value === value,
  );

  if (!option) return "Adulto";

  return short ? option.shortLabel : option.label;
}

export function isChildAgeGroup(
  value: AgeGroup | string | null | undefined,
) {
  return value === "CHILD_4_7" || value === "CHILD_UNDER_4";
}