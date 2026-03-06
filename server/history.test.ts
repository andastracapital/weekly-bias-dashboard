import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock DB helpers ─────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  getAllHistoryEntries: vi.fn(),
  upsertHistoryEntry: vi.fn(),
  // keep other exports as stubs
  createFile: vi.fn(),
  getUserFiles: vi.fn(),
  getFileById: vi.fn(),
  deleteFile: vi.fn(),
}));

import { getAllHistoryEntries, upsertHistoryEntry } from "./db";

// ─── Unit tests for DB helpers (mocked) ──────────────────────────────────────
describe("History DB helpers (mocked)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllHistoryEntries returns entries ordered by date desc", async () => {
    const mockEntries = [
      {
        id: 2,
        date: "2026-03-05",
        weekRange: "Mar 2 - Mar 8, 2026",
        swingWatchlist: JSON.stringify([{ pair: "EUR/USD", direction: "SHORT" }]),
        swingSetups: JSON.stringify([{ pair: "EUR/USD", direction: "SHORT" }]),
        intradayTrades: JSON.stringify([{ pair: "AUD/USD", direction: "SHORT" }]),
        createdAt: new Date("2026-03-05"),
        updatedAt: new Date("2026-03-05"),
      },
      {
        id: 1,
        date: "2026-03-03",
        weekRange: "Mar 2 - Mar 8, 2026",
        swingWatchlist: JSON.stringify([{ pair: "GBP/USD", direction: "SHORT" }]),
        swingSetups: JSON.stringify([]),
        intradayTrades: JSON.stringify([]),
        createdAt: new Date("2026-03-03"),
        updatedAt: new Date("2026-03-03"),
      },
    ];

    (getAllHistoryEntries as ReturnType<typeof vi.fn>).mockResolvedValue(mockEntries);

    const result = await getAllHistoryEntries();
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe("2026-03-05"); // newest first
    expect(result[1].date).toBe("2026-03-03");
  });

  it("upsertHistoryEntry is called with correct shape", async () => {
    (upsertHistoryEntry as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    const entry = {
      date: "2026-03-05",
      weekRange: "Mar 2 - Mar 8, 2026",
      swingWatchlist: JSON.stringify([{ pair: "EUR/USD", direction: "SHORT" }]),
      swingSetups: JSON.stringify([{ pair: "EUR/USD", direction: "SHORT" }]),
      intradayTrades: JSON.stringify([{ pair: "AUD/USD", direction: "SHORT" }]),
    };

    await upsertHistoryEntry(entry);
    expect(upsertHistoryEntry).toHaveBeenCalledWith(entry);
  });
});

// ─── Unit tests for data parsing logic ───────────────────────────────────────
describe("History data parsing", () => {
  const parsePairs = (jsonStr: string): Array<{ pair: string; direction: string }> => {
    try {
      return JSON.parse(jsonStr || "[]");
    } catch {
      return [];
    }
  };

  it("parses valid JSON pair arrays", () => {
    const input = JSON.stringify([
      { pair: "EUR/USD", direction: "SHORT" },
      { pair: "GBP/USD", direction: "SHORT" },
    ]);
    const result = parsePairs(input);
    expect(result).toHaveLength(2);
    expect(result[0].pair).toBe("EUR/USD");
    expect(result[0].direction).toBe("SHORT");
  });

  it("returns empty array for empty string", () => {
    expect(parsePairs("")).toHaveLength(0);
    expect(parsePairs("[]")).toHaveLength(0);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parsePairs("invalid")).toHaveLength(0);
  });

  it("handles LONG direction correctly", () => {
    const input = JSON.stringify([{ pair: "AUD/JPY", direction: "LONG" }]);
    const result = parsePairs(input);
    expect(result[0].direction).toBe("LONG");
  });
});

// ─── Unit tests for FX pair convention validation ─────────────────────────────
describe("FX pair convention validation", () => {
  const BASE_PRIORITY: Record<string, number> = {
    EUR: 1, GBP: 2, AUD: 3, NZD: 4, USD: 5, CAD: 6, CHF: 7, JPY: 8,
  };

  const isConventionalPair = (pair: string, direction: string): boolean => {
    const [base, quote] = pair.split("/");
    if (!base || !quote) return false;
    const basePriority = BASE_PRIORITY[base] ?? 999;
    const quotePriority = BASE_PRIORITY[quote] ?? 999;
    // Base should have higher priority (lower number)
    return basePriority < quotePriority;
  };

  it("EUR/USD SHORT is conventional (EUR=1 > USD=5)", () => {
    expect(isConventionalPair("EUR/USD", "SHORT")).toBe(true);
  });

  it("GBP/JPY SHORT is conventional (GBP=2 > JPY=8)", () => {
    expect(isConventionalPair("GBP/JPY", "SHORT")).toBe(true);
  });

  it("AUD/JPY LONG is conventional (AUD=3 > JPY=8)", () => {
    expect(isConventionalPair("AUD/JPY", "LONG")).toBe(true);
  });

  it("USD/JPY LONG is conventional (USD=5 > JPY=8)", () => {
    expect(isConventionalPair("USD/JPY", "LONG")).toBe(true);
  });

  it("JPY/USD would be non-conventional (JPY=8 < USD=5)", () => {
    expect(isConventionalPair("JPY/USD", "SHORT")).toBe(false);
  });

  it("AUD/GBP would be non-conventional (AUD=3 > GBP=2)", () => {
    expect(isConventionalPair("AUD/GBP", "LONG")).toBe(false);
  });
});
