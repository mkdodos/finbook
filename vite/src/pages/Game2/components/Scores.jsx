import React from "react";
import { Button, Table, Segment, Header } from "semantic-ui-react";

export default function Scores({
  players,
  gamesList,
  scoresList,
  handleDeleteGame,
  setPlayedDate,
  setEditingGameId,
}) {
  const handleEditGame = (game) => {
    // 篩選該場次的所有得分
    const data = scoresList.filter((item) => item.game_id === game.id);
    console.log(data);
    console.log(game.played_date);
    setPlayedDate(game.played_date);
    setEditingGameId(game.id);
  };

  return (
    <div>
      <Segment>
        <Header as="h3">歷史戰績列表</Header>
        <Table celled unstackable selectable textAlign="center">
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
              <Table.HeaderCell colSpan={2}>操作</Table.HeaderCell>
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
                    <Table.Cell>
                      {g.played_date}({g.id})
                    </Table.Cell>

                    {/* 依照 PLAYERS 順序對應每一位玩家的分數 */}
                    {players.map((player) => {
                      // 篩選出該玩家在這場遊戲中的得分
                      const playerRecord = gameScores.find(
                        (item) => String(item.player_id) === String(player.id),
                      );

                      return (
                        <Table.Cell key={player.id}>
                          <strong>
                            {playerRecord?.round_or_role}/{playerRecord?.score}{" "}
                            分
                          </strong>
                        </Table.Cell>
                      );
                    })}

                    <Table.Cell>
                      <Button size="small" onClick={() => handleEditGame(g)}>
                        編輯
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="small"
                        onClick={() => handleDeleteGame(g.id)}
                      >
                        刪除
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
