import React, { useState } from "react";
import { Button, Form, Input } from "semantic-ui-react";

// 輔助函式：將陣列按指定大小切塊
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

function SearchBar({ columns, fetchApiData }) {
  // 用於儲存表單輸入值的狀態 (State)
  const [formValues, setFormValues] = useState({});

  columns = columns
    // 💡 1. 濾除不需要出現在表單中的欄位
    .filter((col) => !col.hideInForm);

  const columnGroups = chunkArray(columns, 6);

  // 處理欄位數值變更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 送出表單
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchApiData(formValues);
    console.log("表單資料送出:", formValues);
  };

  // 💡 清除表單與重設資料處理函式
  const handleReset = () => {
    setFormValues({});
    fetchApiData({});
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* 依照每幾個欄位生成的群組進行渲染 */}
      {columnGroups.map((group, groupIndex) => (
        <Form.Group key={`group-${groupIndex}`}>
          {group.map(({ key, title, name, formType }) => (
            <Form.Field key={key}>
              <label>{title}</label>
              <Input
                type={formType}
                name={name}
                value={formValues[name] || ""}
                onChange={handleChange}
              />
            </Form.Field>
          ))}
        </Form.Group>
      ))}
      {/* 將 Group 設為 flex 佈局並向兩端對齊 */}
      <Form.Group
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Form.Field style={{ margin: 0 }}>
          <Button type="submit" secondary>
            查詢
          </Button>
        </Form.Field>
        <Form.Field style={{ margin: 0 }}>
          <Button type="button" onClick={handleReset}>
            清除
          </Button>
        </Form.Field>
      </Form.Group>
      {/* <Form.Group>
        <Form.Field>
          <label>&nbsp;</label>
          <Button type="submit" secondary>
            查詢
          </Button>
        </Form.Field>
        <Form.Field>
          <label>&nbsp;</label>

          <Button type="button" onClick={handleReset}>
            清除
          </Button>
        </Form.Field>
      </Form.Group> */}
    </Form>
  );
}

export default SearchBar;
