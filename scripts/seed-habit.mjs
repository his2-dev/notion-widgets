// 오늘(KST) 날짜의 Habit Tracker 행이 없으면 자동 생성.
// GitHub Actions(매시)에서 sync 전에 실행. 멱등 — 이미 있으면 건너뜀.
// 노션 "반복 템플릿"(UI 전용)을 대체하는 자동화.
//
// 로컬 테스트:  NOTION_TOKEN=ntn_xxx node scripts/seed-habit.mjs
const TOKEN = process.env.NOTION_TOKEN;
if (!TOKEN) { console.error("❌ NOTION_TOKEN 환경변수가 없습니다."); process.exit(1); }

const DATA_SOURCE = "a2294bf0-8e42-4078-a36a-43c49e264081";
const DATABASE    = "382061bcdc0a41ae862368d6931f8122";

// KST(UTC+9) 기준 오늘
const kst = new Date(Date.now() + 9 * 3600 * 1000);
const y = kst.getUTCFullYear();
const m = kst.getUTCMonth() + 1;
const d = kst.getUTCDate();
const ymd = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const title = `${m}/${d}`;

const H = (version) => ({
  "Authorization": `Bearer ${TOKEN}`,
  "Notion-Version": version,
  "Content-Type": "application/json",
});

// 오늘 날짜 행이 이미 있는지 확인
async function exists(queryUrl, version) {
  const res = await fetch(queryUrl, {
    method: "POST",
    headers: H(version),
    body: JSON.stringify({
      filter: { property: "Date", date: { equals: ymd } },
      page_size: 1,
    }),
  });
  if (!res.ok) throw new Error(`query ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.results.length > 0;
}

// 오늘 행 생성
async function create(parent, version) {
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: H(version),
    body: JSON.stringify({
      parent,
      properties: {
        "날짜": { title: [{ text: { content: title } }] },
        "Date": { date: { start: ymd } },
      },
    }),
  });
  if (!res.ok) throw new Error(`create ${res.status}: ${await res.text()}`);
}

async function run() {
  // 신규 data_sources API 우선 → 실패 시 구 databases API 폴백
  try {
    if (await exists(`https://api.notion.com/v1/data_sources/${DATA_SOURCE}/query`, "2025-09-03")) {
      console.log(`⏭️  ${ymd} 행 이미 존재 — 건너뜀`); return;
    }
    await create({ type: "data_source_id", data_source_id: DATA_SOURCE }, "2025-09-03");
  } catch (e) {
    console.warn(`⚠️  data_sources 경로 실패, databases 폴백:`, e.message);
    if (await exists(`https://api.notion.com/v1/databases/${DATABASE}/query`, "2022-06-28")) {
      console.log(`⏭️  ${ymd} 행 이미 존재 — 건너뜀`); return;
    }
    await create({ type: "database_id", database_id: DATABASE }, "2022-06-28");
  }
  console.log(`✅ ${ymd} (${title}) Habit 행 생성`);
}

run().catch((e) => { console.error(`❌ seed 실패: ${e.message}`); process.exit(1); });
