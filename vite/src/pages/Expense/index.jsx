import React, { useEffect, useState, useReducer } from "react";
import { initialState, reducer } from "./data/reducer";
import { Api } from "./data/api";

import PhoneView from "./components/PhoneView";
import TableView from "./components/TableView";
import EditForm from "./components/EditForm";
import SearchBar from "./components/SearchBar";
import { Button, Form, Grid, Segment, Header } from "semantic-ui-react";
// import data from "./data/data.json";

export default function index() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 切換手機版
  const [isPhone, setIsPhone] = useState(true);

  // 本月支出
  const [total, setTotal] = useState(0);

  const getThisMonData = (data) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // JavaScript 的月份是 0-11（0 代表 1 月）

    const thisData = data.filter((item) => {
      if (!item.spend_date) return false; // 防呆：若沒有日期則略過

      const itemDate = new Date(item.spend_date);

      return (
        itemDate.getFullYear() === currentYear &&
        itemDate.getMonth() === currentMonth
      );
    });
    return thisData;
  };

  const fetchApiData = async (searchParams) => {
    // console.log(searchParams);
    // 1. 開始載入 (轉圈圈)
    dispatch({ type: "FETCH_START" });

    try {
      // 2. 向後端 API 發送查詢請求 (帶入排程日與關鍵字)
      const data = await Api.fetchList(searchParams);

      // 計算合計
      // const thisData = data.filter(item=>item.date)
      const amt = getThisMonData(data).reduce(
        (acc, item) => acc + Number(item.amount),
        0,
      );

      setTotal(amt);

      // 3. 成功後，將後端傳回的資料放進 reducer 的 state.data 中
      dispatch({
        type: "LOAD_SUCCESS",
        payload: { data }, // 假設後端回傳 array
      });
    } catch (error) {
      console.error("載入資料失敗:", error);
      // 可視需求加入 FETCH_ERROR action 來關閉 loading
    }
  };

  useEffect(() => {
    fetchApiData(state.searchParams);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          width: "100%",
          marginBottom: "15px",
          marginTop: "30px",
        }}
      >
        <div style={{ flex: 1 }}>
          <SearchBar fetchData={fetchApiData} />
        </div>
        <Button
          color="blue"
          style={{ flexShrink: 0, whitespace: "nowrap" }}
          onClick={() => dispatch({ type: "OPEN_FORM" })}
        >
          新增
        </Button>
      </div>

      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
          // justifyContent: "flex-end", // 讓內部元素靠右對齊
        }}
      >
        <span style={{ fontSize: "14px", color: "#666" }}>本月支出</span>
        <span style={{ fontSize: "22px", fontWeight: "700", color: "#ff4d4f" }}>
          ${total.toLocaleString()}
        </span>
      </div>

      {/* <div
        style={{
          marginBottom: "16px",
          padding: "12px 16px",
          backgroundColor: "#fff1f0", // 淡紅色背景營造「支出」的警示/提醒感
          borderRadius: "8px",
          border: "1px solid #ffccc7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "14px", color: "#555", fontWeight: "500" }}>
          本月支出
        </span>
        <span style={{ fontSize: "18px", fontWeight: "700", color: "#ff4d4f" }}>
          {total.toLocaleString()}
        </span>
      </div> */}

      {/* <div
        style={{
          marginBottom: "12px",
          fontSize: "14px",
          color: "#333",
          fontWeight: "500",
        }}
      >
        本月支出：
        <span
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#cf1322",
            marginLeft: "4px",
          }}
        >
          {total}
        </span>
      </div> */}

      {/* <div style={{ marginBottom: "10px" }}>本月支出 : {total}</div> */}
      {isPhone ? (
        <PhoneView state={state} dispatch={dispatch} />
      ) : (
        <TableView state={state} dispatch={dispatch} />
      )}

      <EditForm state={state} dispatch={dispatch} />
    </>
  );
}
