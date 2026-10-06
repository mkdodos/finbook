import React, { useEffect, useState, useReducer } from "react";
import { initialState, reducer } from "./data/reducer";
import { Api } from "./data/api";
// import SearchBar from "./components/SearchBar";
import TableView from "./components/TableView";
import EditForm from "./components/EditForm";
import SearchBar from "./components/SearchBar";
import GroupedCard from "./components/GroupedCard";
import GroupedCardByDate from "./components/GroupedCardByDate";
import Phone from "./components/phone/Phone";
import { Button, Divider } from "semantic-ui-react";

import { Tab, Form, Input } from "semantic-ui-react";

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

  // 1. 定義一個統一樣式的渲染函式
  const renderPane = (children) => (
    <Tab.Pane style={{ border: "none", boxShadow: "none" }}>
      {children}
    </Tab.Pane>
  );

  // 2. 簡化 panes 設定
  const panes = [
    {
      menuItem: "手機版",
      render: () =>
        renderPane(
          <Phone
            rows={state.data}
            dispatch={dispatch}
            state={state}
            columns={COLUMNS}
          />,
        ),
    },
    {
      menuItem: "日期分組",
      render: () =>
        renderPane(<GroupedCardByDate data={state.groupedDataByDate} />),
    },

    {
      menuItem: "股票分組",
      render: () => renderPane(<GroupedCard data={state.groupedData} />),
    },
    {
      menuItem: "交易記錄",
      render: () =>
        renderPane(
          <TableView state={state} dispatch={dispatch} columns={COLUMNS} />,
        ),
    },
  ];

  return (
    <>
      {/* <SearchBar
        state={state}
        dispatch={dispatch}
        columns={COLUMNS}
        fetchApiData={fetchApiData}
      /> */}
      <Button
        style={{ marginTop: "10px" }}
        primary
        onClick={() => dispatch({ type: "OPEN_FORM" })}
      >
        新增
      </Button>
      <Divider />

      <Form>
        <Form.Group unstackable widths="2">
          <Form.Field>
            <label>項目</label>
            <Input />
          </Form.Field>
          <Form.Field>
            <label>項目</label>
            <Input />
          </Form.Field>
        </Form.Group>
      </Form>

      <Tab panes={panes} menu={{ secondary: true, pointing: true }} />

      <EditForm state={state} dispatch={dispatch} columns={COLUMNS} />
    </>
  );
}
