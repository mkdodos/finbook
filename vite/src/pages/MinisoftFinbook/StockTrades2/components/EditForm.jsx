import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Icon } from "semantic-ui-react";
// import { createRow, updateRow } from "../data/api";

function EditForm({
  isOpen,
  setIsModalOpen,
  editData,
  handleDelete,
  columns,
  formData,
  setFormData,
  onSaveSuccess,
}) {
  // 表單載入時,判斷 editData, 有的話將 editData 記錄為 formData
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      // setFormData(initialFormData);
    }
  }, [isOpen, editData]);

  /*********************** */

  // 輸入時,改變 formData
  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal open={isOpen} size="small">
      <Modal.Header>{editData ? "✏️ 編輯" : "📝 新增"}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={onSaveSuccess} id="scorecard-form">
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
