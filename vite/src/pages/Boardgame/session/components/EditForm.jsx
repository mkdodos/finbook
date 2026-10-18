import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Item } from "semantic-ui-react";
import { addGame, update, getGames } from "../api";
import { useGameOptions } from "./useGameOptions";

function EditForm({ isOpen, onClose, onSuccess, editData, setIsModalOpen }) {
  const initialFormData = {
    play_date: new Date().toISOString().substring(0, 10),
    game_id: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  // const [gameOptions, setGameOptions] = useState([]);
  // 一行程式碼搞定資料與載入狀態
  const { options, loading } = useGameOptions();

  useEffect(() => {
    if (isOpen) {
      // getGames().then((data) => {
      //   const options = data.map((p) => ({
      //     key: p.id,
      //     text: p.name,
      //     value: p.id,
      //   }));
      //   setGameOptions(options);
      // });

      if (editData) {
        // console.log(editData);
        setFormData({
          play_date: editData.play_date || "",
          game_id: editData.game_id || "",
        });
      } else {
        setFormData(initialFormData);
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
        await addGame(formData);
        // alert("戰績新增成功！");
      }

      if (onSuccess) onSuccess();
      setIsModalOpen(false);
      // if (onClose) onClose();
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
            label="日期"
            name="play_date"
            type="date"
            value={formData.play_date}
            onChange={handleChange}
            required
          />
          <Form.Select
            search
            label="game_name"
            name="game_id"
            value={formData.game_id || ""}
            onChange={handleChange}
            options={options}
            loading={loading}
          />

          <Form.Input
            label="遊戲名稱"
            name="game_id"
            value={formData.game_id}
            onChange={handleChange}
            required
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setIsModalOpen(false)}>取消</Button>
        <Button primary type="submit" form="scorecard-form">
          儲存
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default EditForm;
