import { useState, useEffect } from "react";
import { readRows, deleteRow } from "./data/api";
import TableView from "./components/TableView";
import EditForm from "./components/EditForm";
import SearchBar from "./components/SearchBar";
import { columns as initialColumns } from "./data/columns"; // 改名以便區分
// 假設你有寫一支取得選項的 API 函式，例如 getTradeTypeOptions
// import { getTradeTypeOptions } from "./data/api";

export default function index() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // 💡 1. 將 columns 提升到 state 管理，以便後續動態塞入選項
  const [columns, setColumns] = useState(initialColumns);

  // 載入表格資料與選項
  const fetchData = async (gameFilter = "") => {
    setLoading(true);
    try {
      // 假設這裡同時去抓戰績資料與選項資料
      const [tableData, tradeTypeOptions] = await Promise.all([
        readRows(gameFilter),
        // getTradeTypeOptions() // 呼叫你的後端選項 API，假設回傳 [{value: "buy", text: "買入"}, ...]

        // 模擬後端回傳的 options 資料：
        Promise.resolve([
          { value: "buy", text: "買入" },
          { value: "sell", text: "賣出" },
          { value: "dividend", text: "配息" },
        ]),
      ]);

      setData(tableData);

      // 💡 2. 將取得的 options 組合進 columns 中
      const updatedColumns = initialColumns.map((col) => {
        if (col.field === "trade_type") {
          return { ...col, options: tradeTypeOptions };
        }
        // if (col.field === "stock_id") {
        //   return { ...col, options: tradeTypeOptions };
        // }
        return col;
      });

      setColumns(updatedColumns);
    } catch (err) {
      console.error("載入資料失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 點擊新增按鈕
  const handleAdd = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  // 點擊編輯按鈕
  const handleEdit = (item) => {
    setEditingData(item);
    setIsModalOpen(true);
  };

  // 刪除
  const handleDelete = async (id) => {
    if (!window.confirm("確定要刪除嗎？")) return;
    try {
      await deleteRow(id);
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      alert("刪除失敗，請稍後再試");
    }
  };

  const onSuccess = (formData) => {
    setData((prev) =>
      prev.map((item) => (item.id === formData.id ? formData : item)),
    );
  };

  return (
    <>
      <SearchBar fetchData={fetchData} />

      <EditForm
        onClose={() => setIsModalOpen(false)}
        columns={columns} // 💡 傳遞動態帶有 options 的 columns
        isOpen={isModalOpen}
        editData={editingData}
        setData={setData}
        handleDelete={handleDelete}
      />

      <TableView
        data={data}
        loading={loading}
        handleEdit={handleEdit}
        handleAdd={handleAdd}
        columns={columns} // 💡 傳遞動態帶有 options 的 columns
      />
    </>
  );
}
