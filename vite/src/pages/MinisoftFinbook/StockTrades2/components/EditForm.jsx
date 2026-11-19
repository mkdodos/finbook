import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Icon } from "semantic-ui-react";
import { createRow, updateRow } from "../data/api";

function EditForm({
  isOpen,
  setIsModalOpen,
  editData,
  handleDelete,
  setData,
  columns,
  formData,
  setFormData,
  initialFormData,
}) {
  // const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editData) {
      console.log(editData);
      setFormData(
        editData,
        // name: editData.name || "",
      );
    } else {
      // setFormData(initialFormData);
    }
  }, [isOpen, editData]);

  /*********************** */

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  // 儲存
  const handleSubmit = async () => {
    try {
      if (editData) {
        // 更新
        await updateRow(editData.id, formData);
        setData((prev) =>
          prev.map((item) => (item.id === formData.id ? formData : item)),
        );
      } else {
        // 新增
        const res = await createRow(formData);
        setData((prev) => [{ ...formData, id: res.id }, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      alert("儲存失敗，請檢查輸入內容");
    }
  };

  return (
    <Modal open={isOpen} size="small">
      <Modal.Header>{editData ? "✏️ 編輯" : "📝 新增"}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} id="scorecard-form">
          {/* 透過 map 走訪 JSON 動態產生對應的表單欄位 */}
          {columns
            .filter((col) => col.formShow)
            .map((col) => {
              // 下拉選單
              if (col.type === "select") {
                return (
                  <Form.Select
                    key={col.field}
                    label={col.label}
                    name={col.field}
                    value={formData[col.field]}
                    options={col.options}
                    onChange={handleChange}
                    required={col.required}
                    search
                  />
                );
              }

              // 預設渲染一般文字或數字輸入框
              return (
                <Form.Input
                  key={col.field}
                  label={col.label}
                  name={col.field}
                  type={col.type}
                  // 關鍵在這裡：如果 formData[col.field] 是 null 或 undefined，就強制轉成 ""
                  value={formData[col.field] ?? ""}
                  onChange={handleChange}
                  required={col.required}
                />
              );
            })}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setIsModalOpen(false)}>取消</Button>
        <Button primary type="submit" form="scorecard-form">
          儲存
        </Button>
        <Button
          floated="left"
          color="red"
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
