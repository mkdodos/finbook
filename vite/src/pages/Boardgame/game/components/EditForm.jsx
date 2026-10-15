import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "semantic-ui-react";
import { getPlayers, getRoles, addGame, update } from "../api";

function EditForm({ isOpen, onClose, onSuccess, editData }) {
  const [formData, setFormData] = useState({
    name: "",
    player_id: "",
    role_id: "",
    points: "",
  });

  const [playerOptions, setPlayerOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        console.log(editData);
        setFormData({
          name: editData.name || "",
        });
      } else {
        setFormData({ name: "" });
      }
    }
  }, [isOpen, editData]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editData) {
        await update(editData.id, formData);
        // alert("戰績更新成功！");
      } else {
        console.log(formData);
        await addGame(formData.name);
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
      <Modal.Header>{editData ? "✏️ 編輯" : "📝 新增"}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} id="scorecard-form">
          <Form.Input
            label="遊戲名稱"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>取消</Button>
        <Button primary type="submit" form="scorecard-form">
          儲存
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default EditForm;
