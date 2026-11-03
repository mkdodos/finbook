import axios from "axios";
import { API_HOST } from "@/global/constants";

const table = "session";
const apiClient = axios.create({
  baseURL: `${API_HOST}/boardgame/${table}/api_new.php`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 取得所有資料（若有傳入名稱在後端會進行篩選）
export const readRows = async (search) => {
  try {
    const url = "?action=read_rows";
    const response = await apiClient.get(url, { params: search });
    return response.data;
  } catch (error) {
    console.error("取得資料失敗:", error);
    throw error;
  }
};

// 新增資料
export const createRow = async (formData) => {
  try {
    const response = await apiClient.post("?action=create_row", formData);
    return response.data;
  } catch (error) {
    console.error("新增失敗:", error);
    throw error;
  }
};

// 刪除紀錄
export const deleteRow = async (id) => {
  try {
    const response = await apiClient.post("?action=delete_row", {
      id,
    });
    return response.data;
  } catch (error) {
    console.error("刪除失敗:", error);
    throw error;
  }
};

// 更新紀錄
export const updateRow = async (id, data) => {
  console.log(data);
  try {
    const response = await apiClient.post("?action=update_row", {
      id,
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error("更新失敗:", error);
    throw error;
  }
};
