# SecurityPrep: CompTIA exam study platform

An installable, offline-capable study app for **Security+ (SY0-701)**, **CySA+ (CS0-003)**, **PenTest+ (PT0-003)** and **SecurityX (CAS-005)**.

## What is in it
- **Study**: notes for every objective, key terms, hands-on assignments (self-checked) and a capstone per domain
- **Practice**: instant-feedback quizzes by exam, domain or objective; review-missed, review-saved and weakest-objective drills
- **Labs**: a hands-on sandbox with 19 labs. Use a simulated Linux terminal for log hunting and permission audits, write firewall rules against test traffic, analyze a packet capture, harden SSH / web server / identity-policy files, run real hashing and key-derivation experiments, analyze phishing emails, and make triage, scope and incident-phase decisions. Labs are checked automatically and your completion is saved with your progress
- **Practical-style questions**: put steps in order, sort items into categories, and read a log, rule set or config exhibit
- **Flashcards**: real spaced repetition (1, 3, 7, then 14 day gaps), a "due now" queue, and keyboard controls
- **Mock exam**: timed, no feedback until you submit, paced like the real exam, with a per-domain and pace breakdown
- **Readiness**: weighted score per domain and for the whole exam, focus areas, mock trend
- **Study plan**: set an exam date and get a daily target based on what is left
- **Search**: across every note, term, objective and question; plus saved objectives and questions and your own notes
- **Themes**: dark, light, or match the device. Keyboard shortcuts in quizzes (A-F or 1-6 pick, Enter checks and continues)

## Your progress stays on your device
There is no account or server. Progress is kept in three places so clearing one does not lose everything:
1. the browser's storage (primary),
2. a second copy in the browser's database (IndexedDB), restored automatically if the first is cleared,
3. optionally an **auto-backup file** you choose in Settings (Chrome, Edge and other Chromium browsers): it is rewritten after every change.

The app also asks the browser to treat its storage as persistent. Settings shows the status of each, and you can export or import a backup at any time. Add `?nopersist` to the address to skip the persistence request (the tests do).

## Build status
| Exam | Built so far |
|---|---|
| Security+ | All five domains. |
| CySA+ | All four domains. |
| SecurityX | All four domains. |
| PenTest+ | All five domains are present. Domains 1 to 3 follow the official PT0-003 objective structure and titles (CompTIA exam objectives document v5.0). Domains 4 and 5 still use an earlier, coarser grouping (5 and 3 objectives instead of the official 10 and 4); `node tests/validate.js` lists this as a known gap. Content is concept-level, with no payloads or step-by-step attack procedures. |

Run `node tests/validate.js` for the exact question and objective counts.

## Labs
Everything in the labs runs inside the browser against fictional systems: the terminal is a simulator with an in-memory filesystem (nothing real is executed), firewall and packet data are generated, and no real attack tools or network access are involved. Lab files live in `js/labs/`: `core.js` (pure logic, testable in Node), `ui.js` (rendering), and `content-*.js` (the labs). To add a lab, register it with `CT.labs.register({...})` and add a reference solution to `tests/lab-solutions.js`; `node tests/validate.js` then proves the lab can be completed and that no task starts already done.

## Testing
No packages to install.
- `node tests/validate.js` (or `npm test`): checks every domain, objective, term, assignment and question for shape and consistency, runs every lab through an independent reference solution, that every content file is loaded and cached, that renamed question ids point at real questions, and that the PenTest+ objectives match CompTIA's published list (`tests/official-pt0-003.json`).
- `node tests/smoke.js`: opens the real app in headless Chrome or Edge (Node 22+) and drives it: every page, every question type, saving and restoring progress, search, themes, flashcards, the mock exam and results.

Run both after changing content. Updates are picked up automatically when online (the service worker is network-first), so there is no cache version to bump.

## Adding the next domain
1. Copy `js/content/secplus-d1.js` as a pattern. Each domain file calls `CT.register('<exam>-<domain>', { notes, terms, assignments, capstone, questions })`.
2. For exams other than Security+, add the `objectives` list to that domain in `js/catalog.js`.
3. Add the new `<script>` line in `index.html` and the file path in `sw.js`, then run `node tests/validate.js`.
4. Practical-style questions for any exam go in `js/content/pbq.js` via `CT.addQuestions(exam, domain, [...])`. Types: `order` (steps listed in the correct order), `sort` (items with a category each), and any question can carry an `exhibit`.
5. If you ever rename question ids, add the old-to-new mapping to `js/migrations.js` so saved progress carries over.

Notes and questions are original study material, not real exam questions. Confirm current exam details on comptia.org.
