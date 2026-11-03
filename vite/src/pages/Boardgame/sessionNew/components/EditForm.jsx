import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Icon } from "semantic-ui-react";
import { createRow, updateRow } from "../api";
import GameSelect from "../../components/dropdown/GameSelect";
import PlayerSelect from "../../components/dropdown/PlayerSelect";

function EditForm({ isOpen, onClose, onSuccess, editData, handleDelete }) {
  // A component is changing an uncontrolled input to be controlled
  // 需要給表單每個欄位預設值,確保是受控組件
  // 否則會出現上述警告

  const initialFormData = {
    game_id: "",
    play_date: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editData) {
      console.log(editData);
      setFormData(editData);
    } else {
      setFormData(initialFormData);
    }
  }, [isOpen, editData]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editData) {
        const res = await updateRow(editData.id, formData);
        console.log(res);
        // alert("戰績更新成功！");
      } else {
        console.log(formData);
        await createRow(formData);
        // alert("戰績新增成功！");
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.log(err);
      alert("儲存失敗，請檢查輸入內容");
    }
  };

  const handleDropdownChange = (e, { name, value }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="small">
      <Modal.Header>{editData ? "✏️ 編輯" : "📝 新增"}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} id="scorecard-form">
          <Form.Input
            label="日期"
            type="date"
            name="play_date"
            value={formData.play_date}
            onChange={handleChange}
            required
          />

          <div className="field">
            <label>選擇遊戲</label>
            <GameSelect
              onChange={handleDropdownChange}
              value={formData.game_id}
            />
          </div>
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
