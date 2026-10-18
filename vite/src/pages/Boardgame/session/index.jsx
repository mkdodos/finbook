import { useState, useEffect } from "react";
import { getData, deleteRow } from "./api";
import TableView from "./components/TableView";
import EditForm from "./components/EditForm";
import { Header, Button, Icon } from "semantic-ui-react";

export default function Game() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Modal 顯示狀態
  const [editingData, setEditingData] = useState(null); // 紀錄目前正在編輯的資料
  // 修改：載入資料時可帶入遊戲名稱進行後端過濾
  const fetchData = async (gameFilter = "") => {
    setLoading(true);
    try {
      const data = await getData(gameFilter);
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

  // 點擊新增按鈕
  const handleAdd = () => {
    setEditingData(null); // 清空代表是新增
    setIsModalOpen(true);
  };

  // 點擊編輯按鈕
  const handleEdit = (item) => {
    console.log(item);
    setEditingData(item); // 帶入要編輯的資料
    setIsModalOpen(true);
  };

  // 刪除
  const handleDelete = async (id) => {
    // if (window.confirm("確定要刪除這筆戰績紀錄嗎？")) {
    try {
      await deleteRow(id);
      // 刪除成功後重新載入列表
      fetchData();
    } catch (err) {
      console.log(err);
      alert("刪除失敗，請稍後再試");
    }
    // }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <Header as="h2" dividing style={{ borderBottom: "none" }}>
          Session
        </Header>
        <Button primary icon labelPosition="left" onClick={handleAdd}>
          <Icon name="add" />
          新增
        </Button>
      </div>
      {/* 放置 Modal 表單 */}
      <EditForm
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        // onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchData()} // 儲存成功後維持搜尋條件更新
        // onSuccess={fetchScorecards}
        editData={editingData}
      />
      <TableView
        data={data}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
}
