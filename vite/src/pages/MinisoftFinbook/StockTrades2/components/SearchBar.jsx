import React, { useState } from "react";
import { Button, Input, Form } from "semantic-ui-react";

export default function SearchBar({ fetchData }) {
  // 搜尋值
  const [search, setSearch] = useState("");
  // 輸入時,記錄搜尋值
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  // 將搜尋值傳給 fetchData
  const handleSearch = () => {
    fetchData({ note: search });
  };
  return (
    <Form style={{ marginBottom: "10px", marginTop: "20px" }}>
      <Form.Group>
        <Form.Field>
          <Input value={search} onChange={handleChange} />
        </Form.Field>
        <Form.Field>
          <Button onClick={handleSearch}>查詢</Button>
        </Form.Field>
      </Form.Group>
    </Form>
  );
}
