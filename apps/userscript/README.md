# FC Master Terminal Suite

**Version:** 13.22.1  
**Author:** Caleb McDougall  
**Target:** [Faithful Companion Admin Portal](https://admin.faithfulcompanion.com/job*) — job list and detail pages

A Tampermonkey userscript that adds a floating overlay to the Faithful Companion admin portal, optimized for warehouse scanning workflows. It provides high-speed Communal Check-In, multi-pallet Communal Cremation logging, and passive job inspection — without replacing the native portal.

---

## Project Overview

The suite runs as a self-contained IIFE with an isolated namespace (no conflicts with native `window` objects). It reduces server latency through progressive database cascading, local memory caching, and per-user `localStorage` isolation so multiple shift workers can share the same workstation without data collisions.

**Primary capabilities:**

| Feature | Description |
|---------|-------------|
| Communal Check-In | Scan, confirm, check in, and optionally auto-print keepsake labels |
| Communal Cremation | Log pets to 1–4 pallets with weight tracking and formatted export |
| X-Ray Vision | Hover tooltip with job details — no page navigation required |
| Offline Sync | Queues failed check-ins and retries when connectivity returns |
| Native Print | Injects a print button into standard job list rows on hover |

For full architecture, API quirks, and development conventions, see [`FC Master Terminal Suite Context.txt`](./FC%20Master%20Terminal%20Suite%20Context.txt).

---

## Installation

### Option A — Tampermonkey (manual)

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Open Tampermonkey → **Create a new script**.
3. Delete the default template.
4. Paste the full contents of [`FC Master Terminal Suite.js`](./FC%20Master%20Terminal%20Suite.js).
5. Save (`Ctrl + S` / `Cmd + S`).
6. Navigate to `https://admin.faithfulcompanion.com/job*` — the floating dock appears bottom-right.

### Option B — Auto-update from GitHub

The script header includes `@updateURL` and `@downloadURL` pointing to the main branch on GitHub. If installed from that URL, Tampermonkey can check for updates automatically.

---

## UI Overview

On load, a fixed dock appears in the bottom-right corner:

```
⚙️ Global Settings  |  Communal Check-In  |  Communal Cremation
```

- **Gear** — global settings, backup, keyboard shortcuts
- **Communal Check-In** (red) — rapid check-in terminal
- **Communal Cremation** (blue) — cremation logging terminal

Each terminal panel is draggable (grab the header), resizable (drag the corner), and remembers its position per user. An amber badge on the dock indicates pending offline sync jobs.

---

## Communal Check-In

High-speed terminal for processing incoming communal jobs.

### Workflow

1. Open **Communal Check-In** from the dock.
2. Scan or type a Request ID, Cremation ID, pet name, clinic, or family name → **Enter**.
3. Review the confirmation preview (pet, family, clinic, keepsakes, special requests).
4. **Enter** again to check in; **Escape** to cancel.
5. The job is appended to the local log. Keepsake jobs auto-print when enabled.

### Keepsake Codes

| Code | Item |
|------|------|
| CP | Clay Paw |
| IP | Ink Paw |
| IN | Ink Nose |
| FC | Fur Clip |
| PH | Photo |

Quantity prefixes are supported (e.g. `2FC` for two fur clips).

### Additional Actions

- **➕ Manual FC Form** — add a record without a server job (walk-in / paper form).
- **✏️ / 🖨️ / 🗑️** — edit, reprint, or remove log entries (hover a row).
- **View / Print** — open a formatted print layout.
- **Copy** — copy a Word-compatible HTML table + TSV to clipboard.
- **Clear** — wipe the entire check-in log.

Duplicate jobs (same `jobId`) are blocked with an audio alert.

---

## Communal Cremation

Local logging tool for batching pets onto cremation pallets. **Does not change job status on the server** — it builds a formatted log for warehouse use.

### Workflow

1. Open **Communal Cremation** and select a pallet (1–4).
2. In **numeric weight mode**, enter lbs in the weight field first.
3. Scan or search → review preview → **Enter** to log to the active pallet.
4. Monitor the capacity bar (combined weight vs. max threshold).
5. Export or print when the batch is complete.

### Progressive Search (fastest path first)

When you scan a job, the suite searches in order:

1. **Local cache** — matches against today's Check-In log (instant, if enabled)
2. **Quick scan** — closed records from the last 7 days (default)
3. **Active orders** — open jobs
4. **Deep scan** — closed records up to 60 days back (default)

### Pallet & Weight Settings

Configure via the terminal **⚙️ Settings**:

| Setting | Options |
|---------|---------|
| Pallets | 1–4 concurrent |
| Weight mode | **DB Size** (S/M/L estimates) or **Numeric** (manual lbs) |
| S/M/L estimates | Default 10 / 35 / 70 lbs |
| Max combined weight | Default 3000 lbs — bar turns yellow at 90%, red at capacity |
| Summary format | Split (per pallet + totals) or Combined |
| Export format | Combined table or separate page per pallet |
| Color code logs | Tint rows by pallet in exports |

### Manual Entries

- **FC Form** — standard manual entry with pet, family, clinic, size, keepsakes.
- **Stray/Wildlife** — preset entry type for non-clinic cases.

Pallet buttons show live Small / Medium / Large counts as you log.

---

## X-Ray Vision

Hover over any job link in the native DataTables list for ~600ms to see a floating tooltip with:

- Pet name and job ID
- Size and latest status/history
- Keepsakes, return-to, amount due
- Special requests and internal notes

Hold **Shift** to pin the tooltip for reading; release Shift to dismiss. Enabled by default; toggle in Developer Mode settings.

---

## Global Settings

Open via the **⚙️** dock button.

### Standard Settings

- **Your Initials** — stamped on exported logs (auto-generated from profile name if blank)
- **Audio Cues** and **Volume** — scan feedback tones
- **Terminal Opacity** — panel transparency
- **Default Position** — corner placement for reset/new sessions
- **Export Backup / Import Backup** — JSON snapshot of settings, both logs, and sync queue
- **Keyboard Shortcuts** — remap hotkeys (click an input, press the desired combo)

### Default Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + R` | Toggle Communal Check-In |
| `Alt + C` | Toggle Communal Cremation |
| `Alt + F` | Focus search bar (active terminal) |
| `Escape` | Close all terminals and settings |

### Developer Mode

Rapidly click the **Global Settings** header **5 times** to unlock:

- Search history window (days)
- X-Ray Vision and Native UI Print toggles
- Simulate Offline Mode (test sync queue)
- Comm scan windows (normal / deep days)
- Local cache toggle
- **Migrate Legacy Logs** — re-run all log entries through current clinic formatters

---

## Multi-User Storage

The script reads the logged-in user's name from `a.profileName` on the portal page and scopes all data to that user:

| Key | Contents |
|-----|----------|
| `fc-rapid-log-{user}` | Check-in log |
| `fc-comm-log-{user}` | Cremation log |
| `fc-master-settings-{user}` | All settings and panel positions |
| `fc-sync-queue-{user}` | Pending check-in job IDs |

If no profile is detected, data falls back to a `Shared` namespace.

---

## Offline Sync Queue

When a check-in fails due to network loss (or Developer Mode offline simulation), the job ID is saved locally. A background process retries the queue every 30 seconds and when the browser reports `online`. An amber pulse badge on the dock shows how many jobs are pending.

---

## Native UI Print

When enabled (Developer Mode), hovering a row in the standard job list injects a 🖨️ button next to the job link. Click it to print the job label without leaving the list view.

---

## Configuration & Maintenance

### Adding or Updating Clinics

The suite normalizes clinic names using a dictionary and fuzzy acronym matcher in `CONFIG.formatters` at the top of the script.

1. **Acronym mapping** — add to `clinicMap`:
   ```javascript
   "Amazing Grace Animal Rescue": "AGAR"
   ```
2. **Whitelist the acronym** — add to the `acronyms` array so Title Case logic preserves it.
3. **Truncation override** (optional) — add uppercase keys to `clinics`:
   ```javascript
   'WAVERLY ANIMAL HOSPITAL': 'Waverly Vet Hosp.'
   ```

After bulk dictionary changes, use **Migrate Legacy Logs** in Developer Mode to reformat existing saved entries.

### Version Updates

When releasing a new version:

1. Bump `@version` in the userscript header.
2. Consider aligning the `version` field in the backup export payload.
3. Update this README and the Developer Context file.

---

## For Developers

| Resource | Purpose |
|----------|---------|
| [`FC Master Terminal Suite.js`](./FC%20Master%20Terminal%20Suite.js) | Source (single-file IIFE, ~1400 lines) |
| [`FC Master Terminal Suite Context.txt`](./FC%20Master%20Terminal%20Suite%20Context.txt) | Architecture, API quirks, anti-patterns, conventions |

**Key rules:**

- Modular namespace — `CONFIG`, `State`, `Utils`, `AudioService`, `API`, `UI`, `App.*`
- Never call `fetch()` outside `API`
- Never run concurrent `/job/list` requests — the server rate-limits aggressively
- Store shared UI state (e.g. `activePallet`) on `State`, not in module locals

---

## License & Distribution

Distributed via Tampermonkey and the [fc-nexus](https://github.com/calebmcd/fc-nexus) repository. Internal tool for Faithful Companion warehouse operations.
