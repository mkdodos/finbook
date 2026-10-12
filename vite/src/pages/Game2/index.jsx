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
      <EditForm players={players} />
      <Scores players={players} gamesList={gamesList} scoresList={scoresList} />
    </div>
  );
}
