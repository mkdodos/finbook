import React, { useEffect, useState, useReducer } from "react";
import { initialState, reducer } from "./data/reducer";
import { Api } from "./data/api";
// import SearchBar from "./components/SearchBar";
import TableView from "./components/TableView";
import EditForm from "./components/EditForm";
import { Button } from "semantic-ui-react";
// import data from "./data/data.json";

export default function index() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchApiData = async (searchParams) => {
    // console.log(searchParams);
    // 1. 開始載入 (轉圈圈)
    dispatch({ type: "FETCH_START" });

    try {
      // 2. 向後端 API 發送查詢請求 (帶入排程日與關鍵字)
      const data = await Api.fetchList(searchParams);

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
    // 初始化載入
    // const initData = async () => {
    //   try {
    //     const data = await Api.fetchList();
    //     dispatch({ type: "LOAD_SUCCESS", payload: { data } });
    //   } catch (error) {
    //     console.error("載入報價單失敗:", error);
    //   }
    // };
    // initData();
  }, []);

  return (
    <div>
      <Button onClick={() => dispatch({ type: "OPEN_FORM" })}>新增</Button>
      {/* <SearchBar state={state} dispatch={dispatch} onSearch={fetchApiData} /> */}
      <TableView state={state} dispatch={dispatch} />
      <EditForm state={state} dispatch={dispatch} />
    </div>
  );
}
