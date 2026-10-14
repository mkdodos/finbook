import React, { useState, useEffect } from "react";
import { Form, Button, Segment, Header } from "semantic-ui-react";
import { getPlayers, getRoles, addScorecard } from "./api";

function ScorecardForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    session_id: "",
    player_id: "",
    role_id: "",
    points: "",
  });

  const [playerOptions, setPlayerOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  // 載入時取得玩家與角色下拉選單選項
  useEffect(() => {
    getPlayers().then((data) => {
      const options = data.map((p) => ({
        key: p.id,
        text: p.name,
        value: p.id,
      }));
      setPlayerOptions(options);
    });

    getRoles().then((data) => {
      const options = data.map((r) => ({
        key: r.id,
        text: `${r.name} (遊戲ID: ${r.game_id})`,
        value: r.id,
      }));
      setRoleOptions(options);
    });
  }, []);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await addScorecard(formData);
      alert("戰績新增成功！");
      //   if (onSubmitted) onSubmitted();
      setFormData({ session_id: "", player_id: "", role_id: "", points: "" });
      // 觸發父元件重新載入表格資料
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      alert("儲存失敗，請檢查輸入內容");
    }
  };

  return (
    <Segment style={{ marginTop: "20px" }}>
      <Header as="h3">📝 新增戰績資料（下拉選單版）</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="場次 ID (Session ID)"
          placeholder="例如: 1"
          name="session_id"
          value={formData.session_id}
          onChange={handleChange}
          required
        />

        {/* 玩家下拉選單 */}
        <Form.Dropdown
          label="選擇玩家"
          placeholder="請選擇玩家"
          fluid
          selection
          options={playerOptions}
          name="player_id"
          value={formData.player_id}
          onChange={handleChange}
          required
        />

        {/* 角色下拉選單 */}
        <Form.Dropdown
          label="選擇角色"
          placeholder="請選擇角色"
          fluid
          selection
          options={roleOptions}
          name="role_id"
          value={formData.role_id}
          onChange={handleChange}
          required
        />

        <Form.Input
          label="獲得分數 (Points)"
          type="number"
          placeholder="例如: 42"
          name="points"
          value={formData.points}
          onChange={handleChange}
        />

        <Button primary type="submit">
          儲存戰績
        </Button>
      </Form>
    </Segment>
  );
}

export default ScorecardForm;
