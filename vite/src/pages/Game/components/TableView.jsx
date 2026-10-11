import React from "react";

export default function TableView({ data }) {
  // 顯示指定場次的成績
  console.log(data?.scores.filter((item) => item.score > 0));
  // console.log(data);
  return <div>TableView</div>;
}
