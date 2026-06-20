# Aquarium Image Style Guide

Use this guide to generate new image assets for the `aquarium` widget in the same visual style.

The target look is a **PS1/PS2-era low-poly 3D game asset captured as a 2D PNG sprite**.
The asset should read clearly at a small size. Prioritize chunky shape, low-resolution texture feel,
simple silhouettes, and old-console lighting over polished illustration detail.

## Core Style

- PS1/PS2 low-poly retro game asset
- low-resolution painted texture
- slightly smeared texture colors
- chunky angular geometry
- simple bold silhouette
- flat cel shading or old-console vertex lighting
- cute, toy-like, readable at small size
- no modern glossy 3D realism
- no clean vector illustration
- no detailed painterly concept art
- no thin line-art

## Output Rules

### Fish

- Folder: `C:\Users\hyein\notion-widgets\aquarium\assets\fish\`
- Size: `256x256`
- Format: PNG with alpha
- View: side profile
- Direction: head facing right
- One file = one fish
- Full body inside frame
- No background, ground, shadow, text, border, or watermark

### Decor

- Folder: `C:\Users\hyein\notion-widgets\aquarium\assets\decor\`
- Size: `512x512`
- Format: PNG with alpha
- View: front or slight 3/4 view
- Object should stand upright unless the prompt says otherwise
- Whole object inside frame
- No background, ground, shadow, text, border, or watermark

## Transparency Workflow

The generator may not create true alpha directly. Use a flat chroma-key background first, then remove it locally.

Use `#00ff00` by default:

```text
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for background removal.
The background must be one uniform color with no shadows, gradients, texture, reflections, floor plane, or lighting variation.
Do not use #00ff00 anywhere in the subject.
```

Use `#ff00ff` instead when the subject contains green, moss, plants, or other colors close to green.

After generation:

- Remove the chroma-key background.
- Save final output as RGBA PNG.
- Verify corners have alpha `0`.
- Resize to the required final size.
- Keep the subject centered and fully visible.

## Universal Prompt Template

Use this template for most aquarium assets:

```text
Use case: stylized-concept
Asset type: aquarium sprite matching existing PSX low-poly aquarium assets
Primary request: {SUBJECT_DESCRIPTION}

Reference style: PlayStation 2 era low-poly 3D game asset, chunky angular geometry,
low resolution painted texture, slightly smeared texture colors, simple old-console vertex lighting,
rendered as a transparent cutout sprite.

Style/medium: retro PSX / PS2 low-poly 3D render converted to a 2D sprite,
chunky visible pixels, flat cel shading, simple bold shapes, clean silhouette,
not modern pixel art, not vector, not realistic photo.

Composition/framing: {SIZE} square sprite source, one subject only, centered,
full subject inside frame with generous padding, no cropping.

Scene/backdrop: perfectly flat solid {KEY_COLOR} chroma-key background for background removal.

Lighting/mood: unified soft old-console vertex lighting, cute toy-like aquarium asset,
readable at small size.

Constraints: no background, no water, no sand, no ground, no shadow, no text,
no border, no watermark. Do not use {KEY_COLOR} anywhere in the subject.
Keep the background one uniform {KEY_COLOR} color with no gradients or texture.
```

Replace:

- `{SUBJECT_DESCRIPTION}` with the exact asset request.
- `{SIZE}` with `256x256` for fish or `512x512` for decor.
- `{KEY_COLOR}` with `#00ff00` or `#ff00ff`.

## Fish Prompt Pattern

```text
a single {FISH_NAME} aquarium fish, {COLOR_AND_SHAPE_DETAILS},
small black eye, side profile facing right, full body visible
```

Examples:

```text
a single clownfish aquarium fish, orange body with simple white bands and thin dark markings,
small black eye, side profile facing right, full body visible
```

```text
a single neon tetra aquarium fish, small slender body, cyan blue upper stripe,
red lower stripe, translucent pale body, small black eye, side profile facing right,
full body visible
```

## Decor Prompt Pattern

```text
a single {OBJECT_NAME} aquarium ornament, {MATERIAL_AND_SHAPE_DETAILS},
toy-like decoration, upright pose, entire object visible
```

Examples:

```text
a single sea anemone aquarium ornament, soft pink and purple wavy tentacles,
round base, glossy wet-looking surfaces, upright standing pose, entire object visible
```

```text
an open treasure chest aquarium ornament, wooden chest with gold trim,
glowing gold coins inside, chunky simple shapes, upright stable pose, entire object visible
```

## Cat Prompt

Use this for `assets/decor/cat.png`:

```text
pixel art of a tiny cute cat hanging and draping down over an invisible ledge at the very top,
front paws reach upward and grip the invisible top edge, body and tail dangling below,
looking down curiously, front view, adorable.
low-poly PSX retro game aesthetic, chunky visible pixels, flat cel shading,
simple bold shapes, clean silhouette, crisp hard pixel edges, no blur,
no anti-alias look, tiny game sprite cutout.
Match the existing aquarium fish/decor assets: retro PlayStation-era low-poly rendered sprite
with low-resolution texture feel.
512x512 square source, one cat only, centered, full body and tail inside frame,
paws near the top edge but not cropped, body hanging vertically downward,
transparent PNG cutout after processing, no visible ledge, no background,
no ground, no shadow, no text, no border, no watermark.
```

## Negative Prompt Notes

Avoid these because they push the image away from the current set:

- photorealistic
- modern 3D render
- smooth high-poly model
- realistic fur, scales, or wet materials
- cinematic lighting
- detailed background
- painterly illustration
- clean vector icon
- thin outlines
- soft drop shadow
- text labels

## Final QA Checklist

- [ ] Correct folder and filename.
- [ ] PNG with alpha channel.
- [ ] Transparent corners.
- [ ] Required size: fish `256x256`, decor `512x512`.
- [ ] Subject centered and not cropped.
- [ ] No background, shadow, text, border, or watermark.
- [ ] Same PSX low-poly cutout feeling as existing assets.
- [ ] Readable when displayed small in the aquarium widget.
