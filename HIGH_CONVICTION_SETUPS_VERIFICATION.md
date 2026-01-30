# High Conviction Setups Alignment Verification Process

## Overview
High Conviction Setups are trading opportunities based on **strict alignment** between Weekly Bias and Daily Bias for each currency. This document defines the verification process that MUST be followed during every Daily Recap Update.

## Alignment Rules (STRICT)

### Valid Alignments:
1. **Bullish Alignment**: Weekly Bias = "Bullish" AND Daily Bias = "Bullish"
2. **Bearish Alignment**: Weekly Bias = "Bearish" AND Daily Bias = "Bearish"

### Invalid Alignments (EXCLUDED):
- Weekly Bias = "Bullish" + Daily Bias = "Neutral" → **NO ALIGNMENT**
- Weekly Bias = "Bullish" + Daily Bias = "Mixed" → **NO ALIGNMENT**
- Weekly Bias = "Bearish" + Daily Bias = "Neutral" → **NO ALIGNMENT**
- Weekly Bias = "Bearish" + Daily Bias = "Mixed" → **NO ALIGNMENT**
- Weekly Bias = "Neutral" + Daily Bias = "Bullish" → **NO ALIGNMENT**
- Weekly Bias = "Neutral" + Daily Bias = "Bearish" → **NO ALIGNMENT**
- Weekly Bias = "Mixed" + Daily Bias = "Bullish" → **NO ALIGNMENT**
- Weekly Bias = "Mixed" + Daily Bias = "Bearish" → **NO ALIGNMENT**

## Verification Process (Daily Recap Update)

### Step 1: Read Current Biases
```
Weekly Bias Source: client/src/data/weeklyBias.json
Daily Bias Source: client/src/data/dailyRecap.json (updated during Daily Recap)
```

### Step 2: Check Alignment for Each Currency
For each of the 8 currencies (USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD):

1. Read `weeklyBias.json` → Get Weekly Bias for currency
2. Read `dailyRecap.json` → Get Daily Bias for currency
3. Compare:
   - If both = "Bullish" → Add to `bullishAligned` list
   - If both = "Bearish" → Add to `bearishAligned` list
   - Otherwise → Skip (no alignment)

### Step 3: Generate High Conviction Setups
- Pair each `bullishAligned` currency with each `bearishAligned` currency
- Format: `{bullishCurrency}/{bearishCurrency}` (e.g., "GBP/USD")
- Direction: "Long"
- Reason: "Strong Alignment: Weekly & Daily Bullish {bull} vs Bearish {bear}"

### Step 4: Handle No Alignment Scenario
- If `bullishAligned` list is empty OR `bearishAligned` list is empty:
  - Display message: "No strong alignment setups found currently."
  - Show 0 High Conviction Setups

## Example Verification (30 January 2026)

### Weekly Bias:
- USD: Bearish
- EUR: Neutral
- GBP: Bullish
- JPY: Mixed
- AUD: Bullish
- CAD: Bearish
- CHF: Neutral
- NZD: Bullish

### Daily Bias (30 Jan):
- USD: Mixed
- EUR: Neutral
- GBP: Neutral
- JPY: Bearish
- AUD: Neutral
- CAD: Bearish
- CHF: Bullish
- NZD: Neutral

### Alignment Check:
- USD: Weekly Bearish ≠ Daily Mixed → **NO ALIGNMENT** ❌
- EUR: Weekly Neutral ≠ Daily Neutral → **NO ALIGNMENT** ❌ (Neutral excluded)
- GBP: Weekly Bullish ≠ Daily Neutral → **NO ALIGNMENT** ❌
- JPY: Weekly Mixed ≠ Daily Bearish → **NO ALIGNMENT** ❌
- AUD: Weekly Bullish ≠ Daily Neutral → **NO ALIGNMENT** ❌
- CAD: Weekly Bearish = Daily Bearish → **ALIGNMENT** ✅
- CHF: Weekly Neutral ≠ Daily Bullish → **NO ALIGNMENT** ❌
- NZD: Weekly Bullish ≠ Daily Neutral → **NO ALIGNMENT** ❌

### Result:
- `bullishAligned`: [] (empty)
- `bearishAligned`: ["CAD"]
- **High Conviction Setups**: 0 (cannot pair, need at least 1 Bullish + 1 Bearish)

## Implementation Location

**File**: `client/src/pages/Home.tsx`
**Function**: `getHighConvictionSetups()`
**Lines**: 223-269

## Checklist for Daily Recap Update

When performing "Daily Recap Update", MUST verify:

- [ ] Read `weeklyBias.json` for all 8 currencies
- [ ] Read `dailyRecap.json` for all 8 currencies
- [ ] Check alignment for each currency (exact match: "Bullish"/"Bullish" or "Bearish"/"Bearish")
- [ ] Exclude any currency with "Neutral" or "Mixed" bias (Weekly OR Daily)
- [ ] Generate setups only if both `bullishAligned` AND `bearishAligned` lists are non-empty
- [ ] Display "No strong alignment setups found currently." if no valid setups exist
- [ ] Verify in browser: High Conviction Setups section shows correct count (0 or more)

## Notes

- **NO FALLBACK LOGIC**: If no alignment exists, show 0 setups. Do NOT use Weekly-only data as fallback.
- **Case Sensitivity**: All bias comparisons are lowercase ("bullish", "bearish", "neutral", "mixed")
- **Exact Match Required**: "Bullish" ≠ "Bullish Leaning" (must be exact string match after lowercase)
