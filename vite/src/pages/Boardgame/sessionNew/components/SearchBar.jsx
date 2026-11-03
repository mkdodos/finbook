import React, { useState } from "react";
import { Button, Input, Form } from "semantic-ui-react";
import GameSelect from "../../components/dropdown/GameSelect";

export default function SearchBar({ fetchData }) {
  // 搜尋值
  const [search, setSearch] = useState({ role_id: "", play_date: "" });
  const handleChange = (e) => {
    setSearch((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // setSearch(e.target.value);
  };
  const handleSearch = () => {
    console.log(search);
    fetchData(search);
  };
  const handleGameChange = (e, { value }) => {
    // value : game_id
    setSearch((prev) => ({ ...prev, game_id: value }));
    console.log(value);
  };
  return (
    <div>
      <Form>
        <Form.Group widths={3}>
          <Form.Field>
            <GameSelect onChange={handleGameChange} />
          </Form.Field>
          <Form.Field>
            <Input
              type="date"
              placeholder="日期"
              value={search.play_date}
              onChange={handleChange}
              name="play_date"
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
