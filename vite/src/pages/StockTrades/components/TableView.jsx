import React from "react";
import { Table, Button } from "semantic-ui-react";

// const columns = [
//   { label: "ID", key: "id" },
//   // { label: "stock_id", key: "stock_id" },
//   { label: "symbol", key: "symbol" },
//   { label: "單價", key: "name" },
//   { label: "建立時間", key: "created_at" },
// ];

export default function TableView({ state, dispatch, columns }) {
  // const total = state.data.reduce()
  const total = state.data.reduce((acc, item) => {
    return acc + Math.round(item.price * item.shares); // 替換成你的屬性名稱，例如 item.amount 或 item.count
  }, 0);
  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          {columns.map((col) => (
            <Table.HeaderCell key={col.key}>{col.title}</Table.HeaderCell>
          ))}

          <Table.HeaderCell>
            <Button primary onClick={() => dispatch({ type: "OPEN_FORM" })}>
              新增
            </Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {(state.data ?? []).map((item) => (
          <Table.Row key={item.id}>
            {columns.map((col) => (
              <Table.Cell key={col.key}>
                {col.render ? col.render(item) : item[col.key]}
              </Table.Cell>
            ))}
            <Table.Cell>
              <Button
                onClick={() =>
                  dispatch({
                    type: "OPEN_EDIT",
                    payload: { row: item },
                  })
                }
              >
                編輯
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
