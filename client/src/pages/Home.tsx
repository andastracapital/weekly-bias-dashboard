import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
// Export functionality will use browser's native screenshot capability
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
  const isLong = trade.direction.toUpperCase() === "LONG";
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
  const [viewMode, setViewMode] = useState<"WEEKLY" | "DAILY">("DAILY");
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

  // --- Dynamic Calculation Logic ---

  // 1. Calculate High Conviction Setups (Weekly View)
  // Logic: Find currencies where Weekly Bias matches Daily Bias (Alignment).
  // Pair Strongest (Bullish Aligned) vs Weakest (Bearish Aligned).
  const getHighConvictionSetups = () => {
    const bullishAligned: string[] = [];
    const bearishAligned: string[] = [];

    weeklyData.currencies.forEach((wCurrency: any) => {
      // @ts-ignore
      const dCurrency = dailyData.currencies[wCurrency.code];
      if (!dCurrency) return;

      const wBias = wCurrency.bias.toLowerCase();
      const dBias = dCurrency.bias.toLowerCase();

      // Extract directional bias only (ignore "weak" or "strong" qualifiers)
      const extractDirection = (bias: string) => {
        if (bias.includes("bullish")) return "bullish";
        if (bias.includes("bearish")) return "bearish";
        if (bias.includes("neutral")) return "neutral";
        if (bias.includes("mixed")) return "mixed";
        return bias; // fallback to original if no match
      };

      const wDirection = extractDirection(wBias);
      const dDirection = extractDirection(dBias);

      // Check for Directional Alignment (Both Bullish or Both Bearish)
      // STRICTLY Exclude Neutral/Mixed - must be exact directional match
      const isBullishAlignment = 
        wDirection === "bullish" && dDirection === "bullish";
      const isBearishAlignment = 
        wDirection === "bearish" && dDirection === "bearish";
      
      if (isBullishAlignment) {
        bullishAligned.push(wCurrency.code);
      } else if (isBearishAlignment) {
        bearishAligned.push(wCurrency.code);
      }
    });

    const setups: any[] = [];
    
    // FX Market Convention for Base/Quote Currency Pairs
    // Priority Order (Base Currency): EUR > GBP > AUD > NZD > USD > CAD > CHF > JPY
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
    
    // Generate Pairs: Bullish Aligned vs Bearish Aligned
    bullishAligned.forEach(bull => {
      bearishAligned.forEach(bear => {
        const { pair, direction } = getConventionalPair(bull, bear);
        setups.push({
          pair,
          direction,
          reason: `Strong alignment: Weekly & Daily ${bull === pair.split('/')[0] ? 'Bullish' : 'Bearish'} ${pair.split('/')[0]} vs ${bear === pair.split('/')[1] ? 'Bearish' : 'Bullish'} ${pair.split('/')[1]}`,
          conviction: "High"
        });
      });
    });

    // NO FALLBACK - Only show setups with true Weekly-Daily alignment

    return setups.slice(0, 3); // Limit to top 3
  };

  const highConvictionSetups = getHighConvictionSetups();

  // 2. Calculate Intraday Potentials (Daily View)
  // Logic: List Daily Bullish vs Daily Bearish currencies
  const getIntradayPotentials = () => {
    const bullish: string[] = [];
    const bearish: string[] = [];

    Object.entries(dailyData.currencies).forEach(([code, data]: [string, any]) => {
      const bias = data.bias.toLowerCase();
      if (bias.includes("bullish")) bullish.push(code);
      if (bias.includes("bearish")) bearish.push(code);
    });

    return { bullish, bearish };
  };

  const intradayPotentials = getIntradayPotentials();

  const currentCurrencies = viewMode === "WEEKLY" ? weeklyData.currencies : dailyCurrenciesArray;
  
  const filteredCurrencies = currentCurrencies.filter((c: any) => {
    if (filter === "All") return true;
    return c.bias.includes(filter);
  });

  const handleExport = async () => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Use modern-screenshot which supports modern CSS including OKLCH
      const { domToPng } = await import('modern-screenshot');
      
      const dataUrl = await domToPng(dashboardRef.current, {
        scale: 2, // High resolution
        backgroundColor: '#000000',
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
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden">
      {/* Top Bar - Bloomberg Style */}
      <header className="border-b border-orange-500/30 bg-[#0a0a0a] sticky top-0 z-50 h-10 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <img 
              src="data:image/png;base64,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"
              alt="Logo"
              className="w-24 h-24 object-contain"
            />
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

      <main className="container mx-auto px-4 py-6" ref={dashboardRef}>
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
        {viewMode === "WEEKLY" ? (
          <div className="space-y-6 mb-8">
            {/* Market Overview - Narrower */}
            <div className="bg-[#121212] border border-gray-800 p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" />
                Market Overview
              </h3>
              <p className="text-sm text-gray-300 font-mono leading-relaxed">
                Global markets navigating complex landscape of geopolitical tension and shifting monetary policy expectations. Key focus remains on US economic data and central bank rhetoric.
              </p>
            </div>

            {/* Dual Swing Watchlists Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(() => {
                // Identify Strong (Bullish) and Weak (Bearish) currencies - ignore Neutral
                const strongCurrencies = weeklyData.currencies
                  .filter((c: any) => c.bias.includes("Bullish"))
                  .map((c: any) => c.code);
                const weakCurrencies = weeklyData.currencies
                  .filter((c: any) => c.bias.includes("Bearish"))
                  .map((c: any) => c.code);

                // FX Pair Convention Priority (Base > Quote)
                const fxPriority: { [key: string]: number } = {
                  "EUR": 1, "GBP": 2, "AUD": 3, "NZD": 4,
                  "USD": 5, "CAD": 6, "CHF": 7, "JPY": 8
                };

                const getConventionalPair = (strong: string, weak: string) => {
                  if (fxPriority[strong] < fxPriority[weak]) {
                    return { pair: `${strong}/${weak}`, direction: "LONG" };
                  } else {
                    return { pair: `${weak}/${strong}`, direction: "SHORT" };
                  }
                };

                // Generate ALL Strong vs Weak pairs (no limit)
                const allPairs = [];
                for (const strong of strongCurrencies) {
                  for (const weak of weakCurrencies) {
                    const { pair, direction } = getConventionalPair(strong, weak);
                    allPairs.push({ pair, direction, strong, weak });
                  }
                }

                // Split into LONG and SHORT lists (max 6 each)
                const longPairs = allPairs.filter(p => p.direction === "LONG").slice(0, 6);
                const shortPairs = allPairs.filter(p => p.direction === "SHORT").slice(0, 6);

                return (
                  <>
                    {/* Swing Watchlist LONG */}
                    <div className="bg-[#121212] border border-gray-800 p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-500" />
                        Swing Watchlist LONG
                      </h3>
                      <div className="space-y-2">
                        {longPairs.length > 0 ? (
                          longPairs.map((trade: any, i: number) => (
                            <div key={i} className="bg-black/40 border border-gray-800 p-2.5 hover:border-orange-500/50 transition-all group">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white font-mono">{trade.pair}</span>
                                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/50">
                                  LONG
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500 font-mono italic text-center py-2">No LONG setups available.</p>
                        )}
                      </div>
                    </div>

                    {/* Swing Watchlist SHORT */}
                    <div className="bg-[#121212] border border-gray-800 p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-red-500" />
                        Swing Watchlist SHORT
                      </h3>
                      <div className="space-y-2">
                        {shortPairs.length > 0 ? (
                          shortPairs.map((trade: any, i: number) => (
                            <div key={i} className="bg-black/40 border border-gray-800 p-2.5 hover:border-red-500/50 transition-all group">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white font-mono">{trade.pair}</span>
                                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/50">
                                  SHORT
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500 font-mono italic text-center py-2">No SHORT setups available.</p>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        ) : (
          // DAILY VIEW LAYOUT
          <div className="space-y-6 mb-8">
            {/* Status Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#121212] border border-gray-800 p-4">
              {/* Risk Sentiment */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Risk Sentiment</span>
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${
                    dailyData.marketFocus.riskEnvironment === "Risk-On" ? "text-green-500" :
                    dailyData.marketFocus.riskEnvironment === "Risk-Off" ? "text-orange-500" :
                    "text-gray-400"
                  }`} />
                  <span className={`text-sm font-bold font-mono ${
                    dailyData.marketFocus.riskEnvironment === "Risk-On" ? "text-white" :
                    dailyData.marketFocus.riskEnvironment === "Risk-Off" ? "text-white" :
                    "text-gray-300"
                  }`}>
                    {dailyData.marketFocus.riskEnvironment || "Neutral"}
                  </span>
                </div>
              </div>

              {/* Focus */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Focus</span>
                <span className="text-sm font-bold text-white font-mono truncate">
                  {dailyData.marketFocus.headlines[0] || "Key Market Drivers"}
                </span>
              </div>

              {/* Risk Environment & Next Update */}
              <div className="flex justify-between md:justify-end gap-6">
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Risk Environment</span>
                  <span className={`text-sm font-bold font-mono ${
                    dailyData.marketFocus.riskEnvironment.includes("Risk-Off") ? "text-red-500" :
                    dailyData.marketFocus.riskEnvironment.includes("Mixed") ? "text-orange-500" :
                    "text-green-500"
                  }`}>
                    {dailyData.marketFocus.riskEnvironment}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Next Update</span>
                  <span className="text-sm font-bold text-gray-400 font-mono">
                    07:00
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left: Market Context (50%) */}
              <div className="lg:col-span-2 space-y-6 flex flex-col">
                <div className="bg-[#121212] border border-gray-800 p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    Market Overview
                  </h3>
                  <p className="text-sm text-gray-300 font-mono leading-relaxed">
                    {dailyData.marketFocus.headlines.join(" • ")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
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
                      Risk Environment
                    </h4>
                    <p className="text-[11px] text-gray-300 font-mono leading-relaxed">
                      {dailyData.marketFocus.riskEnvironment}: {dailyData.marketFocus.headlines[0]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle: High Conviction Setups + Intraday Trades (25%) */}
              <div className="lg:col-span-1 space-y-6">
                {/* High Conviction Setups */}
                <div className="bg-[#121212] border border-gray-800 p-5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    High Conviction Setups
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono mb-4">
                    Based on Weekly & Daily Bias Alignment
                  </p>
                  <div className="space-y-3">
                    {highConvictionSetups.length > 0 ? (
                      highConvictionSetups.map((trade: any, i: number) => (
                        <TradeCard key={i} trade={trade} index={i} />
                      ))
                    ) : (
                      <div className="text-center py-8 border border-dashed border-gray-800">
                        <p className="text-xs text-gray-500 font-mono">No strong alignment setups found currently.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Intraday Trades */}
                <div className="bg-[#121212] border border-gray-800 p-5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    Intraday Trades <span className="text-gray-500 ml-1 text-[10px]">(Base Hits)</span>
                  </h3>
                  
                  {/* Generated Pairs Only */}
                  <div className="space-y-2">
                    {intradayPotentials.bullish.length > 0 && intradayPotentials.bearish.length > 0 ? (
                      intradayPotentials.bullish.flatMap(bull => 
                        intradayPotentials.bearish.map(bear => {
                          // Determine Pair Direction (Standard Notation)
                          let pair = `${bull}/${bear}`;
                          let direction = "Long";

                          // Priority: EUR > GBP > AUD > NZD > USD > CAD > CHF > JPY
                          const priority = ["EUR", "GBP", "AUD", "NZD", "USD", "CAD", "CHF", "JPY"];
                          const bullIndex = priority.indexOf(bull);
                          const bearIndex = priority.indexOf(bear);

                          if (bullIndex > bearIndex && bearIndex !== -1) {
                              // Flip to Standard Notation
                              pair = `${bear}/${bull}`;
                              direction = "Short"; 
                          }

                          return { pair, direction, bull, bear };
                        })
                      )
                      // Filter out pairs that are already in High Conviction Setups
                      .filter(trade => !highConvictionSetups.some(hc => hc.pair === trade.pair))
                      .slice(0, 6).map((trade, i) => (
                        <div key={i} className={`flex items-center justify-between bg-[#1a1a1a] px-3 py-2 border-l-2 ${trade.direction === "Long" ? "border-l-orange-500" : "border-l-red-500"} border-y border-r border-gray-800`}>
                          <span className="text-xs font-bold text-white font-mono">{trade.pair}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${trade.direction === "Long" ? "text-orange-500" : "text-red-500"}`}>
                            {trade.direction}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-gray-600 font-mono italic text-center py-4">No clear divergence for intraday setups.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Red Folder News (25%) */}
              <div className="lg:col-span-1">
                <div className="bg-[#121212] border border-gray-800 p-5 h-full">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    Red Folder News
                  </h3>
                  <div className="space-y-3">
                    {dailyData.redFolderNews
                      .filter((news: any) => {
                        // Get current day of week (MON, TUE, WED, THU, FRI)
                        const today = new Date();
                        const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                        const currentDay = daysOfWeek[today.getDay()];
                        
                        // Filter: only show events happening TODAY (exact match)
                        return news.day === currentDay;
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
            </div>
          </div>
        )}

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
            // Find comparison bias for alignment check
            let comparisonBias = undefined;

            if (viewMode === "DAILY") {
              // In Daily View, compare with Weekly Bias
              comparisonBias = weeklyData.currencies.find((c: any) => c.code === currency.code)?.bias;
            } else {
              // In Weekly View, compare with Daily Bias
              // @ts-ignore
              comparisonBias = dailyData.currencies[currency.code]?.bias;
            }

            return (
              <BiasCard 
                key={currency.code} 
                currency={currency} 
                weeklyBias={comparisonBias}
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
