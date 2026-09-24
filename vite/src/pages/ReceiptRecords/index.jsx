import React, { useReducer, useEffect } from "react";
import axios from "axios";
import { Container, Header } from "semantic-ui-react";
import CRUDTemplate from "@/components/templates/CRUDTemplate";
import { API_HOST } from "@/global/constants";
import { Label } from "semantic-ui-react";

// 1. 將 API_URL 指向通用的 api.php，並帶上 ?table=employees
const API_URL = `${API_HOST}/api.php?table=receipt_records`;

// 多型態欄位 Schema (gs 格式)
const employeeColumns = [
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
];

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

export default function Employee() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 取得資料列表 (GET)
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      const dataArray = Array.isArray(res.data) ? res.data : [];
      dispatch({ type: "SET_ITEMS", payload: dataArray });
    } catch (err) {
      console.error("Fetch error:", err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 新增 / 修改資料 (POST / PUT)
  const handleSave = async (formData, isEditing) => {
    try {
      if (isEditing) {
        // 修改：直接送出完整的 formData (內含 id)，api.php 會自動處理
        await axios.put(API_URL, formData);
        dispatch({ type: "UPDATE_ITEM", payload: formData });
      } else {
        // 新增：API 回傳包含新增的 id
        const res = await axios.post(API_URL, formData);
        dispatch({
          type: "ADD_ITEM",
          payload: { ...formData, id: res.data.id },
        });
      }
    } catch (err) {
      console.error("Save error:", err.response?.data?.error || err.message);
    }
  };

  // 刪除資料 (DELETE)
  const handleDelete = async (id) => {
    try {
      // 2. 由於 API_URL 已經有 ?table=employees，刪除 ID 需用 &id= 拼接
      await axios.delete(`${API_URL}&id=${id}`);
      dispatch({ type: "DELETE_ITEM", payload: id });
    } catch (err) {
      console.error("Delete error:", err.response?.data?.error || err.message);
    }
  };

  return (
    <Container style={{ marginTop: "30px" }}>
      <Header as="h2" dividing>
        員工通訊錄管理 (CRUD 範本測試)
      </Header>
      <CRUDTemplate
        columns={employeeColumns}
        data={state.items}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </Container>
  );
}
