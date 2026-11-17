import React from "react";
import { Table, Label, Button, Icon, Card } from "semantic-ui-react";
import { groupedData } from "../data/utils";

export default function PhoneView({ data, handleEdit, handleAdd }) {
  // 準備群組資料
  // if (!data) return;
  const groupedByDate = Object.entries(groupedData(data, "trade_date"));
  // ['日期',{data:[],total:0}]
  // console.log(groupedByRole[0]);

  // groupedByDate.map(([trade_date, { data, total }]) => {

  //   console.log(trade_date, total);
  //   data.map((item) => console.log(item.stock_name, item.price));
  // });

  // return;

  const table = (gData, total) => {
    return (
      <Table unstackable columns={4} basic="very">
        <Table.Header>
          <Table.Row textAlign="right">
            <Table.HeaderCell textAlign="left">
              <Button
                size="mini"
                primary
                icon
                onClick={() => handleAdd(gData[0].trade_date)}
                type="button"
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
                <div style={{ fontWeight: "bold" }}>{item.stock_name}</div>
                <div style={{ color: "#666", fontSize: "0.9em" }}>
                  {item.stock_id}
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

  return (
    <>
      {groupedByDate.map(([trade_date, { data, total }]) => {
        // console.log(data[0]?.stock_name);
        // console.log(trade_date, total);
        return (
          <Card fluid key={trade_date}>
            <Card.Content>
              <Card.Header>{trade_date.substring(5, 10)}</Card.Header>
            </Card.Content>
            <Card.Content>{table(data, total)}</Card.Content>
          </Card>
        );
        data.map((item) => console.log(item.stock_name, item.price));
      })}
    </>
  );
}
