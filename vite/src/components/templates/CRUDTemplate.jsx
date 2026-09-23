import React, { useState } from "react";
import { Table, Form, Button, Modal, Icon, Segment } from "semantic-ui-react";

// 1. 將 data 加上預設值 []
export default function CRUDTemplate({
  columns = [],
  data = [],
  dispatch,
  onSave,
  onDelete,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // 儲存動態從 API 撈取到的 select options
  const [selectOptions, setSelectOptions] = useState({});

  const handleOpenCreate = () => {
    const initialForm = {};
    columns.forEach((col) => (initialForm[col.key] = ""));
    setFormData(initialForm);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setModalOpen(true);
  };

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
    <Segment>
      <Button primary icon labelPosition="left" onClick={handleOpenCreate}>
        <Icon name="add" /> 新增項目
      </Button>

      {/* 動態表格 */}
      <Table celled striped style={{ marginTop: "15px" }}>
        <Table.Header>
          <Table.Row>
            {columns.map((col) => (
              <Table.HeaderCell key={col.key}>{col.label}</Table.HeaderCell>
            ))}
            <Table.HeaderCell width={3}>操作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {/* 2. 加上 safe check 或使用 data?.map(...) */}
          {Array.isArray(data) &&
            data.map((item) => (
              <Table.Row key={item.id}>
                {columns.map((col) => (
                  <Table.Cell key={col.key}>{item[col.key]}</Table.Cell>
                ))}
                <Table.Cell>
                  <Button
                    icon="edit"
                    color="blue"
                    size="mini"
                    onClick={() => handleOpenEdit(item)}
                  />
                  {/* <Button
                    icon="trash"
                    color="red"
                    size="mini"
                    onClick={() => onDelete(item.id)}
                  /> */}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>

      {/* 動態編輯/新增彈窗表單 */}
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
                      label={col.label}
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
                    label={col.label}
                    type={col.formType || "text"} // 若沒設定 type 預設為 "text"
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
          {/* <Button
            icon="trash"
            color="red"
            size="mini"
            onClick={() => handleDelete(formData.id)}
          /> */}
          {/* <Button onClick={() => setModalOpen(false)}>取消</Button> */}
          <Button positive onClick={handleSubmit}>
            儲存
          </Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
}
