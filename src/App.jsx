import { useState, useMemo, useEffect, useRef } from "react";

const INITIAL_GUESTS = [
  { id: 1, name: "오세훈", org: "서울특별시", role: "서울특별시장", table: 3, seat: 1 },
  { id: 2, name: "박일규", org: "한국사회복지사협회", role: "회장", table: 3, seat: 2 },
  { id: 3, name: "김성이", org: "한국사회복지협의회", role: "회장", table: 3, seat: 3 },
  { id: 4, name: "조석영", org: "한국장애인복지관협회", role: "회장", table: 3, seat: 4 },
  { id: 5, name: "김광훈", org: "한국소아당뇨인협회", role: "회장", table: 3, seat: 5 },
  { id: 6, name: "김현훈", org: "서울시사회복지협의회", role: "회장", table: 3, seat: 6 },
  { id: 7, name: "김영환", org: "서울시장애인직업재활시설협회", role: "회장", table: 3, seat: 7 },
  { id: 8, name: "김은영", org: "서울시지역아동센터협의회", role: "회장", table: 3, seat: 8 },
  { id: 9, name: "김한나", org: "서울시한부모가족복지시설협회", role: "회장", table: 3, seat: 9 },
  { id: 10, name: "노장우", org: "서울시아동보호전문기관협회", role: "회장", table: 3, seat: 10 },
  { id: 11, name: "박익현", org: "서울시50플러스센터협의회", role: "회장", table: 1, seat: 1 },
  { id: 12, name: "백윤미", org: "서울시정신요양시설협회", role: "회장", table: 1, seat: 2 },
  { id: 13, name: "신영숙", org: "여성폭력피해지원시설협의회", role: "회장", table: 1, seat: 3 },
  { id: 14, name: "이소영", org: "서울시아동복지협회", role: "회장", table: 1, seat: 4 },
  { id: 15, name: "이은주", org: "서울시노인종합복지관협회", role: "회장", table: 1, seat: 5 },
  { id: 16, name: "임형균", org: "서울시장애인복지관협회", role: "회장", table: 1, seat: 6 },
  { id: 17, name: "정보영", org: "서울정신재활시설협회", role: "회장", table: 1, seat: 7 },
  { id: 18, name: "한철수", org: "서울시노인복지협회", role: "회장", table: 1, seat: 8 },
  { id: 19, name: "허곤", org: "서울시장애인복지시설협회", role: "회장", table: 1, seat: 9 },
  { id: 20, name: "정진모", org: "-", role: "전)서울시사회복지사협회 제8대 회장", table: 1, seat: 10 },
  { id: 21, name: "임성규", org: "-", role: "전)서울시사회복지사협회 제10대 회장", table: 2, seat: 1 },
  { id: 22, name: "장재구", org: "중앙사회복지관", role: "전)서울시사회복지사협회 제11대 회장", table: 2, seat: 2 },
  { id: 23, name: "심정원", org: "성산종합사회복지관", role: "현)서울시사회복지사협회 제15대 회장", table: 2, seat: 3 },
  { id: 24, name: "강현덕", org: "영등포구가족센터", role: "회원참여위원회 위원장", table: 2, seat: 4 },
  { id: 25, name: "김광제", org: "신목종합사회복지관", role: "권익옹호위원회 위원장", table: 2, seat: 5 },
  { id: 26, name: "김아래미", org: "서울여자대학교 사회복지학과", role: "정책위원회 위원장", table: 2, seat: 6 },
  { id: 27, name: "변소현", org: "서부장애인종합복지관", role: "교육위원회 위원장", table: 2, seat: 7 },
  { id: 28, name: "성미선", org: "강동노인종합복지관", role: "기획위원회 위원장", table: 4, seat: 1 },
  { id: 29, name: "이천규", org: "-", role: "회원소통위원회 위원장", table: 4, seat: 2 },
  { id: 30, name: "임명연", org: "마포영유아통합지원센터", role: "복지국가시민위원회 위원장", table: 4, seat: 3 },
  { id: 31, name: "홍준호", org: "공생의 심장", role: "미래세대위원회 위원장", table: 4, seat: 4 },
  { id: 32, name: "김일용", org: "즐거운사회복지궁리소", role: "선거관리위원회 위원장", table: 4, seat: 5 },
  { id: 33, name: "서동명", org: "동덕여자대학교 사회복지학과", role: "교수", table: 5, seat: 1 },
  { id: 34, name: "서정화", org: "열린여성센터", role: "소장", table: 5, seat: 2 },
];

