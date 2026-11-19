import React from "react";
import { Table, Button, Icon, Form } from "semantic-ui-react";
import { columns as columnsTrade } from "../../StockTrades2/data/columns";
import { FaPiggyBank } from "react-icons/fa";

export default function PhoneView({
  columns,
  data,
  setData,
  loading,
  handleEdit,
  handleAdd,
  fetchData,
}) {
  columns = columns.filter((col) => col.field !== "id");

  const filterData = () => {
    setData((prev) => prev.filter((item) => item.amt > 0));
  };

  const searchForm = () => {
    return (
      <Form style={{ marginBottom: "10px", marginTop: "20px" }}>
        <Form.Group
          unstackable
          style={{
            display: "flex",
            alignItems: "center",

            justifyContent: "space-between",
          }}
        >
          <Form.Field style={{ width: "150px" }}>
            <Form.Select
              options={columnsTrade[2].options}
              onChange={(e, { value }) => fetchData({ symbol: value })}
              search
              clearable
              placeholder="股票查詢"
            />
          </Form.Field>
          <Form.Field style={{ display: "flex", marginLeft: "60px" }}>
            <Button primary icon basic type="button" onClick={filterData}>
              <Icon name="calendar check" />
            </Button>
          </Form.Field>
          <Form.Field>
            <Button primary icon type="button" onClick={handleAdd}>
              <Icon name="add" />
            </Button>
          </Form.Field>
        </Form.Group>
      </Form>
    );
  };
  return (
    <div>
      {searchForm()}
      <Table celled selectable unstackable>
        <Table.Header>
          <Table.Row>
            {columns.map((col) => {
              return (
                <Table.HeaderCell key={col.field}>{col.label}</Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.length > 0 ? (
            data.map((item) => (
              <Table.Row key={item.id} onClick={() => handleEdit(item)}>
                {columns.map((col) => {
                  return (
                    <Table.Cell key={col.field}>
                      {col.render
                        ? col.render(item[col.field], item)
                        : item[col.field]}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan="5" textAlign="center">
                目前沒有任何紀錄
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}
