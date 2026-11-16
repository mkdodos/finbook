import React from "react";
import { Table, Label } from "semantic-ui-react";

export default function PhoneView({ data }) {
  return (
    <div>
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            {/* <Table.HeaderCell>第一列欄名</Table.HeaderCell> */}
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>單價</Table.HeaderCell>
            <Table.HeaderCell>股數</Table.HeaderCell>
            <Table.HeaderCell>小計</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item) => (
            <Table.Row>
              <Table.Cell>
                <div style={{ fontWeight: "bold" }}>{item.stock_name}</div>
                <div style={{ color: "#666", fontSize: "0.9em" }}>
                  {item.stock_id}
                </div>
              </Table.Cell>

              <Table.Cell>{Number(item.price).toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Label
                  circular
                  basic
                  color={item.trade_type == "buy" ? "red" : "green"}
                >
                  {item.qty}
                </Label>
              </Table.Cell>
              <Table.Cell>
                <span
                  style={{
                    color: item.trade_type == "buy" ? "#DB2828" : "#21BA45",
                  }}
                >
                  {(item.qty * item.price).toLocaleString()}
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
          {/* <Table.Row>
            <Table.Cell>內容</Table.Cell>
          </Table.Row> */}
        </Table.Body>
      </Table>
    </div>
  );
}
