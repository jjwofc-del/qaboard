# QABoard v1.1.6 — QA workflow hardening

- Test Case recent result is derived from the newest recorded Test Run (Not Run if never executed). Previous editable `case.status` remains in backups for compatibility but is no longer authoritative.
- Manual latest-result editing removed from Test Case editor; Test Runs record execution results. Existing Test Run snapshots retained.
- Resolved bugs stay in the active list until QA retest. QA retest form records Pass/Fail, a required note and optional linked run. Pass closes the bug; Fail reopens it.
- Direct Closed transitions without a successful QA retest are blocked. Previously closed bugs are preserved.
- Dashboard work queue shows pending retests, failed executions, and not-run entries.
- Data remains on the current device's browser; use Settings & Backup before upgrades. No server sync.

## Acceptance tests

1. A TC with no real Test Run displays Not Run, even if legacy metadata said Pass.
2. Run the TC and set Fail: recent result changes to Fail; create another run and Pass: latest result changes to Pass while older Run remains Fail.
3. Move a bug to Resolved: it stays in the active list, click QA 재검증, record Pass and a note: it moves to Closed list.
4. For another Resolved bug record Fail: it returns to Open, retaining notes in bug history.
5. Directly choosing Closed without QA verification is blocked.
6. Dashboard work queue refreshes after test/bug changes.
7. Export and restore JSON, verify case/run/bug histories are preserved.
