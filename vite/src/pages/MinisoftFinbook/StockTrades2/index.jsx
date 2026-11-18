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

  const searchForm = () => {
    return (
      <Form style={{ marginBottom: "10px", marginTop: "20px" }}>
        <Form.Group
          unstackable
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <Form.Field style={{ width: "250px" }}>
            <Form.Select
              // label="代碼"
              options={columns[2].options}
              onChange={(e, { value }) => fetchData({ stock_id: value })}
              search
              clearable
              placeholder="股票查詢"
            />
          </Form.Field>
          <Form.Field>
            {/* <label>&nbsp;</label>
    <Button onClick={() => fetchData()}>顯示全部</Button> */}
            <Button primary icon type="button" onClick={handleAdd}>
              <Icon name="add" />
            </Button>
          </Form.Field>
        </Form.Group>
        {/* <Form.Group
          unstackable
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Form.Field style={{ flex: 1, marginRight: "10px" }}>
            <Form.Select
              // label="代碼"
              options={columns[2].options}
              onChange={(e, { value }) => fetchData({ stock_id: value })}
              search
              clearable
              placeholder="股票查詢"
            />
          </Form.Field>
          <Form.Field style={{ flexShrink: 0 }}>
           
            <Button primary icon type="button" onClick={handleAdd}>
              <Icon name="add" />
            </Button>
          </Form.Field>
        </Form.Group> */}
        {/* <Form.Group unstackable>
          <Form.Field width={10}>
            <Form.Select
              // label="代碼"
              options={columns[2].options}
              onChange={(e, { value }) => fetchData({ stock_id: value })}
              search
              clearable
              placeholder="股票查詢"
            />
          </Form.Field>
          <Form.Field width={2}>
            <Button primary icon fluid type="button" onClick={handleAdd}>
              <Icon name="add" />
            </Button>
          </Form.Field>
        </Form.Group> */}
        {/* <Form.Group
          unstackable
          style={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}
        >
          <Form.Field style={{ flex: 1, marginRight: "10px" }}>
            <Form.Select
              options={columns[2].options}
              onChange={(e, { value }) => fetchData({ stock_id: value })}
              search
              clearable
              placeholder="股票查詢"
            />
          </Form.Field>
          <Form.Field style={{ flex: "0 0 auto" }}>
            <Button primary icon type="button" onClick={handleAdd}>
              <Icon name="add" />
            </Button>
          </Form.Field>
        </Form.Group> */}
      </Form>
      // <Form style={{ marginBottom: "10px", marginTop: "20px" }}>
      //   <Form.Group
      //     widths="equal"
      //     unstackable
      //     style={{ justifyContent: "space-between" }}
      //   >
      //     <Form.Field>
      //       <Form.Select
      //         // label="代碼"
      //         options={columns[2].options}
      //         onChange={(e, { value }) => fetchData({ stock_id: value })}
      //         search
      //         clearable
      //         placeholder="股票查詢"
      //       />
      //     </Form.Field>
      //     <Form.Field>
      //       {/* <label>&nbsp;</label>
      //       <Button onClick={() => fetchData()}>顯示全部</Button> */}
      //       <Button primary icon type="button" onClick={handleAdd}>
      //         <Icon name="add" />
      //       </Button>
      //     </Form.Field>
      //   </Form.Group>
      // </Form>
    );
  };

  return (
    <>
      <div className="mobile-only">
        {/* 按鈕容器：設定靠右對齊 */}
        {/* <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <Button primary icon type="button" onClick={handleAdd}>
            <Icon name="add" />
          </Button>
        </div> */}

        {searchForm()}
        {/* 下方維持原本的 PhoneView */}
        <PhoneView data={data} handleEdit={handleEdit} handleAdd={handleAdd} />
      </div>

      {/* <div className="mobile-only">
        <Button size="mini" primary icon onClick={handleAdd} type="button">
          <Icon name="add" />
        </Button>
        <PhoneView data={data} handleEdit={handleEdit} handleAdd={handleAdd} />
      </div> */}

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
