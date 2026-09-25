import React, { useReducer, useEffect } from "react";
import CRUDTemplate from "./CURD/CRUDTemplate";
import { API_HOST } from "@/global/constants";
import { tables } from "@/global/tableColumns";
// const API_URL = `${API_HOST}/api.php?table=receipt_records`;
const API_URL = `${API_HOST}/api.php?table=employees`;

import axios from "axios";

const initialState = { items: [] };

function reducer(state, action) {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload };
    case "ADD_ITEM":
      return { ...state, items: [action.payload, ...state.items] };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}

export default function GenericPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // 多型態欄位 (generic schema)
  //   console.log(tables);
  // 取得 tableName 為 'a' 的物件
  //   const tableA = tables.find((item) => item.tableName === "b");

  // 取得 columns (加上選用串連 ?. 避免找不到時報錯)
  //   const columnsA = tableA?.columns;

  // 1. 從 API_URL 中提取 table 參數的值
  const urlParams = new URLSearchParams(API_URL.split("?")[1]);
  const currentTableName = urlParams.get("table"); // 取得 "employees"

  // 2. 從 tables 中找出匹配 tableName 的物件
  const targetTable = tables.find(
    (item) => item.tableName === currentTableName,
  );

  // 3. 取得 columns（若找不到則預設為空陣列 []）
  const columns = targetTable ? targetTable.columns : [];

  // 取得資料列表 (GET)
  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      const dataArray = Array.isArray(res.data) ? res.data : [];
      dispatch({ type: "SET_ITEMS", payload: dataArray });
    } catch (err) {
      console.error("Fetch error:", err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  //   const columns = [
  //     {
  //       key: "a",
  //       label: "A",
  //     },
  //     {
  //       key: "b",
  //       label: "B",
  //     },
  //   ];
  //   const data = [{ a: "abc", b: "ddd" }];
  return (
    <div>
      <CRUDTemplate columns={columns} data={state.items} />
    </div>
  );
}
