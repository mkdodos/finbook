import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Icon } from "semantic-ui-react";
import { getPlayers, getRoles, addGame, update } from "../api";
import GameSelect from "../../components/dropdown/GameSelect";

function EditForm({ isOpen, onClose, onSuccess, editData, handleDelete }) {
  // A component is changing an uncontrolled input to be controlled
  // 需要給表單每個欄位預設值,確保是受控組件
  // 否則會出現上述警告

  const initialFormData = {
    name: "",
    game_id: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const [playerOptions, setPlayerOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    if (editData) {
      setFormData(
        editData,
        // name: editData.name || "",
      );
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

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

  const handleGameChange = (e, { value }) => {
    console.log(value);
    setFormData((prev) => ({
      ...prev,
      game_id: value,
    }));
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="small">
      <Modal.Header>{editData ? "✏️ 編輯" : "📝 新增"}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} id="scorecard-form">
          <Form.Input
            label="角色名稱"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Form.Input
            label="遊戲名稱"
            name="game_id"
            value={formData.game_id}
            onChange={handleChange}
          />
          <GameSelect onChange={handleGameChange} value={formData.game_id} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>取消</Button>
        <Button primary type="submit" form="scorecard-form">
          儲存
        </Button>
        <Button
          floated="left"
          color="red"
          size="mini"
          icon
          onClick={() => handleDelete(formData.id)}
          title="刪除"
        >
          <Icon name="trash" />
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default EditForm;
