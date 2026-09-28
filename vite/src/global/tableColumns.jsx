import React from "react"; // 👈 必須引入
import { Label } from "semantic-ui-react";

export const tables = {
  receipt_records: [
    { key: "item_name", label: "品名", type: "text" },
    { key: "amount", label: "金額", type: "text" },
    {
      key: "quantity",
      label: "數量123",
      type: "number",
      render: (row) => {
        return (
          <Label color={row.quantity > 1 ? "red" : "green"} size="medium">
            {row.quantity ?? "無資料"}
          </Label>
        );
      },
      // render: (row) => (
      //   <Label color="red" basic size="medium">
      //     {row.quantity ?? 0}
      //   </Label>
      // ),
      // render: (row) => {
      //   return React.createElement(
      //     Label,
      //     {
      //       // color: row.quantity > 1 ? "red" : "green",
      //       color: "red",
      //       basic: true,
      //       size: "medium",
      //     },
      //     row.quantity,
      //   );
      // },
    },
  ],

  employees: [
    { key: "name", label: "姓名", type: "text" },
    { key: "title", label: "職稱", type: "text" },
  ],
};
