import React, { useState } from "react";
import { Button, Input } from "semantic-ui-react";

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
      <Input value={search} onChange={handleChange} />
      <Button onClick={handleSearch}>查詢</Button>
    </div>
  );
}
