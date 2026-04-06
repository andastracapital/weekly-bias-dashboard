import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { History as HistoryIcon, TrendingUp, TrendingDown, Zap, Activity, RefreshCw, Filter, X } from "lucide-react";

type TradePair = { pair: string; direction: string };

type FilterCategory = "all" | "weeklyBias" | "aligned" | "intraday";

const CATEGORY_LABELS: Record<FilterCategory, string> = {
  all: "All Columns",
  weeklyBias: "Weekly Bias",
  aligned: "Weekly + Daily Aligned",
  intraday: "Intraday Trades",
};

const DirectionBadge = ({ direction, dim }: { direction: string; dim?: boolean }) => {
  const isLong = direction.toUpperCase() === "LONG";
  if (dim) {
    return (
      <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 border font-mono uppercase tracking-wider ${
        isLong
          ? "border-orange-500/20 text-orange-400/50 bg-orange-500/5"
          : "border-red-500/20 text-red-400/50 bg-red-500/5"
      }`}>
        {isLong ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
        {direction.toUpperCase()}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 border font-mono uppercase tracking-wider ${
      isLong
        ? "border-orange-500/50 text-orange-400 bg-orange-500/10"
        : "border-red-500/50 text-red-400 bg-red-500/10"
    }`}>
      {isLong ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
      {direction.toUpperCase()}
    </span>
  );
};

const PairList = ({
  pairs,
  emptyText,
  dim,
  highlight,
  highlightPair,
}: {
  pairs: TradePair[];
  emptyText: string;
  dim?: boolean;
  highlight?: boolean;
  highlightPair?: string;
}) => {
  if (!pairs || pairs.length === 0) {
    return <span className={`text-[10px] font-mono italic ${dim ? "text-gray-700" : "text-gray-600"}`}>{emptyText}</span>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {pairs.map((p, i) => {
        const isMatch = highlightPair && p.pair === highlightPair;
        return (
          <div
            key={i}
            className={`flex items-center gap-1 transition-opacity ${
              highlightPair && !isMatch ? "opacity-20" : "opacity-100"
            }`}
          >
            <span className={`font-mono font-bold ${
              isMatch
                ? "text-sm text-orange-300"
                : highlight
                ? "text-sm text-white"
                : dim
                ? "text-[10px] text-gray-500"
                : "text-[11px] text-gray-400"
            }`}>
              {p.pair}
            </span>
            <DirectionBadge direction={p.direction} dim={dim && !isMatch} />
          </div>
        );
      })}
    </div>
  );
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const hasPairInColumn = (pairs: TradePair[], pair: string) =>
  pairs.some((p) => p.pair === pair);

export default function HistoryPage() {
  const { data: entries, isLoading, error } = trpc.history.list.useQuery();

  const [selectedPair, setSelectedPair] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");

  // Build sorted list of all unique pairs across all entries and all columns
  const allPairs = useMemo(() => {
    if (!entries) return [];
    const pairSet = new Set<string>();
    entries.forEach((e) => {
      e.swingWatchlist?.forEach((p) => pairSet.add(p.pair));
      e.swingSetups?.forEach((p) => pairSet.add(p.pair));
      e.intradayTrades?.forEach((p) => pairSet.add(p.pair));
    });
    return Array.from(pairSet).sort();
  }, [entries]);

  // Filter entries based on selected pair + category
  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    if (selectedPair === "all") return entries;

    return entries.filter((e) => {
      if (filterCategory === "all") {
        return (
          hasPairInColumn(e.swingWatchlist, selectedPair) ||
          hasPairInColumn(e.swingSetups, selectedPair) ||
          hasPairInColumn(e.intradayTrades, selectedPair)
        );
      }
      if (filterCategory === "weeklyBias") return hasPairInColumn(e.swingWatchlist, selectedPair);
      if (filterCategory === "aligned") return hasPairInColumn(e.swingSetups, selectedPair);
      if (filterCategory === "intraday") return hasPairInColumn(e.intradayTrades, selectedPair);
      return true;
    });
  }, [entries, selectedPair, filterCategory]);

  const isFiltered = selectedPair !== "all";

  const clearFilter = () => {
    setSelectedPair("all");
    setFilterCategory("all");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-5 h-5 text-orange-500" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">HISTORY</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
              Daily Recap Archive — Weekly Bias · <span className="text-orange-500/70">Weekly Bias + Daily Narrative aligned</span> · Intraday Trades
            </p>
          </div>
          {entries && (
            <div className="ml-auto text-[10px] text-gray-600 font-mono">
              {isFiltered ? `${filteredEntries.length} / ${entries.length}` : `${entries.length}`} entries
            </div>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      {entries && entries.length > 0 && (
        <div className="border-b border-gray-800/60 px-6 py-3 bg-[#0d0d0d]">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-widest">
              <Filter className="w-3 h-3" />
              Filter by pair
            </div>

            {/* Pair Dropdown */}
            <div className="relative">
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="appearance-none bg-[#1a1a1a] border border-gray-700 text-white text-xs font-mono px-3 py-1.5 pr-7 focus:outline-none focus:border-orange-500/50 cursor-pointer hover:border-gray-600 transition-colors"
              >
                <option value="all">All Pairs</option>
                {allPairs.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Category Filter — only visible when a pair is selected */}
            {isFiltered && (
              <>
                <span className="text-gray-700 text-xs">in</span>
                <div className="flex items-center gap-1">
                  {(["all", "weeklyBias", "aligned", "intraday"] as FilterCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`text-[10px] font-mono px-2.5 py-1 border uppercase tracking-wider transition-colors ${
                        filterCategory === cat
                          ? cat === "aligned"
                            ? "border-orange-500/60 text-orange-400 bg-orange-500/10"
                            : "border-gray-500 text-white bg-gray-800"
                          : "border-gray-800 text-gray-600 hover:border-gray-700 hover:text-gray-400"
                      }`}
                    >
                      {cat === "all" ? "Any Column" : cat === "weeklyBias" ? "Weekly Bias" : cat === "aligned" ? "W+D Aligned" : "Intraday"}
                    </button>
                  ))}
                </div>

                {/* Clear filter */}
                <button
                  onClick={clearFilter}
                  className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-gray-400 transition-colors ml-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              </>
            )}

            {/* Active filter summary */}
            {isFiltered && (
              <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono">
                <span className="text-gray-600">Showing</span>
                <span className="text-orange-400 font-bold">{selectedPair}</span>
                {filterCategory !== "all" && (
                  <>
                    <span className="text-gray-600">in</span>
                    <span className="text-gray-400">{CATEGORY_LABELS[filterCategory]}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6">
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading history...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500 text-sm">
            Failed to load history data.
          </div>
        )}

        {entries && entries.length === 0 && (
          <div className="text-center py-20 border border-dashed border-gray-800">
            <HistoryIcon className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">No history entries yet.</p>
            <p className="text-gray-700 text-xs mt-1">
              Entries are added automatically with each Daily Recap Update.
            </p>
          </div>
        )}

        {entries && filteredEntries.length === 0 && isFiltered && (
          <div className="text-center py-20 border border-dashed border-gray-800">
            <Filter className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-mono">
              No entries found for <span className="text-orange-400 font-bold">{selectedPair}</span>
              {filterCategory !== "all" && <> in <span className="text-gray-300">{CATEGORY_LABELS[filterCategory]}</span></>}.
            </p>
            <button
              onClick={clearFilter}
              className="mt-3 text-[10px] text-gray-600 hover:text-gray-400 underline transition-colors"
            >
              Clear filter
            </button>
          </div>
        )}

        {entries && filteredEntries.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  {/* Date — secondary */}
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-widest font-mono font-normal w-36">
                    Date
                  </th>
                  {/* Week — secondary */}
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-widest font-mono font-normal w-40">
                    Week
                  </th>
                  {/* Weekly Bias — secondary */}
                  <th className={`text-left py-3 px-4 text-xs uppercase tracking-widest font-mono font-normal transition-colors ${
                    filterCategory === "weeklyBias" ? "text-white" : "text-gray-500"
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <Activity className={`w-3 h-3 ${filterCategory === "weeklyBias" ? "text-gray-400" : "text-gray-600"}`} />
                      Weekly Bias
                    </div>
                  </th>
                  {/* PRIMARY COLUMN — highlighted */}
                  <th className={`text-left py-3 px-4 uppercase tracking-widest font-mono font-bold border-l border-r border-orange-500/20 bg-orange-500/[0.04] transition-colors ${
                    filterCategory === "aligned" ? "text-base text-orange-300" : "text-sm text-orange-400"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      Weekly Bias + Daily Narrative aligned
                    </div>
                  </th>
                  {/* Intraday Trades — secondary */}
                  <th className={`text-left py-3 px-4 text-xs uppercase tracking-widest font-mono font-normal transition-colors ${
                    filterCategory === "intraday" ? "text-white" : "text-gray-500"
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className={`w-3 h-3 ${filterCategory === "intraday" ? "text-gray-400" : "text-gray-600"}`} />
                      Intraday Trades
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, i) => {
                  const isFirst = i === 0 && !isFiltered;
                  return (
                    <tr
                      key={entry.id}
                      className={`border-b border-gray-800/60 hover:bg-white/[0.02] transition-colors ${
                        isFirst ? "bg-orange-500/[0.03]" : ""
                      }`}
                    >
                      {/* Date */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-0.5">
                          {isFirst && (
                            <span className="text-[8px] font-bold text-orange-500 uppercase tracking-wider mb-0.5">
                              Latest
                            </span>
                          )}
                          <span className="text-xs font-bold text-white whitespace-nowrap">
                            {formatDate(entry.date)}
                          </span>
                          <span className="text-[9px] text-gray-600">{entry.date}</span>
                        </div>
                      </td>

                      {/* Week Range */}
                      <td className="py-4 px-4 align-top">
                        <span className="text-[10px] text-gray-600 whitespace-nowrap">
                          {entry.weekRange || "—"}
                        </span>
                      </td>

                      {/* Weekly Bias (Swing Watchlist) — dimmed */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        <PairList
                          pairs={entry.swingWatchlist}
                          emptyText="No watchlist"
                          dim={filterCategory !== "weeklyBias"}
                          highlightPair={isFiltered && (filterCategory === "weeklyBias" || filterCategory === "all") ? selectedPair : undefined}
                        />
                      </td>

                      {/* PRIMARY: Weekly Bias + Daily Narrative aligned — highlighted */}
                      <td className="py-4 px-4 align-top max-w-xs border-l border-r border-orange-500/10 bg-orange-500/[0.03]">
                        <PairList
                          pairs={entry.swingSetups}
                          emptyText="No setups"
                          highlight
                          highlightPair={isFiltered && (filterCategory === "aligned" || filterCategory === "all") ? selectedPair : undefined}
                        />
                      </td>

                      {/* Intraday Trades — dimmed */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        <PairList
                          pairs={entry.intradayTrades}
                          emptyText="No trades"
                          dim={filterCategory !== "intraday"}
                          highlightPair={isFiltered && (filterCategory === "intraday" || filterCategory === "all") ? selectedPair : undefined}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
