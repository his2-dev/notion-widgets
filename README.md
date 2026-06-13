# notion-widgets 🪟

정혜인 노션 플래너용 **Win95/98 레트로 커스텀 위젯** 모음.
입력은 노션 DB에서, 위젯은 그 데이터를 읽어 레트로하게 시각화(표시 전용).

```
[노션 Habit DB] --(GitHub Action · 토큰은 Secret)--> habit-tracker/data.json --(fetch)--> 레트로 위젯(98.css)
```

## 📁 구조
```
notion-widgets/
├─ habit-tracker/
│  ├─ index.html      # 레트로 위젯 (data.json 읽어 렌더)
│  └─ data.json       # 노션에서 동기화된 데이터 (Action이 갱신)
├─ scripts/
│  └─ sync.mjs        # 노션 API → data.json
├─ .github/workflows/
│  └─ sync.yml        # 매시 자동 + 수동 동기화
└─ README.md
```

---

## 🚀 셋업 (혜인님이 직접 — 한 번만)

### 1) 노션 통합(Integration) 토큰 발급
- https://www.notion.so/my-integrations → **New integration** → Internal
- 이름: `habit-widget` → 생성 → **Internal Integration Secret**(`ntn_...` 또는 `secret_...`) 복사

### 2) Habit DB를 통합과 연결
- 노션에서 **Habit Tracker** DB 열기 → 우측 상단 `⋯` → **Connections(연결)** → `habit-widget` 추가
- ※ 이 단계 안 하면 API가 데이터를 못 읽어요 (권한 없음).

### 3) GitHub 저장소 생성 & 업로드
- `his2-dev` 계정에 **public** repo `notion-widgets` 생성
- 이 폴더(`C:\Users\hyein\notion-widgets`)를 push
  ```bash
  cd /c/Users/hyein/notion-widgets
  git init && git add . && git commit -m "init: retro notion widgets"
  git branch -M main
  git remote add origin https://github.com/his2-dev/notion-widgets.git
  git push -u origin main
  ```

### 4) 토큰을 GitHub Secret에 등록
- repo → **Settings → Secrets and variables → Actions → New repository secret**
- Name: `NOTION_TOKEN` / Value: 1)에서 복사한 토큰

### 5) GitHub Pages 켜기
- repo → **Settings → Pages** → Source: **Deploy from a branch** → `main` / `/(root)` → Save
- 잠시 후 사이트 URL 활성화:
  `https://his2-dev.github.io/notion-widgets/habit-tracker/`

### 6) 첫 동기화 실행
- repo → **Actions** 탭 → `Sync Notion → data.json` → **Run workflow**
- 성공하면 `habit-tracker/data.json`이 실제 노션 데이터로 갱신됨

### 7) 노션에 임베드
- 노션 2026 PLANNER에서 `/embed` → 위 Pages URL 붙여넣기
- (현재 플래너의 `Habit DB 자리` 또는 위젯 칸에 배치)

---

## 🔧 로컬 테스트
```bash
# 동기화 스크립트 단독 실행
NOTION_TOKEN=ntn_xxx node scripts/sync.mjs

# 위젯 미리보기 (data.json 읽음)
start habit-tracker/index.html   # Windows
```

## ℹ️ 참고
- 갱신 주기: 매시 정각(UTC) 자동 + 언제든 수동 실행. 실시간 아님(습관 시각화엔 충분).
- `sync.mjs`는 신규 `data_sources` API 우선, 실패 시 구 `databases` API로 자동 폴백.
- 다른 DB에 재사용: Action env로 `NOTION_DATA_SOURCE_ID` / `NOTION_DATABASE_ID` 덮어쓰기.
- Habit DB ID: `382061bcdc0a41ae862368d6931f8122` / 데이터소스: `a2294bf0-8e42-4078-a36a-43c49e264081`
