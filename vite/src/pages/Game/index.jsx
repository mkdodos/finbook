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

import TableView from "./components/TableView";

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

  // 編輯狀態：若有值代表目前正在修改某個 game_id
  const [editingGameId, setEditingGameId] = useState(null);

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

  // --- 新進：點擊編輯按鈕，將資料載入到上方表單準備修改 ---
  const handleStartEdit = async (gameId) => {
    try {
      const res = await axios.get(
        `${API_URL}?action=get_game_details&game_id=${gameId}`,
      );
      const { game, scores: detailScores } = res.data;

      setEditingGameId(game.id);
      setGameName(game.game_name);
      setPlayedDate(game.played_date);

      // 取得該場次的 4 位不重複玩家 ID
      const uniquePlayers = [
        ...new Set(detailScores.map((s) => String(s.player_id))),
      ];
      while (uniquePlayers.length < 4) uniquePlayers.push(""); // 確保長度為 4
      setSelectedPlayers(uniquePlayers.slice(0, 4));

      // 組合回 scores 矩陣 [playerIndex][roleIndex]
      let newScores = Array(4)
        .fill(0)
        .map(() => Array(4).fill(0));
      uniquePlayers.forEach((pId, pIdx) => {
        ROLES.forEach((role, rIdx) => {
          const match = detailScores.find(
            (s) =>
              String(s.player_id) === String(pId) && s.round_or_role === role,
          );
          if (match) {
            newScores[pIdx][rIdx] = parseInt(match.score) || 0;
          }
        });
      });
      setScores(newScores);

      // 如果 Modal 有開著就順便關閉
      if (isModalOpen) setIsModalOpen(false);

      // 捲動至畫面最上方填寫區
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", content: "載入編輯資料失敗" });
    }
  };

  // 取消編輯狀態
  const handleCancelEdit = () => {
    setEditingGameId(null);
    setGameName("我的桌遊");
    setPlayedDate(new Date().toISOString().split("T")[0]);
    setSelectedPlayers(["", "", "", ""]);
    setScores(
      Array(4)
        .fill(0)
        .map(() => Array(4).fill(0)),
    );
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm("確定要刪除這場遊戲的成績嗎？此動作無法復原。")) {
      return;
    }

    try {
      const res = await axios.post(`${API_URL}?action=delete_game`, {
        game_id: gameId,
      });
      if (res.data.success) {
        setMessage({ type: "success", content: "遊戲成績已成功刪除！" });
        fetchGames();
        if (isModalOpen) setIsModalOpen(false);
        if (editingGameId === gameId) handleCancelEdit(); // 若剛好在編輯這筆則清除編輯狀態
      } else {
        setMessage({ type: "error", content: "刪除失敗：" + res.data.error });
      }
    } catch (err) {
      setMessage({ type: "error", content: "網路連線錯誤" });
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
      let res;
      if (editingGameId) {
        // 執行更新
        res = await axios.post(`${API_URL}?action=update_game`, {
          game_id: editingGameId,
          game_name: gameName,
          played_date: playedDate,
          records: records,
        });
      } else {
        // 執行新增
        res = await axios.post(`${API_URL}?action=save_game`, {
          game_name: gameName,
          played_date: playedDate,
          records: records,
        });
      }

      if (res.data.success) {
        setMessage({
          type: "success",
          content: editingGameId ? "遊戲成績修改成功！" : "遊戲成績儲存成功！",
        });
        fetchGames();
        handleCancelEdit(); // 儲存/更新後重設表單
      } else {
        setMessage({ type: "error", content: "操作失敗：" + res.data.error });
      }
    } catch (err) {
      setMessage({ type: "error", content: "網路連線錯誤" });
    }
  };

  return (
    <Container style={{ marginTop: "2em", marginBottom: "4em" }}>
      <TableView data={selectedGameDetail} />
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

      {/* 遊戲紀錄表單 (兼具新增與修改功能) */}
      <Segment color={editingGameId ? "orange" : undefined}>
        <Header as="h3">
          {editingGameId
            ? `修改遊戲成績 (代號: #${editingGameId})`
            : "記錄新的一場遊戲 (4位玩家 / 4個角色)"}
        </Header>
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

        <Button.Group fluid size="large">
          <Button
            color={editingGameId ? "orange" : "green"}
            onClick={handleSubmitGame}
          >
            {editingGameId ? "確認修改成績" : "儲存本場遊戲成績"}
          </Button>
          {editingGameId && (
            <>
              <Button.Or />
              basic{" "}
              <Button color="grey" onClick={handleCancelEdit}>
                取消編輯
              </Button>
            </>
          )}
        </Button.Group>
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
                    <Button.Group size="small">
                      <Button
                        color="blue"
                        onClick={() => handleViewDetails(g.id)}
                      >
                        詳情
                      </Button>
                      <Button.Or />
                      <Button
                        color="orange"
                        onClick={() => handleStartEdit(g.id)}
                      >
                        編輯
                      </Button>
                      <Button.Or />
                      <Button
                        color="red"
                        onClick={() => handleDeleteGame(g.id)}
                      >
                        刪除
                      </Button>
                    </Button.Group>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Segment>

      {/* 詳細成績彈窗 (Modal) - 樞紐矩陣格式 */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>遊戲詳細成績（樞紐分析表檢視）</Modal.Header>
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
                    <Table.HeaderCell>玩家 \ 角色</Table.HeaderCell>
                    {ROLES.map((role, idx) => (
                      <Table.HeaderCell key={idx}>{role}</Table.HeaderCell>
                    ))}
                    <Table.HeaderCell>總分</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {(() => {
                    const playersInGame = [
                      ...new Set(
                        selectedGameDetail.scores.map((s) => s.player_name),
                      ),
                    ];

                    return playersInGame.map((playerName, pIdx) => {
                      let rowTotal = 0;
                      return (
                        <Table.Row key={pIdx}>
                          <Table.Cell>
                            <strong>{playerName}</strong>
                          </Table.Cell>

                          {ROLES.map((role, rIdx) => {
                            const scoreItem = selectedGameDetail.scores.find(
                              (s) =>
                                s.player_name === playerName &&
                                s.round_or_role === role,
                            );
                            const score = scoreItem
                              ? parseInt(scoreItem.score) || 0
                              : 0;
                            rowTotal += score;

                            return <Table.Cell key={rIdx}>{score}</Table.Cell>;
                          })}

                          <Table.Cell>
                            <strong>{rowTotal}</strong>
                          </Table.Cell>
                        </Table.Row>
                      );
                    });
                  })()}
                </Table.Body>
              </Table>
            </>
          )}
        </Modal.Content>
        <Modal.Actions>
          {selectedGameDetail && (
            <>
              <Button
                color="orange"
                floated="left"
                onClick={() => handleStartEdit(selectedGameDetail.game.id)}
              >
                修改此場紀錄
              </Button>
              <Button
                color="red"
                floated="left"
                onClick={() => handleDeleteGame(selectedGameDetail.game.id)}
              >
                刪除此場紀錄
              </Button>
            </>
          )}
          <Button primary onClick={() => setIsModalOpen(false)}>
            關閉
          </Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
}

export default App;
