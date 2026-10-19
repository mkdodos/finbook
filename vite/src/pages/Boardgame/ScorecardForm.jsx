import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "semantic-ui-react";
import {
  getPlayers,
  getRoles,
  getSessions,
  addScorecard,
  updateScorecard,
} from "./api";

function ScorecardForm({ isOpen, onClose, onSuccess, editData }) {
  const [formData, setFormData] = useState({
    session_id: "",
    player_id: "",
    role_id: "",
    points: "",
  });

  const [sessionOptions, setSessionOptions] = useState([]);
  const [playerOptions, setPlayerOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      getSessions().then((data) => {
        const options = data.map((p) => ({
          key: p.id,
          text: `${p.play_date}${p.name}`,
          value: p.id,
        }));
        setSessionOptions(options);
      });

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

      if (editData) {
        console.log(editData);
        setFormData({
          session_id: editData.session_id || "",
          player_id: editData.player_id || "",
          role_id: editData.role_id || "",
          points: editData.points || "",
        });
      } else {
        setFormData({ session_id: "", player_id: "", role_id: "", points: "" });
      }
    }
  }, [isOpen, editData]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editData) {
        await updateScorecard(editData.scorecard_id, formData);
        // alert("戰績更新成功！");
      } else {
        await addScorecard(formData);
        // alert("戰績新增成功！");
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.log(err);
      alert("儲存失敗，請檢查輸入內容");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="small">
      <Modal.Header>
        {editData ? "✏️ 編輯戰績資料" : "📝 新增戰績資料"}
      </Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} id="scorecard-form">
          <Form.Input
            label="場次"
            name="session_id"
            value={formData.session_id}
            onChange={handleChange}
            required
          />

          <Form.Dropdown
            label="選擇場次"
            fluid
            selection
            options={sessionOptions}
            name="session_id"
            value={formData.session_id}
            onChange={handleChange}
            required
          />

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

          <Form.Dropdown
            label="選擇角色"
            placeholder="請選擇角色"
            fluid
            selection
            options={roleOptions}
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            clearable
          />

          <Form.Input
            label="獲得分數 (Points)"
            type="number"
            placeholder="例如: 42"
            name="points"
            value={formData.points}
            onChange={handleChange}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>取消</Button>
        <Button primary type="submit" form="scorecard-form">
          儲存戰績
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ScorecardForm;
