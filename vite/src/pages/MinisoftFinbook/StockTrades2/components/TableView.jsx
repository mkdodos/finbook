import React from "react";
import {
  Table,
  Container,
  Header,
  Loader,
  Segment,
  Button,
  Icon,
  Input,
} from "semantic-ui-react";
import { columns } from "../data/columns";

export default function TableView({ data, loading, handleEdit, handleAdd }) {
  return (
    <div>
      {loading ? (
        <Segment basic style={{ minHeight: "150px" }}>
          <Loader active inline="centered">
            載入戰績資料中...
          </Loader>
        </Segment>
      ) : (
        <Table celled striped selectable unstackable>
          <Table.Header>
            <Table.Row>
              {columns.map((col) => {
                return (
                  <Table.HeaderCell key={col.field}>
                    {col.label}
                  </Table.HeaderCell>
                );
              })}

              <Table.HeaderCell textAlign="center" style={{ width: "100px" }}>
                <Button primary icon onClick={handleAdd} type="button">
                  <Icon name="add" />
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.length > 0 ? (
              data.map((item) => (
                <Table.Row key={item.id}>
                  {columns.map((col) => {
                    return (
                      <Table.Cell key={col.field}>{item[col.field]}</Table.Cell>
                    );
                  })}

                  <Table.Cell textAlign="center">
                    {/* 編輯按鈕 */}
                    <Button
                      color="yellow"
                      size="mini"
                      icon
                      onClick={() => handleEdit(item)}
                      title="編輯"
                      style={{ marginRight: "5px" }}
                    >
                      <Icon name="edit" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="5" textAlign="center">
                  目前沒有任何戰績紀錄
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
