import React, { useState, useEffect } from "react";
import { Button, Table, Segment, Header } from "semantic-ui-react";
import axios from "axios";

import { API_HOST } from "@/global/constants";
const API_URL = `${API_HOST}/games/api.php`;
// const ROLES = ["角色 A", "角色 B", "角色 C", "角色 D"];
const PLAYERS = [
  { id: "1", name: "馬克" },
  { id: "2", name: "宜君" },
  { id: "3", name: "愷軒" },
  { id: "4", name: "欣妤" },
];

export default function index() {
  // 所有場次
  const [gamesList, setGamesList] = useState([]);
  // 所有成績
  const [scoresList, setScoresList] = useState([]);
  // 顯示指定場次的成績
  const [selectedGameDetail, setSelectedGameDetail] = useState(null);

  useEffect(() => {
    fetchGames();
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

  const fetchScores = async () => {
    try {
      const res = await axios.get(`${API_URL}?action=get_game_scores`);
      //   console.log(res.data);
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
      console.log(res.data);
      //   setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <Segment>
        <Header as="h3">歷史戰績列表</Header>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>日期</Table.HeaderCell>
              {/* <Table.HeaderCell>桌遊名稱</Table.HeaderCell> */}
              {PLAYERS.map((role, idx) => (
                <Table.HeaderCell key={idx}>{role.name}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {gamesList.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan="3" textAlign="center">
                  尚無歷史紀錄
                </Table.Cell>
              </Table.Row>
            ) : (
              gamesList.map((g) => (
                <Table.Row key={g.id}>
                  <Table.Cell>{g.played_date}</Table.Cell>
                  {scoresList
                    ?.filter((item) => item.game_id === g.id)
                    .map((item) => (
                      <Table.Cell key={item.id}>
                        {item.round_or_role}/{item.score}分
                      </Table.Cell>
                    ))}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Segment>
      <Button color="blue" onClick={() => handleViewDetails(8)}>
        詳情
      </Button>
      <Table>
        {/* <Table.Header>
            <Table.Row>
                <Table.HeaderCell>輪次</Table.HeaderCell>
                {ROLES.map((role, idx) => (
                <Table.HeaderCell key={idx}>{role}</Table.HeaderCell>
                ))}
                <Table.HeaderCell>總分</Table.HeaderCell>
            </Table.Row>
            </Table.Header> */}

        {/* <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>玩家</Table.HeaderCell>
            <Table.HeaderCell>Note (p_note)</Table.HeaderCell>
            <Table.HeaderCell>Note (p_note)</Table.HeaderCell>
          </Table.Row>
        </Table.Header> */}

        <Table.Body>
          {selectedGameDetail?.scores.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.player_id}</Table.Cell>
              <Table.Cell>{item.round_or_role}</Table.Cell>
              <Table.Cell>{item.score}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
