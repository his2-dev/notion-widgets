// 노션 DB → 각 위젯의 data.json 동기화
// GitHub Actions(또는 로컬)에서 실행. 토큰은 환경변수 NOTION_TOKEN.
//
// 로컬 테스트:  NOTION_TOKEN=ntn_xxx node scripts/sync.mjs
import { writeFileSync } from "node:fs";

const TOKEN = process.env.NOTION_TOKEN;
if (!TOKEN) { console.error("❌ NOTION_TOKEN 환경변수가 없습니다."); process.exit(1); }

const HABITS = ["운동", "공부", "독서", "일기", "기상"];

// 동기화 대상 목록 — 통합(integration)이 연결된 DB만 성공함. 실패해도 다른 건 계속 진행.
const TARGETS = [
  {
    name: "habit",
    dataSource: "a2294bf0-8e42-4078-a36a-43c49e264081",
    database:   "382061bcdc0a41ae862368d6931f8122",
    out: "../habit-tracker/data.json",
    parse: (p) => {
      const date = p["Date"]?.date?.start;
      if (!date) return null;
      const row = { date };
      for (const h of HABITS) row[h] = !!(p[h]?.checkbox);
      row.mood = p["기분"]?.select?.name || null;
      row.sleepHours = p["수면(시간)"]?.number ?? null;
      row.focusMinutes = p["집중(분)"]?.number ?? null;
      row.highlight = p["오늘의 한 가지"]?.rich_text?.map(t => t.plain_text).join("") || "";
      row.oneLine = p["한 줄"]?.rich_text?.map(t => t.plain_text).join("") || "";
      return row;
    },
    sort: (a, b) => a.date.localeCompare(b.date),
  },
  {
    name: "todo",
    dataSource: "764c86f6-cd77-435c-a758-9a780f17164e",
    database:   "d0aaed6474df4c7bbd1672f564f923fd",
    out: "../todo-tracker/data.json",
    parse: (p) => {
      const title = p["할 일"]?.title?.map(t => t.plain_text).join("") || "";
      if (!title) return null;
      return {
        title,
        date: p["Date"]?.date?.start || null,
        priority: p["우선순위"]?.select?.name || null,
        category: p["분류"]?.select?.name || null,
        estimatedMinutes: p["예상시간(분)"]?.number ?? null,
        energy: p["에너지"]?.select?.name || null,
        done: !!(p["완료"]?.checkbox),
      };
    },
    // 미완료 먼저, 우선순위(높음>중간>낮음) 순
    sort: (a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const rank = { "높음": 0, "중간": 1, "낮음": 2 };
      return (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3);
    },
  },
];

async function queryPaged(url, version, parse) {
  const rows = [];
  let cursor;
  do {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Notion-Version": version,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cursor ? { start_cursor: cursor, page_size: 100 } : { page_size: 100 }),
    });
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    const data = await res.json();
    for (const page of data.results) {
      const row = parse(page.properties || {});
      if (row) rows.push(row);
    }
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return rows;
}

async function syncTarget(t) {
  // 신규 data_sources API 우선 → 실패 시 구 databases API 폴백
  let rows;
  try {
    rows = await queryPaged(`https://api.notion.com/v1/data_sources/${t.dataSource}/query`, "2025-09-03", t.parse);
  } catch (e) {
    console.warn(`⚠️  [${t.name}] data_sources 실패, databases 폴백:`, e.message);
    rows = await queryPaged(`https://api.notion.com/v1/databases/${t.database}/query`, "2022-06-28", t.parse);
  }
  if (t.sort) rows.sort(t.sort);
  const out = { updatedAt: new Date().toISOString(), rows };
  writeFileSync(new URL(t.out, import.meta.url), JSON.stringify(out, null, 2) + "\n");
  console.log(`✅ [${t.name}] ${rows.length}개 행 → ${t.out.replace("../", "")}`);
}

let failed = 0;
for (const t of TARGETS) {
  try { await syncTarget(t); }
  catch (e) { failed++; console.error(`❌ [${t.name}] 동기화 실패 (통합 연결 확인): ${e.message}`); }
}
// habit 등 핵심이 다 실패하면 비정상 종료, 일부만 실패면 통과
if (failed === TARGETS.length) process.exit(1);
