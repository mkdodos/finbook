import React, { useReducer, useEffect, useState } from "react";
import CRUDTemplate from "./CURD/CRUDTemplate";
import { API_HOST } from "@/global/constants";
import { tables } from "@/global/tableColumns";
// const API_URL = `${API_HOST}/api.php?table=receipt_records`;

import { Button, Input } from "semantic-ui-react";

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
  // const urlParams = new URLSearchParams(API_URL.split("?")[1]);
  // const currentTableName = urlParams.get("table"); // 取得 "employees"

  // 2. 從 tables 中找出匹配 tableName 的物件
  // const targetTable = tables.find(
  //   (item) => item.tableName === currentTableName,
  // );

  // 3. 取得 columns（若找不到則預設為空陣列 []）
  // const columns = targetTable ? targetTable.columns : [];
  // const [table, setTable] = useState("receipt_records");

  const [searchTerm, setSearchTerm] = useState("receipt_records"); // 輸入框暫存值
  const [table, setTable] = useState("receipt_records"); // 真正的資料表名稱

  const handleInputChange = (e, { value }) => {
    setSearchTerm(value);
  };

  const handleSearch = () => {
    setTable(searchTerm); // 按下按鈕時才更新 table 並觸發 useEffect
  };

  // const columns = table ? table.columns : [];
  const columns = tables[table] || [];
  const API_URL = `${API_HOST}/api.php?table=${table}`;
  // const API_URL = `${API_HOST}/api.php?table=employees`;

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
    console.log(API_URL);
    fetchData();
  }, [table]);

  return (
    <div>
      <div>
        {/* {table} */}
        <Input
          onChange={handleInputChange}
          type="text"
          placeholder="請輸入關鍵字..."
          action={
            <Button
              color="teal"
              icon="search"
              content="查詢"
              onClick={handleSearch} // 👈 在這裡加入 onClick 事件處理函式
            />
          }
        />
        {/* 直接加上 style margin */}
        {/* <Input placeholder="請輸入關鍵字..." style={{ marginRight: "8px" }} /> */}
        {/* <Button primary>查詢</Button> */}

        {/* 若專案中有使用 Tailwind CSS */}
        {/* <Input placeholder="請輸入..." className="mr-2" /> */}
      </div>
      {/* <Input />
      <Button>查詢</Button> */}
      <CRUDTemplate columns={columns} data={state.items} />
    </div>
  );
}
