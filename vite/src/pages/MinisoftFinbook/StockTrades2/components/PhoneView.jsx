import React, { useState } from "react";
import { Table, Tab, Button, Icon, Card, Label } from "semantic-ui-react";
import { groupedData } from "../data/utils";
import MonthView from "./MonthView";

export default function PhoneView({ data, handleEdit, handleAdd, fetchData }) {
  // 準備群組資料
  // if (!data) return;
  const groupedByStock = Object.entries(groupedData(data, "stock_id"));
  const groupedByDate = Object.entries(groupedData(data, "trade_date"));
  // ['日期',{data:[],total:0}]

  console.log(groupedByDate);

  // 依買或賣顯示不同色
  const colorCell = (item) => {
    return (
      <Table.Cell textAlign="right">
        <span
        // style={{
        //   color: item.trade_type == "buy" ? "#DB2828" : "#21BA45",
        // }}
        >
          {/* 賣出維持正數，買入加上負號 */}
          {item.trade_type == "buy" ? "-" : ""}
          {Math.round(item.qty * item.price).toLocaleString()}
        </span>
      </Table.Cell>
    );
  };

  const colorPrice = (item) => {
    return (
      <Table.Cell textAlign="right">
        <span
          style={{
            color: item.trade_type == "buy" ? "#DB2828" : "#21BA45",
          }}
        >
          {Number(item.price).toLocaleString()}
        </span>
      </Table.Cell>
    );
  };

  const table = (gData, total, totalQty, gkey) => {
    return (
      <Table unstackable columns={4} basic="very">
        <Table.Header>
          <Table.Row textAlign="right">
            <Table.HeaderCell textAlign="left">
              {gkey == "trade_date" ? "日期" : "名稱"}
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">類型</Table.HeaderCell>
            <Table.HeaderCell>股數</Table.HeaderCell>
            <Table.HeaderCell>單價</Table.HeaderCell>

            <Table.HeaderCell>小計</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {gData.map((item) => (
            <Table.Row
              key={item.id}
              textAlign="right"
              onClick={() => handleEdit(item)}
            >
              <Table.Cell textAlign="left">
                {/* <div style={{ fontWeight: "bold" }}> */}
                <div>
                  {/* 第一欄顯示日期或名稱 */}
                  {gkey == "stock_name"
                    ? item[gkey]
                    : item[gkey].substring(5, 10)}
                </div>
                <div style={{ color: "#666", fontSize: "0.9em" }}></div>
              </Table.Cell>
              {/* 類型 */}
              <Table.Cell>
                <Label
                  // 強制文字不換行
                  style={{ whiteSpace: "nowrap" }}
                  color={item.trade_type == "buy" ? "red" : "green"}
                  basic
                >
                  {item.trade_type == "buy" ? "買進" : "賣出"}
                </Label>
              </Table.Cell>
              {/* 股數 */}
              <Table.Cell>
                <span
                // style={{
                //   color: item.trade_type == "buy" ? "#DB2828" : "#21BA45",
                // }}
                >
                  {item.qty}
                </span>
              </Table.Cell>
              {/* 單價 */}
              {colorPrice(item)}
              {/* <Table.Cell>{Number(item.price).toLocaleString()}</Table.Cell> */}
              {/* 小計 */}
              {colorCell(item)}
              {/* <Table.Cell textAlign="right">
                <span
                  style={{
                    color: item.trade_type == "buy" ? "#DB2828" : "#21BA45",
                  }}
                >
                  {item.trade_type == "buy" ? "-" : ""}
                  {Math.round(item.qty * item.price).toLocaleString()}
                </span>
              </Table.Cell> */}
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row style={{ fontWeight: "bold" }}>
            <Table.HeaderCell style={{ fontWeight: "bold" }}>
              合計
            </Table.HeaderCell>
            <Table.HeaderCell
              colSpan="2"
              style={{ fontWeight: "bold" }}
              textAlign="right"
            >
              {gkey == "trade_date" && totalQty}
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ fontWeight: "bold" }}
              colSpan="3"
              textAlign="right"
            >
              {total.toLocaleString()}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  };

  // 定義統一樣式(去掉外框和陰影)
  const renderPane = (children) => (
    <Tab.Pane style={{ border: "none", boxShadow: "none" }}>
      {children}
    </Tab.Pane>
  );

  // 0: 月份統計, 1: 日期分組, 2: 股票分組
  const [activeIndex, setActiveIndex] = useState(0);

  const panes = [
    {
      menuItem: "月份統計",
      render: () =>
        renderPane(
          <MonthView fetchData={fetchData} setActiveIndex={setActiveIndex} />,
        ),
    },
    {
      menuItem: "日期分組",
      render: () => renderPane(groupedByDatePane()),
    },
    {
      menuItem: "股票分組",
      render: () => renderPane(groupedByStockPane()),
    },
  ];

  // 把取出的 activeIndex 重新命名為 nextIndex，避免跟外層存在的 state 變數 activeIndex 撞名
  // activeIndex 是由 onTabChange 事件傳入
  const handleTabChange = (e, { activeIndex: nextIndex }) => {
    setActiveIndex(nextIndex);
  };

  const groupedByStockPane = () => {
    return groupedByStock.map(([trade_date, { data, total, totalQty }]) => {
      return (
        <Card fluid key={trade_date}>
          <Card.Content>
            <Card.Header>{data[0].stock_name}</Card.Header>
          </Card.Content>
          <Card.Content>
            {table(data, total, totalQty, "trade_date")}
          </Card.Content>
        </Card>
      );
    });
  };

  const groupedByDatePane = () => {
    return groupedByDate.map(([trade_date, { data, total, totalQty }]) => {
      return (
        <Card fluid key={trade_date}>
          <Card.Content>
            <Card.Header>{data[0].trade_date}</Card.Header>
          </Card.Content>
          <Card.Content>
            {table(data, total, totalQty, "stock_name")}
          </Card.Content>
        </Card>
      );
    });
  };

  return (
    <>
      <Tab
        panes={panes}
        activeIndex={activeIndex}
        onTabChange={handleTabChange}
        menu={{ secondary: true, pointing: true, widths: 3, color: "blue" }}
      />
    </>
  );
}
