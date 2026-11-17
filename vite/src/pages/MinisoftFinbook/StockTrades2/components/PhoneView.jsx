import React from "react";
import { Table, Tab, Button, Icon, Card } from "semantic-ui-react";
import { groupedData } from "../data/utils";

export default function PhoneView({ data, handleEdit, handleAdd }) {
  // 準備群組資料
  // if (!data) return;
  const groupedByStock = Object.entries(groupedData(data, "stock_id"));
  const groupedByDate = Object.entries(groupedData(data, "trade_date"));
  // ['日期',{data:[],total:0}]

  const table = (gData, total, gkey) => {
    return (
      <Table unstackable columns={4} basic="very">
        <Table.Header>
          <Table.Row textAlign="right">
            <Table.HeaderCell textAlign="left">
              <Button
                size="mini"
                primary
                icon
                onClick={() => handleAdd(gData[0][gkey])}
                type="button"
                basic
              >
                <Icon name="add" />
              </Button>
            </Table.HeaderCell>
            <Table.HeaderCell>單價</Table.HeaderCell>
            <Table.HeaderCell>股數</Table.HeaderCell>
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
                <div style={{ fontWeight: "bold" }}>
                  {/* 第一欄顯示日期或名稱 */}
                  {gkey == "stock_name"
                    ? item[gkey]
                    : item[gkey].substring(5, 10)}
                </div>
                <div style={{ color: "#666", fontSize: "0.9em" }}>
                  {/* {item[gkey]} */}
                </div>
              </Table.Cell>

              <Table.Cell>{Number(item.price).toLocaleString()}</Table.Cell>
              <Table.Cell>
                <span
                  style={{
                    color: item.trade_type == "buy" ? "red" : "#21BA45",
                  }}
                >
                  {item.qty}
                </span>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <span
                  style={{
                    color: item.trade_type == "buy" ? "red" : "#21BA45",
                  }}
                >
                  {Math.round(item.qty * item.price).toLocaleString()}
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell>合計</Table.HeaderCell>
            <Table.HeaderCell colSpan="3" textAlign="right">
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

  const panes = [
    {
      menuItem: "股票分組",
      render: () => renderPane(groupedByStockPane()),
      // render: () => <Tab.Pane>這裡顯示個人資料設定...</Tab.Pane>,
    },
    {
      menuItem: "日期分組",
      render: () => renderPane(groupedByDatePane()),
      // render: () => <Tab.Pane>這裡顯示個人資料設定...</Tab.Pane>,
    },
  ];

  const groupedByStockPane = () => {
    return groupedByStock.map(([trade_date, { data, total }]) => {
      return (
        <Card fluid key={trade_date}>
          <Card.Content>
            <Card.Header>{data[0].stock_name}</Card.Header>
          </Card.Content>
          <Card.Content>{table(data, total, "trade_date")}</Card.Content>
        </Card>
      );
    });
  };

  const groupedByDatePane = () => {
    return groupedByDate.map(([trade_date, { data, total }]) => {
      return (
        <Card fluid key={trade_date}>
          <Card.Content>
            <Card.Header>{data[0].trade_date}</Card.Header>
          </Card.Content>
          <Card.Content>{table(data, total, "stock_name")}</Card.Content>
        </Card>
      );
    });
  };

  return (
    <>
      <Tab
        panes={panes}
        menu={{ secondary: true, pointing: true, widths: 2, color: "teal" }}
      />
      {/* 股票分組 */}
      {/* {groupedByStock.map(([trade_date, { data, total }]) => {
        return (
          <Card fluid key={trade_date}>
            <Card.Content>
              <Card.Header>{data[0].stock_name}</Card.Header>
            </Card.Content>
            <Card.Content>{table(data, total, "trade_date")}</Card.Content>
          </Card>
        );
      })} */}
      {/* 日期分組 */}
      {/* {groupedByDate.map(([trade_date, { data, total }]) => {
        return (
          <Card fluid key={trade_date}>
            <Card.Content>
              <Card.Header>{trade_date.substring(5, 10)}</Card.Header>
            </Card.Content>
            <Card.Content>{table(data, total, "stock_name")}</Card.Content>
          </Card>
        );
      })} */}
    </>
  );
}
