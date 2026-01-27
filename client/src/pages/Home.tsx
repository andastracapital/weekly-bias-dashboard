import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
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

const BiasCard = ({ currency, weeklyBias, isExportMode, isSelected, onToggleSelect }: { currency: any, weeklyBias?: string, isExportMode?: boolean, isSelected?: boolean, onToggleSelect?: () => void }) => {
  const isBullish = currency.bias === "Bullish";
  const isBearish = currency.bias === "Bearish";
  const isNeutral = currency.bias === "Neutral" || currency.bias === "Mixed";

  // Calculate Alignment dynamically if weeklyBias is provided
  let alignment = currency.alignment; // Fallback to existing if present
  
  if (weeklyBias && currency.bias) {
    const w = weeklyBias.toLowerCase();
    const d = currency.bias.toLowerCase();
    
    if (w === d && w !== "neutral" && w !== "mixed") {
      alignment = "Perfect";
    } else if ((w === "bullish" && d === "bullish") || (w === "bearish" && d === "bearish")) {
      alignment = "Strong";
    } else if (w !== d && w !== "neutral" && d !== "neutral") {
      alignment = "Mismatch";
    }
  }

  // Bloomberg Colors: Orange (Bullish), Red (Bearish), Grey (Neutral)
  const borderColor = isBullish ? "border-orange-500" : isBearish ? "border-red-600" : "border-gray-600";
  const textColor = isBullish ? "text-orange-500" : isBearish ? "text-red-500" : "text-gray-400";
  const bgColor = isBullish ? "bg-orange-500/10" : isBearish ? "bg-red-900/10" : "bg-gray-800/20";
  const glowClass = isBullish ? "shadow-[0_0_15px_rgba(249,115,22,0.15)]" : isBearish ? "shadow-[0_0_15px_rgba(220,38,38,0.15)]" : "";

  // Export Mode Styles
  const exportOverlayClass = isExportMode 
    ? isSelected 
      ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-black cursor-pointer" 
      : "opacity-40 hover:opacity-70 cursor-pointer grayscale" 
    : "";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={isExportMode ? onToggleSelect : undefined}
      className={`relative border ${borderColor} bg-[#121212] p-4 h-full flex flex-col group overflow-hidden ${glowClass} ${exportOverlayClass} transition-all duration-200`}
      id={`card-${currency.code}`}
    >
      {isExportMode && isSelected && (
        <div className="absolute top-2 right-2 z-50 bg-orange-500 text-black rounded-full p-0.5">
          <Check className="w-3 h-3" />
        </div>
      )}
      
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

    </motion.div>
  );
};

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"WEEKLY" | "DAILY">("WEEKLY");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Export State
  const [isExportMode, setIsExportMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentData = viewMode === "WEEKLY" ? weeklyData : dailyData;
  
  const filteredCurrencies = currentData.currencies.filter((c: any) => {
    if (filter === "All") return true;
    return c.bias === filter;
  });

  // Export Logic
  const toggleExportMode = () => {
    setIsExportMode(!isExportMode);
    setSelectedItems([]); // Reset selection on toggle
  };

  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleExport = async () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to export.");
      return;
    }

    // Create a temporary container for the collage
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.left = "-9999px";
    container.style.width = "1200px"; // Fixed width for consistent export
    container.style.backgroundColor = "#000000";
    container.style.padding = "40px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "20px";
    document.body.appendChild(container);

    // Add Header to Export
    const header = document.createElement("div");
    header.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <h1 style="font-family: monospace; font-weight: bold; font-size: 24px; color: #f97316;">TUDOR<span style="color: white;">_DASHBOARD</span></h1>
          <span style="font-family: monospace; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px;">${viewMode} BRIEFING</span>
        </div>
        <div style="font-family: monospace; font-size: 12px; color: #666;">
          ${new Date().toLocaleDateString()} // ${currentTime.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin' })} FRA
        </div>
      </div>
    `;
    container.appendChild(header);

    // Clone selected elements
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(2, 1fr)"; // 2 columns for export
    grid.style.gap = "20px";
    
    // Helper to clone element styles
    const cloneElement = (id: string) => {
      const original = document.getElementById(id);
      if (original) {
        const clone = original.cloneNode(true) as HTMLElement;
        // Remove export-specific classes/overlays
        clone.classList.remove("opacity-40", "hover:opacity-70", "cursor-pointer", "grayscale", "ring-2", "ring-orange-500");
        
        // Force styles for export context
        clone.style.height = "auto";
        clone.style.minHeight = "200px";
        
        // If it's the main overview panel, make it span full width
        if (id === "market-overview") {
          clone.style.gridColumn = "span 2";
        }
        
        return clone;
      }
      return null;
    };

    // Add selected items to grid
    selectedItems.forEach(id => {
      const clone = cloneElement(id);
      if (clone) grid.appendChild(clone);
    });

    container.appendChild(grid);

    // Add Footer
    const footer = document.createElement("div");
    footer.innerHTML = `
      <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px; display: flex; justify-content: space-between; font-family: monospace; font-size: 10px; color: #444;">
        <span>GENERATED BY TUDOR_DASHBOARD</span>
        <span>CONFIDENTIAL TRADING DATA</span>
      </div>
    `;
    container.appendChild(footer);

    try {
      const canvas = await html2canvas(container, {
        backgroundColor: "#000000",
        scale: 2, // High resolution
        useCORS: true,
        logging: false
      });

      const link = document.createElement("a");
      link.download = `TUDOR_EXPORT_${new Date().toISOString().slice(0,10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    } finally {
      document.body.removeChild(container);
      setIsExportMode(false);
      setSelectedItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden">
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
            {isExportMode ? (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="text-orange-500 font-bold">EXPORT MODE ACTIVE</span>
                <span className="bg-gray-800 px-2 py-0.5 rounded text-white">{selectedItems.length} Selected</span>
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-1 bg-orange-500 text-black px-2 py-0.5 font-bold hover:bg-orange-400 transition-colors"
                >
                  <Download className="w-3 h-3" /> GENERATE IMAGE
                </button>
                <button 
                  onClick={toggleExportMode}
                  className="p-0.5 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={toggleExportMode}
                className="flex items-center gap-1 hover:text-orange-500 transition-colors"
              >
                <Camera className="w-3 h-3" />
                <span>SMART EXPORT</span>
              </button>
            )}
            <div className="h-4 w-[1px] bg-gray-800 mx-2"></div>
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

      <main className="container mx-auto px-4 py-6 relative z-10" ref={exportRef}>
        {/* View Toggle & Hero Section */}
        <div className={`flex justify-center mb-6 transition-opacity duration-300 ${isExportMode ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
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
          <div 
            id="market-overview"
            onClick={isExportMode ? () => toggleItemSelection("market-overview") : undefined}
            className={`lg:col-span-8 border border-gray-800 bg-[#0f0f0f] p-5 relative overflow-hidden flex flex-col transition-all duration-200 ${
              isExportMode 
                ? selectedItems.includes("market-overview") 
                  ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-black cursor-pointer" 
                  : "opacity-40 hover:opacity-70 cursor-pointer grayscale" 
                : ""
            }`}
          >
            {isExportMode && selectedItems.includes("market-overview") && (
              <div className="absolute top-2 right-2 z-50 bg-orange-500 text-black rounded-full p-0.5">
                <Check className="w-3 h-3" />
              </div>
            )}
            <div className="absolute top-0 right-0 p-2">
              <span className="text-[9px] font-mono text-orange-500/50 border border-orange-500/20 px-1">
                {viewMode === "WEEKLY" ? `WEEK ${weeklyData.week}` : dailyData.date.toUpperCase()}
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">MARKET <span className="text-orange-500">OVERVIEW</span></h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-800 pt-4 mt-4">
              <div>
                <p className="text-[9px] text-gray-500 uppercase mb-1">Risk Sentiment</p>
                <p className="text-sm font-mono font-bold text-white flex items-center gap-1">
                  <Activity className="w-3 h-3 text-orange-500" /> {viewMode === "WEEKLY" ? "RISK-OFF" : dailyData.marketSentiment}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase mb-1">Focus</p>
                <p className="text-sm font-mono font-bold text-white truncate">{viewMode === "WEEKLY" ? "FOMC / TARIFFS" : dailyData.dailyFocus}</p>
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

            {/* Daily View Specific: Focus & Summary */}
            {viewMode === "DAILY" && dailyData.focus && (
              <div className="mt-6 pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[9px] text-orange-500 uppercase tracking-widest mb-2 font-mono">Market Focus</p>
                  <ul className="space-y-1">
                    {dailyData.focus.headlines.slice(0, 3).map((h: string, i: number) => (
                      <li key={i} className="text-[10px] text-gray-300 font-mono border-l border-gray-700 pl-2 leading-tight">{h}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[9px] text-orange-500 uppercase tracking-widest mb-2 font-mono">Trading Summary</p>
                  <p className="text-[10px] text-gray-300 font-mono leading-relaxed">
                    {dailyData.proprietarySummary}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: High Conviction (Weekly) OR Red Folder News (Daily) */}
          <div 
            id="right-panel"
            onClick={isExportMode ? () => toggleItemSelection("right-panel") : undefined}
            className={`lg:col-span-4 border border-gray-800 bg-[#0f0f0f] p-5 flex flex-col transition-all duration-200 ${
              isExportMode 
                ? selectedItems.includes("right-panel") 
                  ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-black cursor-pointer" 
                  : "opacity-40 hover:opacity-70 cursor-pointer grayscale" 
                : ""
            }`}
          >
            {isExportMode && selectedItems.includes("right-panel") && (
              <div className="absolute top-2 right-2 z-50 bg-orange-500 text-black rounded-full p-0.5">
                <Check className="w-3 h-3" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
              {viewMode === "WEEKLY" ? (
                <>
                  <Zap className="w-4 h-4 text-orange-500" />
                  <h3 className="text-xs font-mono font-bold text-orange-500 uppercase tracking-widest">High Conviction Setup</h3>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 text-red-500" />
                  <h3 className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">Red Folder News (FRA Time)</h3>
                </>
              )}
            </div>
            
            <div className="space-y-3 flex-grow overflow-y-auto max-h-[250px] pr-1 custom-scrollbar">
              {viewMode === "WEEKLY" ? (
                weeklyData.topTrades.map((trade: any, i: number) => (
                  <TradeCard key={i} trade={trade} index={i} />
                ))
              ) : (
                dailyData.redFolderNews?.filter((news: any) => {
                  // Simple filter logic: In a real app, parse dates. Here we assume news are sorted.
                  // For now, we show all news for the week as "Upcoming" context is valuable, 
                  // but we could filter by day index if needed. 
                  // User requested to hide past news.
                  
                  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                  const todayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon...
                  const newsDayIndex = days.indexOf(news.day.toUpperCase().slice(0, 3));
                  
                  // If news day is today, check time
                  if (newsDayIndex === todayIndex) {
                    const now = new Date();
                    const currentHour = now.getHours();
                    const currentMinute = now.getMinutes();
                    const [newsHour, newsMinute] = (news.time || "00:00").split(":").map(Number);
                    
                    if (currentHour > newsHour || (currentHour === newsHour && currentMinute >= newsMinute)) {
                      return false; // Past time today
                    }
                    return true; // Future time today
                  }
                  
                  // If news day is in the future
                  return newsDayIndex > todayIndex;
                }).map((news: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-2 border border-gray-800 bg-[#121212] hover:bg-[#1a1a1a] transition-colors">
                    <div className="flex flex-col items-center min-w-[35px] border-r border-gray-800 pr-2">
                      <span className="text-[9px] font-bold text-gray-500 uppercase">{news.day}</span>
                      <span className="text-[10px] font-bold text-white font-mono">{news.time || "--:--"}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-200 font-mono leading-tight">{news.event}</p>
                      <span className={`text-[8px] px-1 py-0.5 mt-1 inline-block uppercase tracking-wider border ${
                        news.impact === "Critical" ? "border-red-900 text-red-500 bg-red-900/10" : "border-orange-900 text-orange-500 bg-orange-900/10"
                      }`}>
                        {news.impact} Impact
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={`flex flex-wrap gap-2 mb-6 transition-opacity duration-300 ${isExportMode ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
          <span className="text-[10px] font-mono text-gray-500 uppercase self-center mr-2">Filter View:</span>
          {["All", "Bullish", "Bearish", "Neutral"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase border transition-all ${
                filter === f 
                  ? "bg-orange-500 text-black border-orange-500" 
                  : "bg-transparent text-gray-500 border-gray-800 hover:border-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCurrencies.map((currency: any) => {
            // Find corresponding bias for alignment check
            // If in DAILY mode, compare with WEEKLY bias
            // If in WEEKLY mode, compare with DAILY bias (to show if today aligns with the week)
            const weeklyCurrency = weeklyData.currencies.find((c: any) => c.code === currency.code);
            const dailyCurrency = dailyData.currencies.find((c: any) => c.code === currency.code);
            
            const comparisonBias = viewMode === "DAILY" ? weeklyCurrency?.bias : dailyCurrency?.bias;
            
            return (
              <BiasCard 
                key={currency.code} 
                currency={currency} 
                weeklyBias={comparisonBias}
                isExportMode={isExportMode}
                isSelected={selectedItems.includes(`card-${currency.code}`)}
                onToggleSelect={() => toggleItemSelection(`card-${currency.code}`)}
              />
            );
          })}
        </div>

        {/* Footer */}
        <footer className={`mt-12 border-t border-gray-900 pt-6 pb-4 flex justify-between items-center text-[9px] font-mono text-gray-600 transition-opacity duration-300 ${isExportMode ? "opacity-20" : "opacity-100"}`}>
          <div>
            <p>TUDOR_DASHBOARD v3.3.0 // AUTOMATED FX DASHBOARD</p>
            <p className="mt-1">DATA SOURCE: PRIMEMARKET TERMINAL // REFRESH: AUTO</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-900 rounded-full"></div>
            <span>SYSTEM OPTIMAL</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
