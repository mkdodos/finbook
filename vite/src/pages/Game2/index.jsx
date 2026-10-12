import React, { useState, useEffect } from "react";
import { Button, Table, Segment, Header } from "semantic-ui-react";
import axios from "axios";

import { API_HOST } from "@/global/constants";
const API_URL = `${API_HOST}/games/api2.php`;
import Scores from "./components/Scores";
import EditForm from "./components/EditForm";

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

  // {  "id", "game_name" , "played_date"}

  const fetchGames = async () => {
    try {
      const res = await axios.get(`${API_URL}?action=get_games`);
      setGamesList(res.data);
      console.log(res.data);
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

  // {  "id", "game_id", "player_id", "round_or_role",  "score", "player_name"}

  const fetchScores = async () => {
    try {
      const res = await axios.get(`${API_URL}?action=get_game_scores`);
      setScoresList(res.data);
      console.log(res.data);
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

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm("確定要刪除這場遊戲的成績嗎？此動作無法復原。")) {
      return;
    }

    try {
      const res = await axios.post(`${API_URL}?action=delete_game`, {
        game_id: gameId,
      });
      if (res.data.success) {
        // setMessage({ type: "success", content: "遊戲成績已成功刪除！" });
        fetchGames();
        // if (isModalOpen) setIsModalOpen(false);
        // if (editingGameId === gameId) handleCancelEdit(); // 若剛好在編輯這筆則清除編輯狀態
      } else {
        setMessage({ type: "error", content: "刪除失敗：" + res.data.error });
      }
    } catch (err) {
      setMessage({ type: "error", content: "網路連線錯誤" });
    }
  };

  return (
    <div>
      <EditForm
        players={players}
        setGamesList={setGamesList}
        setScoresList={setScoresList}
      />
      <Scores
        handleDeleteGame={handleDeleteGame}
        players={players}
        gamesList={gamesList}
        scoresList={scoresList}
      />
    </div>
  );
}
