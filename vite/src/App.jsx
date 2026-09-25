import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Page from "./pages/Page";
import Expense from "./pages/Expense";
import StockTrades from "./pages/StockTrades";
import Stocks from "./pages/Stocks";
import CRUD from "./pages/CURD";
import Costco from "./pages/Costco";
import Employee from "./pages/Employee";
import ReceiptRecords from "./pages/ReceiptRecords";
import GenericPage from "./pages/GenericPage";
import { Menu, Dropdown, DropdownMenu } from "semantic-ui-react";

export default function App() {
  return (
    <BrowserRouter>
      <Menu>
        <Menu.Item as={Link} to="/generic-page">
          通用頁面
        </Menu.Item>
        <Menu.Item as={Link} to="/receipt-records">
          receipt-records
        </Menu.Item>
        <Menu.Item as={Link} to="/costco">
          好市多
        </Menu.Item>
        <Menu.Item as={Link} to="/crud">
          CRUD
        </Menu.Item>
        <Menu.Item as={Link} to="/stocks">
          股票基本資料
        </Menu.Item>
        <Menu.Item as={Link} to="/stock-trades">
          股票交易
        </Menu.Item>
      </Menu>

      {/* 導覽選單 (可選) */}
      {/* <nav style={{ padding: "10px", marginBottom: "20px" }}>
        <Link to="/page" style={{ marginRight: "10px" }}>
          Page 頁面
        </Link>
        <Link to="/expense">Expense 頁面</Link>
        <Link to="/stocks">股票基本資料</Link>
        <Link to="/stock-trades">股票交易</Link>       
      </nav> */}

      {/* 依據網址路徑切換渲染對應組件 */}
      <Routes>
        <Route path="/generic-page" element={<GenericPage />} />
        <Route path="/receipt-records" element={<ReceiptRecords />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/costco" element={<Costco />} />
        <Route path="/crud" element={<CRUD />} />
        <Route path="/page" element={<Page />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/stock-trades" element={<StockTrades />} />
        <Route path="/expense" element={<Expense />} />
        {/* 預設首頁 (當網址為 / 時顯示 Page) */}
        <Route path="/" element={<Page />} />
      </Routes>
    </BrowserRouter>
  );
}
