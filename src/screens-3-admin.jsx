import React, { useState, useEffect } from 'react';
import { fetchSubsidies } from './services/db';
import { StatusBadge } from './ui';

export const Admin = () => {
  const [subsidiesList, setSubsidiesList] = useState([]);

  useEffect(() => {
    fetchSubsidies().then(setSubsidiesList);
  }, []);

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
            <div className="eyebrow">Admin Dashboard · 2026/05/27 14:32 JST</div>
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
              {subsidiesList.slice(0, 5).map(s => (
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

export const AdminMiniChart = () => {
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
