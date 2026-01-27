import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  Calendar, 
  RefreshCw, 
  ArrowRight,
  Activity,
  Globe,
  Zap,
  Terminal
} from "lucide-react";
import weeklyData from "../data/weeklyBias.json";
import dailyData from "../data/dailyRecap.json";

// Bloomberg / PMT Style Components

const BiasCard = ({ currency }: { currency: any }) => {
  const isBullish = currency.bias === "Bullish";
  const isBearish = currency.bias === "Bearish";
  const isNeutral = currency.bias === "Neutral" || currency.bias === "Mixed";

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
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div>
          <h3 className="text-3xl font-bold font-mono tracking-tighter text-gray-100">{currency.code}</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">{currency.name}</p>
        </div>
        <div className={`px-2 py-0.5 border ${borderColor} ${textColor} text-[10px] font-mono font-bold uppercase tracking-wider`}>
          {currency.biasLevel || currency.tone}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 relative z-10 border-b border-gray-800 pb-3">
        {isBullish && <TrendingUp className="w-4 h-4 text-orange-500" />}
        {isBearish && <TrendingDown className="w-4 h-4 text-red-500" />}
        {isNeutral && <Minus className="w-4 h-4 text-gray-500" />}
        <span className={`text-base font-bold font-mono ${textColor}`}>{currency.bias.toUpperCase()}</span>
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
            {currency.headlines.map((headline: string, i: number) => (
              <li key={i} className="text-[10px] text-gray-300 font-mono leading-tight pl-2 border-l border-gray-700">
                {headline}
              </li>
            ))}
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
      <div className="text-right">
        <p className="text-[8px] text-gray-600 uppercase tracking-wider">Target</p>
        <p className={`font-mono font-bold text-xs ${textColor}`}>{trade.target}</p>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"WEEKLY" | "DAILY">("WEEKLY");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentData = viewMode === "WEEKLY" ? weeklyData : dailyData;
  
  const filteredCurrencies = currentData.currencies.filter((c: any) => {
    if (filter === "All") return true;
    return c.bias === filter;
  });

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden">
      {/* Top Bar - Bloomberg Style */}
      <header className="border-b border-orange-500/30 bg-[#0a0a0a] sticky top-0 z-50 h-10 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Terminal className="w-4 h-4 text-orange-500" />
              <h1 className="font-mono font-bold text-sm tracking-tight text-orange-500">
                PMT<span className="text-white">_TERMINAL</span>
              </h1>
            </div>
            <div className="h-4 w-[1px] bg-gray-800 mx-2"></div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Weekly Bias Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
              <span className="text-orange-500">LIVE CONNECTION</span>
            </div>
            <div className="text-gray-400">
              {currentTime.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin' })} <span className="text-gray-600">FRA</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 relative z-10">
        {/* View Toggle & Hero Section */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-[#1a1a1a] border border-gray-800 p-1 rounded-sm">
            <button 
              onClick={() => setViewMode("WEEKLY")}
              className={`px-6 py-1.5 text-xs font-mono font-bold uppercase transition-all ${viewMode === "WEEKLY" ? "bg-orange-500 text-black" : "text-gray-500 hover:text-gray-300"}`}
            >
              Weekly Bias
            </button>
            <button 
              onClick={() => setViewMode("DAILY")}
              className={`px-6 py-1.5 text-xs font-mono font-bold uppercase transition-all ${viewMode === "DAILY" ? "bg-orange-500 text-black" : "text-gray-500 hover:text-gray-300"}`}
            >
              Daily Recap
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          {/* Main Status Panel */}
          <div className="lg:col-span-8 border border-gray-800 bg-[#0f0f0f] p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <span className="text-[9px] font-mono text-orange-500/50 border border-orange-500/20 px-1">
                {viewMode === "WEEKLY" ? `WEEK ${weeklyData.week}` : dailyData.date}
              </span>
            </div>
            
            <div className="flex items-end gap-4 mb-4">
              <h2 className="text-4xl font-bold text-white font-mono tracking-tighter">
                {viewMode === "WEEKLY" ? "MARKET" : "DAILY"} <span className="text-orange-500">{viewMode === "WEEKLY" ? "OVERVIEW" : "BRIEFING"}</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-800 pt-4">
              <div>
                <p className="text-[9px] text-gray-500 uppercase mb-1">Risk Sentiment</p>
                <p className="text-sm font-mono font-bold text-white flex items-center gap-1">
                  <Activity className="w-3 h-3 text-orange-500" /> {viewMode === "WEEKLY" ? "RISK-OFF" : dailyData.marketSentiment}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase mb-1">Focus</p>
                <p className="text-sm font-mono font-bold text-white">{viewMode === "WEEKLY" ? "FOMC / TARIFFS" : dailyData.dailyFocus}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase mb-1">Volatility</p>
                <p className="text-sm font-mono font-bold text-red-500">ELEVATED</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase mb-1">Next Update</p>
                <p className="text-sm font-mono font-bold text-gray-400">{viewMode === "WEEKLY" ? "SUN 16:00" : "MON-FRI 23:15"}</p>
              </div>
            </div>
          </div>

          {/* Top Trades Panel */}
          <div className="lg:col-span-4 border border-gray-800 bg-[#0f0f0f] p-4 flex flex-col">
            <h2 className="text-[10px] font-mono text-orange-500 mb-3 uppercase tracking-widest flex items-center gap-2 border-b border-gray-800 pb-2">
              <Zap className="w-3 h-3" /> High Conviction Setup
            </h2>
            <div className="space-y-2 flex-1">
              {weeklyData.topTrades.map((trade, i) => (
                <TradeCard key={i} trade={trade} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-2">
          <span className="text-[10px] font-mono text-gray-600 uppercase mr-2">Filter View:</span>
          {["All", "Bullish", "Bearish", "Neutral"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase border transition-all ${
                filter === f 
                  ? "bg-orange-500 text-black border-orange-500" 
                  : "bg-transparent text-gray-500 border-gray-800 hover:border-gray-600 hover:text-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredCurrencies.map((currency) => (
            <BiasCard key={currency.code} currency={currency} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-900 pt-6 pb-4 flex justify-between items-center text-[9px] font-mono text-gray-600">
          <div>
            SOURCE: PRIME MARKET TERMINAL • AUTO-SYNC ENABLED
          </div>
          <div className="flex gap-4">
            <span>LATENCY: 12ms</span>
            <span>SERVER: FRA-1</span>
            <span className="text-orange-900">PMT SYSTEM V2.4</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
