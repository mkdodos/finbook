import React, { Fragment } from "react";
import { Divider, Header, Table, Label } from "semantic-ui-react";

export default function GroupedView({ data, dispatch }) {
  // console.log(data);
  return (
    <>
      {data?.map(([groupedKey, group], index) => (
        <Fragment key={groupedKey}>
          <Divider
            horizontal
            style={{
              marginTop: index === 0 ? "0rem" : "0rem",
              // marginBottom: "0.8rem",
            }}
          >
            <Header as="h4">
              {/* <Icon name="tag" /> */}
              {groupedKey}
            </Header>
          </Divider>
          <Table compact unstackable>
            {/* <Table.Header>
              <Table.Row>
               
                <Table.HeaderCell textAlign="right" colSpan="5">
                
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header> */}

            <Table.Body>
              {group.items.map((item, idx) => {
                const isBuy = item.trade_type === "buy";
                let rawTotal = 0;
                if (isBuy) {
                  rawTotal = Math.round(
                    Number(item.shares) * Number(item.price) * -1,
                  );
                } else {
                  rawTotal = Math.round(
                    Number(item.shares) * Number(item.price),
                  );
                }
                return (
                  <Table.Row
                    key={item.id || `${key}-${idx}`}
                    onClick={() =>
                      dispatch({
                        type: "OPEN_EDIT",
                        payload: { row: item },
                      })
                    }
                  >
                    <Table.Cell>{item.name || item.stock_id}</Table.Cell>
                    <Table.Cell>
                      <Label basic color={isBuy ? "red" : "green"}>
                        {isBuy ? "買" : "賣"}
                      </Label>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      {Number(item.shares).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      {Number(item.price).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      {rawTotal.toLocaleString()}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5" textAlign="right">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                  >
                    <span>合計</span>
                    <span>{group.total.toLocaleString()}</span>
                  </div>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Fragment>
      ))}
    </>
  );
}
