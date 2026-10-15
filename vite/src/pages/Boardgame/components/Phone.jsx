import React, { useState } from "react";
import {
  Table,
  Label,
  Header,
  Modal,
  Form,
  Button,
  Icon,
} from "semantic-ui-react";
import EditForm from "./EditForm";

export default function Phone({ rows, onSave, onDelete }) {
  console.log(rows);
  const columns = [
    { key: "scorecard_id", label: "date", type: "number" },
    { key: "game_name", label: "category", type: "text" },
    { key: "title", label: "title", type: "text" },
  ];
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenCreate = () => {
    const initialForm = {};
    columns.forEach((col) => (initialForm[col.key] = ""));
    // 2. 針對特定欄位覆蓋預設值
    initialForm.transaction_date = new Date().toISOString().substring(0, 10);
    setFormData(initialForm);
    setIsEditing(false);
    setModalOpen(true);
  };
  const handleOpenEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setModalOpen(true);
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
      {/* {JSON.stringify(formData)} */}
      <Button primary onClick={handleOpenCreate}>
        新增
      </Button>
      {/* 彈窗表單 */}
      <EditForm
        columns={columns}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onSave={onSave}
        onDelete={handleDelete}
      />

      <Table unstackable>
        <Table.Body>
          {rows.map((row, index) => {
            return (
              <Table.Row
                key={row.scorecard_id}
                onClick={() => {
                  handleOpenEdit(row);
                }}
              >
                <Table.Cell>
                  <Header as="h4" style={{ marginBottom: 5 }}>
                    {row.game_name}
                  </Header>

                  <span>{row.scorecard_id}</span>

                  {row.cate && <Label>{row.cate}</Label>}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <div
                    style={{
                      // border: "none",
                      color: "#F2711C",
                      fontWeight: "bold",
                      // background: "transparent",
                      // padding: 10,
                    }}
                  ></div>
                  {/* <Label color="orange" size="large"></Label> */}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
