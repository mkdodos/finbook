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

export default function Phone({ rows, columns = [], onSave, onDelete }) {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setModalOpen(true);
  };

  const formatRowValue = (row) => {
    // 1. 取值（使用 ?? 避免 amount = 0 時被跳過）
    const val = row.amount ?? row.price ?? row.title;

    if (val === undefined || val === null || val === "") return "";

    // 2. 判斷 JS 原生型別 或 是否為數字字串
    const isNumberType = typeof val === "number";
    const isNumericString = typeof val === "string" && !isNaN(Number(val));

    // 3. 型別為數字時加上 $
    if (isNumberType || isNumericString) {
      return `$ ${Number(val).toLocaleString()}`;
    }

    // 4. 型別為文字（例如 title 的內容）不加 $
    return val;
  };

  return (
    <div>
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
      />

      <Table unstackable>
        <Table.Body>
          {rows.map((row, index) => {
            return (
              <Table.Row
                key={row.id}
                onClick={() => {
                  handleOpenEdit(row);
                }}
              >
                <Table.Cell>
                  <Header as="h4" style={{ marginBottom: 5 }}>
                    {row.note || row.item_name || row.name || row.category}
                  </Header>
                  <span style={{ fontSize: "12px", marginTop: 0 }}>
                    {row.transaction_date || row.created_at}
                  </span>

                  {row.cate && <Label>{row.cate}</Label>}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Label color="orange" basic size="large">
                    {/* $ {row.amount || row.price || row.title} */}
                    {/* {formatValue(row, columns)} */}
                    {formatRowValue(row)}
                  </Label>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
