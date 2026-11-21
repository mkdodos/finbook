import { useState, useEffect, useRef } from "react";
import { readRows, deleteRow } from "./data/api";
import TableView from "./components/TableView";
import EditForm from "./components/EditForm";
import SearchBar from "./components/SearchBar";
import PhoneView from "./components/PhoneView";
import { columns } from "./data/columns";
import { Button, Icon, Grid, Form } from "semantic-ui-react";
import { createRow, updateRow } from "./data/api";
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
      console.error("載入失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  // 載入資料
  useEffect(() => {
    fetchData();
  }, []);

  const lastTradeDateRef = useRef(null); // 記錄上次使用的日期

  const handleAdd = (customDate = null) => {
    setEditingData(null); // 清空代表是新增

    // 若 customDate 是非空字串（非 Event 物件），優先採用並更新記錄；
    // 否則沿用上次操作/修改的日期；若首次使用則退回今天日期。
    const targetDate =
      typeof customDate === "string" && customDate
        ? customDate
        : lastTradeDateRef.current || getTodayDate();

    lastTradeDateRef.current = targetDate;

    setFormData({
      trade_date: targetDate,
    });

    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // 如果有 editData,代表更新
      if (editingData) {
        // 更新
        await updateRow(editingData.id, formData);
        // 更新後,將資料 state 更新
        setData((prev) =>
          prev.map((item) => (item.id === formData.id ? formData : item)),
        );
      } else {
        // 新增
        const res = await createRow(formData);
        setData((prev) => [{ ...formData, id: res.id }, ...prev]);
      }
      // 關閉表單
      setIsModalOpen(false);
      // 記錄日期,讓新增時使用
      lastTradeDateRef.current = formData.trade_date;
    } catch (err) {
      console.log(err);
      alert("儲存失敗，請檢查輸入內容");
    }
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
      {lastTradeDateRef.current}
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
        setIsModalOpen={setIsModalOpen}
        columns={columns}
        isOpen={isModalOpen}
        onSaveSuccess={handleSubmit}
        editData={editingData}
        handleDelete={handleDelete}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
}
