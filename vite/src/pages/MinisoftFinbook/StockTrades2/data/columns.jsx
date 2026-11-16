import { Label } from "semantic-ui-react";
import React from "react";
import { readStocks } from "./api";
export const columns = [
  {
    field: "id",
    label: "編號",
    type: "number",
    required: true,
    primaryKey: true,
    autoIncrement: true,
    tableShow: true,
    formShow: false,
  },
  {
    field: "trade_date",
    label: "日期",
    type: "date",
    required: true,
    tableShow: true,
    formShow: true,
    searchShow: true,
  },
  {
    field: "stock_id",
    label: "代號",
    type: "select",
    options: await readStocks(),
    tableShow: true,
    formShow: true,
    searchShow: true,
  },
  {
    field: "stock_name",
    label: "名稱",
    type: "text",
    tableShow: true,
    formShow: false,
  },
  {
    field: "trade_type",
    label: "類型",
    type: "select",
    required: true,
    options: [
      {
        value: "buy",
        text: "買入",
        style: { color: "#db2828", fontWeight: "bold" },
      },
      {
        value: "sell",
        text: "賣出",
        style: { color: "#21ba45", fontWeight: "bold" },
      },
      { value: "dividend", text: "配息" },
    ],
    tableShow: true,
    formShow: true,
    render: (value, row) => {
      const isBuy = value === "buy";
      return (
        <Label basic color={isBuy ? "red" : "green"}>
          {isBuy ? "買" : "賣"}
        </Label>
      );
    },
  },
  {
    field: "qty",
    label: "股數",
    type: "number",
    required: true,
    tableShow: true,
    formShow: true,
  },
  {
    field: "price",
    label: "單價",
    type: "decimal",
    required: true,
    // defaultValue: "0.00",
    tableShow: true,
    formShow: true,
    render: (value, row) => {
      // 保留小數點,去掉.00
      return Number(value).toString();
    },
  },

  {
    field: "amt",
    label: "小計",
    tableShow: true,
    render: (value, row) => {
      return (row.qty * row.price).toLocaleString();
    },
  },

  {
    field: "note",
    label: "備註",
    type: "textarea",
    required: false,
    tableShow: false,
    formShow: true,
    searchShow: true,
  },
  // {
  //   field: "created_at",
  //   label: "建立時間",
  //   type: "datetime",
  //   required: false,
  //   tableShow: true,
  //   formShow: false,
  // },
];
