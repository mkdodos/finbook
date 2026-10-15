// src/api.js
import axios from "axios";
import { API_HOST } from "@/global/constants";

// 建立 Axios 實例（請根據您的 PHP 伺服器網址調整 baseURL）
const apiClient = axios.create({
  baseURL: `${API_HOST}/boardgame/api.php`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 取得所有計分卡與戰績資料
// src/api.js

// 取得所有計分卡與戰績資料（支援選擇性傳入遊戲名稱進行過濾）
export const getScorecards = async (gameName = "") => {
  try {
    const url = gameName
      ? `?action=get_scorecards&game=${encodeURIComponent(gameName)}`
      : "?action=get_scorecards";

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("取得戰績資料失敗:", error);
    throw error;
  }
};
// export const getScorecards = async () => {
//   try {
//     const response = await apiClient.get("?action=get_scorecards");
//     return response.data;
//   } catch (error) {
//     console.error("取得戰績資料失敗:", error);
//     throw error;
//   }
// };

// 新增遊戲資料範例
export const addGame = async (gameName) => {
  try {
    const response = await apiClient.post("?action=add_game", {
      name: gameName,
    });
    return response.data;
  } catch (error) {
    console.error("新增遊戲失敗:", error);
    throw error;
  }
};

// 新增戰績紀錄
export const addScorecard = async (data) => {
  try {
    const response = await apiClient.post("?action=add_scorecard", data);
    return response.data;
  } catch (error) {
    console.error("新增戰績失敗:", error);
    throw error;
  }
};

// 取得所有玩家列表
export const getPlayers = async () => {
  const response = await apiClient.get("?action=get_players");
  return response.data;
};

// 取得所有角色列表
export const getRoles = async () => {
  const response = await apiClient.get("?action=get_roles");
  return response.data;
};

// 刪除戰績紀錄
export const deleteScorecard = async (id) => {
  try {
    const response = await apiClient.post("?action=delete_scorecard", {
      id,
    });
    return response.data;
  } catch (error) {
    console.error("刪除戰績失敗:", error);
    throw error;
  }
};

// 更新戰績紀錄
export const updateScorecard = async (id, data) => {
  try {
    const response = await apiClient.post("crud.php?action=update_scorecard", {
      id,
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error("更新戰績失敗:", error);
    throw error;
  }
};
