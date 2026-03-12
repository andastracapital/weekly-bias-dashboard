import { trpc } from "@/lib/trpc";
import { History as HistoryIcon, TrendingUp, TrendingDown, Zap, Activity, RefreshCw } from "lucide-react";

type TradePair = { pair: string; direction: string };

const DirectionBadge = ({ direction }: { direction: string }) => {
  const isLong = direction.toUpperCase() === "LONG";
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 border font-mono uppercase tracking-wider ${
        isLong
          ? "border-orange-500/50 text-orange-400 bg-orange-500/10"
          : "border-red-500/50 text-red-400 bg-red-500/10"
      }`}
    >
      {isLong ? (
        <TrendingUp className="w-2.5 h-2.5" />
      ) : (
        <TrendingDown className="w-2.5 h-2.5" />
      )}
      {direction.toUpperCase()}
    </span>
  );
};

const PairList = ({ pairs, emptyText }: { pairs: TradePair[]; emptyText: string }) => {
  if (!pairs || pairs.length === 0) {
    return <span className="text-[10px] text-gray-600 font-mono italic">{emptyText}</span>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {pairs.map((p, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="text-[11px] font-mono font-bold text-gray-200">{p.pair}</span>
          <DirectionBadge direction={p.direction} />
        </div>
      ))}
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

export default function HistoryPage() {
  const { data: entries, isLoading, error } = trpc.history.list.useQuery();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-5 h-5 text-orange-500" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">HISTORY</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
              Daily Recap Archive — Weekly Bias · Weekly Bias + Daily Narrative aligned · Intraday Trades
            </p>
          </div>
          {entries && (
            <div className="ml-auto text-[10px] text-gray-600 font-mono">
              {entries.length} entries
            </div>
          )}
        </div>
      </div>

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

        {entries && entries.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-sm text-white uppercase tracking-widest font-mono font-semibold w-36">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-white uppercase tracking-widest font-mono font-semibold w-40">
                    Week
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-white uppercase tracking-widest font-mono font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-orange-500" />
                      Weekly Bias
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-white uppercase tracking-widest font-mono font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-orange-500" />
                      Weekly Bias + Daily Narrative aligned
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-white uppercase tracking-widest font-mono font-semibold">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                      Intraday Trades
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-gray-800/60 hover:bg-white/[0.02] transition-colors ${
                      i === 0 ? "bg-orange-500/[0.03]" : ""
                    }`}
                  >
                    {/* Date */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col gap-0.5">
                        {i === 0 && (
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
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {entry.weekRange || "—"}
                      </span>
                    </td>

                    {/* Swing Watchlist */}
                    <td className="py-4 px-4 align-top max-w-xs">
                      <PairList
                        pairs={entry.swingWatchlist}
                        emptyText="No watchlist"
                      />
                    </td>

                    {/* Swing Setups */}
                    <td className="py-4 px-4 align-top max-w-xs">
                      <PairList
                        pairs={entry.swingSetups}
                        emptyText="No setups"
                      />
                    </td>

                    {/* Intraday Trades */}
                    <td className="py-4 px-4 align-top max-w-xs">
                      <PairList
                        pairs={entry.intradayTrades}
                        emptyText="No trades"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
