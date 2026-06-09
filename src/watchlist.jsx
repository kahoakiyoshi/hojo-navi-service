import React, { useState, useEffect } from 'react';
import { formatYen } from './data';
import { StatusBadge } from './ui';
import { fetchSubsidies } from './services/db';

export const Watchlist = ({ onOpenDetail, isMobile, watchlist = [], onToggleWatchlist }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchSubsidies().then(list => setItems(list.filter(s => watchlist.includes(s.id))));
  }, [watchlist]);

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
                  上限 {formatYen(s.maxAmount)} · {s.status === "pre" ? `${s.preOpenInDays} 日後` : `あと ${s.daysLeft} 日`}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onToggleWatchlist && onToggleWatchlist(s.id); }} style={{ padding: "4px 8px" }}>×</button>
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
              <th style={{ textAlign: "right" }}>締切 / 开始</th>
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
                <td className="num" style={{ textAlign: "right" }}>{formatYen(s.maxAmount)}</td>
                <td className="num" style={{ textAlign: "right" }}>
                  {s.status === "pre" ? `${s.preOpenInDays} 日後` : s.daysLeft > 0 ? `${s.daysLeft} 日` : "終了"}
                </td>
                <td onClick={e => { e.stopPropagation(); onToggleWatchlist && onToggleWatchlist(s.id); }} style={{ textAlign: "right" }}>
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
