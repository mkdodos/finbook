import React, { useState } from "react";
import { Table, Header, Menu } from "semantic-ui-react";

export default function PivotTemplate({ data }) {
  // 接收資料
  const games = ["茂林", "現代藝術", "領國者"];
  const [selectedGame, setSelectedGame] = useState("茂林");
  // const game_name = "茂林"
  // const game_name = "現代藝術";
  data = data.filter((item) => item.game_name == selectedGame);
  // 欄列鍵值
  const colkey = "player_id";
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
      <>
        {/* 直接把 CSS 寫在這裡，它只會在這個組件生效 */}
        <style>{`
          /* 針對 compact 選單的最後一個項目，把右側圓角歸零 */
          .ui.compact.menu .item:last-child {
            border-top-right-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
          }

          /* 如果底下有 pointing 指示線，也一併把它的右側圓角清掉 */
          .ui.compact.secondary.pointing.menu .item:last-child::after {
            border-top-right-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
          }
      `}</style>

        <Menu compact secondary pointing>
          {games.map((game, idx) => (
            <Menu.Item
              color="blue"
              onClick={() => setSelectedGame(game)}
              active={game == selectedGame}
              key={idx}
            >
              {game}
            </Menu.Item>
          ))}
        </Menu>
      </>
      {/* 顯示遊戲標題 */}
      {/* <Header as="h3" color="blue">
        {game_name}
      </Header> */}
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              {rowkey} / {colkey}
            </Table.HeaderCell>
            {/* 横欄,玩家 */}
            {columnArray.map(([gId, gData]) => (
              <Table.HeaderCell key={gId} textAlign="center">
                {gData[0].player_name}
              </Table.HeaderCell>
            ))}
            {/* <Table.HeaderCell textAlign="center">列合計</Table.HeaderCell> */}
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
                      {matched?.role_name}
                      {matched?.role_name && " / "}
                      {matched?.points}
                    </Table.Cell>
                  );
                })}
                {/* <Table.Cell textAlign="center">{sum}</Table.Cell> */}
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
                <Table.HeaderCell
                  key={gId}
                  textAlign="center"
                  style={{ lineHeight: "1.4" }}
                >
                  {/* 合計：正常或粗體大字 */}
                  <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    {sum}
                  </div>

                  {/* 平均：小字、灰色、帶有說明 */}
                  <div style={{ fontSize: "0.9em", color: "#666" }}>
                    平均 : {Math.round(sum / gData.length)}
                  </div>
                  {/* {sum}
                  {Math.round(sum / rowArray.length)} */}
                </Table.HeaderCell>
              );
            })}
            {/* <Table.HeaderCell textAlign="center"></Table.HeaderCell> */}
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
}
