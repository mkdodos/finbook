import React, { useState, useEffect } from "react";
import { getGames } from "../../api";
import { Dropdown, Loader } from "semantic-ui-react";

export default function GameSelect({ onChange, value }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedGame, setSelectedGame] = useState("");
  //   console.log(getGames());
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await getGames();
        console.log(response);

        // 假設 API 回傳的資料結構為 [{ id: 1, name: "遊戲A" }, ...]
        // 需轉換成 Semantic UI Dropdown 所需的格式：{ key, value, text }
        const options = response?.map((game) => ({
          key: game.id,
          text: game.name,
          value: game.id,
        }));

        console.log(options);

        setGames(options);
      } catch (error) {
        console.error("載入遊戲失敗：", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleChange = (e, { value }) => {
    setSelectedGame(value);
    console.log("目前選擇的遊戲 ID:", value);
  };

  if (loading) {
    return (
      <Loader active inline="centered">
        載入遊戲中...
      </Loader>
    );
  }

  return (
    <Dropdown
      placeholder="請選擇遊戲"
      fluid
      selection
      search
      clearable
      options={games}
      // value={selectedGame}
      value={value}
      onChange={onChange}
      // onChange={handleChange}
    />
  );
}
