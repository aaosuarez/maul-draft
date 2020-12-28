import React from "react";
import {ALIGNMENTS, RARITIES, SIZES} from "../Utils";

enum TraitType {
  Default,
  Alignment,
  Size,
  Rarity,
}

const TraitBackgrounds = {
  [TraitType.Default]: "#522e2c",
  [TraitType.Alignment]: "#4287f5",
  [TraitType.Size]: "#478c42",
  [TraitType.Rarity]: "#c45500"
}

// const TraitsByType: Record<TraitType, string[]> = {
//   [TraitType.Default]: [],
//   [TraitType.Alignment]: ALIGNMENTS,
//   [TraitType.Rarity]: RARITIES,
//   [TraitType.Size]: SIZES
// }

// TODO: use [TraitsByType] record here
export function getTraitType(traitName: string): TraitType {
  const lowerCaseName = traitName.toLowerCase();

  if (RARITIES.includes(lowerCaseName)) {
    return TraitType.Rarity;
  }
  if (ALIGNMENTS.includes(lowerCaseName)) {
    return TraitType.Alignment;
  }
  if (SIZES.includes(lowerCaseName)) {
    return TraitType.Size;
  }
  return TraitType.Default;
}

export const Trait = ({type, children}: { type: TraitType, children: React.ReactChild }) => {
  const backgroundColor = TraitBackgrounds[type] ?? 'black';

  return (
    <span
      className={"bg-red-500 border-2 text-white py-0.5 px-1 text-xs mr-px"}
      style={{borderColor: "#d8c483", backgroundColor}}
    >
      {children}
    </span>
  );
};