import React, { useState, useEffect } from "react";
import { Button, Table, Segment, Header } from "semantic-ui-react";
import axios from "axios";

import { API_HOST } from "@/global/constants";
const API_URL = `${API_HOST}/games/api2.php`;
import Scores from "./components/Scores";

// 玩家
// const PLAYERS = [
//   { id: "1", name: "馬克" },
//   { id: "2", name: "宜君" },
//   { id: "3", name: "愷軒" },
//   { id: "4", name: "欣妤" },
// ];

export default function Index() {
  const [gamesList, setGamesList] = useState([]);
  const [players, setPlayers] = useState([]);
  const [scoresList, setScoresList] = useState([]);
  const [selectedGameDetail, setSelectedGameDetail] = useState(null);

  useEffect(() => {
    fetchGames();
    fetchPlayers();
    fetchScores();
    handleViewDetails(8);
  }, []);

  const fetchGames = async () => {
    try {
      const res = await axios.get(`${API_URL}?action=get_games`);
      setGamesList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${API_URL}?action=get_players`);
      setPlayers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchScores = async () => {
    try {
      const res = await axios.get(`${API_URL}?action=get_game_scores`);
      setScoresList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = async (gameId) => {
    try {
      const res = await axios.get(
        `${API_URL}?action=get_game_details&game_id=${gameId}`,
      );
      setSelectedGameDetail(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Scores />
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
                    {/* <Table.Cell>{g.game_name}</Table.Cell> */}

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
                            {playerRecords.round_or_role}/{playerRecords.score}{" "}
                            分
                          </strong>
                          {/* 若想看各角色細項可打開下方註解 */}
                          {/* <div style={{ fontSize: '0.85em', color: '#666' }}>
                            {playerRecords.map(r => `${r.round_or_role}:${r.score}`).join(', ')}
                          </div> */}
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

      <Segment>
        <Header as="h3">單場詳細成績 (ID: 8)</Header>
        <Table celled textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>紀錄 ID</Table.HeaderCell>
              <Table.HeaderCell>玩家</Table.HeaderCell>
              <Table.HeaderCell>角色/回合</Table.HeaderCell>
              <Table.HeaderCell>分數</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {selectedGameDetail?.scores?.map((item) => {
              // 透過 player_id 找出 PLAYERS 對應的姓名
              const matchedPlayer = players.find(
                (p) => String(p.id) === String(item.player_id),
              );
              return (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>
                    {matchedPlayer ? matchedPlayer.name : item.player_id}
                  </Table.Cell>
                  <Table.Cell>{item.round_or_role}</Table.Cell>
                  <Table.Cell>{item.score}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Segment>
    </div>
  );
}
