// src/index.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Header,
  Loader,
  Segment,
  Button,
  Icon,
  Input,
  Tab,
} from "semantic-ui-react";
import { getScorecards, deleteScorecard } from "./api";
import ScorecardForm from "./ScorecardForm";

import Game from "./game";
import Session from "./session";

import PivotTable from "./components/PivotTable";
import PivotEdit from "./components/PivotEdit";
import PivotTemplate from "./components/PivotTemplate";
// import { rows, columns, data } from "./data/score";
import { rows, columns, data } from "./data/game";

function index() {
  const [scorecards, setScorecards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Modal 顯示狀態
  const [editingData, setEditingData] = useState(null); // 紀錄目前正在編輯的資料
  // 新增：搜尋關鍵字狀態
  const [searchGame, setSearchGame] = useState("");

  // 修改：載入資料時可帶入遊戲名稱進行後端過濾
  const fetchScorecards = async (gameFilter = "") => {
    setLoading(true);
    try {
      const data = await getScorecards(gameFilter);
      setScorecards(data);
    } catch (err) {
      console.error("載入戰績失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScorecards();
  }, []);

  // 新增：點擊搜尋按鈕或按下 Enter 的處理函式
  const handleSearch = () => {
    fetchScorecards(searchGame);
  };

  // 點擊新增按鈕
  const handleAddClick = () => {
    setEditingData(null); // 清空代表是新增
    setIsModalOpen(true);
  };

  // 點擊編輯按鈕
  const handleEditClick = (item) => {
    setEditingData(item); // 帶入要編輯的資料
    setIsModalOpen(true);
  };

  // 處理刪除的函式
  const handleDelete = async (id) => {
    // if (window.confirm("確定要刪除這筆戰績紀錄嗎？")) {
    try {
      await deleteScorecard(id);
      // 刪除成功後重新載入列表
      fetchScorecards();
    } catch (err) {
      console.log(err);
      alert("刪除失敗，請稍後再試");
    }
    // }
  };

  const panes = [
    {
      menuItem: "PivotTemplate",
      render: () => (
        <Tab.Pane>
          {/* <PivotTemplate
            rows={rows}
            rowkey="play_date"
            columns={columns}
            colkey="subject"
            data={data}
          /> */}
          <PivotTemplate data={scorecards} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Pivot",
      render: () => (
        <Tab.Pane>
          <PivotEdit data={scorecards} />
          <PivotTable data={scorecards} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Game",
      render: () => (
        <Tab.Pane>
          {" "}
          <Game />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "場次",
      render: () => (
        <Tab.Pane>
          {" "}
          <Session />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "計分版",
      render: () => (
        <Tab.Pane>
          {/* 新增：後端過濾搜尋列 */}
          <Segment style={{ marginTop: "20px" }}>
            <Input
              action={{
                icon: "search",
                content: "搜尋",
                onClick: handleSearch,
              }}
              placeholder="輸入遊戲名稱後端搜尋..."
              value={searchGame}
              onChange={(e) => setSearchGame(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              fluid
            />
          </Segment>

          {/* 放置 Modal 表單 */}
          <ScorecardForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => fetchScorecards(searchGame)} // 儲存成功後維持搜尋條件更新
            // onSuccess={fetchScorecards}
            editData={editingData}
          />

          {loading ? (
            <Segment basic style={{ minHeight: "150px" }}>
              <Loader active inline="centered">
                載入戰績資料中...
              </Loader>
            </Segment>
          ) : (
            <Table celled striped selectable sortable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>遊戲名稱</Table.HeaderCell>
                  <Table.HeaderCell>遊玩日期</Table.HeaderCell>
                  <Table.HeaderCell>玩家</Table.HeaderCell>
                  <Table.HeaderCell>角色</Table.HeaderCell>
                  <Table.HeaderCell textAlign="right">分數</Table.HeaderCell>
                  <Table.HeaderCell
                    textAlign="center"
                    style={{ width: "100px" }}
                  >
                    操作
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {scorecards.length > 0 ? (
                  scorecards.map((item) => (
                    <Table.Row key={item.scorecard_id}>
                      <Table.Cell>{item.game_name}</Table.Cell>
                      <Table.Cell>{item.play_date}</Table.Cell>
                      <Table.Cell>{item.player_name}</Table.Cell>
                      <Table.Cell>{item.role_name}</Table.Cell>
                      <Table.Cell textAlign="right">
                        <strong>{item.points}</strong>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {/* 編輯按鈕 */}
                        <Button
                          color="yellow"
                          size="mini"
                          icon
                          onClick={() => handleEditClick(item)}
                          title="編輯"
                          style={{ marginRight: "5px" }}
                        >
                          <Icon name="edit" />
                        </Button>
                        {/* 刪除按鈕 */}
                        <Button
                          color="red"
                          size="mini"
                          icon
                          onClick={() => handleDelete(item.scorecard_id)}
                          title="刪除"
                        >
                          <Icon name="trash" />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan="5" textAlign="center">
                      目前沒有任何戰績紀錄
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </Tab.Pane>
      ),
    },
  ];

  const tabList = () => <Tab panes={panes} />;

  return (
    <Container style={{ marginTop: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Header as="h2" dividing style={{ borderBottom: "none", margin: 0 }}>
          🎲 桌遊戰績計分系統
        </Header>
        <Button primary icon labelPosition="left" onClick={handleAddClick}>
          <Icon name="add" />
          新增戰績
        </Button>
      </div>
      {tabList()}
      {/* <Game />
      <Session /> */}
    </Container>
  );
}

export default index;
