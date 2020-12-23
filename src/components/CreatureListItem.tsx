import React from "react";
import {CreatureType} from "../App";
import {getCreatureXPCost} from "../Utils";

export const CreatureListItem = ({
                                   creature,
                                   onDelete = undefined,
                                 }: {
  creature: CreatureType;
  onDelete?: (creature: CreatureType) => unknown;
}) => {
  const {name, level} = creature;
  const xp = getCreatureXPCost(level);
  return (
    <div className={"flex justify-between p-2 bg-gray-100 hover:bg-gray-200"}>
      <div>
        <div className={"inline-block mr-2"}>{name}</div>
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
        {onDelete && (
          <button
            className={`ml-2 bg-red-500 hover:bg-red-600 w-6 h-6 rounded-full text-center shadow hover:shadow-lg focus:outline-none`}
            onClick={() => onDelete(creature)}
          >
            -
          </button>
        )}
      </div>
    </div>
  );
};
