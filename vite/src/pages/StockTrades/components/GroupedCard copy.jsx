import React, { useState } from "react";
import { Card, Table, Label, Input } from "semantic-ui-react";

const GroupedCard = ({ data }) => {
  // 加上防呆，若 data 為空或尚未載入則直接回傳 null 或載入狀態
  if (!data) return null; // 或 return <div>載入中...</div>;

  // data 依股票代碼名稱群組
  console.log(data);

  // 現價
  const [currentPrice, setCurrentPrice] = useState(3390);

  return (
    <Card.Group stackable itemsPerRow={1}>
      {Object.entries(data).map(([key, trades]) => {
        // 從第一筆資料取得股票名稱與代碼（方便卡片標題顯示）
        const stockName = trades[0]?.name || "";
        const stockId = trades[0]?.stock_id || key;
        console.log(trades);
        const groupTotal = trades.reduce((acc, item) => {
          const single =
            item.trade_type == "buy" ? item.price * -1 : item.price;
          return acc + Math.round(Number(single * item.shares));
        }, 0);

        // 買進時計算均價

        // 確保 trades 是按照日期「由舊到新」排序
        // 複製一份陣列並翻轉，確保是由舊到新（從 10-06 開始算到 11-10）
        // const sortedTrades = trades.slice().reverse();
        let totalQty = 0; // 目前剩餘股數
        let totalCost = 0; // 目前剩餘總成本

        trades.forEach((item) => {
          const price = Number(item.price);
          const qty = Number(item.shares);

          if (item.trade_type === "buy") {
            totalQty += qty;
            totalCost += price * qty;
          } else if (item.trade_type === "sell") {
            if (totalQty > 0) {
              const avgPrice = totalCost / totalQty; // 當下均價
              totalQty -= qty;
              totalCost -= avgPrice * qty; // 依當下均價扣除成本
            }
          }
        });

        // 最終目前的庫存均價
        const currentAvgPrice =
          totalQty > 0 ? Math.round(totalCost / totalQty) : 0;

        // 賣出時計算損益

        const groupShares = trades.reduce((acc, item) => {
          const amt = item.trade_type == "buy" ? item.shares : item.shares * -1;
          return acc + Number(amt);
        }, 0);
        return (
          <Card key={key} fluid color="blue">
            <Card.Content>
              <Card.Header
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px", // 自動處理間隔，不需要再設定 marginLeft
                }}
              >
                <Label color="teal" style={{ margin: 0 }}>
                  {stockId}
                </Label>
                <span>{stockName}</span>
              </Card.Header>
              <Card.Content>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "10px",
                  }}
                >
                  {/* 標籤與輸入框群組 */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Label style={{ margin: 0, whiteSpace: "nowrap" }}>
                      現價
                    </Label>
                    <Input
                      size="small"
                      type="number"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(e.target.value)}
                      style={{ width: "120px" }}
                    />
                  </div>

                  {/* 損益顯示（加上 Number 確保數值正確計算，並加上顏色區分正負） */}
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    損益：
                    <span
                      style={{
                        color:
                          Number(groupTotal) +
                            Number(currentPrice || 0) * Number(groupShares) >=
                          0
                            ? "#52c41a"
                            : "#ff4d4f",
                        marginLeft: "4px",
                      }}
                    >
                      {Number(groupTotal) +
                        Number(currentPrice || 0) * Number(groupShares)}
                    </span>
                  </span>
                </div>
              </Card.Content>

              <Card.Description style={{ marginTop: "15px" }}>
                <Table compact unstackable basic="very">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>日期</Table.HeaderCell>
                      <Table.HeaderCell>類型</Table.HeaderCell>
                      <Table.HeaderCell>{groupShares}股</Table.HeaderCell>
                      <Table.HeaderCell>
                        均價
                        {currentAvgPrice}
                        {/* {Math.round(groupTotal / groupShares) * -1} */}
                      </Table.HeaderCell>
                      <Table.HeaderCell>{groupTotal}</Table.HeaderCell>
                      {/* <Table.HeaderCell>備註</Table.HeaderCell> */}
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {trades.map((item) => {
                      const isBuy = item.trade_type === "buy";

                      // ✅ 先四捨五入再轉千分位
                      const rawTotal = Math.round(
                        Number(item.shares) * Number(item.price),
                      );
                      const totalAmount = (
                        isNaN(rawTotal) ? 0 : rawTotal
                      ).toLocaleString();

                      return (
                        <Table.Row key={item.id}>
                          <Table.Cell>
                            {item.trade_date.substring(5, 10)}
                          </Table.Cell>
                          <Table.Cell>
                            <Label basic color={isBuy ? "red" : "green"}>
                              {isBuy ? "買" : "賣"}
                            </Label>
                          </Table.Cell>
                          <Table.Cell>{item.shares}</Table.Cell>
                          <Table.Cell>{item.price}</Table.Cell>
                          <Table.Cell>
                            {isBuy && "-"}
                            {totalAmount}
                          </Table.Cell>
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
