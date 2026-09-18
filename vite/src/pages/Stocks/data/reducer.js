import dayjs from "dayjs";
const nextWeek = dayjs().add(7, "day");
// 初始化資料
export const initialState = {
  data: [], // 資料
  loading: false, //載入中
  isEditFormOpen: false, // 編輯表單開啟
  // editedRowIndex: -1, // 編輯列索引
  editingRow: null, //編輯中的列
  // 1. 新增：搜尋條件狀態
  searchParams: {},
};

export const reducer = (state, action) => {
  switch (action.type) {
    // 2. 新增：更新搜尋欄位的輸入值
    case "SET_SEARCH_PARAMS":
      return {
        ...state,
        searchParams: {
          ...state.searchParams,
          ...action.payload, // 動態更新 startDate, endDate 或 keyword
        },
      };

    // 3. 新增：重置搜尋條件
    case "RESET_SEARCH_PARAMS":
      return {
        ...state,
        searchParams: initialState.searchParams,
      };

    // 4. 新增/調整：觸發查詢時開啟 loading
    case "FETCH_START":
      return {
        ...state,
        loading: true,
      };

    case "LOAD_SUCCESS":
      // console.log(action.payload.data);
      return {
        ...state,
        data: action.payload.data,
        loading: false,
      };

    // 按下新增鈕,開啟編輯表單
    case "OPEN_FORM":
      return {
        ...state,
        isEditFormOpen: true,
        editingRow: null,
      };
    // 按下表格列的編輯鈕,開啟編輯表單
    case "OPEN_EDIT":
      return {
        ...state,
        isEditFormOpen: true,
        editingRow: action.payload.row,
      };

    // 關閉編輯表單
    case "CLOSE_EDIT":
      return {
        ...state,
        isEditFormOpen: false,
        // dataProcessRow: action.payload.row,
      };

    // 新增成功
    case "ADD_SUCCESS":
      return {
        ...state,
        data: [action.payload.row, ...state.data],
        isEditFormOpen: false,
        // editingRow: null,
      };

    // 2. 更新成功：關閉 Modal 並「清空」暫存的編輯目標
    case "UPDATE_SUCCESS":
      console.log(action.payload.row);
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload.row.id
            ? { ...item, ...action.payload.row }
            : item,
        ),
        isEditFormOpen: false,
      };

    case "DELETE_SUCCESS":
      return {
        ...state,
        data: state.data.filter((obj) => obj.id !== action.payload.id),
        isEditFormOpen: false,
        // dataProcessRow: null, // 👈 補上這行，避免 State 殘留已刪除的舊資料
      };

    default:
      return state;
  }
};
