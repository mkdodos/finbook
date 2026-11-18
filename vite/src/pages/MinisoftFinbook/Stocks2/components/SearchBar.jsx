import React, { useState } from "react";
import { Button, Input, Form } from "semantic-ui-react";

export default function SearchBar({ fetchData, columns }) {
  // 搜尋值
  const [search, setSearch] = useState({ note: "" });
  // 輸入時,記錄搜尋值
  const handleChange = (e, { name, value }) => {
    setSearch({ ...search, [name]: value });
  };
  // 將搜尋值傳給 fetchData
  const handleSearch = () => {
    console.log(search);
    fetchData(search);
  };

  // 用 columns 產生所需表單元件
  const genForm = () => {
    return columns
      .filter((col) => col.searchShow)
      .map((col) => {
        // 下拉選單
        if (col.type === "select") {
          return (
            <Form.Field key={col.field}>
              <Form.Select
                label={col.label}
                name={col.field}
                options={col.options}
                onChange={handleChange}
                search
                clearable
              />
            </Form.Field>
          );
        }
        return (
          <Form.Field key={col.field}>
            <label>{col.label}</label>
            <Input
              type={col.type}
              placeholder={col.label}
              name={col.field}
              onChange={handleChange}
            />
          </Form.Field>
        );
      });
  };

  return (
    <Form style={{ marginBottom: "10px", marginTop: "20px" }}>
      <Form.Group>
        {genForm()}
        <Form.Field>
          <label>&nbsp;</label>
          <Button onClick={handleSearch}>查詢</Button>
          <Button onClick={() => fetchData()}>顯示全部</Button>
        </Form.Field>
      </Form.Group>
    </Form>
  );
}
