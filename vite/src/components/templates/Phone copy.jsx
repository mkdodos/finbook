import React, { useState } from "react";
import {
  Card,
  Form,
  Button,
  Modal,
  Icon,
  Segment,
  Header,
  Grid,
  Divider,
} from "semantic-ui-react";

export default function Phone({
  columns = [],
  data = [],
  dispatch,
  onSave,
  onDelete,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
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

  const handleDelete = async () => {
    if (formData.id && window.confirm("確定要刪除此筆資料嗎？")) {
      await onDelete(formData.id);
      setModalOpen(false);
    }
  };

  return (
    <Segment basic style={{ padding: "10px 5px" }}>
      {/* 頂部操作列：滿版新增按鈕 */}
      <Button
        primary
        fluid
        size="large"
        icon
        labelPosition="left"
        onClick={handleOpenCreate}
        style={{ marginBottom: "15px" }}
      >
        <Icon name="add" /> 新增項目
      </Button>

      {/* 手機端列表：改用 Card 群組替代 Table */}
      <Card.Group stackable itemsPerRow={1}>
        {Array.isArray(data) &&
          data.map((item) => (
            <Card key={item.id} fluid color="blue">
              <Card.Content>
                <Grid columns={2} dividing>
                  {columns.map((col) => (
                    <Grid.Row key={col.key} style={{ padding: "8px 0" }}>
                      <Grid.Column
                        width={6}
                        style={{ color: "#666", fontWeight: "bold" }}
                      >
                        {col.label}
                      </Grid.Column>
                      <Grid.Column
                        width={10}
                        style={{ wordBreak: "break-word" }}
                      >
                        {col.render ? col.render(item) : item[col.key]}
                      </Grid.Column>
                    </Grid.Row>
                  ))}
                </Grid>
              </Card.Content>
              <Card.Content extra>
                <Button
                  fluid
                  basic
                  color="blue"
                  icon="edit"
                  content="編輯此筆資料"
                  onClick={() => handleOpenEdit(item)}
                />
              </Card.Content>
            </Card>
          ))}
      </Card.Group>

      {/* 手機適配 Modal 彈窗 */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="tiny"
        closeIcon
        style={{ margin: "10px auto", width: "95%" }}
      >
        <Modal.Header>
          <Header as="h3" icon>
            <Icon name={isEditing ? "edit" : "plus circle"} color="blue" />
            <Header.Content>
              {isEditing ? "編輯資料" : "新增資料"}
            </Header.Content>
          </Header>
        </Modal.Header>

        <Modal.Content scrolling style={{ maxHeight: "60vh" }}>
          <Form size="large">
            {columns
              .filter((col) => !col.hideInForm)
              .map((col) => {
                const fieldName = col.name || col.key;
                if (col.type === "select") {
                  const currentOptions =
                    selectOptions[fieldName] || col.options || [];

                  return (
                    <Form.Select
                      search
                      fluid
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
                    fluid
                    key={col.key}
                    label={col.label}
                    type={col.type || "text"}
                    name={col.key}
                    value={formData[col.key] || ""}
                    onChange={handleChange}
                  />
                );
              })}
          </Form>
        </Modal.Content>

        <Modal.Actions style={{ padding: "10px" }}>
          <Button
            primary
            fluid
            size="large"
            onClick={handleSubmit}
            style={{ marginBottom: "10px" }}
          >
            儲存
          </Button>

          {isEditing && (
            <Button
              color="red"
              fluid
              basic
              size="large"
              onClick={handleDelete}
              style={{ marginBottom: "10px" }}
            >
              <Icon name="trash" /> 刪除此筆資料
            </Button>
          )}

          <Button fluid onClick={() => setModalOpen(false)}>
            取消
          </Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
}
