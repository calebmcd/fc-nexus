# FC Master Terminal Suite

## Project Overview
The FC Master Terminal Suite is an advanced Tampermonkey UserScript engineered to optimize warehouse scanning workflows for the Faithful Companion admin portal. It introduces an isolated namespace architecture, preventing conflicts with native window objects, and drastically reduces server latency through progressive database cascading and local memory caching.

## Installation Guide
1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension for your respective browser.
2. Click the Tampermonkey extension icon and select **Create a new script**.
3. Delete the default template code provided in the editor.
4. Copy the entire FC Master Terminal Suite source code and paste it into the editor.
5. Save the script (`Ctrl + S` or `Cmd + S`).
6. Navigate to `https://admin.faithfulcompanion.com/job*` to initialize the suite.

## Core Features Breakdown
* **Rapid (Communal) Check-In:** High-speed barcode processing terminal featuring duplicate prevention, automatic keepsake formatting, and automated label printing.
* **Communal Cremation Logger:** Dynamic load-balancing tool supporting up to 4 concurrent pallets. Tracks cumulative weight capacities (via numeric input or database size estimates) and provides visual threshold warnings.
* **Multi-User Dynamic Storage:** Implements intelligent state management by reading the active DOM profile. It dynamically provisions isolated `localStorage` keys (`fc-rapid-log-{user}`, `fc-settings-{user}`, etc.) to guarantee zero data collision between shift workers on shared hardware.
* **Offline Sync Queue:** Intercepts failed XMLHttpRequest `fetch` calls during network drops, caching the payloads locally. A background polling daemon automatically flushes the queue to the backend once connectivity is restored.

## User Guide & Workflows
* **Custom Keyboard Shortcuts:** Remap hotkeys (e.g., toggling terminals, focusing search bars) via the Global Settings panel. The engine natively suppresses default browser behaviors to prevent input conflicts.
* **Global Settings & Developer Mode:** Accessed via the gear icon in the floating dock.
  * *Developer Mode (Easter Egg):* Rapidly click the "Global Settings" header text 5 times. This exposes advanced database query limits, local cache toggles, and legacy data-migration tools.
* **Native UI Print Injection:** When enabled in settings, hovering over a standard DataTables job row injects a rapid-print icon into the DOM, allowing label printing without navigating away from the list view.
* **X-Ray Vision Tooltip:** Employs asynchronous background fetching. Hovering over a job link intercepts the URL and renders a floating tooltip containing critical payload data (keepsakes, size, status, special requests) without triggering a full page navigation.

## Configuration & Maintenance
The suite utilizes a strict dictionary and fuzzy-matching engine to normalize database artifacts. To add new clinics or handle specific edge cases:

1. Locate the `CONFIG.formatters` object at the top of the script.
2. For explicit truncation overrides, add key-value pairs to the `clinics` object:
   ```javascript
   'WAVERLY ANIMAL HOSPITAL': 'Waverly Vet Hosp.'
   ```
3. For new master acronym mapping, add entries to the `clinicMap` object:
   ```javascript
   "Amazing Grace Animal Rescue": "AGAR"
   ```
4. Add the resulting acronym to the `acronyms` array to ensure it is whitelisted by the Title Case normalizer.
