export const tables = [
  {
    tableName: "receipt_records",
    columns: [
      { key: "item_name", label: "品名", type: "text" },
      { key: "amount", label: "金額", type: "text" },
      {
        key: "quantity",
        label: "數量",
        type: "email",
        render: (row) => {
          const isBuy = row.trade_type === "buy";
          return React.createElement(
            Label,
            {
              color: row.quantity > 1 ? "red" : "green",
              basic: true,
              size: "medium",
            },
            row.quantity,
          );
        },
      },
    ],
  },
  {
    tableName: "employees",
    columns: [
      { key: "name", label: "品名", type: "text" },
      { key: "title", label: "金額", type: "text" },
      {
        key: "quantity",
        label: "數量",
        type: "email",
        render: (row) => {
          const isBuy = row.trade_type === "buy";
          return React.createElement(
            Label,
            {
              color: row.quantity > 1 ? "red" : "green",
              basic: true,
              size: "medium",
            },
            row.quantity,
          );
        },
      },
    ],
  },
];
