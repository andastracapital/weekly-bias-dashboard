# Forex Factory Timezone Mapping to GMT+1 (Frankfurt Time)

## Common Forex Factory Timezones

Forex Factory Calendar allows users to select different timezone displays. This reference provides conversion rules from common timezones to **GMT+1 (Frankfurt Time)**.

## Conversion Formula

```
Frankfurt Time (GMT+1) = Source Time + (1 - Source_Offset)
```

Where `Source_Offset` is the timezone offset from UTC.

## Quick Reference Table

| Source Timezone | Offset from UTC | Conversion to GMT+1 | Example: 18:00 → |
|----------------|-----------------|---------------------|------------------|
| **GMT+7** (Bangkok) | +7 | Subtract 6 hours | 12:00 |
| **GMT+8** (Singapore) | +8 | Subtract 7 hours | 11:00 |
| **GMT+9** (Tokyo) | +9 | Subtract 8 hours | 10:00 |
| **GMT+0** (London) | 0 | Add 1 hour | 19:00 |
| **GMT-5** (NYC EST) | -5 | Add 6 hours | 00:00 (next day) |
| **GMT-4** (NYC EDT) | -4 | Add 5 hours | 23:00 |
| **GMT-8** (LA PST) | -8 | Add 9 hours | 03:00 (next day) |
| **GMT+1** (Frankfurt) | +1 | No change | 18:00 |

## Real-World Examples from Daily Recap Update

### Example 1: GMT+7 (Bangkok) → GMT+1 (Frankfurt)

**Source Data (Forex Factory in GMT+7):**
- WED 06:00 - JPY BOJ Core CPI y/y
- WED 08:00 - EUR German Final GDP q/q
- WED 11:00 - EUR Final Core CPI y/y
- WED 16:30 - USD Crude Oil Inventories

**Conversion (Subtract 6 hours):**
- WED 00:00 - JPY BOJ Core CPI y/y
- WED 02:00 - EUR German Final GDP q/q
- WED 05:00 - EUR Final Core CPI y/y
- WED 10:30 - USD Crude Oil Inventories

### Example 2: GMT-5 (NYC EST) → GMT+1 (Frankfurt)

**Source Data (Forex Factory in GMT-5):**
- TUE 20:00 - USD FOMC Minutes
- WED 08:30 - USD GDP Advance q/q

**Conversion (Add 6 hours):**
- WED 02:00 - USD FOMC Minutes
- WED 14:30 - USD GDP Advance q/q

## Day Rollover Handling

When converting times, be aware of day changes:

- **Subtracting hours** (e.g., GMT+7 → GMT+1):
  - If result < 00:00, subtract 1 day
  - Example: MON 02:00 GMT+7 → SUN 20:00 GMT+1

- **Adding hours** (e.g., GMT-5 → GMT+1):
  - If result ≥ 24:00, add 1 day
  - Example: TUE 20:00 GMT-5 → WED 02:00 GMT+1

## Daylight Saving Time (DST) Considerations

**Important:** Forex Factory timezone settings may not automatically adjust for DST. Always verify:

- **Frankfurt (CET/CEST):**
  - Winter (CET): GMT+1
  - Summer (CEST): GMT+2

- **New York (EST/EDT):**
  - Winter (EST): GMT-5
  - Summer (EDT): GMT-4

- **London (GMT/BST):**
  - Winter (GMT): GMT+0
  - Summer (BST): GMT+1

When in doubt, check current UTC offset for the source timezone and apply the conversion formula.

## Validation Checklist

After converting times, verify:

1. ✅ **Major events align with market hours:**
   - EUR events: 02:00-11:00 GMT+1 (European session)
   - USD events: 14:30-16:30 GMT+1 (US session overlap)
   - JPY events: 00:00-06:00 GMT+1 (Asian session)

2. ✅ **Red Folder News filter applied:**
   - Only High Impact events (red folder)
   - Exclude Medium/Low impact

3. ✅ **Dashboard countdown timers work:**
   - Events in the future show "Xh Ym" countdown
   - Past events show "PASSED"

4. ✅ **Today-only filter active:**
   - Only events for current day displayed
   - Past/future days filtered out
