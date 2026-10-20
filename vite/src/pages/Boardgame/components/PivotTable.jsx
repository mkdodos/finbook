import React, { useEffect } from "react";
import { Table, Header } from "semantic-ui-react";

export default function PivotTable({ data = [] }) {
  // 1. 依照 game_name 或 game_id 進行遊戲分組
  const gamesObj = Object.groupBy(
    data,
    (item) => item.game_name || item.game_id,
  );
  const gameGroups = Object.entries(gamesObj);

  // 渲染單一遊戲的樞紐分析表
  const renderGamePivotTable = (gameName, gameRecords) => {
    // 2. 取得「該場遊戲」出現過的所有玩家與場次 (Session)
    const playersObj = Object.groupBy(gameRecords, (item) => item.player_id);
    const sessionsObj = Object.groupBy(gameRecords, (item) => item.session_id);

    const playerList = Object.entries(playersObj);
    const sessionList = Object.entries(sessionsObj);

    return (
      <div key={gameName} style={{ marginBottom: "2rem" }}>
        {/* 顯示遊戲標題 */}
        <Header as="h3" color="blue" dividing>
          🎮 遊戲：{gameName}
        </Header>

        <Table celled striped selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>日期 / 玩家</Table.HeaderCell>
              {/* 橫軸：顯示該遊戲的所有玩家 */}
              {playerList.map(([playerId, pRecords]) => (
                <Table.HeaderCell key={playerId} textAlign="center">
                  {pRecords[0]?.player_name || `Player ${playerId}`}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {/* 縱軸：顯示該遊戲的所有 Session (場次) */}
            {sessionList.map(([sId, sRecords]) => {
              const playDate = sRecords[0]?.play_date || `Session ${sId}`;

              return (
                <Table.Row key={sId}>
                  {/* 第一欄：遊玩日期 */}
                  <Table.Cell style={{ fontWeight: "bold" }}>
                    {playDate}
                  </Table.Cell>

                  {/* 各玩家的得分交叉點 */}
                  {playerList.map(([playerId]) => {
                    // 從「該場遊戲」的紀錄中找出對應 player_id 與 session_id 的得分
                    const playerRecord = gameRecords.find(
                      (item) =>
                        String(item.player_id) === String(playerId) &&
                        String(item.session_id) === String(sId),
                    );

                    return (
                      <Table.Cell key={playerId} textAlign="center">
                        {playerRecord ? (
                          <strong>
                            {playerRecord.role_name}
                            {playerRecord.role_name && " / "}
                            {playerRecord.points} 分
                          </strong>
                        ) : (
                          <span style={{ color: "#ccc" }}>-</span>
                        )}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  };

  if (!data || data.length === 0) {
    return <div>目前沒有資料</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      {gameGroups.map(([gameName, gameRecords]) =>
        renderGamePivotTable(gameName, gameRecords),
      )}
    </div>
  );
}
