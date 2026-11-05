import React, { useEffect, useState, useReducer } from "react";
import { initialState, reducer } from "./data/reducer";
import { Api } from "./data/api";

import PhoneView from "./components/PhoneView";
import TableView from "./components/TableView";
import EditForm from "./components/EditForm";
import SearchBar from "./components/SearchBar";
import { Button, Form, Grid } from "semantic-ui-react";
// import data from "./data/data.json";

export default function index() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 切換手機版
  const [isPhone, setIsPhone] = useState(true);

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
  }, []);

  return (
    <>
      {/* <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <SearchBar fetchData={fetchApiData} />
          </Grid.Column>
          <Grid.Column>
            <Button onClick={() => dispatch({ type: "OPEN_FORM" })}>
              新增
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid> */}
      {/* <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column width={16} tablet={10} computer={12}>
            <SearchBar fetchData={fetchApiData} />
          </Grid.Column>
          <Grid.Column
            width={16}
            tablet={6}
            computer={4}
            className="mobile-button-container"
          >
            <Button
              fluid
              color="blue"
              onClick={() => dispatch({ type: "OPEN_FORM" })}
            >
              新增
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid> */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          width: "100%",
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

      {isPhone ? (
        <PhoneView state={state} dispatch={dispatch} />
      ) : (
        <TableView state={state} dispatch={dispatch} />
      )}

      <EditForm state={state} dispatch={dispatch} />
    </>
  );
}
