import React, { useState } from "react";
import {
  Card,
  Table,
  Label,
  Input,
  Segment,
  Statistic,
} from "semantic-ui-react";

const GroupedCard = ({ data }) => {
  if (!data) return null;

  const [currentPrice, setCurrentPrice] = useState(3390);

  return (
    <Card.Group stackable itemsPerRow={1}>
      {Object.entries(data).map(([key, trades]) => {
        const stockName = trades[0]?.name || "";
        const stockId = trades[0]?.stock_id || key;

        let runQty = 0;
        let runCost = 0;
        let totalPnL = 0;

        let currentNet = 0; // 當下累積淨投入
        let maxInvested = 0; // 最大淨投入本金

        const calculatedTrades = trades.map((item) => {
          const amount = Number(item.price) * Number(item.shares);

          if (item.trade_type === "buy") {
            currentNet -= amount; // 買進，錢減少 (負數增加)
          } else {
            currentNet += amount; // 賣出，錢回收 (負數減少)
          }

          // 記錄歷史上「負得最多」的數值 (取絕對值或直接記錄最小值)
          if (currentNet < maxInvested) {
            maxInvested = currentNet;
          }

          const price = Number(item.price);
          const qty = Number(item.shares);
          const isBuy = item.trade_type === "buy";

          let runningAvg = 0;
          let realizedPnL = null;

          if (isBuy) {
            runQty += qty;
            runCost += price * qty;
            runningAvg = runQty > 0 ? runCost / runQty : 0;
          } else {
            if (runQty > 0) {
              const currentAvg = runCost / runQty;
              realizedPnL = Math.round((price - currentAvg) * qty);
              totalPnL += realizedPnL;

              runQty -= qty;
              runCost -= currentAvg * qty;
              runningAvg = runQty > 0 ? runCost / runQty : 0;
            }
          }

          return {
            ...item,
            runningAvg: Math.round(runningAvg),
            realizedPnL,
          };
        });

        // 判斷損益顏色（大於等於0顯示綠色，小於0顯示紅色）
        const isProfit = Number(totalPnL) >= 0;

        // 最大淨投入本金 (轉為正數)
        const maxCapital = Math.abs(maxInvested);

        const groupShares = trades.reduce((acc, item) => {
          const amt =
            item.trade_type === "buy" ? item.shares : item.shares * -1;
          return acc + Number(amt);
        }, 0);

        const groupTotal = trades.reduce((acc, item) => {
          const single =
            item.trade_type === "buy" ? item.price * -1 : item.price;
          return acc + Math.round(Number(single * item.shares));
        }, 0);

        const currentAvgPrice = runQty > 0 ? Math.round(runCost / runQty) : 0;

        return (
          <Card key={key} fluid color="blue">
            <Card.Content>
              <Card.Header
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Label color="teal" style={{ margin: 0 }}>
                  {stockId}
                </Label>
                <span>{stockName}</span>
                <Segment
                  raised
                  style={{
                    padding: "16px",
                    background: "#fafafa",
                    borderRadius: "8px",
                    boxShadow: "none", // 移除陰影
                    border: "1px solid #e0e0e0", // 改用細邊框
                  }}
                  // style={{
                  //   padding: "16px",
                  //   background: "#fafafa",
                  //   borderRadius: "8px",
                  // }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    {/* 最大淨投入本金 */}
                    <Statistic size="mini" style={{ margin: 0 }}>
                      <Statistic.Value
                        style={{ fontSize: "18px", color: "#333" }}
                      >
                        ${Number(maxCapital || 0).toLocaleString()}
                      </Statistic.Value>
                      <Statistic.Label
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "4px",
                        }}
                      >
                        最大淨投入本金
                      </Statistic.Label>
                    </Statistic>

                    {/* 淨投入現金 */}
                    <Statistic size="mini" style={{ margin: 0 }}>
                      <Statistic.Value
                        style={{ fontSize: "18px", color: "#333" }}
                      >
                        ${Number(groupTotal || 0).toLocaleString()}
                      </Statistic.Value>
                      <Statistic.Label
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "4px",
                        }}
                      >
                        淨投入現金
                      </Statistic.Label>
                    </Statistic>

                    {/* 售出損益（動態色彩） */}
                    <Statistic size="mini" style={{ margin: 0 }}>
                      <Statistic.Value
                        style={{
                          fontSize: "18px",
                          color: isProfit ? "#52c41a" : "#ff4d4f",
                        }}
                      >
                        {isProfit ? "+" : ""}
                        {Number(totalPnL || 0).toLocaleString()}
                      </Statistic.Value>
                      <Statistic.Label
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "4px",
                        }}
                      >
                        已實現損益
                      </Statistic.Label>
                    </Statistic>
                  </div>
                </Segment>
                {/* <span>
                  最大淨投入本金{maxCapital}
                  淨投入現金{groupTotal}(售出損益{totalPnL})
                </span> */}
                <span></span>
              </Card.Header>

              {/* <Card.Content>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "10px",
                  }}
                >
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

                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    未實現損益：
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
                      {(
                        Number(groupTotal) +
                        Number(currentPrice || 0) * Number(groupShares)
                      ).toLocaleString()}
                    </span>
                  </span>
                </div>
              </Card.Content> */}

              <Card.Description style={{ marginTop: "15px" }}>
                <Table compact unstackable basic="very">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>日期</Table.HeaderCell>
                      <Table.HeaderCell>類型</Table.HeaderCell>
                      <Table.HeaderCell>{groupShares} 股</Table.HeaderCell>
                      <Table.HeaderCell>成交價</Table.HeaderCell>
                      <Table.HeaderCell>
                        {/* 當時均價 ({currentAvgPrice}) */}
                        均價
                      </Table.HeaderCell>
                      <Table.HeaderCell>當筆損益/金額</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {calculatedTrades.map((item) => {
                      const isBuy = item.trade_type === "buy";
                      const rawTotal = Math.round(
                        Number(item.shares) * Number(item.price),
                      );
                      const totalAmount = isNaN(rawTotal)
                        ? "0"
                        : rawTotal.toLocaleString();

                      return (
                        <Table.Row key={item.id}>
                          <Table.Cell>
                            {item.trade_date
                              ? item.trade_date.substring(5, 10)
                              : ""}
                          </Table.Cell>
                          <Table.Cell>
                            <Label basic color={isBuy ? "red" : "green"}>
                              {isBuy ? "買" : "賣"}
                            </Label>
                          </Table.Cell>
                          <Table.Cell>{item.shares}</Table.Cell>
                          <Table.Cell>
                            {Number(item.price).toLocaleString()}
                          </Table.Cell>

                          {/* 當時均價防呆 */}
                          <Table.Cell style={{ color: "#8c8c8c" }}>
                            {item.runningAvg != null
                              ? item.runningAvg.toLocaleString()
                              : "0"}
                          </Table.Cell>

                          {/* 當筆損益/金額防呆 */}
                          <Table.Cell
                            style={{
                              color: isBuy
                                ? "inherit"
                                : (item.realizedPnL ?? 0) >= 0
                                  ? "#52c41a"
                                  : "#ff4d4f",
                              fontWeight: isBuy ? "normal" : "bold",
                            }}
                          >
                            {isBuy
                              ? `-${totalAmount}`
                              : item.realizedPnL != null
                                ? `${item.realizedPnL > 0 ? "+" : ""}${item.realizedPnL.toLocaleString()}`
                                : "-"}
                          </Table.Cell>
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
