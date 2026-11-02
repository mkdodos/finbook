import React, { useState } from "react";
import { Button, Input, Form } from "semantic-ui-react";

export default function SearchBar({ fetchData }) {
  // 搜尋值
  const [search, setSearch] = useState({ role_name: "", game_name: "" });
  const handleChange = (e) => {
    setSearch((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // setSearch(e.target.value);
  };
  const handleSearch = () => {
    // console.log(search);
    fetchData(search);
  };
  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Field>
            <Input
              placeholder="角色名稱"
              value={search.role_name}
              onChange={handleChange}
              name="role_name"
            />
          </Form.Field>
          <Form.Field>
            <Input
              placeholder="遊戲名稱"
              value={search.game_name}
              onChange={handleChange}
              name="game_name"
            />
          </Form.Field>
          <Form.Field>
            <Button onClick={handleSearch}>查詢</Button>
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  );
}
