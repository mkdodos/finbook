import React, { useReducer, useEffect, useState } from "react";
import CRUDTemplate from "@/components/templates/CRUDTemplate";
import Phone from "../components/templates/Phone";
import { API_HOST } from "@/global/constants";
import { tables } from "@/global/tableColumns";
import { Button, Menu, Form, Dropdown } from "semantic-ui-react";
import axios from "axios";

const initialState = { items: [] };

function reducer(state, action) {
  switch (action.type) {
    case "SET_ITEMS":
      //以日期群組
      const groupedData = action.payload?.reduce((acc, item) => {
        const dateKey =
          typeof item.transaction_date === "string"
            ? item.transaction_date.slice(0, 10)
            : item.transaction_date?.format?.("YYYY-MM-DD") || "未知日期";

        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
      }, {});
      console.log(groupedData);
      return { ...state, items: action.payload, groupedData };
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

  // const [table, setTable] = useState("receipt_records");
  const [selectedTable, setSelectedTable] = useState("expense");

  const columns = tables[selectedTable] || [];

  const API_URL = `${API_HOST}/api.php?table=${selectedTable}`;

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
    if (selectedTable) {
      fetchData();
    }
  }, [selectedTable]);

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

  // menu 選項清單
  const tableOptions = [
    { key: "notes", text: "notes", value: "notes" },
    // { key: "employees", text: "employees", value: "employees" },
    {
      key: "receipt_records",
      text: "石二鍋",
      value: "receipt_records",
    },
    { key: "costco", text: "好市多", value: "costco" },
    { key: "expense", text: "expense", value: "expense" },
  ];

  const handleDropdownChange = (e, { value }) => {
    setSelectedTable(value);
    console.log("選中的資料表:", value);
  };

  return (
    <div>
      {/* {JSON.stringify(Object.entries(state?.groupedData || {}))} */}
      {/* {JSON.stringify(state.groupedData)} */}
      {/* {JSON.stringify(Object.entries(state?.groupedData) || {})} */}
      {Object.entries(state?.groupedData || {}).map(([key, trades]) => {
        {
          key;
        }
      }, 0)}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <Menu secondary pointing widths={4}>
          {tableOptions.map((option) => {
            return (
              <Menu.Item
                key={option.key}
                onClick={() => setSelectedTable(option.value)}
                active={selectedTable === option.key}
                color="teal"
              >
                {option.text}
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
      {selectedTable !== "notes" && (
        <Phone
          columns={columns}
          rows={state.items}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      <CRUDTemplate
        columns={columns}
        data={state.items}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
