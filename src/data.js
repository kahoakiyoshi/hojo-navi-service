// ユーザー会社情報モック
export const MOCK_COMPANY = {
  name: "",
  url: "",
  industry: "",
  industryCode: "",
  employeeCount: null,
  prefecture: "",
  revenue: null,
  revenueLabel: "",
  established: "",
  businessSummary: "",
  capital: null
};

// アラートモック
export const MOCK_ALERTS = [];

// 専門家モック
export const MOCK_EXPERTS = [];

export const formatYen = (n) => {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}億円`;
  if (n >= 10000) return `${(n / 10000).toLocaleString("ja-JP")}万円`;
  return `${n.toLocaleString("ja-JP")}円`;
};

export const formatDate = (s) => {
  const d = new Date(s);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};
