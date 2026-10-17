# Melissa Ledger — Changelog

All notable changes to this app are documented here.
Format: `[YYYY-MM-DD] Type — Description`
Types: Fix / Feature / Refactor / Deploy

---

## [2026-04-15] Feature — Admin panel with Source Inbox
- Password-gated admin panel (password: `VITE_ADMIN_PASSWORD` env var, default `mri2026`)
- Source Inbox: paste a URL → checks for duplicates across all donations/reports/promises
- Jump-to-form: Inbox shows match summary; "Add as X" buttons open the form with URL pre-filled
- Donation form, Community Report form, Gov Promise form — all wired to real store
- Slide-over panel from right with backdrop blur

## [2026-04-15] Feature — DeepSeek AI integration
- Replaced Gemini AI service with DeepSeek (`https://api.deepseek.com/chat/completions`)
- API key via `VITE_DEEPSEEK_API_KEY` env var
- Generic prompt (no storm/hurricane framing) — context-neutral analysis
- Returns placeholder markdown when API key not set (graceful fallback)
- File: `services/aiService.ts` (new)

## [2026-04-15] Refactor — All views wired to real store data
- **Accountability**: removed `MOCK_PROMISES`, reads from `getPromises()`, shows ministry + sourceUrl
- **Reports**: full rewrite from mock data to `getReports()`, severity badge, source link, empty state
- **CommunityMap**: redesigned using `getParishSummaries()`, grid cards with severity/relief/donations,
  progress bar relative to max parish, summary table — all fake data removed
- **Predictions**: wired to `getKPIs`, `getReports`, `getPromises`; manual "Run Analysis" trigger;
  idle state with Sparkles icon
