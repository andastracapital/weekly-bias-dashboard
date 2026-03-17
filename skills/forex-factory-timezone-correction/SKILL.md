---
name: forex-factory-timezone-correction
description: Correct Forex Factory Calendar times to GMT+1 (Frankfurt Time) for Red Folder News integration. Use when scraping Forex Factory Calendar for high-impact economic events that need to be displayed in Frankfurt timezone, especially for Daily Recap Update workflows.
---

# Forex Factory Timezone Correction

This skill provides a complete workflow for extracting Red Folder News (high-impact economic events) from Forex Factory Calendar and converting times to **GMT+1 (Frankfurt Time)**.

## When to Use This Skill

- **Daily Recap Update workflows** requiring Red Folder News in GMT+1
- **Forex Factory Calendar integration** where times must match Frankfurt timezone
- **Economic calendar scraping** with timezone conversion requirements
- **Fallback scenarios** when Forex Factory timezone settings are blocked (e.g., Cloudflare)

## Core Workflow

### Step 1: Attempt Primary Method (Forex Factory Settings)

Navigate to Forex Factory Calendar and change timezone settings:

1. Open https://www.forexfactory.com/calendar?week=this
2. Click timezone dropdown (usually shows current timezone, e.g., "GMT+7 Bangkok")
3. Select **"GMT+1 Berlin"** or **"GMT+1 Frankfurt"**
4. Click "Save Settings" or equivalent button
5. Verify times updated in calendar display

**Expected Result:** All times now display in GMT+1 (Frankfurt Time).

**If Cloudflare blocks the settings save** → Proceed to Step 2 (Fallback Method).

### Step 2: Fallback Method (Manual Conversion)

When Forex Factory settings cannot be changed (Cloudflare security, login issues), use manual conversion:

#### 2.1 Identify Current Timezone

Check the timezone indicator on Forex Factory Calendar (e.g., "GMT+7 Bangkok", "GMT-5 New York").

#### 2.2 Extract Event Times

Scrape Red Folder News events with their times in the current timezone:

**Filter Criteria:**
- **Impact:** High only (red folder icon) - exclude Medium/Low
- **Time Period:** Current week (Monday-Sunday)
- **Required Fields:** Day, Time, Currency, Event Name

Example raw data (GMT+7 Bangkok):
```
WED 06:00 - JPY BOJ Core CPI y/y
WED 08:00 - EUR German Final GDP q/q
WED 11:00 - EUR Final Core CPI y/y
WED 16:30 - USD Crude Oil Inventories
```

#### 2.3 Convert to GMT+1 (Frankfurt Time)

**Option A: Use Conversion Script**

Run the bundled Python script for each time:

```bash
python /home/ubuntu/skills/forex-factory-timezone-correction/scripts/convert_timezone.py "06:00 GMT+7"
# Output: Frankfurt Time (GMT+1): 00:00

python /home/ubuntu/skills/forex-factory-timezone-correction/scripts/convert_timezone.py "18:00 Bangkok"
# Output: Frankfurt Time (GMT+1): 12:00
```

**Option B: Manual Calculation**

Use the conversion formula from `references/timezone_mapping.md`:

```
Frankfurt Time (GMT+1) = Source Time + (1 - Source_Offset)
```

Common conversions:
- **GMT+7 → GMT+1:** Subtract 6 hours
- **GMT-5 → GMT+1:** Add 6 hours
- **GMT+0 → GMT+1:** Add 1 hour

**Example Conversion (GMT+7 → GMT+1):**
```
Source: WED 06:00 GMT+7
Calculation: 06:00 - 6 hours = 00:00
Result: WED 00:00 GMT+1
```

**Handle Day Rollover:**
- If result < 00:00 → subtract 1 day (e.g., MON 02:00 → SUN 20:00)
- If result ≥ 24:00 → add 1 day (e.g., TUE 20:00 → WED 02:00)

#### 2.4 Update Data File

Write converted times to `dailyRecap.json` (or equivalent):

```json
{
  "redFolderNews": [
    {
      "day": "WED",
      "time": "00:00",
      "currency": "JPY",
      "event": "BOJ Core CPI y/y",
      "impact": "High"
    },
    {
      "day": "WED",
      "time": "02:00",
      "currency": "EUR",
      "event": "German Final GDP q/q",
      "impact": "High"
    }
  ]
}
```

### Step 3: Validation

After conversion, verify correctness:

#### 3.1 Sanity Check Event Times

Ensure major events align with typical market hours:

- **EUR events:** 02:00-11:00 GMT+1 (European session)
- **USD events:** 14:30-16:30 GMT+1 (US session overlap)
- **JPY events:** 00:00-06:00 GMT+1 (Asian session)

**Red Flag Examples:**
- EUR GDP at 20:00 GMT+1 → likely wrong (should be morning)
- USD NFP at 02:00 GMT+1 → likely wrong (should be 14:30)

