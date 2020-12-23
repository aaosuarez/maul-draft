import React, {useState} from "react";
import {v4 as uuid} from "uuid";
import {CreatureListItem} from "./components/CreatureListItem";
import {getCreatureXPCost, MAX_XP} from "./Utils";
import {CreatureTable, DraftCreatureButton} from "./CreatureTable";

export type CreatureType = {
  level: number;
  name: string;
  link?: string;
  traits?: string[];
};

interface TeamCreatureType extends CreatureType {
  id: string;
}

const XPCounter = ({value}: { value: number }) => {
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

export function getXPTotal(creatures: CreatureType[]): number {
  return creatures
    .map((creature) => getCreatureXPCost(creature.level))
    .reduce((result, value) => result + value, 0);
}

function App() {
  const [team, setTeam] = useState<TeamCreatureType[]>([]);
  const currentXP = getXPTotal(team)

  const onAddTeamCreature = React.useCallback((creature: CreatureType) => {
    const currentXP = getXPTotal(team)
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
  }, [team]);

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
        <CreatureTable onAdd={onAddTeamCreature} currentXP={currentXP}/>
      </div>
      <div>
        <div className={"sticky top-4 p-4 bg-gray-100 rounded"}>
          <XPCounter value={MAX_XP - currentXP}/>
          <div className={"mt-8 uppercase text-sm font-bold text-gray-800"}>
            Your Team
          </div>
          <div>
            {team.length > 0 ? (
              team.map((creature) => (
                <CreatureListItem
                  key={creature.id}
                  creature={creature}
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
