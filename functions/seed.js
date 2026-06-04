const admin = require("firebase-admin");
const path = require("path");

// Path to the service account key file
const serviceAccountPath = path.join(__dirname, "..", "hojyokin-navi-firebase-adminsdk-fbsvc-4f29752026.json");
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const subsidies = [
  {
    id: "it-2026",
    name: "IT導入補助金 2026",
    agency: "経済産業省 / 中小企業庁",
    category: "DX・IT",
    status: "open",
    statusLabel: "公募中",
    score: 92,
    matchReasons: [
      "業種「ソフトウェア業」が対象内",
      "従業員規模 12名が小規模事業者要件に合致",
      "クラウド型業務システム導入予定が補助対象"
    ],
    summary: "ITツール導入による業務効率化・DX推進を支援。クラウドサービス・ECサイト構築・セキュリティ対策などが対象。",
    maxAmount: 4500000,
    subsidyRate: 0.66,
    rateLabel: "1/2〜2/3",
    appStart: "2026-05-15",
    appEnd: "2026-07-04",
    daysLeft: 38,
    adoptionRate: 0.58,
    adoptionHistory: [0.52, 0.55, 0.61, 0.58, 0.60, 0.58],
    docs: ["事業計画書", "見積書", "履歴事項全部証明書", "納税証明書"],
    tags: ["公募中", "全国", "スピード採択"],
    sourceUrl: "https://it-shien.smrj.go.jp"
  },
  {
    id: "monodukuri-19",
    name: "ものづくり・商業・サービス生産性向上促進補助金 第19次",
    agency: "中小企業庁 / 全国中小企業団体中央会",
    category: "設備投資・新商品開発",
    status: "open",
    statusLabel: "公募中",
    score: 86,
    matchReasons: [
      "革新的サービス開発の取組として該当可能性高",
      "設備投資 800万円規模が補助上限内",
      "事業計画書の準備期間あり"
    ],
    summary: "革新的な製品・サービス開発、生産プロセス改善のための設備投資等を支援。一般型・グローバル展開型・グリーン枠あり。",
    maxAmount: 12500000,
    subsidyRate: 0.5,
    rateLabel: "1/2",
    appStart: "2026-04-01",
    appEnd: "2026-06-12",
    daysLeft: 16,
    adoptionRate: 0.42,
    adoptionHistory: [0.38, 0.41, 0.45, 0.50, 0.44, 0.42],
    docs: ["事業計画書", "決算書", "賃金引上計画書", "見積書複数"],
    tags: ["締切間近", "設備投資", "高単価"],
    sourceUrl: "https://portal.monodukuri-hojo.jp"
  },
  {
    id: "jizoku-15",
    name: "小規模事業者持続化補助金 第15回",
    agency: "日本商工会議所 / 全国商工会連合会",
    category: "販路開拓",
    status: "pre",
    statusLabel: "公募前",
    score: 78,
    matchReasons: [
      "従業員5名以下の小規模事業者要件に該当",
      "Web販路拡大計画あり",
      "過去採択履歴なし(優遇枠)"
    ],
    summary: "小規模事業者の販路開拓・生産性向上の取組を支援。チラシ作成・Web広告・店舗改装などが対象。次回公募は2026年7月開始見込み。",
    maxAmount: 2000000,
    subsidyRate: 0.66,
    rateLabel: "2/3",
    appStart: "2026-07-15",
    appEnd: "2026-09-04",
    daysLeft: null,
    preOpenInDays: 49,
    adoptionRate: 0.65,
    adoptionHistory: [0.68, 0.66, 0.63, 0.65, 0.67, 0.65],
    docs: ["経営計画書", "補助事業計画書", "事業支援計画書(商工会発行)"],
    tags: ["まもなく公募", "小規模事業者", "高採択率"],
    sourceUrl: "https://r3.jizokukahojokin.info"
  },
  {
    id: "jigyou-saikoutiku-13",
    name: "事業再構築補助金 第13回公募",
    agency: "経済産業省 / 中小企業庁",
    category: "事業転換・再構築",
    status: "open",
    statusLabel: "公募中",
    score: 71,
    matchReasons: [
      "売上減少要件は不明 — 入力確認推奨",
      "新分野展開の意向あり",
      "事業計画書の準備工数が大きい"
    ],
    summary: "ポストコロナの経済社会の変化に対応した事業再構築を支援。新市場進出・事業転換・業種転換・業態転換等が対象。",
    maxAmount: 70000000,
    subsidyRate: 0.5,
    rateLabel: "1/2〜2/3",
    appStart: "2026-04-20",
    appEnd: "2026-06-28",
    daysLeft: 32,
    adoptionRate: 0.36,
    adoptionHistory: [0.45, 0.40, 0.38, 0.35, 0.37, 0.36],
    docs: ["事業再構築要件確認書", "事業計画書", "認定支援機関確認書", "決算書3期分"],
    tags: ["大型", "事業転換", "認定支援機関必須"],
    sourceUrl: "https://jigyou-saikouchiku.go.jp"
  },
  {
    id: "career-up-2026",
    name: "キャリアアップ助成金（正社員化コース）",
    agency: "厚生労働省",
    category: "雇用・人材",
    status: "open",
    statusLabel: "通年",
    score: 64,
    matchReasons: [
      "正社員転換の予定がある場合に該当",
      "就業規則の整備 interrupt — 注意",
      "支給 is 事後精算"
    ],
    summary: "有期雇用労働者を正社員化した事業主に対し、対象者1人あたり最大80万円を助成。要件達成型のため計画的準備が重要。",
    maxAmount: 800000,
    subsidyRate: 1.0,
    rateLabel: "定額",
    appStart: "2026-04-01",
    appEnd: "2027-03-31",
    daysLeft: 308,
    adoptionRate: 0.83,
    adoptionHistory: [0.81, 0.82, 0.85, 0.84, 0.83, 0.83],
    docs: ["キャリアアップ計画書", "就業規則", "賃金台帳", "労働条件通知書"],
    tags: ["通年募集", "助成金", "高採択率"],
    sourceUrl: "https://www.mhlw.go.jp"
  },
  {
    id: "syouene-2026",
    name: "省エネルギー投資促進支援事業費補助金",
    agency: "経済産業省 資源エネルギー庁",
    category: "脱炭素・省エネ",
    status: "pre",
    statusLabel: "公募前",
    score: 58,
    matchReasons: [
      "設備更新計画と一部重複",
      "中小企業要件は満たす",
      "省エネ量の試算が必要"
    ],
    summary: "事業者の省エネ・脱炭素化に向けた設備更新を支援。指定設備導入や設備改修等が対象。次回公募は8月開始見込み。",
    maxAmount: 30000000,
    subsidyRate: 0.5,
    rateLabel: "1/3〜1/2",
    appStart: "2026-08-10",
    appEnd: "2026-09-20",
    daysLeft: null,
    preOpenInDays: 75,
    adoptionRate: 0.48,
    adoptionHistory: [0.50, 0.46, 0.49, 0.47, 0.48, 0.48],
    docs: ["事業計画書", "省エネ量計算書", "見積書", "設備仕様書"],
    tags: ["公募前", "省エネ", "計画工数大"],
    sourceUrl: "https://www.enecho.meti.go.jp"
  },
  {
    id: "tokyo-dx-2026",
    name: "東京都 中小企業デジタルツール導入促進支援事業",
    agency: "東京都 産業労働局",
    category: "地域・DX",
    status: "open",
    statusLabel: "公募中",
    score: 81,
    matchReasons: [
      "本店所在地が東京都内",
      "IT導入補助金との併用不可 — 比較検討推奨",
      "簡易申請方式で書類負担小"
    ],
    summary: "都内中小企業者のデジタルツール導入を支援。最大100万円・補助率1/2。事前相談を経て申請。",
    maxAmount: 1000000,
    subsidyRate: 0.5,
    rateLabel: "1/2",
    appStart: "2026-05-01",
    appEnd: "2026-08-29",
    daysLeft: 94,
    adoptionRate: 0.72,
    adoptionHistory: [0.70, 0.71, 0.74, 0.73, 0.72, 0.72],
    docs: ["申請書", "デジタルツール仕様書", "登記簿謄本"],
    tags: ["東京都", "簡易申請", "高採択率"],
    sourceUrl: "https://www.sangyo-rodo.metro.tokyo.lg.jp"
  },
  {
    id: "ryoko-jinzai-2026",
    name: "両立支援等助成金 (出生時両立支援コース)",
    agency: "厚生労働省",
    category: "雇用・人材",
    status: "open",
    statusLabel: "通年",
    score: 42,
    matchReasons: [
      "対象労働者の出生実績要 — 確認推奨",
      "業種要件あり",
      "事後精算のため資金繰り考慮"
    ],
    summary: "男性労働者の育児休業取得を促進した事業主への助成。1人目20万円・2人目以降10万円。",
    maxAmount: 200000,
    subsidyRate: 1.0,
    rateLabel: "定額",
    appStart: "2026-04-01",
    appEnd: "2027-03-31",
    daysLeft: 308,
    adoptionRate: 0.78,
    adoptionHistory: [0.76, 0.78, 0.80, 0.79, 0.78, 0.78],
    docs: ["支給申請書", "育児休業申出書", "賃金台帳"],
    tags: ["通年", "育休"],
    sourceUrl: "https://www.mhlw.go.jp"
  },
  {
    id: "shinjigyo-2026",
    name: "新事業進出補助金 第1回",
    agency: "経済産業省",
    category: "事業転換・再構築",
    status: "pre",
    statusLabel: "公募前",
    score: 88,
    matchReasons: [
      "新事業計画（SaaS拡張）が対象に合致",
      "投資規模が補助対象帯",
      "事業再構築補助金の後継として注目"
    ],
    summary: "中小企業の新事業進出を支援する新設補助金。最大9,000万円・補助率1/2。パブリックコメント完了済み、8月公募見込み。",
    maxAmount: 90000000,
    subsidyRate: 0.5,
    rateLabel: "1/2",
    appStart: "2026-08-01",
    appEnd: "2026-10-15",
    daysLeft: null,
    preOpenInDays: 66,
    adoptionRate: null,
    adoptionHistory: [],
    docs: ["事業計画書", "新事業内容説明書", "決算書", "認定支援機関確認書"],
    tags: ["新設", "公募前", "大型", "AI予測"],
    sourceUrl: "https://www.meti.go.jp"
  },
  {
    id: "shoukibo-tokyo",
    name: "東京都 創業助成事業",
    agency: "東京都 産業労働局 / TOKYO創業ステーション",
    category: "起業・創業",
    status: "open",
    statusLabel: "公募中",
    score: 35,
    matchReasons: [
      "対象は創業5年未満 — 該当外の可能性",
      "都内開業要件あり",
      "事前申請(エントリー)必須"
    ],
    summary: "都内で創業して5年未満の中小企業者等が対象。賃借料・広告費・人件費等の創業初期費用を最大400万円助成。",
    maxAmount: 4000000,
    subsidyRate: 0.66,
    rateLabel: "2/3",
    appStart: "2026-04-10",
    appEnd: "2026-04-23",
    daysLeft: -34,
    adoptionRate: 0.18,
    adoptionHistory: [0.20, 0.18, 0.16, 0.19, 0.17, 0.18],
    docs: ["助成申請書", "事業計画書", "創業計画書"],
    tags: ["創業", "東京都", "難関"],
    sourceUrl: "https://www.tokyo-kosha.or.jp"
  }
];

async function seed() {
  console.log("Starting DB seeding...");
  const batch = db.batch();
  
  for (const s of subsidies) {
    const docRef = db.collection("subsidies").doc(s.id);
    batch.set(docRef, s, { merge: true });
    console.log(`Prepared subsidy: ${s.name}`);
  }
  
  await batch.commit();
  console.log("Successfully seeded subsidies into Firestore!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
