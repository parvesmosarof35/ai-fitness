# Forge AI — Professional Glass UI Audit & Gemini Implementation Brief

## Goal

Redesign the visual layer of this Expo/React Native fitness app so it feels premium, modern, cohesive, and subtly glassy. Preserve all existing functionality, navigation, state management, forms, workout logic, data flow, and screen content. This is a design-system and presentation refactor, not a product rewrite.

The intended mood is **dark athletic intelligence**: deep graphite backgrounds, controlled violet/cyan light, crisp typography, translucent layered surfaces, strong data readability, and restrained motion. Avoid a loud neon gaming look, excessive gradients, or glass applied to every element.

## Audit Summary

The app already has a promising direction, including `ForgeBackground`, `ForgeHeader`, `GlassCard`, gradient CTAs, Lucide icons, and a violet/cyan palette. The main weakness is not the lack of glass effects; it is the lack of one coherent visual system.

Current quality estimate: **6/10 foundation, 4/10 consistency, 5/10 premium finish**.

### Highest-impact issues

1. **Brand identity is fragmented.** The UI alternates among `FORGE AI`, `AURA`, and `KINETIC AI`. Treat **Forge AI** as the product brand and **Aura** only as the AI coach/persona. Remove “Kinetic AI” copy unless explicitly required by product logic.
2. **Color tokens drift across screens.** The same brand colors appear as `#665CFF` and `#6c5cff`, `#43E6D0` and `#44eac3`, plus multiple backgrounds (`#0B0B13`, `#13121c`, `#0F1015`) and multiple whites/greys. This makes screens look assembled from different concepts.
3. **Two design systems coexist.** New screens use `GlassCard` and Forge components, while older areas still use zinc/emerald Tailwind cards, `Card`, `TouchableCard`, and bespoke inline styles. `WorkoutCompleteScreen`, `CameraTrackerScreen`, `Select`, `ProgressBar`, and `StatBox` visibly belong to the older system.
4. **Glass is simulated mostly with transparency.** `GlassCard` has translucent gradients and borders but no real blur strategy. Some screens use CSS-like `filter: 'blur(...)'` and `boxShadow`, which are not a reliable cross-platform React Native solution.
5. **Typography is inconsistent and overly aggressive.** Many screens use very large all-caps italic headings, while others use plain System typography. There is no dependable display/body/mono hierarchy. Excess uppercase and wide tracking reduce readability.
6. **Spacing and shape language drift.** Card radii range from 12 to 32 and pills use 9999. Horizontal padding, section gaps, icon-button size, and card padding are repeatedly hardcoded.
7. **Headers are inconsistent.** Some screens use `ForgeHeader`; others recreate their own app bar, brand wordmark, back button, and safe-area padding. Home says `AURA` where users expect the product identity.
8. **Home is visually crowded.** It has a large title, photo hero, four stat cards, and nutrition graphics competing for attention. The hero should remain dominant and the secondary information should become quieter.
9. **Remote Google-hosted image URLs are fragile.** Home, Meals, Coach, and Onboarding use long external image URLs. Use reliable local assets or a centralized image source/fallback strategy. Keep photography treatment consistent.
10. **Important states are under-designed.** Loading, empty, error, disabled, selected, pressed, save-failed, camera-permission, and offline-image states do not share a consistent visual language.

## Target Visual System

### Color tokens

Create a single typed token source and use it everywhere. Suggested values:

- `bg.base`: `#080A10`
- `bg.raised`: `#0E111A`
- `surface.glass`: `rgba(20, 24, 36, 0.72)`
- `surface.glassStrong`: `rgba(27, 31, 46, 0.88)`
- `surface.soft`: `rgba(255, 255, 255, 0.045)`
- `border.subtle`: `rgba(255, 255, 255, 0.08)`
- `border.highlight`: `rgba(255, 255, 255, 0.16)`
- `brand.violet`: `#7C6CFF`
- `brand.cyan`: `#42E8CF`
- `accent.warm`: `#FF9B6A`
- `text.primary`: `#F5F7FC`
- `text.secondary`: `#A7ADBC`
- `text.muted`: `#6F7687`
- `success`: `#48D7A5`
- `warning`: `#F6B85F`
- `danger`: `#FF6B78`

Do not introduce random screen-level hex colors. Use cyan/violet as accents, not as large text fills everywhere. Use the warm accent sparingly for energy/calories/highlights.

### Glass recipe

Create three deliberate surface levels:

1. **Glass/subtle:** low-opacity fill, 1 px top/left highlight, faint bottom border, no heavy shadow.
2. **Glass/elevated:** stronger fill, platform-appropriate blur where supported, soft ambient shadow, subtle inner highlight.
3. **Glass/hero:** richer gradient, controlled accent glow, stronger depth, reserved only for primary content.

