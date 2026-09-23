import React, { useReducer, useEffect } from "react";
import axios from "axios";
import { Container, Header } from "semantic-ui-react";
import CRUDTemplate from "./CRUDTemplate";
import "semantic-ui-css/semantic.min.css";
import { API_HOST } from "@/global/constants";

// const API_URL = "http://localhost:8888/finbook/pdo/costco/api.php";

const API_URL = `${API_HOST}/costco/api.php`;

// Reducer 狀態定義與處理
const initialState = {
  items: [],
  loading: false,
  error: null,
};

function dataReducer(state, action) {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, items: action.payload, loading: false };
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

// 欄位定義（傳入通用範本組件）
const itemColumns = [
  { key: "item_code", label: "商品代碼", type: "text" },
  { key: "name", label: "商品名稱", type: "text" },
  { key: "quantity", label: "數量", type: "number" },
  { key: "price", label: "單價/金額 ($)", type: "number" },
];

export default function index() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // 取得初始資料
  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log(res.data);

      // 確保傳給 reducer 的資料是陣列
      const dataArray = Array.isArray(res.data) ? res.data : [];
      dispatch({ type: "FETCH_SUCCESS", payload: dataArray });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 新增或更新資料 handler
  const handleSave = async (formData, isEditing) => {
    try {
      if (isEditing) {
        await axios.put(API_URL, formData);
        dispatch({ type: "UPDATE_ITEM", payload: formData });
      } else {
        const res = await axios.post(API_URL, formData);
        dispatch({
          type: "ADD_ITEM",
          payload: { ...formData, id: res.data.id },
        });
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // 刪除資料 handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}?id=${id}`);
      dispatch({ type: "DELETE_ITEM", payload: id });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <Container style={{ marginTop: "30px" }}>
      <Header as="h2" dividing>
        好市多消費明細管理系統
      </Header>
      <CRUDTemplate
        columns={itemColumns}
        data={state.items}
        dispatch={dispatch}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </Container>
  );
}
