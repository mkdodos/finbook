import React, { useState } from "react";
import { Modal, Form, Button, Icon } from "semantic-ui-react";

export default function EditForm({
  columns,
  setModalOpen,
  modalOpen,
  isEditing,
  formData,
  setFormData,
  onSave,
}) {
  // 儲存動態從 API 撈取到的 select options
  const [selectOptions, setSelectOptions] = useState({});

  const handleChange = (e, { name, value }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData, isEditing);
    setModalOpen(false);
  };

  // 💡 新增：表單內的刪除處理邏輯
  const handleDelete = async () => {
    if (formData.id && window.confirm("確定要刪除此筆資料嗎？")) {
      await onDelete(formData.id); // 呼叫父組件傳入的刪除函式
      setModalOpen(false); // 💡 刪除完成後關閉表單
    }
  };
  return (
    <div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="small">
        <Modal.Header>{isEditing ? "編輯資料" : "新增資料"}</Modal.Header>
        <Modal.Content>
          <Form>
            {columns
              // 💡 1. 濾除不需要出現在表單中的欄位
              .filter((col) => !col.hideInForm)
              // 💡 2. 渲染剩餘的表單欄位
              .map((col) => {
                const fieldName = col.name || col.key;
                // 下拉選單處理
                if (col.type === "select") {
                  // 優先採用非同步載入的 options，若無則使用原本的 col.options
                  const currentOptions =
                    selectOptions[fieldName] || col.options || [];

                  return (
                    <Form.Select
                      search
                      key={col.key}
                      label={col.title}
                      name={fieldName}
                      value={formData[fieldName] || ""}
                      onChange={handleChange}
                      options={currentOptions}
                    />
                  );
                }

                return (
                  <Form.Input
                    key={col.key}
                    label={col.title}
                    type={col.type || "text"} // 若沒設定 type 預設為 "text"
                    name={col.key}
                    value={formData[col.key] || ""}
                    onChange={handleChange}
                  />
                );
              })}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {/* 只有在「編輯」狀態時才顯示刪除按鈕 */}
          {isEditing && (
            <Button
              color="red"
              icon
              labelPosition="left"
              onClick={handleDelete}
              floated="left"
            >
              <Icon name="trash" /> 刪除此筆
            </Button>
          )}

          <Button positive onClick={handleSubmit}>
            儲存
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
