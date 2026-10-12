import { useState } from "react";
import { Table, Input, Button } from "semantic-ui-react";

const initialPlayers = [
  { id: 1, role: "喵咪", score: 0 },
  { id: 2, role: "飛原", score: 0 },
  { id: 3, role: "森林", score: 0 },
  { id: 4, role: "遊俠", score: 0 },
];

export default function EditForm({ players }) {
  const ROLES = ["喵咪", "飛原", "森林", "遊俠"];

  // 初始化狀態
  //   const [playerScore, setPlayerScore] = useState(players);
  const [playerScore, setPlayerScore] = useState(initialPlayers);

  const handleChange = (targetPlayer, e) => {
    const value = Number(e.target.value); // 取得輸入框的值並轉成數字

    setPlayerScore((prevScores) =>
      prevScores.map((item) =>
        item.id === targetPlayer ? { ...item, score: value } : item,
      ),
    );
  };

  const handleSave = () => {
    console.log(playerScore);
  };

  return (
    <div>
      {JSON.stringify(playerScore)}
      <Table celled>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Input type="date" />
            </Table.Cell>

            {/* 改成對 playerScore 進行 map，確保資料與畫面同步 */}
            {playerScore.map((item) => {
              return (
                <Table.Cell key={item.id}>
                  <select className="ui dropdown">
                    <option value="">-- 選擇角色 --</option>
                    {ROLES.map((role, idx) => (
                      <option key={idx} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

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
