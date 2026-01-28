import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  Calendar, 
  RefreshCw, 
  ArrowRight,
  Link2,
  Unlink,
  Activity,
  Globe,
  Zap,
  Terminal,
  Camera,
  Check,
  X,
  Download
} from "lucide-react";
import weeklyData from "../data/weeklyBias.json";
import dailyData from "../data/dailyRecap.json";

// Bloomberg / PMT Style Components

const BiasCard = ({ currency, weeklyBias }: { currency: any, weeklyBias?: string }) => {
  const isBullish = currency.bias.includes("Bullish");
  const isBearish = currency.bias.includes("Bearish");
  const isNeutral = currency.bias.includes("Neutral") || currency.bias.includes("Mixed");

  // Calculate Alignment dynamically if weeklyBias is provided
  let alignment = currency.alignment; // Fallback to existing if present
  
  if (weeklyBias && currency.bias) {
    const w = weeklyBias.toLowerCase();
    const d = currency.bias.toLowerCase();
    
    if (w === d && !w.includes("neutral") && !w.includes("mixed")) {
      alignment = "Perfect";
    } else if ((w.includes("bullish") && d.includes("bullish")) || (w.includes("bearish") && d.includes("bearish"))) {
      alignment = "Strong";
    } else if (!w.includes(d) && !d.includes(w) && !w.includes("neutral") && !d.includes("neutral")) {
      alignment = "Mismatch";
    }
  }

  // Bloomberg Colors: Orange (Bullish), Red (Bearish), Grey (Neutral)
  const borderColor = isBullish ? "border-orange-500" : isBearish ? "border-red-600" : "border-gray-600";
  const textColor = isBullish ? "text-orange-500" : isBearish ? "text-red-500" : "text-gray-400";
  const bgColor = isBullish ? "bg-orange-500/10" : isBearish ? "bg-red-900/10" : "bg-gray-800/20";
  const glowClass = isBullish ? "shadow-[0_0_15px_rgba(249,115,22,0.15)]" : isBearish ? "shadow-[0_0_15px_rgba(220,38,38,0.15)]" : "";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative border ${borderColor} bg-[#121212] p-4 h-full flex flex-col group overflow-hidden ${glowClass}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{currency.code}</h3>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">{currency.name}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`px-2 py-1 border ${borderColor} ${textColor} text-[9px] font-bold uppercase tracking-wider bg-black`}>
            {currency.bias}
          </div>
          {currency.tone && (
            <div className="text-[9px] font-mono text-gray-400 flex items-center gap-1">
              <Activity className="w-2.5 h-2.5" /> {currency.tone}
            </div>
          )}

        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 relative z-10 border-b border-gray-800 pb-3">
        {isBullish && <TrendingUp className="w-4 h-4 text-orange-500" />}
        {isBearish && <TrendingDown className="w-4 h-4 text-red-500" />}
        {isNeutral && <Minus className="w-4 h-4 text-gray-500" />}
        <span className={`text-base font-bold font-mono ${textColor}`}>{currency.bias.toUpperCase()}</span>
        {alignment && alignment !== "Mismatch" && (
          <div className={`ml-auto flex items-center gap-1 px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wider ${
            alignment === "Perfect" || alignment === "Strong" 
              ? "border-orange-500/50 text-orange-400 bg-orange-500/10" 
              : "border-gray-700 text-gray-500"
          }`}>
            {alignment === "Perfect" || alignment === "Strong" ? (
              <Link2 className="w-3 h-3" />
            ) : (
              <Unlink className="w-3 h-3" />
            )}
            {alignment} Match
          </div>
        )}
      </div>

      {currency.summary && (
        <p className="text-xs text-gray-300 mb-4 font-mono leading-relaxed flex-grow relative z-10">
          {currency.summary}
        </p>
      )}

      {currency.headlines && (
        <div className="mb-4 flex-grow relative z-10">
          <p className="text-[9px] text-gray-500 uppercase mb-2 font-mono">Top Headlines</p>
          <ul className="space-y-2">
            {Array.isArray(currency.headlines) ? currency.headlines.map((headline: string, i: number) => (
              <li key={i} className="text-[10px] text-gray-300 font-mono leading-tight pl-2 border-l border-gray-700">
                {headline}
              </li>
            )) : (
              <li className="text-[10px] text-gray-300 font-mono leading-tight pl-2 border-l border-gray-700">
                {currency.headline}
              </li>
            )}
          </ul>
        </div>
      )}

      {currency.reaction && (
        <div className="mb-4 relative z-10 bg-[#1a1a1a] p-2 border border-gray-800">
          <p className="text-[9px] text-orange-500 uppercase mb-1 font-mono">Market Reaction</p>
          <p className="text-[10px] text-gray-400 font-mono leading-tight">{currency.reaction}</p>
        </div>
      )}

      <div className="space-y-2 relative z-10 mt-auto">
        {currency.drivers && (
          <div className="flex flex-wrap gap-1">
            {currency.drivers.map((driver: string, i: number) => (
              <span key={i} className="text-[9px] bg-[#1a1a1a] text-gray-400 px-1.5 py-0.5 border border-gray-700 font-mono uppercase">
                {driver}
              </span>
            ))}
          </div>
        )}

        {currency.events && currency.events.length > 0 && (
          <div className="pt-2 border-t border-gray-800">
            <p className="text-[9px] text-gray-500 uppercase mb-1 font-mono">Key Events</p>
            <ul className="space-y-1">
              {currency.events.map((event: any, i: number) => (
                <li key={i} className="flex justify-between text-[9px] font-mono items-center">
                  {typeof event === 'string' ? (
                    <span className="text-gray-300">{event}</span>
                  ) : (
                    <>
                      <span className="text-orange-500/70 w-8">{event.day.toUpperCase()}</span>
                      <span className="text-gray-300 flex-1 truncate mr-2">{event.event}</span>
                      <span className={`px-1 ${event.impact === "Critical" || event.impact === "High" ? "bg-red-900/30 text-red-400 border border-red-900/50" : "text-gray-600"}`}>
                        {event.impact.toUpperCase()}
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TradeCard = ({ trade, index }: { trade: any, index: number }) => {
  const isLong = trade.direction === "Long";
  // Bloomberg Style: Orange for Long/Bullish, Red for Short/Bearish
  const colorClass = isLong ? "orange" : "red";
  const textColor = isLong ? "text-orange-500" : "text-red-500";
  const borderColor = isLong ? "border-orange-500/30" : "border-red-500/30";
  const bgColor = isLong ? "bg-orange-500/5" : "bg-red-500/5";
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border ${borderColor} ${bgColor} p-2.5 flex items-center justify-between group hover:bg-[#1a1a1a] transition-colors`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 flex items-center justify-center border ${borderColor} ${textColor} font-bold font-mono text-xs`}>
          {index + 1}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm font-mono text-gray-200">{trade.pair}</span>
            <span className={`text-[9px] px-1 py-0.5 ${isLong ? "bg-orange-900/30 text-orange-400" : "bg-red-900/30 text-red-400"} font-bold uppercase border ${borderColor}`}>
              {trade.direction}
            </span>
          </div>
          <p className="text-[9px] text-gray-500 font-mono mt-0.5">{trade.reason}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"WEEKLY" | "DAILY">("WEEKLY");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Transform dailyData object to array format for rendering if needed
  const dailyCurrenciesArray = Object.entries(dailyData.currencies).map(([code, data]: [string, any]) => ({
    code,
    name: code === "USD" ? "US Dollar" : code === "EUR" ? "Euro" : code === "GBP" ? "British Pound" : code === "JPY" ? "Japanese Yen" : code === "AUD" ? "Australian Dollar" : code === "CAD" ? "Canadian Dollar" : code === "CHF" ? "Swiss Franc" : "New Zealand Dollar",
    ...data
  }));

  const currentCurrencies = viewMode === "WEEKLY" ? weeklyData.currencies : dailyCurrenciesArray;
  
  const filteredCurrencies = currentCurrencies.filter((c: any) => {
    if (filter === "All") return true;
    return c.bias.includes(filter);
  });

  const handleExport = async () => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    
    try {
      const dataUrl = await toPng(dashboardRef.current, {
        backgroundColor: '#000000',
        pixelRatio: 2, // High resolution
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.download = `TUDOR_DASHBOARD_${new Date().toISOString().slice(0,10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden" ref={dashboardRef}>
      {/* Top Bar - Bloomberg Style */}
      <header className="border-b border-orange-500/30 bg-[#0a0a0a] sticky top-0 z-50 h-10 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Terminal className="w-4 h-4 text-orange-500" />
              <h1 className="font-mono font-bold text-sm tracking-tight text-orange-500">
                TUDOR<span className="text-white">_DASHBOARD</span>
              </h1>
            </div>
            <div className="h-4 w-[1px] bg-gray-800 mx-2"></div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Weekly Bias Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 hover:text-orange-500 transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Camera className="w-3 h-3" />
              )}
              EXPORT DASHBOARD
            </button>
            <div className="h-3 w-[1px] bg-gray-800"></div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-orange-500" />
              <span>FRA {currentTime.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Mode Switcher & Date */}
        <div className="flex items-end justify-between mb-6 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tighter mb-1">
              {viewMode === "WEEKLY" ? "WEEKLY BIAS" : "DAILY RECAP"}
            </h2>
            <p className="text-xs font-mono text-orange-500 uppercase tracking-widest">
              {viewMode === "WEEKLY" ? weeklyData.week : dailyData.date}
            </p>
          </div>
          
          <div className="flex bg-[#121212] border border-gray-800 p-1 rounded-sm">
            <button 
              onClick={() => setViewMode("WEEKLY")}
              className={`px-4 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider transition-all ${
                viewMode === "WEEKLY" 
                  ? "bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.3)]" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Weekly View
            </button>
            <button 
              onClick={() => setViewMode("DAILY")}
              className={`px-4 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider transition-all ${
                viewMode === "DAILY" 
                  ? "bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.3)]" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Daily View
            </button>
          </div>
        </div>

        {/* Market Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Market Context */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#121212] border border-gray-800 p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" />
                Market Overview
              </h3>
              <p className="text-sm text-gray-300 font-mono leading-relaxed">
                {viewMode === "WEEKLY" ? "Global markets are navigating a complex landscape of geopolitical tension and shifting monetary policy expectations. Key focus remains on US economic data and central bank rhetoric." : dailyData.marketFocus.macroContext}
              </p>
            </div>

            {/* Daily Specific: Focus & Summary */}
            {viewMode === "DAILY" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#121212] border border-gray-800 p-4">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-800 pb-2">
                    Market Focus
                  </h4>
                  <ul className="space-y-2">
                    {dailyData.marketFocus.headlines.map((headline: string, i: number) => (
                      <li key={i} className="text-[11px] text-gray-300 font-mono flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">›</span>
                        {headline}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#121212] border border-gray-800 p-4">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-800 pb-2">
                    Trading Summary
                  </h4>
                  <p className="text-[11px] text-gray-300 font-mono leading-relaxed">
                    {dailyData.tradingSummary}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: High Conviction (Weekly) OR Red Folder News (Daily) */}
          <div className="lg:col-span-1">
            {viewMode === "WEEKLY" ? (
              <div className="bg-[#121212] border border-gray-800 p-5 h-full">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  High Conviction Setups
                </h3>
                <div className="space-y-3">
                  {weeklyData.topTrades.map((trade: any, i: number) => (
                    <TradeCard key={i} trade={trade} index={i} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 h-full">
                {/* Daily High Conviction Setups */}
                <div className="bg-[#121212] border border-gray-800 p-5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    Daily High Conviction
                  </h3>
                  <div className="space-y-3">
                    {/* @ts-ignore - dailyData.topTrades might be undefined in old types */}
                    {dailyData.topTrades && dailyData.topTrades.length > 0 ? (
                      // @ts-ignore
                      dailyData.topTrades.map((trade: any, i: number) => (
                        <TradeCard key={i} trade={trade} index={i} />
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 font-mono italic text-center py-4">No high conviction setups for today.</p>
                    )}
                  </div>
                </div>

                {/* Red Folder News */}
                <div className="bg-[#121212] border border-gray-800 p-5 flex-grow">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    Red Folder News
                  </h3>
                  <div className="space-y-3">
                    {dailyData.redFolderNews
                      .filter((news: any) => {
                        // Simple filter to show only today's/future events based on time if available
                        // For now, showing all for the day as per data
                        return true; 
                      })
                      .map((news: any, i: number) => (
                      <div key={i} className="flex items-center justify-between border-b border-gray-800 pb-2 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-500 w-10">{news.time}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white w-8">{news.currency}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 border ${
                                news.impact === "Critical" ? "border-red-500 text-red-500 bg-red-900/20" : 
                                news.impact === "High" ? "border-orange-500 text-orange-500 bg-orange-900/20" : 
                                "border-gray-600 text-gray-400"
                              } uppercase font-bold`}>
                                {news.impact}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{news.event}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {dailyData.redFolderNews.length === 0 && (
                      <p className="text-xs text-gray-500 font-mono italic text-center py-4">No high impact events remaining today.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["All", "Bullish", "Bearish", "Neutral"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[10px] font-bold font-mono uppercase border transition-all ${
                filter === f 
                  ? "border-orange-500 text-orange-500 bg-orange-500/10" 
                  : "border-gray-800 text-gray-500 hover:border-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Currency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredCurrencies.map((currency: any) => {
            // Find corresponding weekly bias for alignment check
            const weeklyBias = viewMode === "DAILY" 
              ? weeklyData.currencies.find((c: any) => c.code === currency.code)?.bias 
              : undefined;

            return (
              <BiasCard 
                key={currency.code} 
                currency={currency} 
                weeklyBias={weeklyBias}
              />
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#0a0a0a] mt-12 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] text-gray-600 font-mono">
            <p>© 2026 TUDOR_DASHBOARD. Internal Use Only.</p>
            <p className="mt-1">Data sourced from Prime Market Terminal & Bloomberg.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              System Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
