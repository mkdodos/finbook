import { useState, useEffect } from "react";
import { Table, Input, Button, Dropdown } from "semantic-ui-react";
import axios from "axios";

import { API_HOST } from "@/global/constants";
const API_URL = `${API_HOST}/games/api2.php`;

const initialPlayers = [
  { id: 1, round_or_role: "喵咪", score: "" },
  { id: 2, round_or_role: "飛原", score: "" },
  { id: 3, round_or_role: "森林", score: "" },
  { id: 4, round_or_role: "遊俠", score: "" },
];

export default function EditForm({
  players,
  setGamesList,
  setScoresList,
  playedDate,
  setPlayedDate,
  editingGameScores,
}) {
  const ROLES = ["喵咪", "飛原", "森林", "遊俠"];

  // 初始化狀態
  //   const [playerScore, setPlayerScore] = useState(players);
  // 單場4筆得分[]
  // const [playerScore, setPlayerScore] = useState(initialPlayers);
  // const [playerScore, setPlayerScore] = useState(editingGameScores);

  // 初始化狀態：如果有帶入 editingGameScores 則使用它，否則使用 initialPlayers (空表單)
  const [playerScore, setPlayerScore] = useState(
    editingGameScores && editingGameScores.length > 0
      ? editingGameScores
      : initialPlayers,
  );

  // 🔥 關鍵修正：當點擊不同歷史紀錄進行編輯（editingGameScores 改變）時，同步更新表單狀態
  useEffect(() => {
    if (editingGameScores && editingGameScores.length > 0) {
      setPlayerScore(editingGameScores);
    } else {
      setPlayerScore(initialPlayers);
    }
  }, [editingGameScores]);

  // console.log(playerScore);

  const handleChange = (targetPlayer, e) => {
    const value = Number(e.target.value); // 取得輸入框的值並轉成數字

    setPlayerScore((prevScores) =>
      prevScores.map((item) =>
        item.id === targetPlayer
          ? { ...item, score: value, player_id: targetPlayer }
          : item,
      ),
    );
  };

  const handleDateChange = (e) => {
    setPlayedDate(e.target.value);
  };

  // 角色下拉選取
  const handleRoleChange = (e, { value }, targetPlayer) => {
    console.log(value);
    setPlayerScore((prevScores) =>
      prevScores.map((item) =>
        item.id === targetPlayer
          ? { ...item, round_or_role: value, player_id: targetPlayer }
          : item,
      ),
    );
  };

  const handleSave = async () => {
    // 將資料傳給後端,取得新增後的id

    const res = await axios.post(`${API_URL}?action=add_game`, {
      played_date: playedDate,
      records: playerScore,
    });
    // console.log(res.data);

    const newId = res.data.id;

    setGamesList((prev) => [...prev, { id: newId, played_date: playedDate }]);
    // {  "id", "game_id", "player_id", "round_or_role",  "score", "player_name"}
    const newScores = playerScore.map((score) => ({
      ...score,
      game_id: newId,
    }));
    setScoresList((prev) => [...prev, ...newScores]);
    console.log("playerScore", newScores);
    console.log(players);
  };

  return (
    <div>
      {/* {editingGameId} */}
      {/* {JSON.stringify(playerScore)} */}
      <Table celled>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Input
                type="date"
                value={playedDate}
                onChange={handleDateChange}
              />
            </Table.Cell>

            {/* 改成對 playerScore 進行 map，確保資料與畫面同步 */}
            {playerScore?.map((item) => {
              return (
                <Table.Cell key={item.id}>
                  <Dropdown
                    placeholder="-- 選擇角色 --"
                    fluid
                    selection
                    options={ROLES.map((role) => ({
                      key: role,
                      text: role,
                      value: role,
                    }))}
                    onChange={(e, data) => handleRoleChange(e, data, item.id)}
                  />

                  <Input
                    type="number"
                    value={item.score ?? ""} // 綁定狀態中的 score，避免 undefined 警告
                    onChange={(e) => handleChange(item.id, e)}
                  />
                </Table.Cell>
              );
            })}

            <Table.Cell>
              <Button onClick={handleSave}>儲存</Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}
