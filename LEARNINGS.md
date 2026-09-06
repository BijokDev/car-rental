# LEARNINGS.md

> Log silap & fix yang pernah jadi dalam project ni. AI kena baca fail ni di awal setiap session (rule #18 dalam AGENTS.md). Entry baru ditambah hanya lepas user confirm (rule #17).
> Bila file ni dah panjang (>30 entries atau >500 baris), entries lama/low-severity dipindah ke `LEARNINGS_ARCHIVE.md` — tengok rule #19. Index bawah ni kekal terkini walau lepas archive.

---

## Index (ringkas, update bila entry baru/archive)

<!--
Format: [YYYY-MM-DD] [area] [severity] — Ringkasan singkat (link ke entry penuh kat bawah, atau ke archive)
Contoh:
- [2026-01-15] [db] [high] — Migration overwrite tanpa backup
- [2025-11-02] [auth] [low] — Token refresh race condition (→ LEARNINGS_ARCHIVE.md)
-->

---

## Format entry

## [YYYY-MM-DD] [area: db|api|frontend|auth|infra|other] [severity: high|medium|low] — Ringkasan singkat isu
❌ **Silap:** apa yang jadi / assumption yang salah
🔍 **Root cause:** kenapa ia jadi (bukan setakat symptom)
✅ **Fix:** apa penyelesaian betul
📌 **Elak lagi:** (optional) rule/pattern spesifik untuk future reference

---

<!-- Entries baru ditambah kat bawah ni. Sebelum tambah, check index atas — kalau root cause sama dah wujud, update entry sedia ada instead of duplicate (rule #17). -->