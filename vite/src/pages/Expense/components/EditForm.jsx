import React, { useState, useEffect } from "react";
import { Button, Modal, Form, TextArea } from "semantic-ui-react";
import { Api } from "../data/api";
import dayjs from "dayjs";

const EditForm = ({ state, dispatch }) => {
  // 判斷是否為編輯模式（有 dataProcessRow 且含有 id）
  const { editingRow, isEditFormOpen } = state;
  const isEdit = Boolean(editingRow);

  const initState = {
    id: "",
    work_id: "",
    transaction_date: dayjs().format("YYYY-MM-DD"), // 🎉 自動帶入當天日期，例如 "2026-08-19"
    arr_note: "",
  };
  // 初始化 State
  const [formData, setFormData] = useState(initState);

  // 關鍵點：當 open 或 dataProcessRow 改變時，自動更新表單 State
  useEffect(() => {
    console.log(editingRow);
    // 只有在彈窗開啟且 editingRow 有值時才更新
    if (isEditFormOpen && editingRow) {
      setFormData({
        // 使用 optional chaining ?. 避免 null 崩潰
        id: editingRow.id,
        transaction_date: editingRow.transaction_date,
        category_id: editingRow?.category_id ?? "",
        amount: editingRow.amount,
        note: editingRow.note,
      });
    } else {
      setFormData(initState);
    }
  }, [editingRow, isEditFormOpen]);

  const handleChange = (e, { name, value }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
          <Form.Input
            label="消費日"
            type="date"
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleChange}
          />
          <Form.Input
            label="類別"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
          />
          <Form.Input
            label="項目"
            name="note"
            value={formData.note}
            onChange={handleChange}
          />
          <Form.Input
            label="金額"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
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
