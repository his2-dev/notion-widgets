# 어항 장식 이미지(2D) 생성 프롬프트 — Codex용

물고기와 같은 방식. 투명 PNG 장식을 만들어 `assets/decor/` 폴더에 저장하면
위젯이 모래 바닥 위에 자동 배치한다. (로더는 이미 배선됨 — 파일명만 맞추면 됨)

---

## 1. 산출물 규격 (계약)
| 항목 | 값 |
|---|---|
| 저장 폴더 | `C:\Users\hyein\notion-widgets\aquarium\assets\decor\` (없으면 생성) |
| 형식 | **PNG, 배경 완전 투명(알파)** |
| 크기 | **512×512 px** (정사각) |
| 구도 | **정면 또는 살짝 3/4, 똑바로 선 자세, 물체 전체가 프레임 안**, 바닥 중앙에 놓이게 |
| 1파일 | 장식 1개, 중앙 정렬 |
| 스타일 | **물고기와 동일** — 픽셀/로우폴리 PSX 레트로, 도트 굵게, 플랫 음영, 안티앨리어싱 없음 |
| 금지 | 배경·바닥·그림자·글자·테두리 |
| 일관성 | 물고기 세트와 같은 화풍·도트크기·조명 |

> 파일명이 아래와 정확히 같아야 자동 배치됨. (위젯의 DECOR_DEFS가 이 이름을 찾음)

---

## 2. 파일명 & 프롬프트 (복붙용)

공통 꼬리표(모든 프롬프트 끝에 붙임):
```
low-poly PSX retro game aesthetic, chunky visible pixels, flat cel shading, simple bold shapes,
clean silhouette, centered, upright, full object in frame, fully transparent background (alpha PNG cutout),
no background, no ground, no shadow, no text, no border, 512x512, crisp pixels no blur no anti-alias
```

1) `anemone.png` (말미잘 — 흰동가리랑 세트):
```
pixel art of a single sea anemone, soft pink and purple wavy tentacles, round base, glossy,
[공통 꼬리표]
```

2) `treasure-chest.png` (보물상자):
```
pixel art of a single open treasure chest, wooden chest with gold trim, glowing gold coins inside,
[공통 꼬리표]
```

3) `shipwreck.png` (침몰선 잔해):
```
pixel art of a small sunken pirate ship wreck, broken wooden hull, tilted, mossy,
[공통 꼬리표]
```

4) `castle.png` (미니 성/유적):
```
pixel art of a small underwater stone castle ornament, towers and arch, aquarium decoration style,
[공통 꼬리표]
```

5) `starfish.png` (불가사리):
```
pixel art of a single orange starfish, five arms, top-down slightly tilted view, cute,
[공통 꼬리표]
```

---

## 3. 배치 위치 (참고 — 코드에 이미 지정됨)
| 파일 | 위치(x,z) | 높이 |
|---|---|---|
| anemone | 왼쪽 (-2.6, 0.3) | 1.5 |
| treasure-chest | 오른쪽 (2.5, 0.5) | 1.1 |
| shipwreck | 가운데 뒤 (0.3, -0.9) | 2.0 |
| castle | 가운데 뒤 (-0.4, -0.7) | 2.4 |
| starfish | 오른쪽 앞바닥 (1.3, 1.1) | 0.6 |

> 위치·크기 조정은 Claude가 `index.html`의 `DECOR_DEFS`에서 함. 다 만들 필요 없고 원하는 것만 생성해도 됨.

---

## 3-1. 전경 장식 (앞유리에 걸치는 고양이) — `cat.png`
수조 앞쪽 우측 상단 모서리에 매달리는 빌보드. 작은 고양이가 **테두리에 걸터앉아/앞발로 잡고 아래로 늘어진** 모습.

```
pixel art of a tiny cute cat hanging and draping down over an edge, front paws reaching up gripping
an invisible ledge at the top, body and tail dangling below, looking down curiously, front view, adorable,
low-poly PSX retro game aesthetic, chunky visible pixels, flat cel shading, simple bold shapes,
clean silhouette, centered, fully transparent background (alpha PNG cutout), no background, no ground,
no shadow, no text, no border, 512x512, crisp pixels no blur no anti-alias
```
> 핵심: **앞발로 위를 잡고 몸·꼬리가 아래로 늘어진 구도**여야 테두리에 걸친 것처럼 보임. 512×512, 투명배경.
> 파일명 `cat.png` 정확히. 위치·크기는 Claude가 `index.html`에서 조정 (현재 우측 상단).

## 4. 납품 체크리스트
- [ ] `assets/decor/<이름>.png` 정확한 이름
- [ ] 투명 배경, 똑바로 선 자세, 512×512
- [ ] 물고기 세트와 화풍 통일, 안티앨리어싱 없음
