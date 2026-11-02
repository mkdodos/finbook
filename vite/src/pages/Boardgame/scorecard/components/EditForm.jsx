import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Icon } from "semantic-ui-react";
import { createRow, updateRow } from "../api";
import RoleSelect from "../../components/dropdown/RoleSelect";
import PlayerSelect from "../../components/dropdown/PlayerSelect";

function EditForm({ isOpen, onClose, onSuccess, editData, handleDelete }) {
  // A component is changing an uncontrolled input to be controlled
  // 需要給表單每個欄位預設值,確保是受控組件
  // 否則會出現上述警告

  const initialFormData = {
    role_id: "",
    player_id: "",
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
          <Form.Input
            label="角色名稱"
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            required
          />

          {/* 使用 Form.Field 包裝，並加上 label 屬性 */}
          {/* <Form.Field label="選擇玩家">
            <PlayerSelect
              onChange={handleDropdownChange}
              value={formData.player_id}
            />
          </Form.Field> */}

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

          {/* <PlayerSelect
            onChange={handleDropdownChange}
            value={formData.player_id}
          /> */}
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
