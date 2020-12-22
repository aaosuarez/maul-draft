import React, {useState} from 'react';
import {v4 as uuid} from 'uuid';
import monstersJSON from './monsters.json';

const CREATURE_LEVEL_TO_XP = new Map([
    [-4, 10],
    [-3, 15],
    [-2, 20],
    [-1, 30],
    [0, 40],
    [1, 60],
    [2, 80],
    [3, 120],
    [4, 160]
]);

const getXPForLevel = (creatureLevel: number, partyLevel: number = 1): number => {
    return CREATURE_LEVEL_TO_XP.get(creatureLevel - partyLevel) ?? 0;
}

const XPCounter = ({value}: { value: number }) => {
    return (
        <div className={"inline-block"}>
            <div className={"text-sm uppercase text-sm font-bold text-gray-800"}>XP Available</div>
            <div className={"text-xl"}>{value} / {MAX_XP}</div>
        </div>)
}

enum TraitType  {
    Alignment,
    Size,
    Other
}

const Trait = ({type, ...props}: any) => {
    let backgroundColor = "";
    switch (type) {
        case TraitType.Alignment: {
            backgroundColor = "#4287f5"
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
    return <span {...props}  className={"bg-red-500 border text-white p-1 text-xs font-bold"} style={{borderColor: '#d8c483', backgroundColor}}/>
}

const alignments = ['lg','ng','cg','ln','n','cn','le','ne','ce'];

const sizes = ['tiny','small','medium','large','huge','gargantuan'];

function getTraitType(traitName:string): TraitType {
    const lowerCaseName = traitName.toLowerCase();
    if (alignments.includes(lowerCaseName)) {
        return TraitType.Alignment;
    }
    if (sizes.includes(lowerCaseName)) {
        return TraitType.Size
    }
    return TraitType.Other
}

const Creature = ({creature, withCR = true, onAdd = undefined, onDelete = undefined, isDisabled = false}: { creature: CreatureType, withCR?: boolean, onAdd?: (creature: CreatureType) => unknown, onDelete?: (creature: CreatureType) => unknown, isDisabled?: boolean }) => {
    const {name, level} = creature;
    const xp = getXPForLevel(level);
    const backgroundColor = isDisabled ? 'bg-gray-300' : 'bg-green-500 hover:bg-green-600'
    return (
        <div className={"flex justify-between p-2 bg-gray-100 hover:bg-gray-200"}>
            <div>
                <div className={"inline-block mr-2"}>{name}</div>
            <div className={"inline-block mr-2"}>
                {creature.traits?.map(trait => <Trait key={trait} type={getTraitType(trait)}>{trait}</Trait>)}
            </div>
                {creature.link != null && <a className={"text-xs underline text-blue-500"} href={creature.link} target="_blank" rel="noopener noreferrer">SRC</a>}
            </div>

            <div>
                <span>{xp} XP</span>
                {withCR && (<span className={"text-sm ml-2"}>CR {level}</span>)}
                {onAdd && <button
                    disabled={isDisabled}
                    className={`ml-2 w-6 h-6 rounded-full text-center shadow hover:shadow-lg focus:outline-none ${backgroundColor}`}
                    onClick={() => onAdd(creature)}>+</button>}
                {onDelete && <button
                    disabled={isDisabled}
                    className={`ml-2 bg-red-500 hover:bg-red-600 w-6 h-6 rounded-full text-center shadow hover:shadow-lg focus:outline-none ${isDisabled && 'bg-gray-500 hover:bg-gray-500'}`}
                    onClick={() => onDelete(creature)}>-</button>}
            </div>
        </div>
    )
}

type CreatureType = {
    level: number,
    name: string,
    link?: string,
    traits?: string[]
}

interface TeamCreatureType extends CreatureType {
    id: string;
}

const MAX_XP = 120;

const creatures = monstersJSON.monsters.filter(c => c.level < 3 && c.source?.includes("Bestiary pg."))

function App() {
    const [team, setTeam] = useState<TeamCreatureType[]>([]);
    const currentXP = team.map(creature => getXPForLevel(creature.level)).reduce((result, value) => result + value, 0);

    const onAddTeamCreature = (creature: CreatureType) => {
        const creatureXP = getXPForLevel(creature.level);
        if (currentXP + creatureXP > MAX_XP) {
            return;
        }
        const newTeam = [...team];
        newTeam.push({
            ...creature,
            id: uuid(),
        });
        setTeam(newTeam);
    }


    const onRemoveTeamCreature = (creature: CreatureType) => {
        const creatureToRemoveIndex = team.findIndex(c => c.name === creature.name);
        if (creatureToRemoveIndex === -1) {
            return;
        }
        const newTeam = [...team];
        newTeam.splice(creatureToRemoveIndex, 1);
        setTeam(newTeam);
    }

    return (
        <div className={"container mx-auto grid grid-cols-3 gap-4 m-4"}>
            <div className={"col-span-2"}>
                <p>Select Creatures</p>
                <div>
                    {
                        creatures.map(creature => <Creature key={creature.name} creature={creature}
                                                            isDisabled={getXPForLevel(creature.level) + currentXP > MAX_XP}
                                                            onAdd={onAddTeamCreature}/>)
                    }</div>
            </div>
            <div>
                <div  className={"sticky top-4 p-4 bg-gray-100 rounded"}>
                <XPCounter value={MAX_XP - currentXP}/>
                <div className={"mt-8 uppercase text-sm font-bold text-gray-800"}>Your Team</div>
                <div>
                    {team.length > 0 ? team.map(creature => <Creature key={creature.id} creature={creature}
                                                                      withCR={false}

                                                                      onDelete={onRemoveTeamCreature}/>) : (
                        <div>Add creatures to your team.</div>)}
                </div>
                </div>
            </div>

        </div>
    );
}

export default App;
