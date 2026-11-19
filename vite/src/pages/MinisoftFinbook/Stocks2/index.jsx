import React, { useState, useEffect } from "react";
import TableView from "./components/TableView";
import PhoneView from "./components/PhoneView";
import EditForm from "./components/EditForm";
import { columns } from "./data/columns";
import { readRows, deleteRow } from "./data/api";
import { initialFormData, getTodayDate } from "./data/utils";

export default function index() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState(null); // 紀錄目前正在編輯的資料
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Modal 顯示狀態
  // 表單資料
  const [formData, setFormData] = useState(initialFormData);

  // 載入資料時帶入條件進行後端過濾
  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      const data = await readRows(search);
      console.log(data);
      setData(data);
    } catch (err) {
      console.error("載入戰績失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 讓參數預設值直接就是今天的日期！
  const handleAdd = (customDate = null) => {
    setEditRow(null); // 清空代表是新增

    // 如果從按鈕點擊傳進來的是「事件物件 (Event)」，我們需要過濾掉它
    // 判斷方式：如果 customDate 不是字串（例如它是物件），就強制換成今天日期
    const targetDate =
      typeof customDate === "string" ? customDate : getTodayDate();

    // 初始化表單
    setFormData({
      trade_date: targetDate,
    });

    setIsModalOpen(true);
  };

  // 點擊編輯按鈕
  const handleEdit = (item) => {
    // console.log(item);
    setEditRow(item); // 從表格帶入要編輯的資料給表單
    setIsModalOpen(true);
  };

  // 刪除
  const handleDelete = async (id) => {
    if (!window.confirm("確定要刪除嗎？")) return;
    try {
      await deleteRow(id);
      // 刪除成功後重新載入列表
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      alert("刪除失敗，請稍後再試");
    }
  };

  return (
    <div>
      <div className="mobile-only">
        <PhoneView
          data={data}
          setData={setData}
          loading={loading}
          handleEdit={handleEdit}
          handleAdd={handleAdd}
          columns={columns}
          fetchData={fetchData}
        />
      </div>

      <div className="desktop-only">
        <TableView
          data={data}
          loading={loading}
          handleEdit={handleEdit}
          handleAdd={handleAdd}
          columns={columns}
        />
      </div>

      <EditForm
        // onClose={() => setIsModalOpen(false)}
        setIsModalOpen={setIsModalOpen}
        columns={columns}
        isOpen={isModalOpen}
        editRow={editRow}
        setData={setData}
        handleDelete={handleDelete}
        formData={formData}
        setFormData={setFormData}
        initialFormData={initialFormData}
      />
    </div>
  );
}
