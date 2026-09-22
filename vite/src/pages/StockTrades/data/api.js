import axios from "axios";
// import { API_HOST } from "../../../global/constants";
import { API_HOST } from "@/global/constants";

const FOLDER = "stock_trades";

export const Api = {
  // 載入股票下拉選單
  getCategories: async (params) => {
    const url = `${API_HOST}/stocks/readOptions.php`;

    const response = await axios.get(url, { params });
    console.log(response.data.data);
    // console.log("fetchList result:", response, Array.isArray(response));
    return response.data.data;
  },

  // 載入列表
  fetchList: async (params) => {
    const url = `${API_HOST}/${FOLDER}/read.php`;
    console.log(url);
    // const url = `http://192.168.0.10:8888/finbook/pdo/categories/read.php`;
    const response = await axios.get(url, { params });
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
