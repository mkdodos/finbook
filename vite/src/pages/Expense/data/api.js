import axios from "axios";
// import { API_HOST } from "../../../global/constants";
import { API_HOST } from "@/global/constants";

const FOLDER = "expense";

export const Api = {
  // 載入列表
  fetchList: async (params) => {
    const url = `${API_HOST}/${FOLDER}/read.php`;
    // console.log(url);
    // const url = `http://192.168.0.10:8888/finbook/pdo/categories/read.php`;
    const response = await axios.get(url, { params });
    console.log(params);
    console.log(response.data);
    // console.log("fetchList result:", response, Array.isArray(response));
    return response.data.data;
  },
  // 新增 Master
  create: async (row) => {
    console.log(row);
    const url = `${API_HOST}/${FOLDER}/create.php`;
    const response = await axios.post(url, row);
    console.log(response.data);
    return response.data; // 回傳新 quoteID
  },
  // 更新 Master
  update: async (params) => {
    const url = `${API_HOST}/${FOLDER}/update.php`;
    const response = await axios.put(url, params);
    console.log(params);

    return response.data;
  },
  // 刪除
  delete: async (id) => {
    const url = `${API_HOST}/${FOLDER}/delete.php`;
    await axios.delete(url, {
      params: { id }, // 自動轉為 delete.php?id=xxx
    });
  },

  // delete: async (id) => {
  //   const url = `${API_HOST}/${FOLDER}/delete.php`;
  //   await axios.delete(url);
  // },
};

// 建立 Axios 實例（請根據您的 PHP 伺服器網址調整 baseURL）
const apiClient = axios.create({
  baseURL: `${API_HOST}/expense/api.php`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 取得所有遊戲列表
export const getCates = async () => {
  const response = await apiClient.get("?action=get_cates");
  return response.data;
};
