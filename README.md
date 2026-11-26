# Rumah Harapan — Virtual Tour Demo

Demo website (Next.js App Router + TypeScript + Tailwind + A-Frame 1.8) for a children’s home. Potential sponsors can “visit” through a 360° tour with VR headset support. Sample assets only — for client presentation.

## Requirements

- Node.js 20+
- npm

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve production build
npm test        # unit tests (yaw/pitch helper)
```

The site emits `noindex` and is Indonesian-only for now.

## Replace sample assets

1. Put equirectangular **JPG** panoramas and **H.264 MP4** 360 videos under `public/demo/` (or your own folder).
2. Update paths in `src/content/tour.ts` (`image`, `thumbnail`, `photos`, `videos`).
3. Keep panorama aspect ≈ **2:1** (e.g. 4096×2048). Videos should be equirectangular MP4.
4. Thumbnails can be smaller crops/resizes of the same scenes.

Suggested filenames already wired in content:

| Role | Example path |
|------|----------------|
| Panorama | `/demo/eksterior-1.jpg`, `/demo/kelas-1.jpg`, … |
| Thumbnail | `/demo/eksterior-1-thumb.jpg`, … |
| Gallery photo | `/demo/photo-kelas-a.jpg`, … |
| 360 video | `/demo/video-sample.mp4` |
| Video poster | `/demo/video-sample-poster.jpg` |

Canonical copies of the open sample panoramas also live as `panorama-city.jpg`, `panorama-sechelt.jpg`, `panorama-cubes.jpg`.

## Asset sources & licenses (demo)

Current demo media comes from the **A-Frame CDN** example packs (CORS-enabled):

| Asset | URL |
|-------|-----|
| city panorama | https://cdn.aframe.io/360-image-gallery-boilerplate/img/city.jpg |
| sechelt panorama | https://cdn.aframe.io/360-image-gallery-boilerplate/img/sechelt.jpg |
| cubes panorama | https://cdn.aframe.io/360-image-gallery-boilerplate/img/cubes.jpg |
| thumbs | `thumb-city.jpg`, `thumb-sechelt.jpg`, `thumb-cubes.jpg` (same gallery) |
| 360 video | https://cdn.aframe.io/360-video-boilerplate/video/city.mp4 |

Boilerplate packaging: [aframevr/360-image-gallery-boilerplate](https://github.com/aframevr/360-image-gallery-boilerplate) (MIT). Index: https://cdn.aframe.io/

These are **stand-ins**, not photos of Rumah Harapan. Replace before any production launch.

## Yaw / pitch debug helper (hotspot placement)

1. Copy `.env.example` → `.env.local`
2. Set:

```bash
NEXT_PUBLIC_TOUR_DEBUG=true
```

3. Restart `npm run dev`
4. Open the tour and **click the panorama** (not a hotspot)
5. The console logs `{ yaw, pitch }` in degrees:

- `yaw` 0 = straight ahead, positive = right  
- `pitch` positive = up  

6. Paste those values into `links` entries in `src/content/tour.ts`.

Conversion helper (with unit tests): `src/lib/yawPitch.ts`.

## Architecture notes

- Single page: scene changes are React state + `history.replaceState` (no route change — keeps VR sessions alive).
- A-Frame loads **client-only** (`dynamic` + `ssr: false`).
- React owns 2D UI/state; A-Frame owns the 3D scene (imperative DOM after load).
- Bridge: React → `setAttribute` / rebuild hotspots on scene change; A-Frame → `CustomEvent` (`tour:navigate`, `tour:exit-video`).

## Manual test checklist

### Desktop Chrome

- [ ] Homepage hero shows **Rumah Harapan**, CTA scrolls to `#tour`
- [ ] Area cards open the matching scene (URL updates `?scene=` / `?area=` without full navigation)
- [ ] Drag looks around; hotspots navigate; prev/next + thumb strip work
- [ ] Info panel: description, photos, videos; Escape closes; focus returns to Info
- [ ] Video: play / mute / close → back to photo sky
- [ ] Keyboard: Tab shows focus rings; thumb strip ArrowLeft/ArrowRight
- [ ] `npm run build` succeeds; page has `robots` noindex

### Android Chrome

- [ ] Gyroscope / magic-window look works after permission if prompted
- [ ] Touch drag still works if gyro is off
- [ ] Hotspots tappable; video controls usable
- [ ] Overlay usable in portrait and landscape

### iPhone Safari

- [ ] Device orientation permission UI appears when needed; after Allow, gyro works
- [ ] **No Enter VR button expected** (WebXR VR not available in Safari)
- [ ] Tour does not break on permission Deny (mouse/touch look still works)
- [ ] Video plays inline (muted first); unmute works after gesture

### Meta Quest Browser

- [ ] **Enter VR** works; session survives scene changes (no page reload)
- [ ] Laser pointer selects hotspots
- [ ] Info is desktop overlay only (hidden in VR) — expected
- [ ] Start a video from 2D, enter VR (or start video then VR): **Kembali** 3D button returns to photo
- [ ] Exit VR restores 2D overlay

## Out of scope

Sponsor/child profiles, payments, login, CMS, database, English UI, analytics.
