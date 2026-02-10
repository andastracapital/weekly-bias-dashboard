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
              className="w-12 h-12 object-contain"
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
