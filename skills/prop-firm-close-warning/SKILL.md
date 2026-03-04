---
name: prop-firm-close-warning
description: >-
  Implements and maintains the "Close Pos. Before" feature in the TK Trading Fundamentals Dashboard.
  Highlights prop-firm mandatory position-close events (NFP, Rate Decisions, CPI) with countdown timers.
  Shows overnight events (before 09:00 Frankfurt Time) as early warnings from 16:00 the previous day with a TONIGHT badge.
  Use when adding new currencies to the close list, updating event keywords, changing the overnight warning threshold,
  or debugging why an event is not appearing in the Close Pos. Before section.
---

# Prop-Firm Close Warning Feature

## Overview

The "Close Pos. Before" section sits **above** the Red Folder News section in the Daily View. It automatically filters `redFolderNews` events from `dailyRecap.json` against a hardcoded list of prop-firm mandatory close events — no JSON changes needed.

**Key file:** `client/src/pages/Home.tsx`

---

## PROP_FIRM_CLOSE_EVENTS List

Defined at the top of `Home.tsx` (before any component functions):

```ts
const PROP_FIRM_CLOSE_EVENTS: { currency: string; keywords: string[] }[] = [
  { currency: "USD", keywords: ["Federal Funds Rate", "Non-Farm Employment Change", "Nonfarm Employment Change", "Non-Farm Payrolls", "NFP", "Unemployment Rate", "Advance GDP", "FOMC Meeting Minutes", "CPI y/y"] },
  { currency: "EUR", keywords: ["Main Refinancing Rate", "Minimum Bid Rate", "ECB Rate"] },
  { currency: "GBP", keywords: ["Official Bank Rate", "MPC Vote", "CPI y/y"] },
  { currency: "CAD", keywords: ["Overnight Rate", "BOC Rate", "BoC Rate", "CPI m/m", "Employment Change", "Unemployment Rate"] },
  { currency: "AUD", keywords: ["Cash Rate", "RBA Statement", "Employment Change", "Unemployment Rate", "CPI q/q", "GDP q/q"] },
  { currency: "NZD", keywords: ["Official Cash Rate", "RBNZ", "Employment Change", "Unemployment Rate", "CPI q/q", "GDP q/q"] },
  { currency: "CHF", keywords: ["SNB Policy Rate", "SNB Rate", "SNB Monetary Policy", "Swiss National Bank", "Libor Rate", "SNB Press Conference"] },
  { currency: "JPY", keywords: ["BOJ Rate", "BoJ Rate", "Bank of Japan Rate", "Monetary Policy Statement", "BOJ Policy Rate", "BOJ Interest Rate", "Outlook Report", "BOJ Press Conference"] },
];
```

### Critical Rule: ADP Exclusion

The `isPropFirmEvent()` guard **must** explicitly exclude ADP reports (private report, not official NFP):

```ts
const isPropFirmEvent = (news: any): boolean => {
  if (news.event?.toLowerCase().includes("adp")) return false; // ADP = private, NOT official NFP
  const rule = PROP_FIRM_CLOSE_EVENTS.find(r => r.currency === news.currency);
  if (!rule) return false;
  return rule.keywords.some(kw => news.event?.toLowerCase().includes(kw.toLowerCase()));
};
```

---

## Display Logic

### Same-Day Events (Normal)
- Filter: `news.day === currentDay && isPropFirmEvent(news)`
- Badge: amber **CLOSE** label
- Timer: `<CountdownTimer eventTime={news.time} />` (live countdown)

### Overnight Events (Early Warning)
- Trigger: current Frankfurt Time hour ≥ **16**
- Filter: `news.day === tomorrowDay && isPropFirmEvent(news) && eventHour < 9`
- Badge: yellow **🌙 TONIGHT** label
- Timer: static time string (event is next day — no countdown)

Both sets are merged and rendered in the amber-bordered section above Red Folder News.

---

## Complete Currency Coverage

| Currency | Covered Events |
|----------|---------------|
| USD | Federal Funds Rate, NFP, Unemployment Rate, Advance GDP, FOMC Minutes, CPI y/y |
| EUR | Main Refinancing Rate, Minimum Bid Rate, ECB Rate |
| GBP | Official Bank Rate, MPC Vote, CPI y/y |
| CAD | Overnight Rate, BOC/BoC Rate, CPI m/m, Employment Change, Unemployment Rate |
| AUD | Cash Rate, RBA Statement, Employment Change, Unemployment Rate, CPI q/q, GDP q/q |
| NZD | Official Cash Rate, RBNZ, Employment Change, Unemployment Rate, CPI q/q, GDP q/q |
| CHF | SNB Policy Rate, SNB Rate, SNB Monetary Policy, Swiss National Bank, Libor Rate, SNB Press Conference |
| JPY | BOJ Rate, BoJ Rate, Bank of Japan Rate, Monetary Policy Statement, BOJ Policy Rate, BOJ Interest Rate, Outlook Report, BOJ Press Conference |

---

## Adding a New Currency

1. Add entry to `PROP_FIRM_CLOSE_EVENTS` in `Home.tsx`
2. Match Forex Factory's exact event name (case-insensitive partial match is used)
3. Test with a dummy event in `dailyRecap.json`

**Example — adding a new currency:**
```ts
{ currency: "XXX", keywords: ["Central Bank Rate Decision", "CPI"] },
```

---

## Overnight Threshold

| Setting | Current Value | Location in Home.tsx |
|---------|--------------|----------------------|
| Early warning starts | 16:00 (4pm) | `currentHour >= 16` |
| Overnight cutoff | before 09:00 | `h < 9` |

To change: edit these two numeric values directly in the `Close Pos. Before` IIFE block.

---

## Debugging Checklist

If an event is **not appearing** in Close Pos. Before:

1. `dailyRecap.json` → correct `day`, `currency`, `time` (HH:MM 24h format)?
2. `isPropFirmEvent()` → does event name contain one of the keywords?
3. ADP guard → does event name contain "adp"? If yes, excluded by design.
4. Overnight logic → is `currentHour >= 16`? Is event on `tomorrowDay`? Is `eventHour < 9`?

---

## Reference

See `references/prop_firm_events_table.md` for the complete prop-firm mandatory close events table per currency (from official prop-firm rules).
