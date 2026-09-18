import React from "react";
import { Table, Button } from "semantic-ui-react";

const columns = [
  { label: "ID", key: "id" },
  // { label: "stock_id", key: "stock_id" },
  { label: "symbol", key: "symbol" },
  { label: "單價", key: "name" },
  { label: "建立時間", key: "created_at" },
];

export default function TableView({ state, dispatch }) {
  const data = state?.data ?? [];

  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          {columns.map((col) => (
            <Table.HeaderCell key={col.key}>{col.label}</Table.HeaderCell>
          ))}
          <Table.HeaderCell>#</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.map((item) => (
          <Table.Row key={item.id}>
            {columns.map((col) => (
              <Table.Cell key={col.key}>{item[col.key]}</Table.Cell>
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
