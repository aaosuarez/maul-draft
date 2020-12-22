import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import monstersJSON from "./monsters.json";
import { CreatureListItem } from "./components/CreatureListItem";
import { getCreatureXPCost, MAX_XP } from "./Utils";

export type CreatureType = {
  level: number;
  name: string;
  link?: string;
  traits?: string[];
};

interface TeamCreatureType extends CreatureType {
  id: string;
}

const creatures = monstersJSON.monsters.filter(
  (c) => c.level < 3 && c.source?.includes("Bestiary pg.")
);

const XPCounter = ({ value }: { value: number }) => {
  return (
    <div className={"inline-block"}>
      <div className={"text-sm uppercase text-sm font-bold text-gray-800"}>
        XP Available
      </div>
      <div className={"text-xl"}>
        {value} / {MAX_XP}
      </div>
    </div>
  );
};

function App() {
  const [team, setTeam] = useState<TeamCreatureType[]>([]);
  const currentXP = team
    .map((creature) => getCreatureXPCost(creature.level))
    .reduce((result, value) => result + value, 0);

  const onAddTeamCreature = (creature: CreatureType) => {
    const creatureXP = getCreatureXPCost(creature.level);
    if (currentXP + creatureXP > MAX_XP) {
      return;
    }
    const newTeam = [...team];
    newTeam.push({
      ...creature,
      id: uuid(),
    });
    setTeam(newTeam);
  };

  const onRemoveTeamCreature = (creature: CreatureType) => {
    const creatureToRemoveIndex = team.findIndex(
      (c) => c.name === creature.name
    );
    if (creatureToRemoveIndex === -1) {
      return;
    }
    const newTeam = [...team];
    newTeam.splice(creatureToRemoveIndex, 1);
    setTeam(newTeam);
  };

  return (
    <div className={"container mx-auto grid grid-cols-3 gap-4 m-4"}>
      <div className={"col-span-2"}>
        <p>Select Creatures</p>
        <div>
          {creatures.map((creature) => (
            <CreatureListItem
              key={creature.name}
              creature={creature}
              isDisabled={
                getCreatureXPCost(creature.level) + currentXP > MAX_XP
              }
              onAdd={onAddTeamCreature}
            />
          ))}
        </div>
      </div>
      <div>
        <div className={"sticky top-4 p-4 bg-gray-100 rounded"}>
          <XPCounter value={MAX_XP - currentXP} />
          <div className={"mt-8 uppercase text-sm font-bold text-gray-800"}>
            Your Team
          </div>
          <div>
            {team.length > 0 ? (
              team.map((creature) => (
                <CreatureListItem
                  key={creature.id}
                  creature={creature}
                  withCR={false}
                  onDelete={onRemoveTeamCreature}
                />
              ))
            ) : (
              <div>Add creatures to your team.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
