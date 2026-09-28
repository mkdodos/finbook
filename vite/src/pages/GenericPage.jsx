import React, { useReducer, useEffect, useState } from "react";
import CRUDTemplate from "./CURD/CRUDTemplate";
import { API_HOST } from "@/global/constants";
import { tables } from "@/global/tableColumns";
import { Button, Input, Form } from "semantic-ui-react";
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

  // 1. 分離「輸入框輸入值」與「目前查詢的表名」
  const [searchTerm, setSearchTerm] = useState("receipt_records");
  const [table, setTable] = useState("receipt_records");

  console.log("當前 table 名稱:", table);
  console.log("對應到的 columns 內容:", tables[table]);

  // 2. 正確從 tables 陣列中查詢 columns
  // const targetTable = tables.find((item) => item.tableName === table);
  // const columns = targetTable ? targetTable.columns : [];

  const columns = tables[table] || [];
  console.log(columns);

  const API_URL = `${API_HOST}/api.php?table=${table}`;

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
    if (table) {
      fetchData();
    }
  }, [table]);

  const handleInputChange = (e, { value }) => {
    setSearchTerm(value);
  };

  const handleSearch = () => {
    setTable(searchTerm); // 觸發重新 Fetch
  };

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
      await axios.delete(`${API_URL}&id=${id}`);
      // await axios.delete(`${API_URL}?id=${id}`);
      dispatch({ type: "DELETE_ITEM", payload: id });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        {/* 包在 Form 裡面，按 Enter 鍵也能自動觸發 handleSearch */}
        <Form onSubmit={handleSearch}>
          <Input
            value={searchTerm}
            onChange={handleInputChange}
            type="text"
            placeholder="請輸入資料表名稱..."
            action={
              <Button type="submit" color="teal" icon="search" content="查詢" />
            }
          />
        </Form>
      </div>

      <CRUDTemplate
        columns={columns}
        data={state.items}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
