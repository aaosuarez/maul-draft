export const ALIGNMENTS = ["lg", "ng", "cg", "ln", "n", "cn", "le", "ne", "ce"];
export const SIZES = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
export const MAX_XP = 120;
const CREATURE_LEVEL_DIFFERENCE_TO_XP = new Map([
  [-4, 10],
  [-3, 15],
  [-2, 20],
  [-1, 30],
  [0, 40],
  [1, 60],
  [2, 80],
  [3, 120],
  [4, 160],
]);

export const getCreatureXPCost = (
  creatureLevel: number,
  partyLevel: number = 1
): number => {
  return CREATURE_LEVEL_DIFFERENCE_TO_XP.get(creatureLevel - partyLevel) ?? 0;
};
