# Family Health Records

A private family health app in **one file: `index.html`**. Open it in any browser (Chrome, Edge, Firefox,
Safari, phone or computer). No install, no Python, no server, no internet needed. Nothing is uploaded.

## Use it

- **On this PC:** double-click `index.html`. Always open the same copy the same way: each browser keeps its own data.
- **On a phone:** copy `index.html` to the phone and open it in the browser, or host the file
  (e.g. GitHub Pages) and open the link. The page holds no data; each device keeps its own records.
- **Same data on every device: Sync.** See below. Without sync, each browser keeps its own copy.
- **Backup / Import:** *Backup* downloads a `.json` file; *Import* adds it on another device.
  Import skips anything already there, so importing the same file twice is safe.

## Sync with GitHub (one shared copy for phone + laptop)

All records are kept in **one encrypted file in a private GitHub repo**. Every device reads and writes that file,
so a change made anywhere shows up everywhere. The file is encrypted in the browser with a family passphrase
(AES-256-GCM, key from PBKDF2-SHA256 with 310,000 rounds) before upload, so GitHub only stores unreadable data.

One-time setup:
1. On GitHub, create a **private** repo, e.g. `family-health-data` (empty is fine).
2. GitHub → Settings → Developer settings → **Fine-grained personal access tokens** → Generate:
   *Repository access: Only select repositories* → that repo; *Permissions: Contents → Read and write*.
   Pick an expiry you're happy with (you'll paste a new token when it expires).
3. In the app click **Set up sync**: enter `owner/repo`, paste the token, choose a family passphrase.
4. On each other device: open the app, **Set up sync** with the same repo and passphrase (a token per device is fine).

How it behaves:
- Syncs when the app opens, a couple of seconds after every change, and when you come back to the app.
  Click the **✓ Synced** button to sync now. Works offline; changes go up next time there's internet.
- Merge is per record: the newest edit wins, deletions carry across, and the same item entered on two
  devices is kept once. Two devices saving at the same moment is handled (one retries).
- The token and passphrase are saved in that browser so sync runs on its own. **If the passphrase is lost, the
  GitHub copy can't be opened** (each device still has its own copy; use Backup now and then too).
- Lost a phone? Revoke its token on GitHub. *Turn off on this device* stops syncing without touching GitHub.

## What's inside

| Tab | What it does |
|---|---|
| Family | A card per person (age, blood group, allergies, conditions, medicines, last visit, lab alerts) and everything due in the next 30 days |
| Health & Advice | Active conditions & medicines, alerts from the latest lab values, age/gender screening recommendations, a tick-off roadmap of tasks and reminders, and a doctor summary |
| Trends | Chart of any test over time with the green normal band; whole-family comparison; blood pressure chart; every test with 2+ readings at a glance; health timeline (visits, surgeries, vaccines, lab days, medicines) |
| History | Search and filter everything (labs, scans, surgeries, visits, medicines, vaccines); CSV export; doctor summary to print, save as PDF or download as Markdown |
| Medicines / Vaccines / Visits | Lists with refill, next-dose and follow-up dates that feed the reminders |
| Add / PDF | Add records by hand, log vitals (BP, pulse, weight, sugar), or read a lab report PDF into an editable table before saving |

**Status rule for lab values:** inside the normal range = Normal; up to 10% outside = Borderline; further = High/Low;
over 2x the upper limit or under half the lower = Critical.

**PDF reading** works on text PDFs downloaded from the lab, not on scanned photos. Layouts are matched by column order
(Test, Result, Unit, Range or Test, Result, Range, Unit). Check the preview before saving.

Recommendations are general screening reminders to discuss with a doctor, not medical advice.

## Backup format

JSON with lists `members`, `records`, `tasks`, `medicines`, `vaccines`, `visits`, linked by `member_name`.
`records` use `test_date`, `category`, `biomarker`, `value`, `unit`, `ref_low`, `ref_high`, `status`, `notes`.
Backups from the first version of this page, and files in the Streamlit app's format, import as well.

## Changing the app (developer notes)

- Edit `src/app.html`, then rebuild with Node: `node build.mjs`. This writes `index.html` with
  pdf.js 4.10.38 (Mozilla, Apache-2.0, `vendor/pdfjs-4.10.38/`) embedded so the file works offline.
- Data is kept in the browser's `localStorage` under `familyHealth.v2` (data from the first version is moved over automatically).
  Sync settings are under `familyHealth.sync`. For sync every row has `_t` (last change, ms) and `deleted` maps
  removed ids to when; `save()` sets these by comparing with the last snapshot.
- The earlier Python/Streamlit version (`legacy-streamlit/`) is kept locally only, not in this repo.
