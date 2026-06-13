// 노션 Habit Tracker DB → habit-tracker/data.json 동기화
// GitHub Actions(또는 로컬)에서 실행. 토큰은 환경변수 NOTION_TOKEN 으로 주입.
//
// 로컬 테스트:  NOTION_TOKEN=secret_xxx node scripts/sync.mjs
import { writeFileSync } from "node:fs";

const TOKEN = process.env.NOTION_TOKEN;
// Habit Tracker — 데이터소스(컬렉션) ID 와 데이터베이스 ID (둘 다 폴백용으로 보관)
const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID || "a2294bf0-8e42-4078-a36a-43c49e264081";
const DATABASE_ID    = process.env.NOTION_DATABASE_ID    || "382061bcdc0a41ae862368d6931f8122";
const HABITS = ["운동", "공부", "독서", "일기", "기상"];

if (!TOKEN) {
  console.error("❌ NOTION_TOKEN 환경변수가 없습니다.");
  process.exit(1);
}

function parseRows(results) {
  const rows = [];
  for (const page of results) {
    const p = page.properties || {};
    const date = p["Date"]?.date?.start;
    if (!date) continue;
    const row = { date };
    for (const h of HABITS) row[h] = !!(p[h]?.checkbox);
    rows.push(row);
  }
  return rows;
}

async function queryPaged(url, version) {
  const rows = [];
  let cursor = undefined;
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
    rows.push(...parseRows(data.results));
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return rows;
}

async function queryAll() {
  // 1) 신규 데이터소스 API 시도 → 실패 시 2) 구 databases API 폴백
  try {
    const rows = await queryPaged(
      `https://api.notion.com/v1/data_sources/${DATA_SOURCE_ID}/query`, "2025-09-03");
    console.log("ℹ️  data_sources 엔드포인트 사용");
    rows.sort((a, b) => a.date.localeCompare(b.date));
    return rows;
  } catch (e) {
    console.warn("⚠️  data_sources 실패, databases 엔드포인트로 폴백:", e.message);
    const rows = await queryPaged(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`, "2022-06-28");
    console.log("ℹ️  databases 엔드포인트 사용");
    rows.sort((a, b) => a.date.localeCompare(b.date));
    return rows;
  }
}

try {
  const rows = await queryAll();
  const out = { updatedAt: new Date().toISOString(), rows };
  writeFileSync(new URL("../habit-tracker/data.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
  console.log(`✅ ${rows.length}개 행 동기화 완료 → habit-tracker/data.json`);
} catch (e) {
  console.error("❌ 동기화 실패:", e.message);
  process.exit(1);
}
