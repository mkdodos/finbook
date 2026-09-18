import React from "react";
import { Card, Table, Label, Header } from "semantic-ui-react";

const GroupedCardByDate = ({ data }) => {
  if (!data) return null;

  return (
    <Card.Group stackable itemsPerRow={1}>
      {Object.entries(data).map(([key, trades]) => {
        // 計算該日期的總金額合計
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
                    {trades.map((item) => {
                      const isBuy = item.trade_type === "buy";

                      const rawTotal = Math.round(
                        Number(item.shares) * Number(item.price),
                      );
                      const totalAmount = (
                        isNaN(rawTotal) ? 0 : rawTotal
                      ).toLocaleString();

                      return (
                        <Table.Row key={item.id}>
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

                  {/* ✅ 加入 Table.Footer 顯示群組合計 */}
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
