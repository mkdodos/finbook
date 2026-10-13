import { useState, useEffect } from "react";
import { Table, Input, Button, Dropdown } from "semantic-ui-react";
import axios from "axios";

import { API_HOST } from "@/global/constants";
const API_URL = `${API_HOST}/games/api2.php`;

const ROLES = ["貓咪", "飛鷹", "森林", "遊俠"];

const initialPlayers = ROLES.map((item, idx) => ({
  round_or_role: item,
  player_id: idx + 1,
  score: "",
}));

//  const initialPlayers = [
//   { player_id: 1, round_or_role: "喵咪", score: "" },
//   { player_id: 2, round_or_role: "飛原", score: "" },
//   { player_id: 3, round_or_role: "森林", score: "" },
//   { player_id: 4, round_or_role: "遊俠", score: "" },
// ];

export default function EditForm({
  players,
  setGamesList,
  setScoresList,
  playedDate,
  setPlayedDate,
  editingGameScores,
  editingGameId,
  setEditingGameId,
}) {
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
  }, [editingGameId]);

  // console.log(playerScore);

  const handleChange = (targetPlayer, e) => {
    const value = Number(e.target.value); // 取得輸入框的值並轉成數字
    console.log(targetPlayer);
    setPlayerScore((prevScores) =>
      prevScores.map((item) =>
        item.player_id === targetPlayer
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
    // console.log(value);
    console.log(targetPlayer);
    setPlayerScore((prevScores) =>
      prevScores.map((item) =>
        item.player_id === targetPlayer
          ? { ...item, round_or_role: value, player_id: targetPlayer }
          : item,
      ),
    );
  };

  const handleSave = async () => {
    // 用 editingGameId 判斷新增或更新

    // console.log(playerScore);
    if (editingGameId) {
      // 🔄 編輯更新邏輯
      // const res = await axios.post(`${API_URL}?action=update_game`, {
      //   game_id: editingGameId, // 依您的後端 API 欄位名稱調整（可能是 game_id 或 id）
      //   played_date: playedDate,
      //   records: playerScore,
      // });

      // console.log("更新成功", res.data);

      // 1. 更新前端的 gamesList（將對應 id 的 played_date 更新）
      setGamesList((prev) =>
        prev.map((game) =>
          game.id === editingGameId
            ? { ...game, played_date: playedDate }
            : game,
        ),
      );

      // 2. 更新前端的 scoresList（移除該場舊分數，換上更新後的這批分數）
      setScoresList((prev) => {
        // 過濾掉舊的該場分數
        const filteredScores = prev.filter(
          (score) => score.game_id !== editingGameId,
        );
        // 組裝新的分數資料
        const updatedScores = playerScore.map((score) => ({
          ...score,
          game_id: editingGameId,
        }));
        return [...filteredScores, ...updatedScores];
      });

      // 3. 清空或重設表單（可視需求決定是否順便重設父層的編輯狀態）
      setPlayerScore(initialPlayers);
      setEditingGameId(null);

      return;
    }

    const res = await axios.post(`${API_URL}?action=add_game`, {
      played_date: playedDate,
      records: playerScore,
    });
    // console.log(res.data);

    // 將資料傳給後端,取得新增後的id
    const newId = res.data.id;

    setGamesList((prev) => [...prev, { id: newId, played_date: playedDate }]);
    // {  "id", "game_id", "player_id", "round_or_role",  "score", "player_name"}
    const newScores = playerScore.map((score) => ({
      ...score,
      game_id: newId,
    }));
    setScoresList((prev) => [...prev, ...newScores]);
    setPlayerScore(initialPlayers);
    // console.log("playerScore", newScores);
    // console.log(players);
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
                <Table.Cell key={item.player_id}>
                  {/* 使用 Flexbox 讓 Dropdown 和 Input 變成同行 */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Dropdown
                      placeholder="-- 選擇角色 --"
                      fluid
                      selection
                      options={ROLES.map((role) => ({
                        key: role,
                        text: role,
                        value: role,
                      }))}
                      onChange={(e, data) =>
                        handleRoleChange(e, data, item.player_id)
                      }
                      value={item.round_or_role || ""} // 🔍 這裡剛剛漏掉了！加上這行才能正確把資料庫或狀態中的角色顯示在畫面上
                    />

                    <Input
                      type="number"
                      value={item.score ?? ""} // 綁定狀態中的 score，避免 undefined 警告
                      onChange={(e) => handleChange(item.player_id, e)}
                      style={{ width: "100px" }} // 依需求調整分數輸入框的寬度
                    />
                  </div>
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
