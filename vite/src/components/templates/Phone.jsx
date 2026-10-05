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
    // console.log(columns[2])
    // 1. 取值（使用 ?? 避免 amount = 0 時被跳過）
    // const val = row.amount ?? row.price ?? row.title;
    const val = row[columns[2]?.key];

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

  function getChineseWeekday(date = new Date(), prefix = "") {
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    return `${prefix}${days[date.getDay()]}`;
  }

  // 使用方式：
  console.log(getChineseWeekday()); // 預設輸出目前日期，例如：星期三
  console.log(getChineseWeekday(new Date("2026-10-10"), "週")); // 輸出：週六

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
                    {/* columns[0].key 第0個欄位鍵值, 例: item_name , 再用此值取得資料  */}
                    {row[columns[1].key]}
                  </Header>
                  {/* 日期 style={{ fontSize: "0.875rem" }} */}
                  <span>
                    {/* <Icon name="calendar  outline" /> */}
                    {row[columns[0]?.key]?.substring(5, 10)} (
                    {getChineseWeekday(new Date(row[columns[0]?.key]))})
                  </span>

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
                  >
                    {" "}
                    {formatRowValue(row)}
                  </div>
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