Use `expo-blur` only if compatible with the project’s Expo version and platform behavior. Provide a graceful opaque/translucent fallback for Android and reduced-transparency contexts. Do not rely on CSS `filter` or web-only shadows. Glass must preserve text contrast.

### Typography

Load one professional variable sans family with `expo-font` if the project permits it. Good direction: **Manrope**, **Inter**, or **Plus Jakarta Sans**. Use a mono style only for compact data labels/timers if needed.

- Display: 40/44, 800–900, minimal negative tracking
- Screen title: 30/36, 750–850
- Section title: 18/24, 700
- Body: 15/22, 450–550
- Label: 11/14, 650–750, moderate tracking
- Metric: 28/32 or 36/40, 750–850

Avoid making every heading uppercase/italic. Reserve uppercase for short labels and workout intensity. Use sentence case for readable titles and messages.

### Spacing, radii, and sizing

Use a consistent 4-point grid:

- Screen horizontal padding: 20 or 24
- Section gap: 28–32
- Card padding: 16 or 20; hero cards 24
- Element gaps: 8, 12, 16, 24
- Radii: 12 (small), 16 (controls), 20 (cards), 28 (hero)
- Icon buttons: minimum 44×44
- Primary controls: 54–56 high
- Bottom navigation touch targets: at least 44×44

### Motion

Use motion as feedback, not decoration:

- Press scale: 0.98 with 120–180 ms timing/spring
- Screen entrance: 180–260 ms; small stagger only for primary sections
- Progress changes: smooth but quick
- Haptic feedback for primary actions, selected tabs, completed sets, and success states where appropriate
- Respect reduced-motion preferences

## Component Refactor

Build or consolidate these shared primitives before polishing individual screens:

- `AppBackground`: base gradient plus 1–2 soft accent glows; no CSS `filter`
- `AppHeader`: variants for brand, title, back, and contextual action
- `GlassSurface` / improved `GlassCard`: subtle, elevated, hero, selected, danger
- `AppText`: display, title, section, body, label, metric, mono/data variants
- `Button`: primary, secondary, ghost, destructive, icon, chip; consistent pressed/disabled/loading states
- `TextField`: normal, focused, error, disabled; unified labels and password affordance
- `SegmentedControl` / `FilterChip`
- `MetricCard`
- `ProgressRing` and `ProgressBar`
- `ListRow`
- `StateView`: loading, empty, error, permission, offline
- `Avatar` with initials fallback
- `AppTabBar`

Deprecate or migrate the legacy `Card`, `TouchableCard`, zinc/emerald styles, and duplicated inline glass cards. Keep component APIs simple and typed. Avoid rewriting business logic while extracting visual primitives.

## Screen-by-Screen Direction

### Intro

- Keep the cinematic full-screen idea but standardize overlays and typography.
- Improve slide-to-slide contrast and text safe zones.
- Make pagination and CTA feel part of the same glass system.
- Ensure images have consistent crop, tonal overlay, and fallback.

### Authentication: Login, Register, Forgot Password, Check Email, New Password

- Use one shared auth scaffold: background, header, title block, form surface, footer link.
- Reduce oversized 48 px dual-color headings on smaller devices.
- Replace duplicated header/back-button code with `AppHeader`.
- Normalize form spacing, labels, focus rings, validation text, button states, and social login buttons.
- Fix any garbled password placeholder characters.
- Remove inconsistent orange/brown link colors.

### Onboarding

- Preserve the multi-step data flow, but create one stable layout shell.
- Use a clear top progress indicator, concise step title, supportive subtitle, content area, and sticky bottom CTA.
- Standardize choice cards and selected states.
- Make pickers feel embedded in the glass system.
- Avoid remote decorative imagery when a local asset or abstract brand graphic is sufficient.

### Home

- Brand the app as Forge AI; show Aura as a clearly labeled coach shortcut.
- Simplify the top bar and reduce competing icons.
- Keep one dominant workout hero with reliable imagery, dark readability overlay, compact metadata, and one strong CTA.
- Convert four metrics into cleaner, calmer compact cards with consistent icon containers.
- Replace decorative macro “liquid circles” with clear progress rings/bars or compact macro rows.
- Ensure the active-workout state is visually distinct from a normal recommendation.

### Meals / Nutrition

- Use the same background/header system as Home.
- Keep the calorie ring as the main visual, with readable consumed/target values.
- Standardize macro colors and show exact numbers, not only decoration.
- Use consistent meal cards with image gradient, meal type, calories, macros, and an add action.
- Add a polished empty/offline-image fallback.

### Workouts List

- Keep the featured-plan hierarchy but replace the placeholder dumbbell field with a refined abstract workout visual or reliable asset.
- Reduce excessive all-caps in page title/filter chips.
- Make chips compact, scrollable, and visually unambiguous when selected.
- Standardize workout rows and metadata alignment.

### Workout Overview

