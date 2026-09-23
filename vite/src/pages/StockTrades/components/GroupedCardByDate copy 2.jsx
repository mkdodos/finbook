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
      {/* 上方：月彙整統計卡片 */}
      <Card fluid color="blue">
        <Card.Content>
          <Card.Header>
            <Header as="h3">月份彙整統計</Header>
          </Card.Header>
          <Card.Description style={{ marginTop: "15px" }}>
            <Table celled striped compact>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>年月</Table.HeaderCell>
                  <Table.HeaderCell>類型</Table.HeaderCell>
                  {/* <Table.HeaderCell>總筆數</Table.HeaderCell> */}
                  {/* <Table.HeaderCell>總股數</Table.HeaderCell> */}
                  <Table.HeaderCell>總金額</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {monthSum && monthSum.length > 0 ? (
                  monthSum.map((item) => {
                    const isBuy = item.trade_type === "buy";
                    const totalAmt = Number(
                      item.total_amt || 0,
                    ).toLocaleString();

                    return (
                      <Table.Row key={`${item.ym}-${item.trade_type}`}>
                        <Table.Cell>{item.ym}</Table.Cell>
                        <Table.Cell>
                          <Label basic color={isBuy ? "red" : "green"}>
                            {isBuy ? "買進" : "賣出"}
                          </Label>
                        </Table.Cell>
                        {/* <Table.Cell>{item.total_cnt ?? 0}</Table.Cell> */}
                        {/* <Table.Cell>{item.total_shares ?? 0}</Table.Cell> */}
                        <Table.Cell>{totalAmt}</Table.Cell>
                      </Table.Row>
                    );
                  })
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan="5" textAlign="center">
                      暫無月統計資料
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Card.Description>
        </Card.Content>
      </Card>

      {/* 下方：每日明細卡片 */}
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
                <Table celled striped compact>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>名稱</Table.HeaderCell>
                      <Table.HeaderCell>類型</Table.HeaderCell>
                      <Table.HeaderCell>股數</Table.HeaderCell>
                      <Table.HeaderCell>單價</Table.HeaderCell>
                      <Table.HeaderCell>總金額</Table.HeaderCell>
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
                          <Table.Cell>{item.shares}</Table.Cell>
                          <Table.Cell>{item.price}</Table.Cell>
                          <Table.Cell>{totalAmount}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>

                  <Table.Footer>
                    <Table.Row>
                      <Table.HeaderCell colSpan="4" textAlign="right">
                        <strong>當日合計</strong>
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        <strong>{groupTotal.toLocaleString()}</strong>
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
