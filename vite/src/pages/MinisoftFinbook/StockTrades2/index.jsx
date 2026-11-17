import { useState, useEffect } from "react";
import { readRows, deleteRow } from "./data/api";
import TableView from "./components/TableView";
import EditForm from "./components/EditForm";
import SearchBar from "./components/SearchBar";
import PhoneView from "./components/PhoneView";
import { columns } from "./data/columns";
import { Button, Icon, Grid, Form } from "semantic-ui-react";
import { initialFormData, getTodayDate } from "./data/utils";

export default function index() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Modal 顯示狀態
  const [editingData, setEditingData] = useState(null); // 紀錄目前正在編輯的資料

  // formData 直接由父組件管理
  const [formData, setFormData] = useState(initialFormData);

  // 修改：載入資料時可帶入遊戲名稱進行後端過濾
  const fetchData = async (gameFilter = "") => {
    setLoading(true);
    try {
      const data = await readRows(gameFilter);
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
  // const handleAdd = (customDate = null) => {
  //   setEditingData(null); // 清空代表是新增

  //   // 三元運算子：如果有傳 customDate 就用它；沒有傳就自動抓今天日期
  //   const targetDate = customDate ? customDate : getTodayDate();

  //   console.log(getTodayDate());

  //   // 初始化表單並帶入日期
  //   setFormData({
  //     trade_date: targetDate,
  //   });

  //   setIsModalOpen(true);
  // };

  // 讓參數預設值直接就是今天的日期！
  const handleAdd = (customDate = null) => {
    setEditingData(null); // 清空代表是新增

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
    setEditingData(item); // 從表格帶入要編輯的資料給表單
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

  const onSuccess = (formData) => {
    // 將儲存成功的值寫入state
    setData((prev) =>
      prev.map((item) => (item.id === formData.id ? formData : item)),
    );
    // console.log(formData);
  };

  return (
    <>
      {/* <PhoneView data={data} /> */}
      {/* <SearchBar fetchData={fetchData} columns={columns} /> */}

      <div className="mobile-only">
        <Button size="mini" primary icon onClick={handleAdd} type="button">
          <Icon name="add" />
        </Button>
        <PhoneView data={data} handleEdit={handleEdit} handleAdd={handleAdd} />
      </div>

      {/* 僅在電腦螢幕（769px 以上）顯示 */}
      <div className="desktop-only">
        <SearchBar fetchData={fetchData} columns={columns} />
        <TableView
          data={data}
          loading={loading}
          handleEdit={handleEdit}
          handleAdd={handleAdd}
          columns={columns}
        />
      </div>
      <EditForm
        onClose={() => setIsModalOpen(false)}
        columns={columns}
        isOpen={isModalOpen}
        editData={editingData}
        setData={setData}
        handleDelete={handleDelete}
        formData={formData}
        setFormData={setFormData}
        initialFormData={initialFormData}
      />
    </>
  );
}
