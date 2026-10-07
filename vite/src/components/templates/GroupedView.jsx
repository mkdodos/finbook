import React, { Fragment } from "react";
import { Divider, Header, Table, Label } from "semantic-ui-react";

export default function GroupedView({ data }) {
  console.log(data);
  return (
    <div style={{ padding: "10px" }}>
      <h4>交易紀錄 (按日期分組)：</h4>
      {data?.map(([groupedKey, group]) => (
        <Fragment key={groupedKey}>
          <Divider horizontal>
            <Header as="h4">
              {/* <Icon name="tag" /> */}
              {groupedKey}
            </Header>
          </Divider>
          <Table compact unstackable>
            <Table.Header>
              <Table.Row>
                {/* <Table.HeaderCell></Table.HeaderCell> */}
                <Table.HeaderCell textAlign="right" colSpan="2">
                  ${group.total.toLocaleString()}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {group.items.map((item, idx) => {
                return (
                  <Table.Row key={item.id || `${key}-${idx}`}>
                    <Table.Cell>{item.note}</Table.Cell>
                    <Table.Cell textAlign="right">
                      {Number(item.amount).toLocaleString()}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Fragment>
      ))}
    </div>
  );
}
