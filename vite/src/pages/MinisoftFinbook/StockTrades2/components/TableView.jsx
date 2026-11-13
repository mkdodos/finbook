import React from "react";
import {
  Table,
  Container,
  Header,
  Loader,
  Segment,
  Button,
  Icon,
  Input,
  Label,
} from "semantic-ui-react";
import { columns } from "../data/columns";

export default function TableView({ data, loading, handleEdit, handleAdd }) {
  // 核心轉換函式：根據 col 的設定與資料值轉出對應文字
  // const renderCellContent = (item, col) => {
  //   const value = item[col.field];

  //   // 如果該欄位有定義 options（例如 select 類型），則嘗試找出對應的 text
  //   if (col.options && Array.isArray(col.options)) {
  //     const matchedOption = col.options.find((opt) => opt.value === value);
  //     return matchedOption ? matchedOption.text : value; // 找不到就退回顯示原始 value
  //   }

  //   return value;
  // };
  // const renderCellContent = (item, col) => {
  //   const value = item[col.field];

  //   // 1. 如果 columns 設定裡有提供客製化的 render 函式，直接呼叫它
  //   if (typeof col.render === "function") {
  //     return col.render(value, item);
  //   }

  //   // 2. 預設的 options 轉換邏輯
  //   if (col.options && Array.isArray(col.options)) {
  //     const matched = col.options.find((opt) => opt.value === value);
  //     return matched ? matched.text : value;
  //   }

  //   return value;
  // };
  // 渲染儲存格內容的函式
  const renderCellContent = (item, col) => {
    const value = item[col.field];

    // 針對 trade_type 欄位特別處理：顯示為 Label 標籤
    if (col.field === "trade_type") {
      const isBuy = value === "buy";

      // 找出 options 對應的中文文字（例如 "買入" 或對應簡寫 "買"）
      const matched = col.options?.find((opt) => opt.value === value);
      const text = matched ? matched.text : value;

      return (
        <Label
          basic
          // color={isBuy ? "#FF6082" : "green"}
          // 31AAA9 21ba45
          style={{
            borderColor: isBuy ? "#FF6082" : "#21ba45",
            color: isBuy ? "#FF6082" : "#21ba45",
          }}
        >
          {text}
        </Label>
      );
    }

    // 其他一般欄位
    if (col.options) {
      const matched = col.options.find((opt) => opt.value === value);
      return matched ? matched.text : value;
    }

    return value;
  };

  return (
    <div>
      {loading ? (
        <Segment basic style={{ minHeight: "150px" }}>
          <Loader active inline="centered">
            載入戰績資料中...
          </Loader>
        </Segment>
      ) : (
        <Table celled striped selectable unstackable>
          <Table.Header>
            <Table.Row>
              {columns.map((col) => {
                return (
                  <Table.HeaderCell key={col.field}>
                    {col.label}
                  </Table.HeaderCell>
                );
              })}

              <Table.HeaderCell
              // textAlign="center"
              //  style={{ width: "100px" }}
              >
                <Button primary icon onClick={handleAdd} type="button">
                  <Icon name="add" />
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.length > 0 ? (
              data.map((item) => (
                <Table.Row key={item.id}>
                  {columns.map((col) => {
                    return (
                      <Table.Cell key={col.field}>
                        {/* 透過共用函式渲染特定欄位格式 */}
                        {renderCellContent(item, col)}
                        {/* {item[col.field]} */}
                      </Table.Cell>
                    );
                  })}

                  <Table.Cell>
                    {/* 編輯按鈕 */}
                    <Button
                      // color="yellow"
                      icon
                      onClick={() => handleEdit(item)}
                      title="編輯"
                      // style={{ marginRight: "5px" }}
                    >
                      <Icon name="pencil" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="5" textAlign="center">
                  目前沒有任何戰績紀錄
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
