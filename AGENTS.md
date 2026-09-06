# AGENTS.md

## Working Principles (general, bukan project-specific)

0. Bila conflict antara rules — destructive-op confirmation (#10) dan security-sensitive flagging (#16) always menang berbanding kelajuan/proactivity. Kalau proceed pantas akan skip salah satu daripada dua rule ni, stop dan tanya user dulu.

1. Check docs/existing code dulu sebelum implement — kalau ada library official docs atau existing pattern dalam codebase untuk sesuatu function, guna tu dulu sebelum reka approach baru. Jangan assume API/syntax dari memory kalau boleh verify.
2. Jangan invent API yang tak wujud — kalau tak pasti sama ada satu method/library function tu betul-betul wujud, check dulu (docs, package README, atau search) sebelum guna dalam code. AI "hallucinate" API yang bunyi masuk akal tapi tak wujud ni common issue.
3. Ikut pattern sedia ada dalam codebase — kalau dah ada cara tertentu untuk handle sesuatu (contoh: cara error handling, cara naming file), consistent dengan tu, jangan introduce pattern baru sebab "rasa lebih baik" tanpa state kenapa.
4. Verify sebelum declare "done" — describe macam mana check kerja (build pass? tested visually? edge case apa yang belum cover?), bukan just claim siap. Kalau project ada `DEFINITION_OF_DONE.md`, rujuk checklist tu; kalau tak ada, minimum: build/lint pass + at least one concrete verification step stated.
5. Small, reviewable changes — untuk task yang besar, pecahkan kepada step, tunjuk progress, jangan generate ribuan baris code sekali gus tanpa checkpoint.
6. Bila tak pasti/ambiguous, tanya — jangan assume dan proceed senyap. Especially untuk keputusan yang effect banyak bahagian lain (architecture, data model).
7. State assumption secara explicit kalau terpaksa buat keputusan tanpa tanya (contoh: "saya assume field ni required sebab X, betulkan kalau salah").
8. Jangan touch/refactor code yang tak related dengan task semasa — kalau nampak "boleh improve" bahagian lain, sebut je, jangan terus ubah tanpa diminta (scope creep).
9. Jangan hardcode secrets/credentials (API key, password) dalam code — selalu guna env variables, dan jangan commit `.env` ke git.
10. Untuk operasi destructive (delete file, drop table, force push, overwrite migration) — confirm dengan user dulu sebelum execute, jangan run terus.
11. Bila fix bug, cari root cause — jangan just patch symptom yang nampak (contoh: kalau error sebab null value, fix kenapa data jadi null, bukan setakat tambah null-check untuk suppress error).
12. Prefer edit file sedia ada berbanding create file baru, melainkan memang perlu — elak file sprawl/duplicate logic merata.
13. Jangan tambah library/dependency baru untuk sesuatu yang boleh diselesaikan dengan beberapa baris code sedia ada — check kalau functionality tu dah wujud dalam dependency yang dah ada dulu.
14. Bila something fail, laporkan actual error message/stack trace — bukan setakat "tak berjaya" atau assume punca tanpa evidence.
15. Match naming convention & style codebase sedia ada (contoh: camelCase vs snake_case, indentation) — jangan mix style baru dalam file yang dah ada convention lain.
16. Kalau task involve auth, payment, atau data sensitif user — sebut secara explicit yang ni "security-sensitive" sebelum implement, supaya user lebih alert semasa review.
17. Bila fix bug atau selesai task yang non-trivial (bukan typo/formatting kecil), cadangkan entry untuk `LEARNINGS.md` — format: apa silap, root cause, fix betul, area, severity. Sebelum draft entry baru, check dulu LEARNINGS.md kalau dah ada entry dengan root cause yang sama — kalau ada, cadangkan update entry sedia ada instead of duplicate. JANGAN auto-write terus; tunjuk draft entry tu kat user dulu dan tanya "nak saya catat ni dalam LEARNINGS.md?" Hanya commit lepas user confirm. Kalau user tolak/edit, ikut apa yang user nak.
18. Di awal setiap session (atau bila mula task baru dalam project ni), baca `LEARNINGS.md` dulu (kalau wujud) sebelum mula kerja — supaya elak ulang silap yang dah pernah dicatat. Kalau LEARNINGS.md dah panjang (ada archive index), baca index + entries yang area-nya relevant dengan task semasa dulu; full archive hanya bila memang perlu (contoh: audit menyeluruh).
19. LEARNINGS.md archiving — bila entries dalam LEARNINGS.md > ~30 atau file > ~500 baris, pindahkan entries lama/low-severity ke `LEARNINGS_ARCHIVE.md`, kekalkan 1-line summary index kat bahagian atas LEARNINGS.md yang point ke archive. Tanya user dulu sebelum archive (extend rule #17's confirm pattern) — jangan archive senyap.

## Docs Index (baca on-demand, bukan semua sekaligus)

Skim `README.md` sekali di awal session untuk overview. Untuk baki docs, buka HANYA yang relevant dengan task semasa — jangan baca semua fail secara automatic setiap session, tu bazir token untuk context yang tak relevant.

| Doc | Buka bila... |
|---|---|
| `LEARNINGS.md` (root) | Selalu — baca di awal setiap session (bukan on-demand macam docs/ lain) |
| `LEARNINGS_ARCHIVE.md` (root, kalau wujud) | Hanya bila perlu full history / audit — bukan default setiap session |
| `docs/API_REFERENCE.md` | Task involve endpoint/API contract |
| `docs/ARCHITECTURE.md` | Task involve struktur sistem/flow antara module |
| `docs/DATABASE_AND_*.md` | Task involve schema, query, migration |
| `docs/FRONTEND.md` | Task involve UI/component/styling |
| `docs/OPS_AND_SECURITY.md` | Task involve deployment, auth, secrets, security |
| `docs/PROJECT_TRACKING.md` | Perlu tahu status/progress project semasa |
| `DEFINITION_OF_DONE.md` (root, kalau wujud) | Rujuk untuk rule #4 — checklist "verify before done" |

Kalau task cross beberapa area (contoh: tambah field baru kena touch DB + API + frontend), baca yang relevant sahaja untuk task tu — bukan semua 6 file.

**Regenerating/updating `/docs`?** Any request like "update the docs", "docs dah outdated", "regenerate docs", or "sync docs dengan code" — treat it as a trigger to follow `docs-generation-prompt.md`. It enforces update-only regeneration (not full rewrite), flags uncertainty instead of guessing, never exposes secret values, and cross-checks the code against the rules in this file.