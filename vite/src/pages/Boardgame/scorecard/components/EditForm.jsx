import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Icon } from "semantic-ui-react";
import { createRow, updateRow } from "../api";
import RoleSelect from "../../components/dropdown/RoleSelect";
import PlayerSelect from "../../components/dropdown/PlayerSelect";
import SessionSelect from "../../components/dropdown/SessionSelect";

function EditForm({ isOpen, onClose, setData, editData, handleDelete }) {
  // A component is changing an uncontrolled input to be controlled
  // 需要給表單每個欄位預設值,確保是受控組件
  // 否則會出現上述警告

  const initialFormData = {
    role_id: "",
    player_id: "",
    points: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  // const [playerOptions, setPlayerOptions] = useState([]);
  // const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    if (editData) {
      console.log(editData);
      setFormData(
        editData,
        // name: editData.name || "",
      );
    } else {
      setFormData(initialFormData);
    }
  }, [isOpen, editData]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // if (editData) {
      //   const res = await updateRow(editData.id, formData);

      // } else {

      //   await createRow(formData);

      // }
      if (editData) {
        await updateRow(editData.id, formData);
        // 將儲存成功的值寫入state
        setData((prev) =>
          prev.map((item) => (item.id === formData.id ? formData : item)),
        );
      } else {
        const res = await createRow(formData);
        // 將儲存成功的值寫入state
        setData((prev) => [...prev, { ...formData, id: res.id }]);
      }

      // if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.log(err);
      alert("儲存失敗，請檢查輸入內容");
    }
  };

  const handleDropdownChange = (e, { name, value }) => {
    console.log(name);
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
          <div className="field">
            <label>選擇場次</label>
            <SessionSelect
              onChange={handleDropdownChange}
              value={formData.session_id}
            />
          </div>

          <div className="field">
            <label>選擇玩家</label>
            <PlayerSelect
              onChange={handleDropdownChange}
              value={formData.player_id}
            />
          </div>
          <div className="field">
            <label>選擇角色</label>
            <RoleSelect
              onChange={handleDropdownChange}
              value={formData.role_id}
            />
          </div>

          <Form.Input
            label="分數"
            name="points"
            type="number"
            value={formData.points}
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
