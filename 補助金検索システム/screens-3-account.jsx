// =========================
// MyPage + Watchlist + Alerts + Expert + Auth + AIChat + Admin
// =========================

// ====== USR-07: MyPage Dashboard ======
const MyPage = ({ onOpenDetail, onNav, isMobile }) => {
  const c = MOCK_COMPANY;
  const unread = MOCK_ALERTS.filter(a => !a.read).length;
  const watched = SUBSIDIES.slice(0, 4);

  return (
    <div style={{ background: "var(--bg)", paddingBottom: 60 }}>
      {/* Editorial masthead */}
      <div style={{
        padding: isMobile ? "24px 22px 22px" : "36px 56px 28px",
        borderBottom: "1px solid var(--line-ink)",
      }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>
          {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })} · おはようございます
        </div>
        <h1 className="display" style={{
          fontSize: isMobile ? 26 : 38,
          margin: "0 0 8px",
          fontWeight: 600,
          letterSpacing: "-0.015em",
          lineHeight: 1.25
        }}>{c.name} <em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>様</em></h1>
        <div className="muted sm">{c.industry} · {c.employeeCount} 名 · {c.prefecture}</div>
      </div>

      {/* Stats row */}
      <div style={{
        padding: isMobile ? "20px 22px" : "28px 56px",
        borderBottom: "1px solid var(--line)",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: 0,
      }}>
        {[
          { l: "マッチ補助金", v: "10", u: "件", to: "USR-04" },
          { l: "ウォッチ中", v: "04", u: "件", to: "USR-10" },
          { l: "未読アラート", v: String(unread).padStart(2, "0"), u: "件", to: "USR-09", hot: true },
          { l: "申請準備中", v: "01", u: "件", to: "USR-07" },
        ].map((s, i) => (
          <div key={i} onClick={() => onNav(s.to)} style={{
            cursor: "pointer",
            paddingLeft: i ? 24 : 0,
            borderLeft: i ? "1px solid var(--line)" : 0
          }}>
            <div className="eyebrow" style={{ marginBottom: 10, color: s.hot ? "var(--amber)" : undefined }}>{s.l}</div>
            <div className="num" style={{
              fontSize: isMobile ? 32 : 42,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: s.hot ? "var(--amber)" : "var(--ink)"
            }}>
              {s.v}<span style={{ fontSize: 12, color: "var(--ink-4)", marginLeft: 4, fontWeight: 500, letterSpacing: 0 }}>{s.u}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: isMobile ? "22px 22px 0" : "32px 56px 0" }}>
        {/* Important alert callout */}
        <div className="fade-in" style={{
          padding: "20px 22px",
          marginBottom: 32,
          borderLeft: "3px solid var(--amber)",
          background: "var(--bg-inset)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16, alignItems: "center"
        }}>
          <div>
            <div className="eyebrow eyebrow-amber" style={{ marginBottom: 6 }}>公募前アラート · 予測</div>
            <div className="serif" style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
              <em style={{ fontStyle: "italic" }}>新事業進出補助金</em> が間もなく公募開始
            </div>
            <div className="muted sm" style={{ lineHeight: 1.6 }}>
              予算動向から <span className="num bold" style={{ color: "var(--ink)" }}>49 日後</span> の公募開始を予測。事業計画書の準備を今から始めると間に合います。
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => onOpenDetail("shinjigyo-2026")}>詳細 →</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: 36 }}>
          <div>
            <div className="section-head">
              <h3>ウォッチ中の補助金</h3>
              <button className="btn-link sm" onClick={() => onNav("USR-10")}>全件 ({watched.length}) →</button>
            </div>
            <div>
              {watched.map((s, i) => (
                <div key={s.id} style={{
                  padding: "16px 0",
                  borderBottom: "1px solid var(--line)",
                  display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 18, alignItems: "center",
                  cursor: "pointer"
                }} onClick={() => onOpenDetail(s.id)}>
                  <div className="num" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.score}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="serif" style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{s.name}</div>
                    <div className="row" style={{ gap: 8 }}>
                      <StatusBadge status={s.status} />
                      <span className="muted-2 num" style={{ fontSize: 11 }}>
                        {s.status === "pre" ? `${s.preOpenInDays} 日後` : s.daysLeft > 0 ? `あと ${s.daysLeft} 日` : "終了"}
                      </span>
                    </div>
                  </div>
                  <span className="muted">→</span>
                </div>
              ))}
            </div>

            <div className="section-head" style={{ marginTop: 36 }}>
              <h3>申請進捗</h3>
            </div>
            <div style={{ padding: "20px 0", borderBottom: "1px solid var(--line)" }}>
              <div className="between" style={{ marginBottom: 18 }}>
                <div>
                  <div className="serif" style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>IT導入補助金 2026</div>
                  <div className="muted sm">準備中 · 締切まで <span className="num">38 日</span></div>
                </div>
                <span className="badge badge-pre">準備中</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, marginBottom: 14 }}>
                {[
                  { l: "GBizID", done: true },
                  { l: "計画書", done: true },
                  { l: "見積書", done: true },
                  { l: "申請入力", done: false, now: true },
                  { l: "結果通知", done: false },
                ].map((p, i) => (
                  <div key={i}>
                    <div style={{
                      height: 2,
                      background: p.done ? "var(--ink)" : p.now ? "var(--ink-3)" : "var(--line)",
                    }} />
                    <div className="eyebrow" style={{
                      marginTop: 8,
                      fontSize: 9.5,
                      color: p.done ? "var(--ink)" : p.now ? "var(--ink)" : "var(--ink-4)",
                      fontWeight: p.now ? 600 : 500
                    }}>
                      <span className="num muted-2" style={{ marginRight: 4 }}>0{i + 1}</span>{p.l}
                    </div>
                  </div>
                ))}
              </div>
              <div className="between" style={{ marginTop: 14 }}>
                <span className="muted sm">次のタスク — <strong style={{ color: "var(--ink)" }}>Jグランツで申請入力</strong></span>
                <button className="btn btn-ghost btn-sm">進捗を更新</button>
              </div>
            </div>
          </div>

          <aside className="col" style={{ gap: 36 }}>
            {/* Company card */}
            <div>
              <div className="section-head">
                <h3 style={{ fontSize: 14 }}>登録会社情報</h3>
                <button className="btn-link sm" onClick={() => onNav("USR-08")}>編集</button>
              </div>
              <div className="col" style={{ gap: 0 }}>
                {[
                  ["業種", c.industry],
                  ["従業員数", `${c.employeeCount} 名`],
                  ["所在地", c.prefecture],
                  ["売上", c.revenueLabel],
                  ["設立", c.established],
                ].map(([l, v], i) => (
                  <div key={i} className="between" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                    <span className="eyebrow" style={{ fontSize: 9.5 }}>{l}</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 14 }}>
                最新情報で再診断
              </button>
            </div>

            {/* Recent alerts */}
            <div>
              <div className="section-head">
                <h3 style={{ fontSize: 14 }}>最近のアラート</h3>
                <button className="btn-link sm" onClick={() => onNav("USR-09")}>全件</button>
              </div>
              <div>
                {MOCK_ALERTS.slice(0, 3).map((a, i) => (
                  <div key={a.id} style={{
                    padding: "12px 0",
                    borderBottom: "1px solid var(--line)"
                  }}>
                    <div className="row" style={{ gap: 10, marginBottom: 4 }}>
                      <span className="eyebrow" style={{
                        fontSize: 9,
                        color: a.type === "pre_open" ? "var(--amber)" :
                          a.type === "deadline_near" ? "var(--crimson)" : "var(--ink-3)"
                      }}>{a.typeLabel}</span>
                      {!a.read && <span className="num muted-2 tiny">NEW</span>}
                    </div>
                    <div className="serif sm bold" style={{ marginBottom: 2 }}>{a.subsidyName}</div>
                    <div className="muted tiny" style={{ lineHeight: 1.6 }}>{a.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// ====== USR-10: Watchlist ======
const Watchlist = ({ onOpenDetail, isMobile }) => {
  const items = SUBSIDIES.slice(0, 5);
  return (
    <div style={{ padding: isMobile ? "24px 22px 80px" : "36px 56px 60px" }}>
      <div className="between" style={{ marginBottom: 28, alignItems: "flex-end" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Watchlist · {items.length} 件</div>
          <h1 className="display" style={{ fontSize: isMobile ? 26 : 36, margin: 0, fontWeight: 600, letterSpacing: "-0.015em" }}>
            ウォッチリスト
          </h1>
          <div className="muted sm" style={{ marginTop: 8 }}>関心の補助金を保存。締切前にアラートが届きます。</div>
        </div>
        {!isMobile && (
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-ghost btn-sm">CSV 出力</button>
            <button className="btn btn-ghost btn-sm">フィルター</button>
          </div>
        )}
      </div>

      {isMobile ? (
        <div style={{ borderTop: "1px solid var(--line-ink)" }}>
          {items.map((s, i) => (
            <div key={s.id} style={{
              padding: "16px 0",
              borderBottom: "1px solid var(--line)",
              display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "start"
            }} onClick={() => onOpenDetail(s.id)}>
              <div className="num" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.score}</div>
              <div style={{ minWidth: 0 }}>
                <div className="serif bold sm" style={{ marginBottom: 4 }}>{s.name}</div>
                <div className="row" style={{ gap: 6, marginBottom: 6 }}>
                  <StatusBadge status={s.status} />
                </div>
                <div className="muted-2 tiny">
                  上限 {window.formatYen(s.maxAmount)} · {s.status === "pre" ? `${s.preOpenInDays} 日後` : `あと ${s.daysLeft} 日`}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={e => e.stopPropagation()} style={{ padding: "4px 8px" }}>×</button>
            </div>
          ))}
        </div>
      ) : (
        <table className="tab">
          <thead>
            <tr>
              <th style={{ width: 50 }}>—</th>
              <th>スコア</th>
              <th>補助金名</th>
              <th>状態</th>
              <th style={{ textAlign: "right" }}>補助上限</th>
              <th style={{ textAlign: "right" }}>締切 / 開始</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((s, i) => (
              <tr key={s.id} style={{ cursor: "pointer" }}
                onClick={() => onOpenDetail(s.id)}>
                <td className="num muted-2" style={{ fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</td>
                <td className="num" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.score}</td>
                <td>
                  <div className="serif" style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</div>
                  <div className="muted-2 tiny">{s.agency}</div>
                </td>
                <td><StatusBadge status={s.status} /></td>
                <td className="num" style={{ textAlign: "right" }}>{window.formatYen(s.maxAmount)}</td>
                <td className="num" style={{ textAlign: "right" }}>
                  {s.status === "pre" ? `${s.preOpenInDays} 日後` : s.daysLeft > 0 ? `${s.daysLeft} 日` : "終了"}
                </td>
                <td onClick={e => e.stopPropagation()} style={{ textAlign: "right" }}>
                  <button className="btn btn-ghost btn-sm" style={{ padding: "4px 8px" }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ====== USR-09: Alerts ======
const Alerts = ({ onOpenDetail, isMobile }) => {
  const [tab, setTab] = useState("all");
  let items = MOCK_ALERTS;
  if (tab !== "all") items = items.filter(a => a.type === tab);

  return (
    <div style={{ padding: isMobile ? "24px 22px 80px" : "36px 56px 60px" }}>
      <div className="between" style={{ marginBottom: 22, alignItems: "flex-end" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Alerts · Inbox</div>
          <h1 className="display" style={{ fontSize: isMobile ? 26 : 36, margin: 0, fontWeight: 600, letterSpacing: "-0.015em" }}>
            アラート
          </h1>
          <div className="muted sm" style={{ marginTop: 8 }}>
            公募前 · 締切間近 · 新規マッチの通知一覧
          </div>
        </div>
        <button className="btn btn-ghost btn-sm">通知設定</button>
      </div>

      <div className="row" style={{ gap: 0, marginBottom: 28, borderBottom: "1px solid var(--line-ink)" }}>
        {[
          { id: "all", l: "すべて", n: MOCK_ALERTS.length },
          { id: "pre_open", l: "公募前", n: MOCK_ALERTS.filter(a => a.type === "pre_open").length },
          { id: "deadline_near", l: "締切間近", n: MOCK_ALERTS.filter(a => a.type === "deadline_near").length },
          { id: "condition_match", l: "新規マッチ", n: MOCK_ALERTS.filter(a => a.type === "condition_match").length },
        ].map(tt => (
          <button key={tt.id} onClick={() => setTab(tt.id)} style={{
            padding: "12px 22px 14px",
            color: tab === tt.id ? "var(--ink)" : "var(--ink-3)",
            borderBottom: "2px solid " + (tab === tt.id ? "var(--ink)" : "transparent"),
            marginBottom: -1,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: tab === tt.id ? 600 : 500,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            {tt.l}
            <span className="num muted-2" style={{ fontSize: 10 }}>({String(tt.n).padStart(2, "0")})</span>
          </button>
        ))}
      </div>

      <div>
        {items.map((a, i) => {
          const typeColor =
            a.type === "pre_open" ? "var(--amber)" :
              a.type === "deadline_near" ? "var(--crimson)" : "var(--ink)";
          return (
            <div key={a.id} style={{
              padding: "20px 0",
              borderBottom: "1px solid var(--line)",
              cursor: "pointer",
              display: "grid",
              gridTemplateColumns: "60px 1fr 200px 24px",
              gap: 24, alignItems: "start",
              borderTop: i === 0 ? "1px solid var(--line)" : 0
            }} onClick={() => onOpenDetail(a.subsidyId)}>
              <div className="num muted-2" style={{ fontSize: 11, letterSpacing: "0.04em" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                  <span className="eyebrow" style={{ color: typeColor, fontWeight: 600 }}>{a.typeLabel}</span>
                  <ChannelIco channel={a.channel} />
                  {!a.read && <span className="num" style={{ fontSize: 9, color: "var(--amber)", letterSpacing: "0.1em" }}>NEW</span>}
                </div>
                <div className="serif" style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{a.subsidyName}</div>
                <div className="muted sm" style={{ lineHeight: 1.7, maxWidth: 560 }}>{a.body}</div>
              </div>
              <div className="num muted-2" style={{ fontSize: 11, textAlign: "right" }}>
                {a.receivedAt}
              </div>
              <div className="muted" style={{ fontSize: 14, textAlign: "right" }}>→</div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "28px 0 0", marginTop: 28, borderTop: "1px solid var(--line-ink)" }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>通知設定 — Notification Preferences</div>
        <div>
          {[
            { l: "公募前アラート", d: "パブコメ・予算動向から開始予測", on: true },
            { l: "締切間近アラート", d: "ウォッチ補助金の 14 / 7 / 3 日前", on: true },
            { l: "新規マッチアラート", d: "条件にマッチする新補助金", on: false },
          ].map((s, i) => (
            <div key={i} className="between" style={{ padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
              <div>
                <div className="serif" style={{ fontSize: 15, fontWeight: 600 }}>{s.l}</div>
                <div className="muted sm" style={{ marginTop: 2 }}>{s.d}</div>
              </div>
              <div style={{
                width: 38, height: 22,
                background: s.on ? "var(--ink)" : "var(--line-strong)",
                position: "relative", cursor: "pointer", transition: "background 200ms"
              }}>
                <div style={{
                  position: "absolute", top: 2, left: s.on ? 18 : 2,
                  width: 18, height: 18, background: "var(--bg-elev)",
                  transition: "left 200ms"
                }} />
              </div>
            </div>
          ))}
        </div>
        <div className="row" style={{ gap: 12, marginTop: 18 }}>
          <span className="eyebrow">配信先</span>
          <ChannelIco channel="line" />
          <ChannelIco channel="email" />
          <button className="btn-link tiny">変更</button>
        </div>
      </div>
    </div>
  );
};

// ====== USR-11: Expert Consultation ======
const Expert = ({ isMobile }) => {
  const [picked, setPicked] = useState(MOCK_EXPERTS[0].id);
  const [phase, setPhase] = useState("pick"); // pick | chat
  const exp = MOCK_EXPERTS.find(e => e.id === picked);
  return (
    <div style={{ padding: isMobile ? "24px 22px 80px" : "36px 56px 60px" }}>
      <div className="between" style={{ marginBottom: 22, alignItems: "flex-end" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Expert Consultation</div>
          <h1 className="display" style={{ fontSize: isMobile ? 26 : 36, margin: 0, fontWeight: 600, letterSpacing: "-0.015em" }}>
            専門家相談
          </h1>
          <div className="muted sm" style={{ marginTop: 8 }}>
            株式会社CrownStrategy JV 監修ネットワーク · <strong style={{ color: "var(--emerald)" }}>初回 30 分 無料</strong>
          </div>
        </div>
        <div className="cv-toggle" style={{ display: isMobile ? "none" : "inline-flex" }}>
          <button className={phase === "pick" ? "on" : ""} onClick={() => setPhase("pick")}>Book</button>
          <button className={phase === "chat" ? "on" : ""} onClick={() => setPhase("chat")}>Active</button>
        </div>
      </div>

      {phase === "pick" ? (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 36 }}>
          <div style={{ borderTop: "1px solid var(--line-ink)" }}>
            {MOCK_EXPERTS.map((e, i) => (
              <div key={e.id} style={{
                padding: "24px 0",
                borderBottom: "1px solid var(--line)",
                cursor: "pointer",
                background: picked === e.id ? "var(--bg-inset)" : "transparent",
                paddingLeft: picked === e.id ? 16 : 0,
                transition: "padding 120ms, background 120ms",
              }} onClick={() => setPicked(e.id)}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "flex-start" }}>
                  <div className="num muted-2" style={{ fontSize: 11, paddingTop: 4, minWidth: 28 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="between" style={{ marginBottom: 8 }}>
                      <div>
                        <div className="serif" style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em" }}>{e.name}</div>
                        <div className="eyebrow" style={{ marginTop: 6 }}>{e.role}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="num" style={{ fontSize: 16, fontWeight: 600, color: "var(--amber)" }}>★ {e.rating}</div>
                        <div className="num muted-2" style={{ fontSize: 11, marginTop: 2 }}>{e.cases} 件対応</div>
                      </div>
                    </div>
                    <div style={{ color: "var(--ink-2)", lineHeight: 1.75, fontSize: 13, marginTop: 12, maxWidth: 540 }}>{e.profile}</div>
                    <div className="row" style={{ gap: 16, marginTop: 16, flexWrap: "wrap" }}>
                      <span className="eyebrow">空き</span>
                      {e.avail.map(a => (
                        <span key={a} className="num" style={{ fontSize: 11, color: "var(--ink-2)" }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside style={{ alignSelf: "flex-start" }}>
            <div className="eyebrow" style={{ marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--line-ink)" }}>相談予約フォーム</div>
            <div className="col" style={{ gap: 18 }}>
              <div>
                <div className="label">担当者</div>
                <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{exp.name}</div>
                <div className="muted-2 tiny">{exp.role}</div>
              </div>
              <div>
                <div className="label">対象の補助金（任意）</div>
                <select className="input">
                  <option>未選択</option>
                  {SUBSIDIES.slice(0, 5).map(s => <option key={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <div className="label">希望日時</div>
                <select className="input">
                  {exp.avail.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <div className="label">相談内容</div>
                <textarea className="input" rows={4} placeholder="どんな補助金を検討中で、何に困っているか..." />
              </div>
              <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
                <div className="between">
                  <span className="eyebrow">相談料金</span>
                  <span>
                    <span className="num" style={{ fontSize: 22, fontWeight: 600, color: "var(--emerald)" }}>¥0</span>
                    <span className="muted-2 tiny" style={{ marginLeft: 6 }}>初回 30 分</span>
                  </span>
                </div>
              </div>
              <button className="btn btn-primary btn-lg btn-block">この内容で予約する →</button>
            </div>
          </aside>
        </div>
      ) : (
        <ExpertChat exp={exp} />
      )}
    </div>
  );
};

const ExpertChat = ({ exp }) => (
  <div style={{ minHeight: 520, display: "grid", gridTemplateRows: "auto 1fr auto", border: "1px solid var(--line)" }}>
    <div className="between" style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)" }}>
      <div>
        <div className="serif" style={{ fontSize: 17, fontWeight: 600 }}>{exp.name}</div>
        <div className="muted-2 tiny" style={{ marginTop: 2 }}>{exp.role} · 通常 2 時間以内に返信</div>
      </div>
      <span className="badge badge-open">進行中</span>
    </div>
    <div style={{ padding: 28, overflowY: "auto", display: "flex", flexDirection: "column", gap: 22 }}>
      <ChatBubble side="them" name={exp.name} text="お問い合わせありがとうございます。IT 導入補助金 2026 の件、貴社のご状況を確認させていただきました。" time="14:02" />
      <ChatBubble side="them" name={exp.name} text={`売上規模・従業員数の要件は問題なく、特に「クラウド型業務システム導入」は補助対象に明示されているのでマッチします。3 点気になる箇所がありますので、お時間ある時にご確認ください:

01 — GBizID プライムを未取得の場合、申請 2 週間前までに取得が必要です
02 — 賃金引上計画が必須なので、就業規則の整備状況をご共有いただけますか
03 — IT ベンダーの登録番号が必要です — 候補ベンダーはお決まりですか？`} time="14:05" />
      <ChatBubble side="me" text="ありがとうございます！GBizID は取得済です。ベンダーは 2 社で迷っています、比較資料をお送りしてもよろしいでしょうか？" time="14:18" />
      <ChatBubble side="them" name={exp.name} text="はい、ぜひお送りください。私の方で「補助対象事業者」かどうかと、過去の採択補助率も含めて確認します。" time="14:22" />
      <div className="row" style={{ alignSelf: "center", gap: 8 }}>
        <div className="thinking-dots"><span /><span /><span /></div>
        <span className="muted tiny">{exp.name} さんが入力中…</span>
      </div>
    </div>
    <div style={{ padding: 16, borderTop: "1px solid var(--line)" }}>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn btn-ghost btn-sm">添付</button>
        <input className="input" placeholder="メッセージを入力..." style={{ flex: 1 }} />
        <button className="btn btn-primary">送信 →</button>
      </div>
    </div>
  </div>
);

const ChatBubble = ({ side, name, text, time }) => (
  <div className="fade-in" style={{
    display: "flex", flexDirection: "column",
    alignItems: side === "me" ? "flex-end" : "flex-start",
    gap: 6
  }}>
    <div className="row" style={{ gap: 10 }}>
      {side === "them" ? (
        <span className="eyebrow">{name}</span>
      ) : (
        <span className="eyebrow eyebrow-ink">あなた</span>
      )}
      <span className="num muted-2" style={{ fontSize: 10 }}>{time}</span>
    </div>
    <div className="serif" style={{
      maxWidth: 520,
      padding: side === "me" ? "12px 16px" : 0,
      background: side === "me" ? "var(--ink)" : "transparent",
      color: side === "me" ? "var(--bg-elev)" : "var(--ink)",
      fontSize: 15, lineHeight: 1.75,
      whiteSpace: "pre-line",
      fontWeight: 500,
      borderLeft: side === "them" ? "2px solid var(--ink)" : 0,
      paddingLeft: side === "them" ? 14 : undefined
    }}>{text}</div>
  </div>
);

// ====== AUTH ======
const Auth = ({ mode, onSwitch, onDone, isMobile }) => {
  const isLogin = mode === "login";
  return (
    <div style={{
      minHeight: isMobile ? 700 : 760,
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      background: "var(--bg)"
    }}>
      {!isMobile && (
        <div style={{
          padding: "60px 50px",
          borderRight: "1px solid var(--line-ink)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div className="row" style={{ gap: 10, marginBottom: 36 }}>
              <div className="sb-mark">HJ</div>
              <div style={{ fontWeight: 600, fontFamily: "var(--font-display)", fontSize: 16 }}>HojoNavi</div>
            </div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              {isLogin ? "Sign In" : "New Account"}
            </div>
            <h2 className="display" style={{ fontSize: 38, lineHeight: 1.3, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>
              {isLogin ? <>ようこそ。<br />あなたの補助金、<br /><em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>待っています。</em></>
                : <>3 分で会員登録。<br /><em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>公募前アラート</em>で<br />機会を逃さない。</>}
            </h2>
            <p style={{ color: "var(--ink-3)", lineHeight: 1.85, marginTop: 28, fontSize: 14, maxWidth: 360 }}>
              {isLogin ? "登録済みのウォッチリスト・アラート・申請進捗にアクセスできます。"
                : "メール+PW で 30 秒登録 → 公募前アラート → 専門家相談予約。初回 30 分無料相談を即利用可能です。"}
            </p>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>専門家ネットワーク</div>
            <div className="col" style={{ gap: 8 }}>
              {MOCK_EXPERTS.map(e => (
                <div key={e.id} style={{ fontSize: 13 }}>
                  <span className="serif" style={{ fontWeight: 600 }}>{e.name}</span>
                  <span className="muted-2" style={{ marginLeft: 10, fontSize: 11 }}>{e.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{ padding: isMobile ? "40px 22px" : "60px 50px", display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 360, margin: "0 auto" }}>
          {isMobile && (
            <div className="row" style={{ gap: 10, marginBottom: 36 }}>
              <div className="sb-mark">HJ</div>
              <div style={{ fontWeight: 600, fontFamily: "var(--font-display)", fontSize: 16 }}>HojoNavi</div>
            </div>
          )}
          <h2 className="display" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px", letterSpacing: "-0.015em" }}>
            {isLogin ? "ログイン" : "新規会員登録"}
          </h2>
          <div className="muted sm" style={{ marginBottom: 32 }}>
            {isLogin ? "メールアドレスとパスワードを入力" : "30 秒で完了します"}
          </div>

          <div className="col" style={{ gap: 18 }}>
            {!isLogin && (
              <div>
                <div className="label">お名前</div>
                <input className="input" placeholder="田中 太郎" defaultValue="田中 太郎" />
              </div>
            )}
            <div>
              <div className="label">メールアドレス</div>
              <input className="input" placeholder="you@example.com" defaultValue="tanaka@sample-works.co.jp" />
            </div>
            <div>
              <div className="label between">
                <span>パスワード</span>
                {isLogin && <button className="btn-link tiny">忘れた方</button>}
              </div>
              <input className="input" type="password" defaultValue="********" />
              {!isLogin && <div className="muted-2 tiny" style={{ marginTop: 6 }}>8 文字以上 · 英大小数字 + 記号</div>}
            </div>

            {!isLogin && (
              <label className="row" style={{ gap: 8, fontSize: 12, color: "var(--ink-3)", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "var(--ink)" }} />
                <span><a className="btn-link" style={{ fontSize: 12 }}>利用規約</a> および <a className="btn-link" style={{ fontSize: 12 }}>プライバシーポリシー</a> に同意</span>
              </label>
            )}

            <button className="btn btn-primary btn-lg btn-block" onClick={onDone}>
              {isLogin ? "ログイン →" : "登録してはじめる →"}
            </button>

            <div className="row" style={{ gap: 10, alignItems: "center", margin: "8px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
              <span className="eyebrow">OR</span>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            </div>

            <button className="btn btn-ghost btn-block" style={{ padding: "12px" }}>
              Google で続ける
            </button>
            <button className="btn btn-ghost btn-block" style={{ padding: "12px" }}>
              LINE で続ける
            </button>

            <div className="muted sm" style={{ textAlign: "center", marginTop: 18 }}>
              {isLogin ? "アカウントをお持ちでない方は" : "既に登録済みの方は"}
              <button className="btn-link" style={{ marginLeft: 8 }} onClick={() => onSwitch(isLogin ? "register" : "login")}>
                {isLogin ? "新規登録" : "ログイン"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====== AI Chat — full-page question answer ======
const AIChatPage = ({ isMobile }) => {
  const [messages, setMessages] = useState([
    { r: "ai", t: "こんにちは。補助金AIアシスタントです。貴社情報を読み込み済みです。どんなことをお聞きしたいですか？" },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.parentElement?.scrollTo?.({ top: 99999, behavior: "smooth" });
  }, [messages]);

  const send = async (q) => {
    if (!q.trim()) return;
    const next = [...messages, { r: "user", t: q }];
    setMessages(next);
    setDraft("");
    setLoading(true);

    try {
      const ctx = `あなたは日本の中小企業向け補助金AIアシスタント「HojoNavi」です。
ユーザー企業情報:
- 会社名: 株式会社サンプルワークス
- 業種: ソフトウェア業 (Web/SaaS)
- 従業員: 12名 / 売上1.8億円 / 東京都渋谷区 / 2019年設立
- 事業内容: 中小企業向け業務効率化SaaS開発・販売

利用可能な補助金 (一部):
- IT導入補助金 2026 (経産省, 上限450万円, 補助率1/2-2/3, 採択率58%)
- ものづくり補助金 第19次 (上限1250万円, 1/2, 42%)
- 新事業進出補助金 (公募前, 上限9000万円, 1/2)
- 小規模事業者持続化補助金 (公募前, 上限200万円, 2/3)
- 東京都デジタルツール導入促進 (上限100万円, 1/2)
- キャリアアップ助成金 (通年, 1人80万円)

簡潔に・具体的に・断定的すぎず（「採択を保証するものではありません」のスタンスで）回答してください。150〜250字程度。`;

      const response = await window.claude.complete({
        messages: [
          { role: "user", content: ctx + "\n\n質問: " + q }
        ]
      });
      setMessages(m => [...m, { r: "ai", t: response }]);
    } catch (e) {
      setMessages(m => [...m, { r: "ai", t: "（オフラインモック応答）IT導入補助金 2026 は貴社の業態に最も適合しています。クラウドSaaS導入が補助対象に明示されているためです。次の一手として、GBizIDの取得状況をご確認ください。" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: isMobile ? "20px 22px 100px" : "36px 56px 60px",
      minHeight: 600
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>AI Assistant · powered by Claude</div>
        <h1 className="display" style={{ fontSize: isMobile ? 26 : 36, margin: "0 0 8px", fontWeight: 600, letterSpacing: "-0.015em" }}>
          補助金 AI アシスタント
        </h1>
        <div className="muted sm" style={{ marginBottom: 28 }}>貴社情報を読み込み済み · 自由に質問してください</div>

        <div style={{
          borderTop: "1px solid var(--line-ink)",
          padding: "32px 0",
          minHeight: 380,
          maxHeight: 520, overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 26,
          marginBottom: 22
        }}>
          {messages.map((m, i) => (
            <div key={i} className="fade-in" style={{
              display: "flex", flexDirection: "column",
              alignItems: m.r === "user" ? "flex-end" : "flex-start",
              gap: 6
            }}>
              <div className="eyebrow">
                {m.r === "user" ? "あなた" : "AI Assistant"}
              </div>
              <div className="serif" style={{
                maxWidth: 640,
                padding: m.r === "user" ? "14px 18px" : 0,
                background: m.r === "user" ? "var(--ink)" : "transparent",
                color: m.r === "user" ? "var(--bg-elev)" : "var(--ink)",
                fontSize: 15, lineHeight: 1.85,
                fontWeight: 500,
                whiteSpace: "pre-wrap",
                borderLeft: m.r !== "user" ? "2px solid var(--ink)" : 0,
                paddingLeft: m.r !== "user" ? 16 : undefined
              }}>{m.t}</div>
            </div>
          ))}
          {loading && (
            <div style={{ borderLeft: "2px solid var(--ink)", paddingLeft: 16 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>AI Assistant</div>
              <div className="thinking-dots"><span /><span /><span /></div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>例</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, borderTop: "1px solid var(--line)" }}>
            {[
              "我が社が一番有利な補助金は？",
              "IT 導入補助金とものづくり補助金の違いは？",
              "申請書ドラフトを作って",
            ].map(q => (
              <button key={q} onClick={() => send(q)} style={{
                padding: "10px 16px 10px 0",
                fontSize: 13,
                color: "var(--ink-2)",
                marginRight: 18,
                borderBottom: "1px solid var(--line)",
                fontWeight: 400
              }}>{q} →</button>
            ))}
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); send(draft); }} className="row" style={{ gap: 0, border: "1px solid var(--line-strong)" }}>
          <input className="input" placeholder="補助金について自由に質問..." value={draft} onChange={e => setDraft(e.target.value)} disabled={loading}
            style={{ border: 0, padding: "14px 18px", flex: 1 }} />
          <button className="btn btn-primary" disabled={loading || !draft.trim()} style={{ borderRadius: 0, padding: "14px 22px" }}>
            送信 →
          </button>
        </form>
      </div>
    </div>
  );
};

// ====== Admin Dashboard ======
const Admin = () => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: 760, background: "var(--bg)" }}>
      <aside style={{ background: "var(--bg-elev)", borderRight: "1px solid var(--line-ink)", padding: "22px 14px" }}>
        <div className="row" style={{ gap: 10, marginBottom: 32 }}>
          <div className="sb-mark">HJ</div>
          <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-display)" }}>
            管理コンソール
            <div className="eyebrow" style={{ marginTop: 4, fontSize: 9 }}>Admin v0.4</div>
          </div>
        </div>
        {[
          { l: "ダッシュボード", on: true },
          { l: "補助金マスタ", n: 2418 },
          { l: "ユーザー", n: 1240 },
          { l: "専門家相談", n: 18 },
          { l: "アラート配信" },
          { l: "監査ログ" },
        ].map((it, i) => (
          <div key={i} style={{
            padding: "9px 12px",
            marginBottom: 1,
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 12.5,
            background: it.on ? "var(--bg-inset)" : "transparent",
            color: it.on ? "var(--ink)" : "var(--ink-3)",
            fontWeight: it.on ? 600 : 400,
            cursor: "pointer",
            borderLeft: it.on ? "2px solid var(--ink)" : "2px solid transparent"
          }}>
            <span style={{ flex: 1 }}>{it.l}</span>
            {it.n && <span className="num muted-2" style={{ fontSize: 10 }}>{it.n}</span>}
          </div>
        ))}
      </aside>

      <main style={{ padding: 36, overflowY: "auto" }}>
        <div className="between" style={{ marginBottom: 28, alignItems: "flex-end" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Admin Dashboard · 2026/05/27 14:32 JST</div>
            <h1 className="display" style={{ fontSize: 32, margin: 0, fontWeight: 600, letterSpacing: "-0.015em" }}>
              ダッシュボード
            </h1>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-ghost btn-sm">CSV エクスポート</button>
            <button className="btn btn-primary btn-sm">+ 補助金追加</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid var(--line-ink)", borderBottom: "1px solid var(--line-ink)" }}>
          {[
            { l: "登録ユーザー", v: "1,240", c: "+38" },
            { l: "MAU", v: "418", c: "33.7%" },
            { l: "アラート配信(月)", v: "2,184", c: "+412" },
            { l: "相談件数(今月)", v: "58", c: "+12" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "26px 24px 26px 0",
              paddingLeft: i ? 24 : 0,
              borderLeft: i ? "1px solid var(--line)" : 0
            }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>{s.l}</div>
              <div className="num" style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.v}</div>
              <div className="num" style={{ fontSize: 11, color: "var(--emerald)", marginTop: 8, letterSpacing: "0.02em" }}>
                ↑ {s.c} 前月比
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 36, marginTop: 36 }}>
          <div>
            <div className="between" style={{ marginBottom: 18, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
              <div className="eyebrow">ユーザー登録 — 過去 30 日</div>
              <div className="row" style={{ gap: 12 }}>
                <button className="btn-link tiny">7d</button>
                <button className="btn-link tiny" style={{ borderColor: "var(--ink)", fontWeight: 600 }}>30d</button>
                <button className="btn-link tiny">90d</button>
              </div>
            </div>
            <AdminMiniChart />
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>直近アクティビティ</div>
            <div>
              {[
                { t: "新規登録", n: "田中 太郎 / SaaS / 12 名", a: "2 分前" },
                { t: "公募前アラート配信", n: "新事業進出補助金 → 412 名", a: "1 時間前" },
                { t: "専門家相談予約", n: "山田 花子 → 秋吉氏", a: "3 時間前" },
                { t: "補助金ステータス変更", n: "持続化補助金 第 15 回 → pre", a: "5 時間前" },
              ].map((e, i) => (
                <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
                  <div className="between" style={{ marginBottom: 4 }}>
                    <span className="eyebrow">{e.t}</span>
                    <span className="num muted-2" style={{ fontSize: 10 }}>{e.a}</span>
                  </div>
                  <div className="sm" style={{ color: "var(--ink-2)" }}>{e.n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 36 }}>
          <div className="between" style={{ marginBottom: 14 }}>
            <div className="eyebrow">補助金マスタ — 直近編集</div>
            <button className="btn-link sm">全件 →</button>
          </div>
          <table className="tab">
            <thead>
              <tr>
                <th>ID</th>
                <th>名称</th>
                <th>ステータス</th>
                <th style={{ textAlign: "right" }}>対象ユーザー数</th>
                <th>最終更新</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {SUBSIDIES.slice(0, 5).map(s => (
                <tr key={s.id} style={{ cursor: "pointer" }}>
                  <td className="num muted-2" style={{ fontSize: 11 }}>{s.id}</td>
                  <td style={{ fontWeight: 600 }} className="serif">{s.name}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="num" style={{ textAlign: "right" }}>{Math.floor(Math.random() * 800 + 100)}</td>
                  <td className="num muted-2" style={{ fontSize: 11 }}>2026-05-{25 + (Math.floor(Math.random() * 3))}</td>
                  <td><button className="btn btn-ghost btn-sm">編集</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

const AdminMiniChart = () => {
  const data = [12, 18, 15, 22, 28, 24, 30, 32, 28, 36, 40, 38, 45, 42, 48, 52, 55, 50, 58, 62, 60, 64, 70, 68, 72, 76, 80, 78, 82, 85];
  const w = 600, h = 180;
  const max = Math.max(...data);
  const bw = w / data.length - 4;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`}>
      {data.map((v, i) => (
        <rect key={i}
          x={i * (w / data.length) + 2}
          y={h - (v / max) * (h - 20)}
          width={bw}
          height={(v / max) * (h - 20)}
          fill="var(--ink)"
          opacity={i === data.length - 1 ? 1 : 0.85}
        />
      ))}
    </svg>
  );
};

Object.assign(window, { MyPage, Watchlist, Alerts, Expert, ExpertChat, Auth, AIChatPage, Admin });
