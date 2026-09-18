import React from "react";
import { Table, Button } from "semantic-ui-react";

export default function TableView({ state, dispatch }) {
  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>stock_id</Table.HeaderCell>
          <Table.HeaderCell>symbol</Table.HeaderCell>
          <Table.HeaderCell>單價</Table.HeaderCell>
          {/* <Table.HeaderCell>小計</Table.HeaderCell> */}

          <Table.HeaderCell>#</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {/* {Array.isArray(state.data) ? state.data.map(...) : null} */}
        {(state.data ?? []).map((item) => (
          // {state.data.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.id}</Table.Cell>
            <Table.Cell>{item.stock_id}</Table.Cell>
            <Table.Cell>{item.symbol}</Table.Cell>
            <Table.Cell>{item.name}</Table.Cell>
            {/* <Table.Cell>{Math.round(item.price * item.shares)}</Table.Cell> */}

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
