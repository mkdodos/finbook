import { useState } from "react";
import { Table, Input, Button } from "semantic-ui-react";

export default function EditForm({ players }) {
  const ROLES = ["喵咪", "飛原", "森林", "遊俠"];
  // 記錄4個玩家角色分數
  //   const [row, setRow] = useState({});
  const [playerScore, setPlayerScore] = useState(players);
  //   const handleChange = (e, targetPlayer) => {
  //     const newScore = Number(e.target.value); // 取得輸入框的值並轉成數字
  //     console.log(newScore);

  //     // setPlayerScore((prev) =>
  //     //   prev.map((item) =>
  //     //     // 更新有輸入的那筆,其餘維持不變
  //     //     item.id === targetPlayer ? { ...item, score: newScore } : item,
  //     //   ),
  //     // );
  //   };
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
    // console.log(players);
  };
  return (
    <div>
      {/* {JSON.stringify(row)} */}
      {JSON.stringify(playerScore)}
      <Table celled>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Input type="date" />
            </Table.Cell>

            {players.map((p) => {
              return (
                <Table.Cell key={p.id}>
                  <select className="ui dropdown">
                    <option value="">-- 選擇角色 --</option>
                    {ROLES.map((p, idx) => (
                      <option key={idx} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    // name={`score${p.id}`}
                    // value={item.score}
                    onChange={(e) => handleChange(p.id, e)}
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
