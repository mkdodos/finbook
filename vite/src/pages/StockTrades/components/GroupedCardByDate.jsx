import React, { Fragment, useEffect, useState } from "react";
import { Table, Label, Divider, Header, Icon } from "semantic-ui-react";
import { Api } from "../data/api";

const GroupedCardByDate = ({ data, dispatch }) => {
  const [monthSum, setMonthSum] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchApiData = async () => {
      try {
        const resData = await Api.readMonthSum();
        if (isMounted && resData) {
          setMonthSum(resData);
        }
      } catch (err) {
        console.error("Fetch month sum error:", err);
      }
    };

    fetchApiData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!data) return null;

  return (
    <>
      {/* 1. 月統計表格 */}
      <Table celled unstackable striped compact align="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">年月</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">買進總額</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">賣出總額</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">淨收支</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {monthSum && monthSum.length > 0 ? (
            monthSum.map((item) => {
              const buyAmt = Math.round(Number(item.buy_amt || 0));
              const sellAmt = Math.round(Number(item.sell_amt || 0));

              // 改為 sellAmt - buyAmt (現金淨收支)
              const netAmt =
                item.net_amt !== undefined && item.net_amt !== null
                  ? Math.round(Number(item.net_amt))
                  : sellAmt - buyAmt;

              return (
                <Table.Row key={item.ym}>
                  <Table.Cell textAlign="center">
                    <strong>{item.ym}</strong>
                  </Table.Cell>
                  <Table.Cell
                    textAlign="right"
                    style={{ fontWeight: "bold", color: "#d9534f" }}
                  >
                    {buyAmt.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell
                    textAlign="right"
                    style={{ fontWeight: "bold", color: "#5cb85c" }}
                  >
                    {sellAmt.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell
                    textAlign="right"
                    style={{
                      fontWeight: "bold",
                      color: netAmt >= 0 ? "#5cb85c" : "#d9534f",
                    }}
                  >
                    {netAmt.toLocaleString()}
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell colSpan="4" textAlign="center">
                暫無月統計資料
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {/* 2. 每日明細表格 */}
      {Object.entries(data).map(([key, trades]) => {
        // 日合計
        const groupTotal = trades.reduce((sum, item) => {
          const isBuy = item.trade_type === "buy";
          const rawTotal = Math.round(Number(item.shares) * Number(item.price));
          // 依買或賣,做加或減
          if (isBuy) return sum - (isNaN(rawTotal) ? 0 : rawTotal);
          return sum + (isNaN(rawTotal) ? 0 : rawTotal);
        }, 0);

        return (
          <Fragment key={key}>
            <Divider horizontal>
              <Header as="h4">
                {/* <Icon name="tag" /> */}
                {key}
              </Header>
            </Divider>
            <Table key={key} compact unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell textAlign="right"></Table.HeaderCell>
                  <Table.HeaderCell textAlign="right"></Table.HeaderCell>
                  <Table.HeaderCell textAlign="right">
                    {/* ${groupTotal.toLocaleString()} */}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {trades.map((item, idx) => {
                  const isBuy = item.trade_type === "buy";
                  // const rawTotal = Math.round(
                  //   Number(item.shares) * Number(item.price),
                  // );

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

                  const totalAmount = (
                    isNaN(rawTotal) ? 0 : rawTotal
                  ).toLocaleString();

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
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>
                        <Label basic color={isBuy ? "red" : "green"}>
                          {isBuy ? "買" : "賣"}
                        </Label>
                      </Table.Cell>
                      <Table.Cell textAlign="right">{item.shares}</Table.Cell>
                      <Table.Cell textAlign="right">{item.price}</Table.Cell>
                      <Table.Cell
                        textAlign="right"
                        // style={{
                        //   fontWeight: "bold",
                        //   color: isBuy ? "#DB2828" : "#21BA45",
                        // }}
                      >
                        {totalAmount}
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
                      <span>{groupTotal.toLocaleString()}</span>
                    </div>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Fragment>
        );
      })}
    </>
  );
};

export default GroupedCardByDate;
