import React from "react";
import { Button, Table, Segment, Header } from "semantic-ui-react";

export default function Scores({ players, gamesList, scoresList }) {
  return (
    <div>
      <Segment>
        <Header as="h3">歷史戰績列表</Header>
        <Table celled striped textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>日期</Table.HeaderCell>
              {/* <Table.HeaderCell>桌遊名稱</Table.HeaderCell> */}
              {/* 動態產生 4 位玩家的欄位標題 */}
              {players.map((player) => (
                <Table.HeaderCell key={player.id}>
                  {player.name}
                </Table.HeaderCell>
              ))}
              <Table.HeaderCell>操作</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {gamesList.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={players.length + 3} textAlign="center">
                  尚無歷史紀錄
                </Table.Cell>
              </Table.Row>
            ) : (
              gamesList.map((g) => {
                // 找出屬於這場遊戲的所有分數紀錄
                const gameScores =
                  scoresList?.filter(
                    (item) => String(item.game_id) === String(g.id),
                  ) || [];

                return (
                  <Table.Row key={g.id}>
                    <Table.Cell>{g.played_date}</Table.Cell>

                    {/* 依照 PLAYERS 順序對應每一位玩家的分數 */}
                    {players.map((player) => {
                      // 篩選出該玩家在這場遊戲中的所有角色得分
                      //   const playerRecords = gameScores.filter(
                      //     (item) => String(item.player_id) === String(player.id),
                      //   );
                      const playerRecords = gameScores.find(
                        (item) => String(item.player_id) === String(player.id),
                      );

                      //   if (playerRecords.length === 0) {
                      //     return <Table.Cell key={player.id}>-</Table.Cell>;
                      //   }

                      // 計算該玩家 4 個角色的總分（若只需顯示各角色細項也可自行調整）
                      //   const totalScore = playerRecords.reduce(
                      //     (sum, cur) => sum + (parseInt(cur.score) || 0),
                      //     0,
                      //   );

                      return (
                        <Table.Cell key={player.id}>
                          <strong>
                            {playerRecords?.round_or_role}/
                            {playerRecords?.score} 分
                          </strong>
                        </Table.Cell>
                      );
                    })}

                    <Table.Cell>
                      <Button
                        size="small"
                        color="blue"
                        onClick={() => handleViewDetails(g.id)}
                      >
                        詳情
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table>
      </Segment>
    </div>
  );
}
