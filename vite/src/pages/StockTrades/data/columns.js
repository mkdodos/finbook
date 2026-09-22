// 根據你專案中 api.js 的實際相對路徑來 import
import { Api } from "../data/api";
import React from "react";
import { Label } from "semantic-ui-react";
export const COLUMNS = [
  { key: "id", title: "id", name: "id", formType: "date", hideInForm: true },
  { key: "trade_date", title: "交易日", name: "trade_date", formType: "date" },
  {
    key: "stock_id",
    title: "代碼",
    name: "stock_id",
    formType: "select",
    // 💡 定義取得該選單 Options 的 API
    fetchOptions: async () => {
      const categories = await Api.getCategories();
      // 注意：Semantic UI React 的 Select options 格式需為 { key, text, value }
      return categories.map((item) => ({
        key: item.id,
        text: `${item.symbol}${item.name}`,
        value: item.symbol,
      }));
    },
  },
  {
    key: "name",
    title: "代碼",
    name: "name",
    formType: "text",
    hideInForm: true,
  },

  {
    key: "trade_type",
    title: "交易類別",
    name: "trade_type",
    formType: "select",
    options: [
      { text: "買進", value: "buy" },
      { text: "賣出", value: "sell" },
    ],
    // 💡 新增 render 函式來呈現分色標籤
    render: (row) => {
      const isBuy = row.trade_type === "buy";
      return React.createElement(
        Label,
        { color: isBuy ? "red" : "green", basic: true, size: "medium" },
        isBuy ? "買進" : "賣出",
      );
    },
  },
  { key: "shares", title: "股數", name: "shares", formType: "number" },
  { key: "price", title: "單價", name: "price", formType: "number" },
  // 新增小計欄位：設定 computed 標記或計算邏輯
  {
    key: "total_amount",
    title: "小計",
    formType: "number",
    hideInForm: true, // 👈 表單不顯示小計，只在表格呈現
    render: (row) => Math.round((row.shares || 0) * (row.price || 0)), // 表格中動態計算顯示
  },
  { key: "note", title: "備註", name: "note", formType: "text" },
];
