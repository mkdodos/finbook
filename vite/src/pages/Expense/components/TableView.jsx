import React from "react";
import { Table, Button } from "semantic-ui-react";

export default function TableView({ state, dispatch }) {
  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>消費日</Table.HeaderCell>
          <Table.HeaderCell>品名</Table.HeaderCell>
          <Table.HeaderCell>類別</Table.HeaderCell>
          <Table.HeaderCell>金額</Table.HeaderCell>

          <Table.HeaderCell>#</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {/* {Array.isArray(state.data) ? state.data.map(...) : null} */}
        {(state.data ?? []).map((item) => (
          // {state.data.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.id}</Table.Cell>
            <Table.Cell>{item.transaction_date}</Table.Cell>
            <Table.Cell>{item.note}</Table.Cell>
            <Table.Cell>{item.category_id}</Table.Cell>
            <Table.Cell>{item.amount}</Table.Cell>
            <Table.Cell>{item.work_name}</Table.Cell>

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
