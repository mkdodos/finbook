// 傳入資料和鍵值，傳回群組資料
export const groupedData = (targetData, key) => {
  return targetData.reduce((acc, item) => {
    let sum = Math.round(Number(item.price * item.qty)) || 0;
    let sumQty = Number(item.qty);
    const groupKey = item[key];
    acc[groupKey] ||= { data: [], total: 0, totalQty: 0 };
    acc[groupKey].data.push(item);
    // 依買賣加減金額
    sum = item.trade_type == "buy" ? sum * -1 : sum;
    sumQty = item.trade_type == "buy" ? sumQty : sumQty * -1;
    acc[groupKey].total += sum;
    acc[groupKey].totalQty += sumQty;
    // 依買賣加減股數

    return acc;
  }, {});
};

import { columns } from "./columns";

export const initialFormData = () => {
  return columns
    .filter((col) => col.formShow)
    .reduce((acc, col) => {
      // 優先檢查 JSON 裡有沒有寫死的 defaultValue
      if (col.defaultValue !== undefined && col.defaultValue !== null) {
        acc[col.field] = col.defaultValue;
      }
      // 如果沒有，但它是日期型別，就自動產生「本地時間」的今天 (YYYY-MM-DD)
      else if (col.type === "date") {
        // acc[col.field] = `${year}-${month}-${day}`;
        acc[col.field] = getTodayDate();
      }
      // 3. 其他型別的預設空值
      else {
        acc[col.field] = "";
        // col.type === "number" || col.type === "decimal" ? 0 : "";
      }

      return acc;
    }, {});
};

export const getTodayDate = () => {
  const now = new Date();
  // 使用本地時間的年月日，避免 UTC 時區誤差
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
