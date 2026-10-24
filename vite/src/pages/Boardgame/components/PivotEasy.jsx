import { useState } from "react";
import { Table } from "semantic-ui-react";

export default function PivotEasy({ data }) {
  const [selectedGame, setSelectedGame] = useState("現代藝術");
  //   const [selectedGame, setSelectedGame] = useState("茂林");

  data = data.filter((item) => item.game_name == selectedGame);
  // 將資料依所需鍵值群組
  //   const groupedData = data.reduce((acc, item) => {
  //     if (acc[item.player_id]) {
  //       acc[item.player_id].push(item);
  //     } else {
  //       acc[item.player_id] = [item];
  //     }
  //     return acc;
  //   }, {});
  // 同時計算群組合計
  //   const groupedData = data.reduce((acc, item) => {
  //     const pointValue = Number(item.points) || 0; // 確保一定是數字，若無則為 0
  //     if (acc[item.player_id]) {
  //       acc[item.player_id].gData.push(item);
  //       acc[item.player_id].total += pointValue;
  //     } else {
  //       // 不存在
  //       acc[item.player_id] = { gData: [item], total: pointValue };
  //     }
  //     return acc;
  //   }, {});

  // 傳入資料和鍵值,傳回群組資料
  const groupedData = (data, key) => {
    return data.reduce((acc, item) => {
      const points = Number(item.points) || 0;
      const groupKey = item[key];
      acc[groupKey] ||= { gData: [], total: 0 };
      //   acc[item[key]].total ||= 0;
      acc[groupKey].gData.push(item);
      acc[groupKey].total += points;
      return acc;
    }, {});
  };

  //   console.log(groupedData(data, "player_id"));
  // 將群組資料轉為陣列,方便顯示
  // 二維陣列,第1個元素為鍵值,第2個元素為各組資料
  const groupedArray = Object.entries(groupedData(data, "player_id"));
  console.log(groupedArray);
  //   return;
  return (
    <div>
      {/* 將群組資料用表格呈現 */}
      {/* 橫欄 */}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            {groupedArray.map(([gId, { gData, total }]) => {
              {
                /* {groupedArray.map(([gId, gData]) => { */
              }
              return (
                <Table.HeaderCell key={gId}>
                  {gData[0].player_name}
                  {total}
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
      </Table>
    </div>
  );
}
