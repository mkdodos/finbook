import React, { useState } from "react";
import { Table } from "semantic-ui-react";
// 依角色分類,一個角色一張pivot
export default function PivotRole({ data }) {
  // 接收資料
  const games = ["茂林", "現代藝術", "領國者"];
  const [selectedGame, setSelectedGame] = useState("茂林");
  // const game_name = "茂林"
  // const game_name = "現代藝術";
  data = data.filter((item) => item.game_name == selectedGame);
  const colkey = "role_id";
  const rowkey = "play_date";
  // 將資料依鍵值群組
  const columnGroups = Object.groupBy(data, (item) => item[colkey]);
  const rowGroups = Object.groupBy(data, (item) => item[rowkey]);
  const columnArray = Object.entries(columnGroups);
  const rowArray = Object.entries(rowGroups);
  console.log(columnArray);
  const total = data.reduce((acc, item) => {
    return acc + Number(item.points);
  }, 0);
  return (
    <div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              {rowkey} / {colkey}
            </Table.HeaderCell>
            {/* 横欄,角色 */}
            {columnArray.map(([gId, gData]) => (
              <Table.HeaderCell key={gId} textAlign="center">
                {gData[0].role_name}
              </Table.HeaderCell>
            ))}
            <Table.HeaderCell textAlign="center">列合計</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {/* 直列,日期 */}
          {rowArray.map(([rId, rData]) => {
            const sum = rData.reduce((acc, item) => {
              return acc + Number(item.points);
            }, 0);

            return (
              <Table.Row key={rId}>
                <Table.Cell>{rId}</Table.Cell>
                {/* 資料格,玩家 */}
                {columnArray.map(([gId, gData]) => {
                  const matched = gData.find((item) => item[rowkey] === rId);
                  return (
                    <Table.Cell key={gId} textAlign="center">
                      {matched?.player_name}
                      {matched?.player_name && " / "}
                      {matched?.points}
                    </Table.Cell>
                  );
                })}
                <Table.Cell textAlign="center">{sum}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
        <Table.Footer>
          {/* 欄合計 */}
          <Table.Row>
            <Table.HeaderCell>欄合計</Table.HeaderCell>
            {columnArray.map(([gId, gData]) => {
              const sum = gData.reduce((acc, item) => {
                return (acc += Number(item.points));
              }, 0);
              return (
                <Table.HeaderCell key={gId} textAlign="center">
                  {sum}
                </Table.HeaderCell>
              );
            })}
            <Table.HeaderCell textAlign="center">{total}</Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
}
