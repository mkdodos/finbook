import React from "react";
import { Table, Button, Card, Icon } from "semantic-ui-react";
import "./PhoneView.css";

export default function PhoneView({ state, dispatch }) {
  const list = state.data ?? [];

  return (
    <>
      {/* 1. 桌機版顯示（寬螢幕維持傳統表格） */}
      <div className="desktop-only">
        <Table celled selectable unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>消費日</Table.HeaderCell>
              <Table.HeaderCell>品名</Table.HeaderCell>
              <Table.HeaderCell>類別代碼</Table.HeaderCell>
              <Table.HeaderCell>類別名稱</Table.HeaderCell>
              <Table.HeaderCell>金額</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">操作</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {list.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.spend_date}</Table.Cell>
                <Table.Cell>{item.note}</Table.Cell>
                <Table.Cell>{item.category_id}</Table.Cell>
                <Table.Cell>{item.cate_name}</Table.Cell>
                <Table.Cell>${item.amount}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Button
                    compact
                    basic
                    color="blue"
                    onClick={() =>
                      dispatch({
                        type: "OPEN_EDIT",
                        payload: { row: item },
                      })
                    }
                  >
                    編輯
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* 2. 手機版顯示（卡片設計：把品名、金額、編輯按鈕放在同一列） */}
      <div className="mobile-only">
        {list.map((item) => (
          <Card key={item.id} fluid style={{ marginBottom: "10px" }}>
            <Card.Content style={{ padding: "12px" }}>
              {/* 第一行：品名與編輯按鈕在同一列 */}
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
                  {item.note || ""}
                </span>
              </div>

              {/* 第二行：金額與日期、類別資訊 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <span style={{ color: "#666", fontSize: "0.9em" }}>
                  {[item.spend_date, item.cate_name]
                    .filter(Boolean)
                    .join(" · ")}
                  {/* {item.spend_date} · {item.cate_name} */}
                </span>
                <span
                  style={{
                    color: "#2391FF",

                    fontSize: "1.1em",
                    fontWeight: "bold",
                  }}
                >
                  ${item.amount}
                </span>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </>
  );
}
