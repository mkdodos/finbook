import React from "react";
import { Table } from "semantic-ui-react";

export default function PivotTable({ data }) {
  console.log(data);
  const playersObj = Object.groupBy(data, (item) => item.player_id);
  const sessionObj = Object.groupBy(data, (item) => item.session_id);
  //   console.log(players);
  const playerGroups = Object.entries(playersObj);
  const sessionGroups = Object.entries(sessionObj);
  console.log(sessionGroups);
  return (
    <div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>日期/玩家</Table.HeaderCell>
            {data?.length > 0 &&
              playerGroups.map(([playerId, records]) => (
                <Table.HeaderCell key={playerId}>
                  {records[0]?.player_name}
                </Table.HeaderCell>
              ))}

            {/* <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Quote ID</Table.HeaderCell>
            <Table.HeaderCell width={8}>Note (p_note)</Table.HeaderCell> */}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data?.length > 0 &&
            sessionGroups.map(([sId, records]) => (
              <Table.Row key={sId}>
                <Table.Cell>{records[0]?.play_date}</Table.Cell>
                {playerGroups.map(([playerId, records]) => {
                  // 篩選出該玩家在這場遊戲中的得分
                  const playerRecord = data.find(
                    (item) =>
                      String(item.player_id) === String(playerId) &&
                      item.session_id === sId,
                  );

                  return (
                    <Table.Cell key={playerId}>
                      <strong>{playerRecord?.points} 分</strong>
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
}
