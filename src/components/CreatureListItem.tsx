import React from "react";
import { CreatureType } from "../App";
import { ALIGNMENTS, getCreatureXPCost, SIZES } from "../Utils";

enum TraitType {
  Alignment,
  Size,
  Other,
}

function getTraitType(traitName: string): TraitType {
  const lowerCaseName = traitName.toLowerCase();
  if (ALIGNMENTS.includes(lowerCaseName)) {
    return TraitType.Alignment;
  }
  if (SIZES.includes(lowerCaseName)) {
    return TraitType.Size;
  }
  return TraitType.Other;
}

const Trait = ({ type, ...props }: any) => {
  let backgroundColor = "";
  switch (type) {
    case TraitType.Alignment: {
      backgroundColor = "#4287f5";
      break;
    }
    case TraitType.Size: {
      backgroundColor = "#478c42";
      break;
    }
    default: {
      backgroundColor = "#522e2c";
    }
  }
  return (
    <span
      {...props}
      className={"bg-red-500 border-2 text-white py-0.5 px-1 text-xs mr-px"}
      style={{ borderColor: "#d8c483", backgroundColor }}
    />
  );
};

export const CreatureListItem = ({
  creature,
  withCR = true,
  onAdd = undefined,
  onDelete = undefined,
  isDisabled = false,
}: {
  creature: CreatureType;
  withCR?: boolean;
  onAdd?: (creature: CreatureType) => unknown;
  onDelete?: (creature: CreatureType) => unknown;
  isDisabled?: boolean;
}) => {
  const { name, level } = creature;
  const xp = getCreatureXPCost(level);
  const backgroundColor = isDisabled
    ? "bg-gray-300"
    : "bg-green-500 hover:bg-green-600";
  return (
    <div className={"flex justify-between p-2 bg-gray-100 hover:bg-gray-200"}>
      <div>
        <div className={"inline-block mr-2"}>{name}</div>
        <div className={"inline-block mr-2"}>
          {creature.traits?.map((trait) => (
            <Trait key={trait} type={getTraitType(trait)}>
              {trait}
            </Trait>
          ))}
        </div>
        {creature.link != null && (
          <a
            className={"text-xs underline text-blue-500"}
            href={creature.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            SRC
          </a>
        )}
      </div>

      <div>
        <span>
          {xp} <span className={"text-sm"}>XP</span>
        </span>
        {withCR && <span className={"text-xs ml-2"}>CR {level}</span>}
        {onAdd && (
          <button
            disabled={isDisabled}
            className={`ml-2 w-6 h-6 rounded-full text-center shadow hover:shadow-lg focus:outline-none ${backgroundColor}`}
            onClick={() => onAdd(creature)}
          >
            +
          </button>
        )}
        {onDelete && (
          <button
            disabled={isDisabled}
            className={`ml-2 bg-red-500 hover:bg-red-600 w-6 h-6 rounded-full text-center shadow hover:shadow-lg focus:outline-none ${
              isDisabled && "bg-gray-500 hover:bg-gray-500"
            }`}
            onClick={() => onDelete(creature)}
          >
            -
          </button>
        )}
      </div>
    </div>
  );
};
