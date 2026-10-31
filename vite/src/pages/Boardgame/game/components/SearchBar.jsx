import React, { useState } from "react";
import { Button, Input, Form } from "semantic-ui-react";

export default function SearchBar({ fetchData }) {
  // 搜尋值
  const [search, setSearch] = useState("");
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearch = () => {
    fetchData({ name: search });
  };
  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Field>
            <Input value={search} onChange={handleChange} />
          </Form.Field>
          <Form.Field>
            <Button onClick={handleSearch}>查詢</Button>
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  );
}
