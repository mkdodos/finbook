import React, { useState, useEffect } from "react";
import { Button, Modal, Form, TextArea } from "semantic-ui-react";
import { Api } from "../data/api";
import dayjs from "dayjs";

const EditForm = ({ state, dispatch, columns }) => {
  // 判斷是否為編輯模式（有 dataProcessRow 且含有 id）
  const { editingRow, isEditFormOpen } = state;
  const isEdit = Boolean(editingRow);

  // 💡 根據 COLUMNS 動態產生 initState
  const getInitialState = () => {
    return columns.reduce(
      (acc, col) => {
        // 優先使用 name，若無則使用 key
        const fieldName = col.name || col.key;
        if (!fieldName) return acc;

        // 依據 formType 設定預設值
        switch (col.formType) {
          case "date":
            acc[fieldName] = dayjs().format("YYYY-MM-DD");
            break;
          case "number":
            acc[fieldName] = ""; // 或 0，依據表單輸入習慣設定
            break;
          default:
            acc[fieldName] = "";
            break;
        }

        return acc;
      },
      { id: "" },
    ); // 若需要預留 id 欄位，可在此設定預設值
  };

  const initState = getInitialState();

  // 初始化 State
  const [formData, setFormData] = useState(initState);

  // 關鍵點：當 open 或 dataProcessRow 改變時，自動更新表單 State
  useEffect(() => {
    // 只有在彈窗開啟且 editingRow 有值時才更新 (代表進入編輯模式)
    if (isEditFormOpen && editingRow) {
      // 1. 自動根據 columns 映射編輯資料
      const newFormData = columns.reduce((acc, col) => {
        const fieldName = col.name || col.key;

        if (fieldName) {
          let val = editingRow[fieldName] ?? "";

          // 🛡️ 防呆：如果是日期欄位，確保截斷為 YYYY-MM-DD 格式，否則 input 會顯示空白
          if (col.formType === "date" && val) {
            val = String(val).split("T")[0];
          }

          acc[fieldName] = val;
        }
        return acc;
      }, {});

      // 2. 補上 id 欄位 (通常 id 不會在 columns 表單定義裡)
      newFormData.id = editingRow.id ?? "";

      setFormData(newFormData);
    } else if (!isEditFormOpen || !editingRow) {
      // 若不是編輯模式 (例如新增模式)，帶入初始預設值
      setFormData(initState);
    }
  }, [editingRow, isEditFormOpen]);

  const handleChange = (e, { name, value }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 同時支援 原生 Input (e.target) 與 Semantic Select (data)
  // const handleChange = (e, data) => {
  //   const name = data?.name || e?.target?.name;
  //   const value = data?.value !== undefined ? data.value : e?.target?.value;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleSubmit = async () => {
    if (isEdit) {
      // 1. 執行更新 API
      const response = await Api.update(formData);

      console.log(response);
      // 2. 觸發 Reducer 更新
      dispatch({
        type: "UPDATE_SUCCESS",
        payload: { row: formData },
      });
    } else {
      // 1. 執行新增 API (假設後端傳回包含新 id 的物件)
      const response = await Api.create(formData);
      //   console.log(newId);
      // 模擬後端回傳的物件：
      //   const newRow = { ...formData, id: Date.now() };
      const newRow = { ...formData, id: response.id };

      // 2. 觸發 Reducer 新增
      dispatch({
        type: "ADD_SUCCESS",
        payload: { row: newRow },
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("確定刪除嗎?")) return;
    await Api.delete(formData.id);
    dispatch({
      type: "DELETE_SUCCESS",
      payload: { id: formData.id },
    });
  };

  return (
    <Modal
      open={state.isEditFormOpen}
      onClose={() => dispatch({ type: "CLOSE_EDIT" })}
      size="tiny"
    >
      <Modal.Header>{isEdit ? "編輯" : "新增"}</Modal.Header>

      <Modal.Content>
        <Form>
          {columns
            // 💡 1. 濾除不需要出現在表單中的欄位
            .filter((col) => !col.hideInForm)
            // 💡 2. 渲染剩餘的表單欄位
            .map((col) => {
              // 💡 判斷是否為下拉選單欄位
              if (col.formType === "select") {
                return (
                  <Form.Select
                    key={col.key}
                    label={col.title}
                    name={col.name}
                    value={formData[col.name] || ""}
                    onChange={handleChange}
                    options={col.options || []} // 傳入選項陣列，例如 [{ label: '選項A', value: 'A' }]
                  />
                );
              }

              return (
                <Form.Input
                  key={col.key}
                  label={col.title}
                  type={col.formType || "text"} // 若沒設定 type 預設為 "text"
                  name={col.name}
                  value={formData[col.name] || ""}
                  onChange={handleChange}
                />
              );
            })}
        </Form>
      </Modal.Content>

      <Modal.Actions>
        <Button primary onClick={handleSubmit}>
          儲存
        </Button>
        {/* 僅在編輯模式 (isEdit) 時才顯示刪除按鈕 */}
        {isEdit && (
          <Button negative floated="left" type="button" onClick={handleDelete}>
            刪除
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default EditForm;
