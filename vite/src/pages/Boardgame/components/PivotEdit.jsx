import React, { useState, useEffect } from "react";
import {
  Table,
  Header,
  Input,
  Dropdown,
  Form,
  Button,
} from "semantic-ui-react";
import { updateScorecard } from "../api";
import { useRoleOptions } from "./useRoleOptions";

export default function PivotEdit({ data = [], onPointsChange }) {
  const { options, loading } = useRoleOptions();
  //   console.log(data);
  // 1. 本地狀態：記錄哪些資料被修改了，或者追蹤正在編輯的儲存格
  // 格式預期為 "sessionId_playerId"
  const [editingCell, setEditingCell] = useState(null);

  //   在 React 中，useState(data) 只會在元件「第一次掛載 (Mount)」時執行一次。
  // 如果你的資料是透過 API 非同步抓取的（例如頁面剛打開時 data 是空的 []，過了一秒資料才回來），父元件傳進來的 data 雖然更新了，但 tableData 因為是 State，不會自動跟著 prop 改變，導致畫面依然維持空資料的狀態。

  // 為了讓畫面可以即時反應修改，我們將傳入的 data 存入本地 state（也可以透過 callback 回傳給父元件）
  const [tableData, setTableData] = useState(data);

  // 用一組 state 存 formData
  const [formData, setFormData] = useState(null);

  // 2. 當外部的 data 改變時（例如 API 載入完成），同步更新本地 state
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // 依照 game_name 進行遊戲分組
  const gamesObj = Object.groupBy(
    tableData,
    (item) => item.game_name || item.game_id,
  );
  const gameGroups = Object.entries(gamesObj);

  // 處理分數變更
  const handlePointChange = async (
    sessionId,
    playerId,
    newPoints,
    playerRecord,
  ) => {
    const updatedData = tableData.map((item) => {
      if (
        String(item.session_id) === String(sessionId) &&
        String(item.player_id) === String(playerId)
      ) {
        return { ...item, points: newPoints };
      }
      return item;
    });
    setTableData(updatedData);

    // 如果父元件需要接收更新後的資料，可以呼叫此 callback
    if (onPointsChange) {
      onPointsChange(updatedData);
    }

    // 3. 呼叫後端 API 更新資料庫
    try {
      await updateScorecard(
        playerRecord.scorecard_id, // 第一個參數：id
        {
          ...playerRecord,
          points: newPoints, // 第二個參數：data 物件
        },
      );
    } catch (error) {
      console.error("更新分數失敗:", error);
      // 可以在這裡處理失敗邏輯（例如跳出錯誤提示，或重新整理資料）
      alert("更新分數失敗，請稍後再試");
    }
  };

  const handleCellClick = (playerRecord, cellKey) => {
    setFormData(playerRecord);
    setEditingCell(cellKey);
    console.log("cell click");
  };

  const handleChange = (e, { value }) => {
    // 從 options 裡面找出被選中的那一個選項
    const selectedOption = options.find((opt) => opt.value === value);

    setFormData({
      ...formData,
      role_id: value,
      role_name: selectedOption ? selectedOption.text : "", // 同時更新 role_name
    });
  };
  //   const handleInputChange = (e, { value }) => {
  //     setFormData({ ...formData, points: value });
  //     console.log(value);
  //   };

  const handleInputChange = (e, { value }) => {
    // 必須使用函式寫法 (prev) =>，確保只更新 points，絕對不要動到其他欄位！
    setFormData((prev) => ({
      ...prev,
      points: value,
    }));
  };

  const handleSave = async () => {
    try {
      // 1. 呼叫後端 API 更新（確保後端也有收到 role_id）
      await updateScorecard(formData.scorecard_id, formData);

      // 2. 更新前端本地狀態
      const updatedData = tableData.map((item) => {
        if (formData.scorecard_id === item.scorecard_id) {
          return formData; // 包含最新的 role_id, role_name, points
        }
        return item;
      });
      setTableData(updatedData);

      // 3. 關閉編輯狀態
      setEditingCell(null);
      setFormData(null);
    } catch (error) {
      console.error("儲存失敗:", error);
      alert("儲存失敗，請稍後再試");
    }
  };
  //   const handleSave = () => {
  //     const updatedData = tableData.map((item) => {
  //       if (formData.scorecard_id === item.scorecard_id) {
  //         return formData;
  //       }
  //       return item;
  //     });
  //     setTableData(updatedData);
  //     setEditingCell(null);
  //     console.log(formData);
  //   };

  const renderGamePivotTable = (gameName, gameRecords) => {
    const playersObj = Object.groupBy(gameRecords, (item) => item.player_id);
    const sessionsObj = Object.groupBy(gameRecords, (item) => item.session_id);

    const playerList = Object.entries(playersObj);
    const sessionList = Object.entries(sessionsObj);

    return (
      <div key={gameName} style={{ marginBottom: "2rem" }}>
        <Header as="h3" color="blue" dividing>
          🎮 遊戲：{gameName}
        </Header>

        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>日期 / 場次</Table.HeaderCell>
              {playerList.map(([playerId, pRecords]) => (
                <Table.HeaderCell key={playerId} textAlign="center">
                  {pRecords[0]?.player_name || `Player ${playerId}`}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {sessionList.map(([sId, sRecords]) => {
              const playDate = sRecords[0]?.play_date || `Session ${sId}`;

              return (
                <Table.Row key={sId}>
                  <Table.Cell style={{ fontWeight: "bold" }}>
                    {playDate} (場次 #{sId})
                  </Table.Cell>

                  {playerList.map(([playerId]) => {
                    const playerRecord = gameRecords.find(
                      (item) =>
                        String(item.player_id) === String(playerId) &&
                        String(item.session_id) === String(sId),
                    );

                    const cellKey = `${sId}_${playerId}`;
                    const isEditing = editingCell === cellKey;

                    return (
                      <Table.Cell
                        key={playerId}
                        textAlign="center"
                        // onClick={() => playerRecord && setEditingCell(cellKey)}
                        onClick={() => handleCellClick(playerRecord, cellKey)}
                        style={{ cursor: playerRecord ? "pointer" : "default" }}
                      >
                        {isEditing ? (
                          /* 編輯狀態：顯示輸入框 */
                          <>
                            {/* 「阻止事件往上傳遞（Stop Propagation）」。才不會點擊form時,觸發上層 onClick */}
                            <div onClick={(e) => e.stopPropagation()}>
                              <Form>
                                <Form.Group widths="equal">
                                  {/* 遊戲選擇 Dropdown */}
                                  <Form.Field>
                                    <label>遊戲名稱</label>
                                    <Dropdown
                                      search
                                      selection
                                      fluid
                                      name="game_id"
                                      options={options}
                                      value={formData.role_id || ""}
                                      onChange={handleChange}
                                      placeholder="請選擇遊戲..."
                                    />
                                  </Form.Field>

                                  {/* 分數輸入 Input */}
                                  <Form.Field>
                                    <label>分數調整</label>
                                    <Input
                                      // autoFocus
                                      // value={playerRecord.points}
                                      value={formData.points}
                                      onChange={handleInputChange}
                                      // onChange={(e) =>
                                      //   handlePointChange(
                                      //     sId,
                                      //     playerId,
                                      //     e.target.value,
                                      //     playerRecord,
                                      //   )
                                      // }
                                      // onKeyDown={(e) => {
                                      //   if (e.key === "Enter")
                                      //     setEditingCell(null);
                                      // }}
                                      placeholder="輸入分數"
                                    />
                                  </Form.Field>
                                  <Form.Field>
                                    <Button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation(); // 阻止事件冒泡
                                        handleSave();
                                      }}
                                    >
                                      儲存
                                    </Button>
                                  </Form.Field>
                                </Form.Group>
                              </Form>
                            </div>
                            {/* <Dropdown
                              search
                              label="game_name"
                              name="game_id"
                              selection
                              options={options}
                            />
                            <Input
                              autoFocus
                              value={playerRecord.points}
                              onChange={(e) =>
                                handlePointChange(
                                  sId,
                                  playerId,
                                  e.target.value,
                                  playerRecord,
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") setEditingCell(null); // 按 Enter 也可以結束編輯
                              }}
                              style={{ width: "80px" }}
                            /> */}
                          </>
                        ) : (
                          /* 一般狀態：顯示分數 */
                          <div>
                            {playerRecord ? (
                              <strong>
                                {playerRecord.role_name}
                                {playerRecord.role_name && " / "}
                                {playerRecord.points} 分
                              </strong>
                            ) : (
                              <span style={{ color: "#ccc" }}>-</span>
                            )}
                          </div>
                        )}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  };

  if (!tableData || tableData.length === 0) {
    return <div>目前沒有資料</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      {gameGroups.map(([gameName, gameRecords]) =>
        renderGamePivotTable(gameName, gameRecords),
      )}
    </div>
  );
}
