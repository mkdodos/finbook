import { useState } from "react";
import { Table } from "semantic-ui-react";

export default function PivotEasy({ data }) {
  const [selectedGame, setSelectedGame] = useState("茂林");

  // 過濾資料
  const filteredData = data.filter((item) => item.game_name === selectedGame);

  // 傳入資料和鍵值，傳回群組資料
  const groupedData = (targetData, key) => {
    return targetData.reduce((acc, item) => {
      const points = Number(item.points) || 0;
      const groupKey = item[key];
      acc[groupKey] ||= { gData: [], total: 0 };
      acc[groupKey].gData.push(item);
      acc[groupKey].total += points;
      return acc;
    }, {});
  };

  // 欄位（以 role_id 群組）與列（以 session_id 群組）
  const groupedArray = Object.entries(groupedData(filteredData, "role_id"));
  const groupedBySid = Object.entries(groupedData(filteredData, "session_id"));

  return (
    <div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>日期 / 角色</Table.HeaderCell>
            {groupedArray.map(([gId, { gData, total }]) => {
              return (
                <Table.HeaderCell key={gId}>
                  <div>{gData[0].role_name}</div>
                  {/* <div>總分: {total}</div> */}
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {groupedBySid.map(([sId, { gData: sessionData }]) => {
            return (
              <Table.Row key={sId}>
                {/* 顯示遊玩日期 */}
                <Table.Cell>{sessionData[0].play_date}</Table.Cell>

                {/* 對應每個欄位（role_id）尋找該場次（session_id）的分數 */}
                {groupedArray.map(([roleId]) => {
                  const matched = sessionData.find(
                    (obj) => String(obj.role_id) === String(roleId),
                  );
                  return (
                    <Table.Cell key={roleId}>
                      {matched ? (
                        <>
                          <div>{matched.player_name}</div>
                          <div>{matched.points}分</div>
                        </>
                      ) : (
                        "-"
                      )}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell>合計</Table.HeaderCell>
            {groupedArray.map(([gId, { total }]) => {
              return <Table.HeaderCell key={gId}>{total}</Table.HeaderCell>;
            })}
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
}
