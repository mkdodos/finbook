import React, { useEffect, useState, useReducer } from "react";
import { initialState, reducer } from "./data/reducer";
import { Api } from "./data/api";
// import SearchBar from "./components/SearchBar";
import TableView from "./components/TableView";
import EditForm from "./components/EditForm";
import SearchBar from "./components/SearchBar";
import GroupedCard from "./components/GroupedCard";
import GroupedCardByDate from "./components/GroupedCardByDate";
import { Button } from "semantic-ui-react";
// import data from "./data/data.json";

import { Tab } from "semantic-ui-react";

import { COLUMNS } from "./data/columns";

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
    console.log(state.groupedData);
  }, []);

  const panes = [
    {
      menuItem: "日期分組",
      render: () => (
        <Tab.Pane>
          {" "}
          <GroupedCardByDate data={state.groupedDataByDate} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "交易記錄",
      render: () => (
        <Tab.Pane>
          {" "}
          <TableView state={state} dispatch={dispatch} columns={COLUMNS} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "股票分組",
      render: () => (
        <Tab.Pane>
          {" "}
          <GroupedCard data={state.groupedData} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div>
      <SearchBar
        state={state}
        dispatch={dispatch}
        columns={COLUMNS}
        fetchApiData={fetchApiData}
      />
      <Tab panes={panes} />

      <EditForm state={state} dispatch={dispatch} columns={COLUMNS} />
    </div>
  );
}
