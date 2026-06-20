# 물고기 이미지(2D 스프라이트) 생성 프롬프트 — Codex용

위젯을 **2D 픽셀 물고기 스프라이트** 방식으로 바꾼다. 아래 프롬프트로 물고기 이미지를 생성해
`assets/fish/` 폴더에 저장하면, Claude가 수조 안에 빌보드로 띄워 헤엄치게 연결한다.

---

## 0. 먼저 할 일
- 이전에 만든 영어 요약본 `Documents/hyein-projects/FISH_ASSET_SPEC.md` 는 **삭제(정리)**.
  (3D `.glb` 방식 폐기 → 2D 스프라이트로 전환했기 때문)

---

## 1. 산출물 규격 (계약 — 꼭 지킬 것)
| 항목 | 값 |
|---|---|
| 저장 폴더 | `C:\Users\hyein\notion-widgets\aquarium\assets\fish\` (없으면 생성) |
| 형식 | **PNG, 배경 완전 투명(알파)** — 배경색·바닥·그림자 없음 |
| 크기 | **256×256 px** (정사각, 여백 약간) |
| 구도 | **측면(옆모습) 프로필, 머리는 오른쪽(→)을 향하게**, 몸 전체가 프레임 안에 |
| 1파일 | 물고기 1마리, 화면 중앙 정렬 |
| 스타일 | **픽셀아트 / 로우폴리 PSX 레트로**, 도트 굵게, 플랫한 음영, 단순한 형태 |
| 금지 | 글자·테두리·배경·그림자·물방울·여러 마리 한 장에 |
| 일관성 | 모든 물고기가 **같은 화풍·같은 도트 크기·같은 조명**(세트처럼 보이게) |

> 왜 "오른쪽 향함" 고정? → 위젯이 왼쪽으로 헤엄칠 땐 좌우반전(flip)해서 쓴다. 방향이 섞이면 깨짐.

---

## 2. 파일명 (소문자)
- `clownfish.png` — 주황 몸 + 흰 세로줄 (흰동가리)
- `blue-tang.png` — 파란 몸 (양쥐돔)
- `yellow-tang.png` — 노란 몸
- `pink-fish.png` — 분홍 작은 열대어
- `neon-tetra.png` — 파랑+빨강 줄무늬 (선택)
- `guppy.png` — 알록달록 꼬리 큰 (선택)

---

## 3. 복붙용 이미지 프롬프트

### 공통 스타일 블록 (모든 물고기 앞에 붙임)
```
pixel art sprite of a single {FISH}, side profile view facing right, full body in frame,
low-poly PSX / retro game aesthetic, chunky visible pixels, flat cel shading, simple bold shapes,
clean readable silhouette, centered, fully transparent background (alpha, PNG cutout),
no background, no ground, no drop shadow, no text, no border, 256x256, crisp pixels (no blur, no anti-alias)
```

### 종별 {FISH} 치환값
- clownfish → `tropical clownfish, vivid orange body with two white vertical stripes and thin black outlines, small black eye`
- blue-tang → `blue tang fish, royal blue body, bright yellow tail, small black eye`
- yellow-tang → `yellow tang fish, all bright yellow body, pointed snout, small black eye`
- pink-fish → `small pink tropical fish, soft magenta-pink body, round cute shape, small black eye`
- neon-tetra → `neon tetra, slender body, glowing cyan-blue top stripe and red bottom stripe`
- guppy → `fancy guppy, colorful body with a large flowing patterned tail (orange/teal)`

> 예) clownfish 최종 프롬프트 =
> `pixel art sprite of a single tropical clownfish, vivid orange body with two white vertical stripes
> and thin black outlines, small black eye, side profile view facing right, full body in frame,
> low-poly PSX / retro game aesthetic, chunky visible pixels, flat cel shading, simple bold shapes,
> clean readable silhouette, centered, fully transparent background (alpha, PNG cutout),
> no background, no ground, no drop shadow, no text, no border, 256x256, crisp pixels (no blur, no anti-alias)`

---

## 4. (선택) 헤엄 2프레임
더 살아있게 하려면 종마다 꼬리 위치만 다른 2장:
- `clownfish_a.png` (꼬리 위로), `clownfish_b.png` (꼬리 아래로)
- 위젯이 번갈아 보여줘 펄럭이게 함. 부담되면 1장만 — 그땐 코드로 살짝 흔든다.

---

## 5. 납품 체크리스트
- [ ] `assets/fish/<종>.png` 위치·이름 정확
- [ ] 배경 투명, 측면 프로필, 머리 오른쪽 고정
- [ ] 256×256, 픽셀 선명(안티앨리어싱 X)
- [ ] 모든 물고기 화풍 통일
- [ ] 옛 영어 스펙 문서 삭제 완료

> 이미지가 폴더에 들어오면 Claude가 위젯에 스프라이트 로더를 붙여 절차적 물고기와 교체한다.
