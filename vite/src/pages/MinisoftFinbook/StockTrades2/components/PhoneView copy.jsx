import React from "react";
import { Card } from "semantic-ui-react";

export default function PhoneView({ data = [] }) {
  return (
    <div>
      {data.map((item) => (
        <Card key={item.id} fluid style={{ marginBottom: "10px" }}>
          <Card.Content style={{ padding: "12px" }}>
            {/* 第一行 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: "32px", // 確保沒文字時也能維持按鈕高度的空間
              }}
              onClick={() =>
                dispatch({
                  type: "OPEN_EDIT",
                  payload: { row: item },
                })
              }
            >
              <span style={{ fontSize: "1.1em", fontWeight: "bold" }}>
                {item.stock_name || ""}
              </span>
            </div>

            {/* 第二行 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <span style={{ color: "#666", fontSize: "0.9em" }}>
                {item.trade_date}
              </span>
              {/* 包裝第 2、3 項的容器（靠右對齊並保持橫向排列） */}
              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                {/* 第 2 項：價格 */}
                <span
                  style={{
                    // color: "#2391FF",
                    fontSize: "1.1em",
                    fontWeight: "bold",
                  }}
                >
                  {Number(item.qty)} 股
                </span>
                <span
                  style={{
                    color: "#2391FF",
                    fontSize: "1.1em",
                    fontWeight: "bold",
                  }}
                >
                  ${Number(item.price).toLocaleString()}
                </span>

                {/* 第 3 項：股數 */}
              </div>
              {/* <span
                style={{
                  color: "#2391FF",
                  fontSize: "1.1em",
                  fontWeight: "bold",
                }}
              >
                ${Number(item.price).toLocaleString()}
              </span>
              <span
                style={{
                  color: "#2391FF",

                  fontSize: "1.1em",
                  fontWeight: "bold",
                }}
              >
                {Number(item.qty)} 股
              </span> */}
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
}
