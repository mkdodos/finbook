import React from "react";
import { Card, Table, Label, Header } from "semantic-ui-react";

const GroupedCard = ({ data }) => {
  // 加上防呆，若 data 為空或尚未載入則直接回傳 null 或載入狀態
  if (!data) return null; // 或 return <div>載入中...</div>;
  return (
    <Card.Group stackable itemsPerRow={1}>
      {Object.entries(data).map(([key, trades]) => {
        // 從第一筆資料取得股票名稱與代碼（方便卡片標題顯示）
        const stockName = trades[0]?.name || "";
        const stockId = trades[0]?.stock_id || key;

        return (
          <Card key={key} fluid color="blue">
            <Card.Content>
              <Card.Header>
                <Header as="h3">
                  {stockName}
                  <Label
                    color="teal"
                    size="small"
                    style={{ marginLeft: "10px" }}
                  >
                    {stockId}
                  </Label>
                </Header>
              </Card.Header>

              <Card.Description style={{ marginTop: "15px" }}>
                <Table celled striped compact>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>交易日期</Table.HeaderCell>
                      <Table.HeaderCell>類型</Table.HeaderCell>
                      <Table.HeaderCell>股數</Table.HeaderCell>
                      <Table.HeaderCell>單價</Table.HeaderCell>
                      <Table.HeaderCell>總金額</Table.HeaderCell>
                      {/* <Table.HeaderCell>備註</Table.HeaderCell> */}
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {trades.map((item) => {
                      const isBuy = item.trade_type === "buy";
                      //   let totalAmount = (
                      //     Number(item.shares) * Number(item.price)
                      //   ).toLocaleString();
                      //   totalAmount = Math.round(totalAmount);

                      // ✅ 先四捨五入再轉千分位
                      const rawTotal = Math.round(
                        Number(item.shares) * Number(item.price),
                      );
                      const totalAmount = (
                        isNaN(rawTotal) ? 0 : rawTotal
                      ).toLocaleString();

                      return (
                        <Table.Row key={item.id}>
                          <Table.Cell>{item.trade_date}</Table.Cell>
                          <Table.Cell>
                            <Label basic color={isBuy ? "red" : "green"}>
                              {isBuy ? "買進" : "賣出"}
                            </Label>
                          </Table.Cell>
                          <Table.Cell>{item.shares}</Table.Cell>
                          <Table.Cell>{item.price}</Table.Cell>
                          <Table.Cell>{totalAmount}</Table.Cell>
                          {/* <Table.Cell>{item.note || "-"}</Table.Cell> */}
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </Card.Description>
            </Card.Content>
          </Card>
        );
      })}
    </Card.Group>
  );
};

export default GroupedCard;
