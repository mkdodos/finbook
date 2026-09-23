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
                  <Button
                    icon="trash"
                    color="red"
                    size="mini"
                    onClick={() => onDelete(item.id)}
                  />
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
            {columns.map((col) => (
              <Form.Input
                key={col.key}
                label={col.label}
                name={col.key}
                type={col.type || "text"}
                value={formData[col.key] || ""}
                onChange={handleChange}
              />
            ))}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)}>取消</Button>
          <Button positive onClick={handleSubmit}>
            儲存
          </Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
}
