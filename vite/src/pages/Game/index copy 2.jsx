import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Table,
  Button,
  Input,
  Form,
  Segment,
  Message,
  Modal,
} from "semantic-ui-react";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import { API_HOST } from "@/global/constants";

// 定義 API 主機與路徑前置變數
// const API_HOST = 'http://localhost'; // 可依實際部署環境調整
const API_URL = `${API_HOST}/games/api.php`;

const ROLES = ["角色 A", "角色 B", "角色 C", "角色 D"];

function App() {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");

  // 遊戲基本資訊
  const [gameName, setGameName] = useState("我的桌遊");
  const [playedDate, setPlayedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // 選擇參與的 4 位玩家 ID
  const [selectedPlayers, setSelectedPlayers] = useState(["", "", "", ""]);

  // 分數紀錄：matrix[playerIndex][roleIndex] = score
  const [scores, setScores] = useState(
    Array(4)
      .fill(0)
      .map(() => Array(4).fill(0)),
  );

  const [message, setMessage] = useState(null);

  // 歷史紀錄相關狀態
  const [gamesList, setGamesList] = useState([]);
  const [selectedGameDetail, setSelectedGameDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPlayers();
    fetchGames();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${API_URL}?action=get_players`);
      setPlayers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGames = async () => {
    try {
      const res = await axios.get(`${API_URL}?action=get_games`);
      setGamesList(res.data);
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
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    try {
      await axios.post(`${API_URL}?action=add_player`, { name: newPlayerName });
      setNewPlayerName("");
      fetchPlayers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScoreChange = (playerIdx, roleIdx, value) => {
    const newScores = [...scores];
    newScores[playerIdx][roleIdx] = parseInt(value) || 0;
    setScores(newScores);
  };

  const handlePlayerSelect = (playerIdx, playerId) => {
    const updated = [...selectedPlayers];
    updated[playerIdx] = playerId;
    setSelectedPlayers(updated);
  };

  const calculateTotal = (playerIdx) => {
    return scores[playerIdx].reduce((sum, current) => sum + current, 0);
  };

  const handleSubmitGame = async () => {
    if (selectedPlayers.some((id) => !id)) {
      setMessage({
        type: "error",
        content: "請確保 4 個欄位都選擇了對應的玩家！",
      });
      return;
    }

    let records = [];
    selectedPlayers.forEach((playerId, pIdx) => {
      ROLES.forEach((role, rIdx) => {
        records.push({
          player_id: playerId,
          role: role,
          score: scores[pIdx][rIdx],
        });
      });
    });

    try {
      const res = await axios.post(`${API_URL}?action=save_game`, {
        game_name: gameName,
        played_date: playedDate,
        records: records,
      });
      if (res.data.success) {
        setMessage({ type: "success", content: "遊戲成績儲存成功！" });
        fetchGames();
      } else {
        setMessage({ type: "error", content: "儲存失敗：" + res.data.error });
      }
    } catch (err) {
      setMessage({ type: "error", content: "網路連線錯誤" });
    }
  };

  return (
    <Container style={{ marginTop: "2em", marginBottom: "4em" }}>
      <Header as="h1" dividing>
        桌遊多玩家計分系統
      </Header>

      {message && <Message {...message} onDismiss={() => setMessage(null)} />}

      {/* 新增玩家區塊 */}
      <Segment>
        <Header as="h3">新增玩家</Header>
        <Form onSubmit={handleAddPlayer}>
          <Form.Group>
            <Form.Input
              placeholder="玩家姓名"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
            />
            <Button primary type="submit">
              新增
            </Button>
          </Form.Group>
        </Form>
      </Segment>

      {/* 遊戲紀錄表單 */}
      <Segment>
        <Header as="h3">記錄新的一場遊戲 (4位玩家 / 4個角色)</Header>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              label="桌遊名稱"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
            <Form.Input
              label="遊玩日期"
              type="date"
              value={playedDate}
              onChange={(e) => setPlayedDate(e.target.value)}
            />
          </Form.Group>
        </Form>

        <Table celled padded textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>玩家選擇</Table.HeaderCell>
              {ROLES.map((role, idx) => (
                <Table.HeaderCell key={idx}>{role}</Table.HeaderCell>
              ))}
              <Table.HeaderCell>總分</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {[0, 1, 2, 3].map((playerIdx) => (
              <Table.Row key={playerIdx}>
                <Table.Cell>
                  <select
                    className="ui dropdown"
                    value={selectedPlayers[playerIdx]}
                    onChange={(e) =>
                      handlePlayerSelect(playerIdx, e.target.value)
                    }
                  >
                    <option value="">-- 選擇玩家 --</option>
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </Table.Cell>

                {ROLES.map((_, roleIdx) => (
                  <Table.Cell key={roleIdx}>
                    <Input
                      type="number"
                      value={scores[playerIdx][roleIdx]}
                      onChange={(e) =>
                        handleScoreChange(playerIdx, roleIdx, e.target.value)
                      }
                      style={{ width: "80px" }}
                    />
                  </Table.Cell>
                ))}

                <Table.Cell>
                  <strong>{calculateTotal(playerIdx)}</strong>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <Button color="green" fluid size="large" onClick={handleSubmitGame}>
          儲存本場遊戲成績
        </Button>
      </Segment>

      {/* 歷史戰績列表區塊 */}
      <Segment>
        <Header as="h3">歷史戰績列表</Header>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>日期</Table.HeaderCell>
              <Table.HeaderCell>桌遊名稱</Table.HeaderCell>
              <Table.HeaderCell collapsing>操作</Table.HeaderCell>
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
                  <Table.Cell>{g.game_name}</Table.Cell>
                  <Table.Cell>
                    <Button
                      size="small"
                      color="blue"
                      onClick={() => handleViewDetails(g.id)}
                    >
                      查看詳情
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Segment>

      {/* 詳細成績彈窗 (Modal) */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>遊戲詳細成績</Modal.Header>
        <Modal.Content>
          {selectedGameDetail && (
            <>
              <p>
                <strong>桌遊名稱：</strong> {selectedGameDetail.game.game_name}
              </p>
              <p>
                <strong>遊玩日期：</strong>{" "}
                {selectedGameDetail.game.played_date}
              </p>

              <Table celled padded textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>玩家</Table.HeaderCell>
                    <Table.HeaderCell>角色/回合</Table.HeaderCell>
                    <Table.HeaderCell>得分</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedGameDetail.scores.map((s, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell>{s.player_name}</Table.Cell>
                      <Table.Cell>{s.round_or_role}</Table.Cell>
                      <Table.Cell>{s.score}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={() => setIsModalOpen(false)}>
            關閉
          </Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
}

export default App;
