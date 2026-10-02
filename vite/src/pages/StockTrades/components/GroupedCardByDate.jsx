import React, { useEffect, useState } from "react";
import { Card, Table, Label, Header } from "semantic-ui-react";
import { Api } from "../data/api";

const GroupedCardByDate = ({ data }) => {
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
    <Card.Group stackable itemsPerRow={1}>
      {/* 1. 月份統計卡片（買賣在同一列） */}
      <Card fluid color="blue">
        <Card.Content>
          <Card.Header>
            <Header as="h3">月份彙整統計</Header>
          </Card.Header>
          <Card.Description style={{ marginTop: "15px" }}>
            <Table celled unstackable striped compact align="center">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">年月</Table.HeaderCell>
                  <Table.HeaderCell textAlign="right">
                    買進總額
                  </Table.HeaderCell>
                  <Table.HeaderCell textAlign="right">
                    賣出總額
                  </Table.HeaderCell>
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
          </Card.Description>
        </Card.Content>
      </Card>

      {/* 2. 每日明細卡片 */}
      {Object.entries(data).map(([key, trades]) => {
        const groupTotal = trades.reduce((sum, item) => {
          const rawTotal = Math.round(Number(item.shares) * Number(item.price));
          return sum + (isNaN(rawTotal) ? 0 : rawTotal);
        }, 0);

        return (
          <Card key={key} fluid color="blue">
            <Card.Content>
              <Card.Header>
                <Header as="h3">{key}</Header>
              </Card.Header>

              <Card.Description style={{ marginTop: "15px" }}>
                <Table celled striped compact unstackable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>名稱</Table.HeaderCell>
                      <Table.HeaderCell>類型</Table.HeaderCell>
                      <Table.HeaderCell textAlign="right">
                        股數
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="right">
                        單價
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="right">
                        總金額
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {trades.map((item, idx) => {
                      const isBuy = item.trade_type === "buy";
                      const rawTotal = Math.round(
                        Number(item.shares) * Number(item.price),
                      );
                      const totalAmount = (
                        isNaN(rawTotal) ? 0 : rawTotal
                      ).toLocaleString();

                      return (
                        <Table.Row key={item.id || `${key}-${idx}`}>
                          <Table.Cell>{item.name}</Table.Cell>
                          <Table.Cell>
                            <Label basic color={isBuy ? "red" : "green"}>
                              {isBuy ? "買進" : "賣出"}
                            </Label>
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            {item.shares}
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            {item.price}
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            ${totalAmount}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>

                  <Table.Footer>
                    <Table.Row>
                      <Table.HeaderCell colSpan="4" textAlign="right">
                        <strong>當日合計</strong>
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="right">
                        <strong>${groupTotal.toLocaleString()}</strong>
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Footer>
                </Table>
              </Card.Description>
            </Card.Content>
          </Card>
        );
      })}
    </Card.Group>
  );
};

export default GroupedCardByDate;
