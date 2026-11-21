import { useState, useEffect, useRef } from "react";
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

  // 載入資料時帶入條件進行後端過濾
  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      const data = await readRows(search);
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

  const lastTradeDateRef = useRef(null); // 記錄上次使用的日期

  // 讓參數預設值直接就是今天的日期！
  const handleAdd = (customDate = null) => {
    setEditingData(null); // 清空代表是新增

    // 如果從按鈕點擊傳進來的是「事件物件 (Event)」，我們需要過濾掉它
    // 判斷方式：如果 customDate 不是字串（例如它是物件），就強制換成今天日期
    // const targetDate =
    //   typeof customDate === "string" ? customDate : getTodayDate();

    let targetDate;
    if (typeof customDate === "string" && customDate) {
      // 1. 有明確傳入日期字串 → 使用並更新記錄
      targetDate = customDate;
      lastTradeDateRef.current = customDate;
    } else if (lastTradeDateRef.current) {
      // 2. 沒有傳入日期，但有上次記錄 → 沿用上次的日期
      targetDate = lastTradeDateRef.current;
    } else {
      // 3. 首次新增且無傳入日期 → 預設今天
      targetDate = getTodayDate();
      lastTradeDateRef.current = targetDate;
    }

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

  const searchForm = () => {
    return (
      <Form style={{ marginBottom: "10px", marginTop: "20px" }}>
        <Form.Group
          unstackable
          style={{
            display: "flex",
            alignItems: "center",

            justifyContent: "space-between",
          }}
        >
          <Form.Field style={{ width: "150px" }}>
            <Form.Select
              options={columns[2].options}
              onChange={(e, { value }) => fetchData({ stock_id: value })}
              search
              clearable
              placeholder="股票查詢"
            />
          </Form.Field>
          <Form.Field style={{ display: "flex", marginLeft: "60px" }}>
            <Button primary icon basic type="button" onClick={fetchData}>
              <Icon name="refresh" />
            </Button>
          </Form.Field>
          <Form.Field>
            {/* 新增鈕 */}
            <Button primary icon type="button" onClick={handleAdd}>
              <Icon name="add" />
            </Button>
          </Form.Field>
        </Form.Group>
      </Form>
    );
  };

  return (
    <>
      <div className="mobile-only">
        {searchForm()}
        {/* 下方維持原本的 PhoneView */}
        <PhoneView
          data={data}
          // 讓 MonthView 可進行篩選
          // setData={setData}
          fetchData={fetchData}
          handleEdit={handleEdit}
          handleAdd={handleAdd}
        />
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
        // onClose={() => setIsModalOpen(false)}
        setIsModalOpen={setIsModalOpen}
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
