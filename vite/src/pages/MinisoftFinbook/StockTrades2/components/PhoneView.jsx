import React from "react";
import { Table, Label, Button, Icon } from "semantic-ui-react";

export default function PhoneView({ data, handleEdit, handleAdd }) {
  return (
    <div>
      <Table unstackable columns={4}>
        <Table.Header>
          <Table.Row textAlign="right">
            <Table.HeaderCell textAlign="left">
              <Button
                size="mini"
                primary
                icon
                onClick={handleAdd}
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
          {data.map((item) => (
            <Table.Row textAlign="right" onClick={() => handleEdit(item)}>
              <Table.Cell textAlign="left">
                <div style={{ fontWeight: "bold" }}>
                  {/* <Label>{item.stock_id}</Label> */}
                  {item.stock_name}
                </div>
                <div style={{ color: "#666", fontSize: "0.9em" }}>
                  {item.trade_date.substring(5, 10)}
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
              <Table.Cell textAlign="right">
                <span
                  style={{
                    color: item.trade_type == "buy" ? "#DB2828" : "#21BA45",
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
            <Table.HeaderCell>合計列</Table.HeaderCell>
            <Table.HeaderCell colSpan="3" textAlign="right">
              1,234
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
}
