import React, { useState, useEffect } from "react";
import { Form } from "semantic-ui-react";
// 在場次表格中按下新增開啟此表單輸入 {人員,角色,分數}
export default function ScoreForm({ editData }) {
  // 表單初始值
  const initialFormData = {
    // editData存在才取id
    // 不存在時取 ""
    // 如果沒做這判斷, value 是 undefined 時，React 會把它視為非受控元件（Uncontrolled Input）。
    session_id: editData?.id || "",
    ...editData,
  };
  console.log(initialFormData);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editData) {
      setFormData({
        session_id: editData.id || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

  const handleEdit = (item) => {
    setFormData(item);
  };
  const handleChange = () => {};
  const handleSubmit = () => {};

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="game_name"
          name="game_id"
          value={formData.session_id}
          onChange={handleChange}
        />
      </Form>
    </div>
  );
}