const TABLE_CONFIG = {
  1: { seats: 10, label: "테이블 1", color: "#3B82F6" },
  2: { seats: 10, label: "테이블 2", color: "#8B5CF6" },
  3: { seats: 10, label: "테이블 3 (VIP)", color: "#EF4444" },
  4: { seats: 10, label: "테이블 4", color: "#F59E0B" },
  5: { seats: 10, label: "테이블 5", color: "#10B981" },
};

const SEAT_POSITIONS = (() => {
  const pos = {};
  for (let t = 1; t <= 5; t++) {
    pos[t] = [];
    for (let s = 0; s < 10; s++) {
      const angle = (s / 10) * Math.PI * 2 - Math.PI / 2;
      pos[t].push({ x: Math.cos(angle) * 42, y: Math.sin(angle) * 42 });
    }
  }
  return pos;
})();

function StatusBadge({ checked }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 14px",
        borderRadius: 999,
        fontSize: 14,
        fontWeight: 600,
        background: checked ? "#DCFCE7" : "#FEE2E2",
        color: checked ? "#166534" : "#991B1B",
      }}
    >
      <span style={{ fontSize: 12 }}>{checked ? "●" : "○"}</span>
      {checked ? "참석" : "미참석"}
    </span>
  );
}

function TableBadge({ table }) {
  if (!table) return <span style={{ color: "#9CA3AF", fontSize: 14 }}>미배정</span>;
  const cfg = TABLE_CONFIG[table];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 14px",
        borderRadius: 999,
        fontSize: 14,
        fontWeight: 600,
        background: cfg.color + "18",
        color: cfg.color,
        border: `1px solid ${cfg.color}30`,
      }}
    >
      {cfg.label}
    </span>
  );
}

