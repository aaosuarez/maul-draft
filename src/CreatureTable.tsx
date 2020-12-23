import React from "react";
import {getCreatureXPCost, MAX_XP} from "./Utils";
import {useSortBy, useTable} from "react-table";
import monstersJSON from "./monsters.json";
import {CreatureType} from "./App";
import {getTraitType, Trait} from "./components/Trait";

const creatures = monstersJSON.monsters.filter(
  (c) => c.level < 3 && c.source?.includes("Bestiary pg.")
);

export const DraftCreatureButton = ({
                                      className,
                                      onClick,
                                      currentXP,
                                      creature,
                                    }: { className: string, onClick: (creature: CreatureType) => unknown, currentXP: number, creature: CreatureType }) => {
  const isDisabled = getCreatureXPCost(creature.level) + currentXP > MAX_XP;
  const backgroundColor = isDisabled
    ? "bg-gray-300 cursor-default"
    : "bg-green-500 hover:bg-green-600";
  return (
    <button
      disabled={isDisabled}
      className={`${className} ml-2 w-6 h-6 rounded-full text-center shadow hover:shadow-lg focus:outline-none ${backgroundColor}`}
      onClick={() => onClick(creature)}
    >
      +
    </button>
  )
}

export const CreatureTable = ({
                                onAdd,
                                currentXP
                              }: { onAdd: (creature: CreatureType) => unknown, currentXP: number }) => {
  const columns = React.useMemo(() => [
    {
      Header: 'Name',
      id: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Traits',
      id: 'Traits',
      Cell: ({row}: any): React.ReactNode => {
        const {original: creature} = row;
        return (<div className={"inline-block mr-2"}>
          {creature.traits?.map((trait: string) => (
            <Trait key={trait} type={getTraitType(trait)}>
              {trait}
            </Trait>
          ))}
        </div>)
      }
    },
    {
      Header: 'Level',
      id: 'Level',
      accessor: 'level',
      Cell: ({value}: any) => (<div className={"text-right"}>{value}</div>)
    },
    {
      Header: 'XP Cost',
      id: 'XP',
      accessor: 'level',
      headerClassName: 'text-right',
      Cell: ({value}: any) => {
        return <div className={"text-right"}>{getCreatureXPCost(value)}</div>;
      }
    },
    {
      id: 'Add',
      Cell: ({row}: any): React.ReactNode => {
        const {original: creature} = row;
        return (
          <DraftCreatureButton creature={creature} className={"float-right"} onClick={onAdd} currentXP={currentXP}/>);
      }
    }
  ], [onAdd, currentXP]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<any>({columns, data: creatures}, useSortBy);

  return (
    <>
      <table {...getTableProps()} className={"w-full"}>
        <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} className={"border-b"}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
             </span>
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()} className={"hover:bg-gray-100"}>
              {row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps()} className={"p-2 border"}>
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
    </>
  );
}