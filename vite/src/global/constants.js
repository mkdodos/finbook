const isDev = process.env.NODE_ENV === "development";

const HOST = isDev
  ? "http://192.168.0.10" // 開發環境 (區網 IP 或 localhost)
  : "https://minisoft.acsite.org"; // 正式環境：必須是 HTTPS 網域

export const API_HOST = isDev
  ? `${HOST}:8888/finbook/pdo`
  : `${HOST}/finbook/pdo`; // 正式環境通常使用預設 443 埠號 (無需寫 Port)