- Improve hero art, title readability, and transition into metrics.
- Make the 2×2 metrics grid equal in width and height across device sizes; do not depend on fragile `48%` calculations.
- Clarify routine rows and keep muscle tags secondary.
- Keep the CTA sticky but respect safe-area and tab-bar/stack context.

### Active Session

- Prioritize focus and readability; use less background decoration here.
- Replace the giant numeric media placeholder with a real exercise-media state or refined empty visual.
- Make set inputs large, tactile, and clearly selected.
- Improve pause/rest modes as distinct visual states.
- Make the exercise progress indicator scalable when many exercises exist.
- Keep critical touch targets reachable with one hand.

### Camera Tracker

- Fully migrate from zinc/emerald legacy styling.
- Use a glass top HUD, clear tracking state, refined pose frame, confidence/rep count, concise correction feedback, and a safe end button.
- Design permission denied, no device, and unavailable-camera states with `StateView`.
- Preserve camera visibility and avoid low-contrast overlays.

### Workout Complete

- Treat it as a premium success moment: restrained success glow, summary title, workout name, and balanced metrics.
- Migrate all legacy zinc/brand-cyan classes.
- Add a clear saved/save-failed status surface without alarming the user unnecessarily.
- Keep the final CTA safe-area aware.

### Progress

- Keep charts and metrics data-first; glass should frame the information, not compete with it.
- Use consistent chart axes, labels, gridlines, and accent colors.
- Add timeframe selection with a proper segmented control.
- Make loading, insufficient-data, and empty-history states polished.

### Profile

- Use a clean profile hero with initials/local fallback instead of a blurred remote avatar dependency.
- Improve grouping and row rhythm; remove unnecessary nested glass.
- Standardize chevrons, toggles, badges, dividers, and danger actions.
- Ensure logout is clearly destructive but not visually dominant.

### Aura Coach Chat

- Present Aura as the Forge AI coach, not a competing product name.
- Use a calmer chat background and readable message bubbles.
- Differentiate user, coach, typing, error, and suggested-prompt states.
- Make the composer feel anchored, safe-area aware, and visually consistent with form inputs.

### Bottom Navigation

- Refine the current floating tab bar into a lighter elevated glass dock with clear active state.
- The center Workout action may remain emphasized, but reduce its glow and ensure it does not visually overpower the current tab.
- Keep labels readable; do not rely only on color for selection.
- Respect Android/iOS safe areas and avoid covering scroll content.

## Technical Guardrails

- This project uses Expo 57 / React Native 0.86. Check the exact Expo 57 documentation before adding or changing Expo packages.
- Preserve TypeScript types and navigation route types.
- Preserve Zustand stores, hooks, validation schemas, forms, and workout behavior.
- Do not remove accessibility props; add labels/roles where missing.
- Maintain WCAG-friendly contrast: body text should be comfortably readable on every translucent surface.
- Avoid web-only styling (`filter`, CSS-only `boxShadow`, unsupported shadow utilities) for native UI.
- Do not add a large UI framework. Prefer existing React Native, NativeWind, Reanimated, LinearGradient, Lucide, and a compatible blur/font package only where justified.
- Centralize tokens instead of duplicating hex values and inline styles.
- Test narrow Android devices, modern iPhones, keyboard-open forms, long text, and large font scaling.
- Keep performance stable: avoid many full-screen blurred layers or continuously animated glows.

## Implementation Order

1. Create tokens and shared typography/spacing/radius/shadow definitions.
2. Upgrade shared background, glass surface, header, buttons, inputs, chips, metrics, state views, and tab bar.
3. Migrate Auth and Onboarding.
4. Migrate Home, Meals, Progress, and Profile.
5. Migrate Workout List, Overview, Active Session, Camera, and Complete.
6. Migrate Aura Chat.
7. Remove legacy styles/components only after every usage has moved.
8. Run typecheck/lint and perform visual QA on representative iOS and Android viewports.

## Acceptance Criteria

- Every screen looks like one product and uses one brand identity.
- Forge AI is the product; Aura is the AI coach.
- No screen-level random palette drift or legacy zinc/emerald visual language remains.
- All primary screens use the shared background, surface, text, control, and state primitives.
- Glass is restrained, layered, readable, and platform-safe.
- No CSS-only blur/shadow techniques remain in native paths.
- Headers, spacing, radii, icon sizes, buttons, inputs, chips, cards, and navigation are consistent.
- Loading, error, empty, disabled, selected, pressed, permission, offline image, save success, and save failure states are designed.
- Existing functionality and navigation remain unchanged.
- TypeScript typecheck and lint pass, and the app has been visually checked at multiple phone sizes.

## Instruction to Gemini

First inspect the repository and map existing shared components and screen flows. Then implement this redesign in small, verifiable phases. Do not merely add more glow or change colors screen by screen. Establish the shared token/component system first, migrate every screen to it, and keep all product behavior intact. After each phase, run typecheck and report exactly which files were changed, which screens were migrated, and any platform-specific compromises.