function SeatMap({ guests, onSeatClick, selectedTable }) {
  const tablePositions = [
    { id: 1, cx: 110, cy: 200, label: "1" },
    { id: 2, cx: 290, cy: 280, label: "2" },
    { id: 3, cx: 400, cy: 130, label: "3\nVIP" },
    { id: 4, cx: 510, cy: 280, label: "4" },
    { id: 5, cx: 690, cy: 200, label: "5" },
  ];

  const guestMap = {};
  guests.forEach((g) => {
    if (g.table) {
      if (!guestMap[g.table]) guestMap[g.table] = {};
      guestMap[g.table][g.seat] = g;
    }
  });

  return (
    <div style={{ background: "#FAFBFC", borderRadius: 16, padding: "20px 12px", border: "1px solid #E5E7EB" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #1E293B, #334155)",
            color: "#fff",
            padding: "10px 60px",
            borderRadius: "10px 10px 0 0",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: 8,
          }}
        >
          무 대
        </div>
        <div style={{ height: 3, background: "linear-gradient(90deg, transparent, #1E293B, transparent)", margin: "0 40px" }} />
      </div>
      <svg viewBox="0 0 800 400" style={{ width: "100%", maxHeight: 420 }}>
        {tablePositions.map((tp) => {
          const isVIP = tp.id === 3;
          const isSelected = selectedTable === tp.id;
          const tableGuests = guestMap[tp.id] || {};
          const seated = Object.keys(tableGuests).length;
          const checkedIn = Object.values(tableGuests).filter((g) => g.checked).length;
          const cfg = TABLE_CONFIG[tp.id];

          return (
            <g key={tp.id} onClick={() => onSeatClick(tp.id)} style={{ cursor: "pointer" }}>
              {/* table circle */}
              <circle
                cx={tp.cx}
                cy={tp.cy}
                r={isVIP ? 38 : 32}
                fill={isSelected ? cfg.color + "15" : "#fff"}
                stroke={isSelected ? cfg.color : "#D1D5DB"}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              <text x={tp.cx} y={tp.cy - 6} textAnchor="middle" fontSize={isVIP ? 16 : 14} fontWeight="800" fill={cfg.color}>
                {tp.id}
              </text>
              {isVIP && (
                <text x={tp.cx} y={tp.cy + 10} textAnchor="middle" fontSize={8} fontWeight="700" fill={cfg.color} opacity={0.7}>
                  VIP
                </text>
              )}
              {!isVIP && (
                <text x={tp.cx} y={tp.cy + 10} textAnchor="middle" fontSize={9} fill="#6B7280">
                  {checkedIn}/{seated}
                </text>
              )}
              {isVIP && (
                <text x={tp.cx} y={tp.cy + 20} textAnchor="middle" fontSize={9} fill="#6B7280">
                  {checkedIn}/{seated}
                </text>
              )}

              {/* seats */}
              {SEAT_POSITIONS[tp.id].map((sp, idx) => {
                const seatNum = idx + 1;
                const guest = tableGuests[seatNum];
                const sx = tp.cx + sp.x * (isVIP ? 1.15 : 1);
                const sy = tp.cy + sp.y * (isVIP ? 1.15 : 1);
                const r = 13;

                let fill = "#F3F4F6";
                let stroke = "#D1D5DB";
                let textColor = "#9CA3AF";
                if (guest) {
                  if (guest.checked) {
                    fill = cfg.color + "20";
                    stroke = cfg.color;
                    textColor = cfg.color;
                  } else {
                    fill = "#FFF";
                    stroke = cfg.color + "60";
                    textColor = "#6B7280";
                  }
                }

                return (
                  <g key={idx}>
                    <circle cx={sx} cy={sy} r={r} fill={fill} stroke={stroke} strokeWidth={1.2} />
                    {guest ? (
                      <>
                        <text x={sx} y={sy - 1} textAnchor="middle" fontSize={8} fontWeight="700" fill={textColor}>
                          {guest.name.length > 3 ? guest.name.slice(0, 2) : guest.name}
                        </text>
                        {guest.name.length > 3 && (
                          <text x={sx} y={sy + 8} textAnchor="middle" fontSize={7} fill={textColor}>
                            {guest.name.slice(2)}
                          </text>
                        )}
                        {guest.name.length <= 3 && (
                          <text x={sx} y={sy + 8} textAnchor="middle" fontSize={6} fill={textColor} opacity={0.6}>
                            {guest.checked ? "✓" : ""}
                          </text>
                        )}
                      </>
                    ) : (
                      <text x={sx} y={sy + 3} textAnchor="middle" fontSize={8} fill={textColor}>
                        {seatNum}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
        {[
          { color: "#10B981", bg: "#10B98120", label: "참석 확인" },
          { color: "#6B7280", bg: "#FFF", label: "미참석", border: true },
          { color: "#9CA3AF", bg: "#F3F4F6", label: "빈 좌석" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280" }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: l.bg,
                border: `1.5px solid ${l.border ? "#6B728060" : l.color}`,
              }}
            />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "18px 20px",
        border: "1px solid #E5E7EB",
        flex: "1 1 0",
        minWidth: 180,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <span style={{ fontSize: 15, color: "#6B7280", fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: color || "#111827", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 14, color: "#9CA3AF", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function GuestManagement() {
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [search, setSearch] = useState("");
  const [filterTable, setFilterTable] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTable, setSelectedTable] = useState(null);
  const [editingGuest, setEditingGuest] = useState(null);
  const [view, setView] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const toggleCheck = (id) => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const next = { ...g, checked: !g.checked };
          showToast(next.checked ? `${g.name}님 참석 확인 ✓` : `${g.name}님 참석 취소`);
          return next;
        }
        return g;
      })
    );
  };

  const updateGuestTable = (id, table, seat) => {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, table, seat } : g)));
    setEditingGuest(null);
    showToast("좌석 배정이 변경되었습니다");
  };

  const stats = useMemo(() => {
    const total = guests.length;
    const checked = guests.filter((g) => g.checked).length;
    const assigned = guests.filter((g) => g.table).length;
    const byTable = {};
    for (let t = 1; t <= 5; t++) {
      const tg = guests.filter((g) => g.table === t);
      byTable[t] = { total: tg.length, checked: tg.filter((g) => g.checked).length };
    }
    return { total, checked, assigned, byTable };
  }, [guests]);

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      if (search && !g.name.includes(search) && !g.org.includes(search) && !g.role.includes(search)) return false;
      if (filterTable > 0 && g.table !== filterTable) return false;
      if (filterStatus === "checked" && !g.checked) return false;
      if (filterStatus === "unchecked" && g.checked) return false;
      if (filterStatus === "unassigned" && g.table) return false;
      return true;
    });
  }, [guests, search, filterTable, filterStatus]);

  const getAvailableSeats = (tableNum) => {
    const taken = guests.filter((g) => g.table === tableNum).map((g) => g.seat);
    const seats = [];
    for (let s = 1; s <= TABLE_CONFIG[tableNum].seats; s++) {
      if (!taken.includes(s)) seats.push(s);
    }
    return seats;
  };

  return (
    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', 'Apple SD Gothic Neo', sans-serif", background: "#F8F9FB", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
          color: "#fff",
          padding: "20px 28px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1100, margin: "0 auto" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>🎤 내빈 관리 시스템</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.7 }}>서울시사회복지사협회</p>
          </div>
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 4 }}>
            {["dashboard", "list"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "10px 22px",
                  borderRadius: 8,
                  border: "none",
                  background: view === v ? "#fff" : "transparent",
                  color: view === v ? "#1E293B" : "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {v === "dashboard" ? "📊 대시보드" : "📋 명단"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 80px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
          <StatCard icon="👥" label="전체 내빈" value={stats.total} sub="명" color="#1E293B" />
          <StatCard
            icon="✅"
            label="참석 확인"
            value={stats.checked}
            sub={`${stats.total > 0 ? Math.round((stats.checked / stats.total) * 100) : 0}%`}
            color="#16A34A"
          />
          <StatCard
            icon="⏳"
            label="미참석"
            value={stats.total - stats.checked}
            sub={`${stats.total > 0 ? Math.round(((stats.total - stats.checked) / stats.total) * 100) : 0}%`}
            color="#DC2626"
          />
          <StatCard icon="💺" label="빈 좌석" value={50 - stats.assigned} sub={`/ 50석`} color="#6B7280" />
        </div>

        {view === "dashboard" && (
          <>
            {/* Seat Map */}
            <SeatMap guests={guests} onSeatClick={(t) => setSelectedTable(selectedTable === t ? null : t)} selectedTable={selectedTable} />

            {/* Table Detail */}
            {selectedTable && (
              <div
                style={{
                  marginTop: 20,
                  background: "#fff",
                  borderRadius: 14,
                  border: `2px solid ${TABLE_CONFIG[selectedTable].color}30`,
                  padding: 20,
                  animation: "fadeIn 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: TABLE_CONFIG[selectedTable].color }}>
                    {TABLE_CONFIG[selectedTable].label} 상세
                  </h3>
                  <span style={{ fontSize: 15, color: "#6B7280" }}>
                    {stats.byTable[selectedTable].checked}/{stats.byTable[selectedTable].total}명 참석
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                  {guests
                    .filter((g) => g.table === selectedTable)
                    .sort((a, b) => a.seat - b.seat)
                    .map((g) => (
                      <div
                        key={g.id}
                        onClick={() => toggleCheck(g.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "14px 16px",
                          borderRadius: 10,
                          background: g.checked ? "#F0FDF4" : "#FAFAFA",
                          border: `1px solid ${g.checked ? "#BBF7D0" : "#E5E7EB"}`,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 700,
                            background: g.checked ? TABLE_CONFIG[selectedTable].color : "#E5E7EB",
                            color: g.checked ? "#fff" : "#6B7280",
                            flexShrink: 0,
                          }}
                        >
                          {g.seat}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{g.name}</div>
                          <div style={{ fontSize: 13, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {g.role}
                          </div>
                        </div>
                        <div style={{ fontSize: 22 }}>{g.checked ? "✅" : "⬜"}</div>
                      </div>
                    ))}
                  {/* Empty seats */}
                  {getAvailableSeats(selectedTable).map((s) => (
                    <div
                      key={`empty-${s}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 16px",
                        borderRadius: 10,
                        background: "#FAFAFA",
                        border: "1px dashed #D1D5DB",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 700,
                          background: "#F3F4F6",
                          color: "#9CA3AF",
                          flexShrink: 0,
                        }}
                      >
                        {s}
                      </div>
                      <div style={{ fontSize: 14, color: "#9CA3AF" }}>빈 좌석</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Per-table progress */}
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              {[1, 2, 3, 4, 5].map((t) => {
                const cfg = TABLE_CONFIG[t];
                const tb = stats.byTable[t];
                const pct = tb.total > 0 ? (tb.checked / tb.total) * 100 : 0;
                return (
                  <div
                    key={t}
                    onClick={() => setSelectedTable(selectedTable === t ? null : t)}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: "16px 14px",
                      border: `1px solid ${selectedTable === t ? cfg.color : "#E5E7EB"}`,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: cfg.color, marginBottom: 6 }}>{cfg.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>
                      {tb.checked}<span style={{ fontSize: 14, color: "#9CA3AF" }}>/{tb.total}</span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 3,
                        background: "#F3F4F6",
                        marginTop: 8,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          borderRadius: 3,
                          background: cfg.color,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {view === "list" && (
          <>
            {/* Search & Filters */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 16,
                border: "1px solid #E5E7EB",
                marginBottom: 16,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative", flex: "1 1 240px" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="이름, 소속, 직함 검색..."
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    border: "1px solid #E5E7EB",
                    borderRadius: 10,
                    fontSize: 15,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <select
                value={filterTable}
                onChange={(e) => setFilterTable(Number(e.target.value))}
                style={{ padding: "12px 16px", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 15, background: "#fff", minHeight: 48 }}
              >
                <option value={0}>전체 테이블</option>
                {[1, 2, 3, 4, 5].map((t) => (
                  <option key={t} value={t}>
                    {TABLE_CONFIG[t].label}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: "12px 16px", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 15, background: "#fff", minHeight: 48 }}
              >
                <option value="all">전체 상태</option>
                <option value="checked">참석</option>
                <option value="unchecked">미참석</option>
              </select>
              <div style={{ fontSize: 14, color: "#6B7280", marginLeft: 4 }}>
                {filtered.length}명 표시
              </div>
            </div>

            {/* Guest List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((g) => (
                <div
                  key={g.id}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "16px 20px",
                    border: `1px solid ${g.checked ? "#BBF7D0" : "#E5E7EB"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    transition: "all 0.15s",
                    position: "relative",
                  }}
                >
                  {/* Check button */}
                  <button
                    onClick={() => toggleCheck(g.id)}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      border: `2px solid ${g.checked ? "#16A34A" : "#D1D5DB"}`,
                      background: g.checked ? "#16A34A" : "#fff",
                      color: g.checked ? "#fff" : "#D1D5DB",
                      fontSize: 20,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.15s",
                    }}
                  >
                    {g.checked ? "✓" : ""}
                  </button>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{g.name}</span>
                      <StatusBadge checked={g.checked} />
                    </div>
                    <div style={{ fontSize: 14, color: "#6B7280" }}>
                      {g.org !== "-" ? g.org : ""} {g.role}
                    </div>
                  </div>

                  {/* Table badge */}
                  <TableBadge table={g.table} />

                  {/* Edit seat */}
                  <button
                    onClick={() => setEditingGuest(editingGuest === g.id ? null : g.id)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      border: "1px solid #E5E7EB",
                      background: editingGuest === g.id ? "#F3F4F6" : "#fff",
                      cursor: "pointer",
                      fontSize: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    title="좌석 변경"
                  >
                    ✏️
                  </button>

                  {/* Edit panel */}
                  {editingGuest === g.id && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: 4,
                        background: "#fff",
                        borderRadius: 14,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                        padding: 20,
                        zIndex: 50,
                        border: "1px solid #E5E7EB",
                        minWidth: 300,
                      }}
                    >
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>좌석 변경 - {g.name}</div>
                      {[1, 2, 3, 4, 5].map((t) => {
                        const avail = getAvailableSeats(t);
                        if (g.table === t) avail.push(g.seat);
                        avail.sort((a, b) => a - b);
                        return (
                          <div key={t} style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: TABLE_CONFIG[t].color, marginBottom: 6 }}>
                              {TABLE_CONFIG[t].label} ({avail.length}석 가능)
                            </div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {avail.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => updateGuestTable(g.id, t, s)}
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 8,
                                    border: g.table === t && g.seat === s ? `2px solid ${TABLE_CONFIG[t].color}` : "1px solid #E5E7EB",
                                    background: g.table === t && g.seat === s ? TABLE_CONFIG[t].color + "15" : "#fff",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    color: "#374151",
                                  }}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1E293B",
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            zIndex: 999,
            animation: "fadeIn 0.2s ease",
          }}
        >
          {toast}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        button:active { transform: scale(0.97); }
        button:hover { opacity: 0.85; }
        @media (max-width: 600px) {
          .table-progress-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
