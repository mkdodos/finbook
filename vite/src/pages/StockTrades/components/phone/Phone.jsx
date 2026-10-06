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
import EditForm from "../EditForm";

export default function Phone({
  rows,
  columns = [],
  dispatch,
  state,
  onSave,
  onDelete,
}) {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setModalOpen(true);
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
      <EditForm state={state} dispatch={dispatch} columns={columns} />
      {/* <EditForm
        columns={columns}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onSave={onSave}
      /> */}

      <Table unstackable>
        <Table.Body>
          {rows.map((row, index) => {
            return (
              <Table.Row
                key={row.id}
                onClick={() =>
                  dispatch({
                    type: "OPEN_EDIT",
                    payload: { row },
                  })
                }
                // onClick={() => {
                //   handleOpenEdit(row);
                // }}
              >
                <Table.Cell>
                  <Header as="h4" style={{ marginBottom: 5 }}>
                    {/* columns[0].key 第0個欄位鍵值, 例: item_name , 再用此值取得資料  */}
                    {row[columns[1].key]}&nbsp;
                    {row.name}
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
                  <div>{row.shares}</div>
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
                    {row.price}
                  </div>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {/* <div>{JSON.stringify(columns[6].render(row))}</div> */}
                  {/* <div>{columns[6].render(row)}</div> */}
                  <div>{columns[6].render(row)}</div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