#### 3.2 Test Dashboard Display

If integrating with a dashboard (e.g., TK Trading Fundamentals):

1. **Countdown Timers:** Future events show "Xh Ym" countdown
2. **PASSED Status:** Past events show "PASSED" correctly
3. **Today-Only Filter:** Only current day's events displayed
4. **Time Format:** All times in 24-hour format (e.g., "14:30" not "2:30 PM")

#### 3.3 Cross-Reference with Other Sources

Verify critical events (e.g., FOMC, NFP, ECB) against:
- **Investing.com Economic Calendar**
- **Bloomberg Economic Calendar**
- **Official central bank announcements**

## Bundled Resources

### Scripts

- **`scripts/convert_timezone.py`** - Automated timezone conversion
  - Input: Time in any supported timezone (e.g., "18:00 GMT+7", "06:00 Bangkok")
  - Output: Time in GMT+1 (Frankfurt Time)
  - Supports: GMT+7 (Bangkok), GMT+8 (Singapore), GMT+9 (Tokyo), GMT-5 (NYC), GMT-8 (LA), GMT+0 (London)

### References

- **`references/timezone_mapping.md`** - Comprehensive timezone conversion reference
  - Quick reference table for all common timezones
  - Real-world examples from Daily Recap Update workflows
  - Day rollover handling rules
  - Daylight Saving Time (DST) considerations
  - Validation checklist

## Common Pitfalls

### 1. Cloudflare Blocking Settings Save

**Problem:** Forex Factory blocks timezone settings change with Cloudflare security check.

**Solution:** Use Fallback Method (Step 2) with manual conversion or Python script.

### 2. Incorrect Day Rollover

**Problem:** Converting 02:00 GMT+7 to GMT+1 results in negative hours.

**Solution:** Subtract 1 day when result < 00:00.

Example:
```
MON 02:00 GMT+7 → MON 02:00 - 6 hours = MON -04:00
Correct: SUN 20:00 GMT+1
```

### 3. Mixing Timezones in Same Dataset

**Problem:** Some events scraped in GMT+7, others in GMT-5 (if timezone changed mid-scrape).

**Solution:** Always verify timezone indicator before scraping each batch of events. Re-scrape if timezone changed unexpectedly.

### 4. Forgetting DST Adjustments

**Problem:** Converting times during Daylight Saving Time transitions without adjusting offset.

**Solution:** Check if source timezone is currently in DST:
- **Frankfurt:** CET (GMT+1) in winter, CEST (GMT+2) in summer
- **New York:** EST (GMT-5) in winter, EDT (GMT-4) in summer

Adjust conversion formula accordingly.

## Integration with Daily Recap Update Workflow

This skill is designed to integrate seamlessly with the **Daily Recap Update** workflow:

1. **Scrape PMT Market Wraps** (day-specific: Monday = Analyst Reports, Tuesday-Friday = Market Wraps)
2. **Scrape PMT Headlines** (last 24 hours)
3. **Scrape Forex Factory Calendar** → **Use this skill for timezone correction**
4. **Rebuild dailyRecap.json** with corrected GMT+1 times
5. **Verify High Conviction Setups alignment**
6. **Test dashboard display**

## Quick Reference: Conversion Examples

| Source Time | Source TZ | Frankfurt Time (GMT+1) | Calculation |
|-------------|-----------|------------------------|-------------|
| 18:00 | GMT+7 | 12:00 | 18 - 6 = 12 |
| 06:00 | GMT+7 | 00:00 | 06 - 6 = 0 |
| 00:00 | GMT-5 | 06:00 | 00 + 6 = 6 |
| 20:00 | GMT-5 | 02:00 (next day) | 20 + 6 = 26 → 02:00 |
| 12:00 | GMT+0 | 13:00 | 12 + 1 = 13 |
| 23:00 | GMT+9 | 15:00 | 23 - 8 = 15 |

## Troubleshooting

### Times Still Look Wrong After Conversion

1. **Check source timezone** - Verify Forex Factory timezone indicator
2. **Verify conversion formula** - Use `convert_timezone.py` script to double-check
3. **Cross-reference critical events** - Compare with Investing.com or Bloomberg
4. **Check DST status** - Ensure correct offset for current date

### Dashboard Countdown Timers Not Working

1. **Verify time format** - Must be 24-hour format (e.g., "14:30" not "2:30 PM")
2. **Check day field** - Must match current day for countdown to activate
3. **Ensure GMT+1 timezone** - Dashboard logic expects Frankfurt Time

### Events Missing or Duplicated

1. **Check Red Folder filter** - Only High Impact events should be included
2. **Verify week range** - Should include Monday-Sunday of current week
3. **Check for duplicate scraping** - Ensure events scraped only once per update
