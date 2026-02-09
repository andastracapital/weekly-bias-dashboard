# FX Market Pair Conventions

## Base Currency Priority Order

In conventional FX market notation, currency pairs follow a strict hierarchy to determine which currency is the **base** (first) and which is the **quote** (second).

### Priority Ranking (Highest to Lowest):

1. **EUR** - Euro (highest priority - almost always base)
2. **GBP** - British Pound
3. **AUD** - Australian Dollar
4. **NZD** - New Zealand Dollar  
5. **USD** - US Dollar
6. **CAD** - Canadian Dollar
7. **CHF** - Swiss Franc
8. **JPY** - Japanese Yen (lowest priority - almost always quote)

## Rules:

- The currency with **higher priority** (lower number) becomes the **base currency**
- The currency with **lower priority** (higher number) becomes the **quote currency**
- This ensures consistent pair notation across all FX platforms and analysis

## Examples:

### Correct Notation:
- **GBP/USD** ✅ (GBP priority 2, USD priority 5 → GBP is base)
- **EUR/GBP** ✅ (EUR priority 1, GBP priority 2 → EUR is base)
- **AUD/JPY** ✅ (AUD priority 3, JPY priority 8 → AUD is base)
- **GBP/AUD** ✅ (GBP priority 2, AUD priority 3 → GBP is base)
- **NZD/USD** ✅ (NZD priority 4, USD priority 5 → NZD is base)

### Incorrect Notation:
- **USD/GBP** ❌ (Should be GBP/USD)
- **GBP/EUR** ❌ (Should be EUR/GBP)
- **JPY/AUD** ❌ (Should be AUD/JPY)
- **AUD/GBP** ❌ (Should be GBP/AUD)
- **USD/NZD** ❌ (Should be NZD/USD)

## Implementation in High Conviction Setups:

When generating High Conviction Setups, the code automatically applies these conventions:

```typescript
const basePriority: { [key: string]: number } = {
  "EUR": 1,
  "GBP": 2,
  "AUD": 3,
  "NZD": 4,
  "USD": 5,
  "CAD": 6,
  "CHF": 7,
  "JPY": 8
};

const getConventionalPair = (curr1: string, curr2: string) => {
  const priority1 = basePriority[curr1] || 999;
  const priority2 = basePriority[curr2] || 999;
  
  // Higher priority (lower number) becomes base currency
  if (priority1 < priority2) {
    return { pair: `${curr1}/${curr2}`, direction: "LONG" };
  } else {
    return { pair: `${curr2}/${curr1}`, direction: "SHORT" };
  }
};
```

## Direction Adjustment:

When the conventional pair notation reverses the bullish/bearish currencies:

- **Original Intent:** Bullish AUD vs Bearish GBP
- **Conventional Pair:** GBP/AUD (GBP has higher priority)
- **Direction:** SHORT (because we're bearish on the base currency GBP)

- **Original Intent:** Bullish AUD vs Bearish JPY
- **Conventional Pair:** AUD/JPY (AUD has higher priority)
- **Direction:** LONG (because we're bullish on the base currency AUD)

## Why This Matters:

1. **Consistency:** All traders and platforms use the same notation
2. **Clarity:** Eliminates confusion about which currency is being bought/sold
3. **Professionalism:** Shows understanding of FX market conventions
4. **Automation:** Enables correct order execution on trading platforms

---

**CRITICAL:** Always use this convention when displaying currency pairs in High Conviction Setups, Intraday Trades, or any FX analysis. Never invent custom pair notations.
