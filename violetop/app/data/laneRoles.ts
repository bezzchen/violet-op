export type LaneRole = "Top" | "Jungle" | "Middle" | "Bottom" | "Support";

const laneAliases = new Map<string, LaneRole>([
  ["top", "Top"],
  ["jungle", "Jungle"],
  ["jg", "Jungle"],
  ["middle", "Middle"],
  ["mid", "Middle"],
  ["bottom", "Bottom"],
  ["bot", "Bottom"],
  ["adc", "Bottom"],
  ["support", "Support"],
  ["supp", "Support"],
]);

/** The League lane a roster role names ("Support / sub" is Support), or null when it names none. */
export function laneRole(role: string): LaneRole | null {
  const lane = role.split("/")[0].trim().toLowerCase();
  // A Map rather than an object, so words like "constructor" can't match inherited keys.
  return laneAliases.get(lane) ?? null;
}
