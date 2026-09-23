import React, { useReducer, useEffect } from "react";
import axios from "axios";
import { Container, Header } from "semantic-ui-react";
import CRUDTemplate from "@/components/templates/CRUDTemplate";
import { API_HOST } from "@/global/constants";

const API_URL = `${API_HOST}/employee/api_employee.php`;

// 測試用多型態欄位 Schema (gs 格式)
const employeeColumns = [
  { key: "employee_no", label: "員工編號", type: "text", hideInForm: true },
  { key: "name", label: "姓名", type: "text" },
  { key: "department", label: "部門", type: "text" },
  {
    key: "title",
    label: "職稱",
    type: "select",
    options: [
      { text: "社群小編", value: "社群小編" },
      { text: "資料庫管理員", value: "資料庫管理員" },
    ],
  },
  { key: "email", label: "電子郵件", type: "email" },
  { key: "hire_date", label: "到職日期", type: "date" },
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

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      const dataArray = Array.isArray(res.data) ? res.data : [];
      dispatch({ type: "SET_ITEMS", payload: dataArray });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

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
