import React, { useState, useEffect } from "react";
import { readMonthSum } from "../data/api";
import { Table } from "semantic-ui-react";

export default function MonthView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // 載入資料
  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      const data = await readMonthSum(search);
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

  return (
    <div>
      <Table unstackable>
        <Table.Header>
          <Table.Row textAlign="right">
            {/* <Table.HeaderCell>年</Table.HeaderCell> */}
            <Table.HeaderCell>月</Table.HeaderCell>
            <Table.HeaderCell>買進</Table.HeaderCell>
            <Table.HeaderCell>賣出</Table.HeaderCell>
            <Table.HeaderCell>淨收支</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item, index) => (
            <Table.Row key={index} textAlign="right">
              {/* <Table.Cell>{item.y}</Table.Cell> */}
              <Table.Cell>{item.m}</Table.Cell>
              <Table.Cell>{item.buy_amt}</Table.Cell>
              <Table.Cell>{item.sell_amt}</Table.Cell>
              <Table.Cell>
                <span
                  style={{
                    color: item.sell_amt - item.buy_amt < 0 ? "red" : "green",
                  }}
                >
                  {item.sell_amt - item.buy_amt}
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
