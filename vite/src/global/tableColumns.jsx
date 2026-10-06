import React from "react"; // 👈 必須引入
import { Label } from "semantic-ui-react";

export const tables = {
  receipt_records: [
    { key: "created_at", label: "created_at", type: "date" },
    { key: "item_name", label: "品名", type: "text" },
    { key: "amount", label: "金額", type: "text" },
    {
      key: "quantity",
      label: "數量",
      type: "number",
      // render: (row) => {
      //   return (
      //     <Label basic color={row.quantity > 1 ? "red" : "green"} size="medium">
      //       {row.quantity ?? "無資料"}
      //     </Label>
      //   );
      // },
    },
  ],

  notes: [
    { key: "date", label: "date", type: "date" },
    { key: "category", label: "category", type: "text" },
    { key: "title", label: "title", type: "text" },
  ],
  employees: [
    { key: "name", label: "姓名", type: "text" },
    { key: "title", label: "職稱", type: "text" },
  ],
  costco: [
    // { key: "item_code", label: "品名", type: "text" },
    { key: "created_at", label: "created_at", type: "date" },
    { key: "name", label: "品名", type: "text" },
    // { key: "quantity", label: "quantity", type: "number" },

    { key: "price", label: "price", type: "number" },
  ],
  expense: [
    { key: "transaction_date", label: "transaction_date", type: "date" },
    { key: "note", label: "note", type: "text" },
    { key: "amount", label: "金額", type: "number" },
  ],
};
