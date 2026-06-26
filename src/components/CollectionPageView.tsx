import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { DesignRenderer } from './DesignRenderer';
import { 
  ArrowLeft, Heart, Download, ShoppingBag, 
  Flame, Anchor, Zap, Shield, HelpCircle, Activity, 
  RotateCcw, Sliders, BadgeInfo, CheckCircle2, ChevronRight, Play
} from 'lucide-react';

interface CollectionPageViewProps {
  collection: {
    id: string;
    name: string;
    tag: string;
    count: number;
    color: string;
  };
  products: Product[];
  favorites: string[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (id: string) => void;
  onPurchase: (product: Product) => void;
  isLoading?: boolean;
}

export const CollectionPageView: React.FC<CollectionPageViewProps> = ({
  collection,
  products,
  favorites,
  onBack,
  onSelectProduct,
  onToggleFavorite,
  onPurchase,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubFilter, setActiveSubFilter] = useState('All');
  
  // Interactive state variables depending on collection type
  // Naruto State
  const [auraLevel, setAuraLevel] = useState(60);
  const [chakraColor, setChakraColor] = useState('Sage Orange');
  
  // One Piece State
  const [bountyName, setBountyName] = useState('STRAW HAT REBEL');
  const [bountyVal, setBountyVal] = useState(1500000000);
  
  // Demon Slayer State
  const [breathingForm, setBreathingForm] = useState('Water');
  
  // Attack on Titan State
  const [cureTemp, setCureTemp] = useState(320);
  
  // Jujutsu Kaisen State
  const [isDomainActive, setIsDomainActive] = useState(false);
  const [domainProgress, setDomainProgress] = useState(0);
  
  // Dragon Ball State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<number | null>(null);
  
  // Bleach State
  const [isBankaiActive, setIsBankaiActive] = useState(false);
  
  // Death Note State
  const [selectedNoteRule, setSelectedNoteRule] = useState<number>(0);

  // Trigger domains
  useEffect(() => {
    let timer: any;
    if (isDomainActive && domainProgress < 100) {
      timer = setTimeout(() => {
        setDomainProgress(prev => Math.min(prev + 10, 100));
      }, 80);
    }
    return () => clearTimeout(timer);
  }, [isDomainActive, domainProgress]);

  // Handle Dragon Ball Scouter scan
  const handleScouterScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      // Generate funny high power levels
      const basePower = 9000;
      const extraPower = Math.floor(Math.random() * 8000) + 1;
      setScanResult(basePower + extraPower);
    }, 1500);
  };

  // Filter products matching this collection
  const collectionProducts = products.filter((p) => {
    const matchesTag = p.category === collection.tag || p.tags.includes(collection.tag);
    const matchesSearch = searchQuery.trim() === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesSub = true;
    if (activeSubFilter !== 'All') {
      matchesSub = p.tags.includes(activeSubFilter) || p.badge === activeSubFilter;
    }
    
    return matchesTag && matchesSearch && matchesSub;
  });

  // Unique sub-filters / style tags parsed from matching products
  const uniqueTags = ['All', ...Array.from(new Set(
    products
      .filter((p) => p.category === collection.tag || p.tags.includes(collection.tag))
      .flatMap((p) => p.tags)
      .slice(0, 4)
  ))];

  // Specific quotes and editorial specs per collection
  const getCollectionEditorial = () => {
    switch (collection.id) {
      case 'naruto':
        return {
          slogan: "SHINOBI CHAKRA DESIGN GRID",
          quote: "I never go back on my word... that's my nindo, my ninja way!",
          speaker: "Naruto Uzumaki",
          description: "Engineered with heavy flat ink-weight, sacred spiral seal designs, and dynamic brush strokes. Optimized for print-on-demand oversized blanks.",
          accentColor: "#f59e0b",
          glowingAccent: "rgba(245, 158, 11, 0.15)",
          vibeTag: "Sage Ink Separation",
          guideline: "Ideal on Heavy Black Cotton or Distressed Sandstone blanks. Minimum recommended DPI is 300 with 100% CMYK color nodes."
        };
      case 'one-piece':
        return {
          slogan: "GRAND LINE MARITIME BLUEPRINTS",
          quote: "Inherited Will, the Destiny of Age, and the Dreams of People. As long as people continue to pursue freedom, these things will never cease to exist!",
          speaker: "Gol D. Roger",
          description: "Jolly roger vectors, rough maritime borders, and deep nautical splash ink-masks. Hand-drawn brush vectors crafted by veteran print illustrators.",
          accentColor: "#3b82f6",
          glowingAccent: "rgba(59, 130, 246, 0.15)",
          vibeTag: "Grand Line Vectors",
          guideline: "Perfect for deep vintage washing, stonewashed blue or washed anthracite garments. Set half-tone screen print frequencies to 45 LPI."
        };
      case 'demon-slayer':
        return {
          slogan: "NICHIRIN ELEMENTAL PATTERNS",
          quote: "No matter how many people you may lose, you have no choice but to go on living.",
          speaker: "Tanjiro Kamado",
          description: "Traditional woodblock woodcut curves, neon breathing wave arrays, and sharp kanji character stamps. Designed to maintain razor-thin white borders.",
          accentColor: "#0ea5e9",
          glowingAccent: "rgba(14, 165, 233, 0.15)",
          vibeTag: "Breath Vector Nodes",
          guideline: "Prints best on solid dark navy or pristine off-white blanks. Use premium water-based discharge ink for that buttery-soft hand feel."
        };
      case 'attack-on-titan':
        return {
          slogan: "RUMBLING LITHOGRAPH VECTORS",
          quote: "If you win, you live. If you lose, you die. If you don't fight, you can't win!",
          speaker: "Eren Yeager",
          description: "Anatomically rigorous sketch work, industrial steam vent gradients, and historic gothic fonts. High tension vector lines built for fast separation.",
          accentColor: "#ef4444",
          glowingAccent: "rgba(239, 68, 68, 0.15)",
          vibeTag: "Colossal Cross-hatching",
          guideline: "Excellent on heavy coal black oversizes or forest-green canvas jackets. Best cured with dual heater zones at exactly 320°F."
        };
      case 'jujutsu-kaisen':
        return {
          slogan: "MALEVOLENT CURSED MATRICES",
          quote: "Throughout Heaven and Earth, I alone am the honored one.",
          speaker: "Satoru Gojo",
          description: "Modern street style typography, domain barrier frame overlays, and cursed eye contours. Infused with toxic neo-noir purple tones.",
          accentColor: "#a855f7",
          glowingAccent: "rgba(168, 85, 247, 0.15)",
          vibeTag: "Domain Vector Stamp",
          guideline: "Fabulous on deep violet or washed ash grey. Recommend soft plastisol or high-density silicone prints for an elevated raised texture."
        };
      case 'dragon-ball':
        return {
          slogan: "SAIYAN RETRO SCENIC RADAR",
          quote: "Even a low-class warrior can surpass an elite if he trains hard enough!",
          speaker: "Goku",
          description: "Vintage 90s power level monitors, aura storm waves, and radar HUD tracking outlines. High contrast, low bleed print setups.",
          accentColor: "#f97316",
          glowingAccent: "rgba(249, 115, 22, 0.15)",
          vibeTag: "Electric Scouter Grid",
          guideline: "Great for bright orange or crisp black fleece hoodies. For vector prints, scale SVG files without limit on any wide-format garment printer."
        };
      case 'bleach':
        return {
          slogan: "SOUL REAPER BLACK-INK SEPARATION",
          quote: "If I don't wield the sword, I can't protect you. If I keep wielding the sword, I can't embrace you.",
          speaker: "Ichigo Kurosaki",
          description: "High-contrast monochromatic hollow mask illustrations, distressed brush strokes, and sharp kanji. Absolute zero flat vector curves.",
          accentColor: "#64748b",
          glowingAccent: "rgba(100, 116, 139, 0.15)",
          vibeTag: "Hollow Mask Monochrome",
          guideline: "Strictly suited for heavy pitch black or bleach-splattered white garments. Recommended mesh count is 230 to retain high calligraphy details."
        };
      case 'death-note':
      default:
        return {
          slogan: "GOTHIC FEATHER SHADOW GRIDS",
          quote: "This world is rotten, and those who are making it rotten deserve to die.",
          speaker: "Light Yagami",
          description: "Stark feathered wings silhouettes, gothic Old English fonts, and high contrast crimson pixel graphics. Designed for dramatic apparel focal points.",
          accentColor: "#1e293b",
          glowingAccent: "rgba(30, 41, 59, 0.15)",
          vibeTag: "Gothic Typo Layout",
          guideline: "Perfect on bone-white cotton, slate grey, or solid vintage black. Ensure fine serif line elements are printed with high tension screens."
        };
    }
  };

  const editorial = getCollectionEditorial();

  // Selected note rules content
  const deathNoteRules = [
    { rule: "THE LAYOUT MESH RULE", detail: "A vector line whose thickness is less than 0.15pt shall fade and fail to print within 40 seconds of exposure to standard emulsified mesh." },
    { rule: "THE COLOR SEPARATION RULE", detail: "Designs containing red moons and dark silhouettes must be screen separated using a clear white flash underbase before applying crimson pigments." },
    { rule: "THE CMYK VOW OF DENSITY", detail: "The printer who uploads low resolution JPEG graphics on high-end merch is committing an irreversible offense. Vectors must remain pure SVG/EPS." },
    { rule: "THE BLEACH SPLATTER OATH", detail: "If a gothic design is printed on a heavy black blank, a manual bleach wash surrounding the borders will multiply the retail value tenfold." }
  ];

  return (
    <div 
      className={`min-h-screen py-10 transition-colors duration-500 font-sans ${isBankaiActive ? 'bg-[#050800] text-[#aaff00]' : 'bg-neutral-50 text-[#0d1400]'}`}
      style={{
        backgroundImage: isBankaiActive 
          ? 'radial-gradient(circle at 10% 20%, rgba(170, 255, 0, 0.03) 0%, transparent 40%)'
          : `radial-gradient(circle at 10% 20%, ${editorial.glowingAccent} 0%, transparent 45%)`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        
        {/* Navigation & Back Header */}
        <div className="flex items-center justify-between border-b border-[#0d1400]/10 pb-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-all rounded-full font-mono text-xs uppercase tracking-wider font-bold cursor-pointer bg-white text-[#0d1400]"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO BROWSE
          </button>
          
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            <span>COLLECTION INDEX:</span>
            <span className="font-bold text-[#0d1400] px-2 py-0.5 bg-[#aaff00] border border-[#0d1400] rounded-sm">
              {collection.id.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Dynamic Theme Banner / Hero for the Anime Collection */}
        {isLoading ? (
          <div className="relative border border-[#0d1400]/10 overflow-hidden p-6 md:p-12 rounded-[20px] flex flex-col justify-between min-h-[340px] bg-white animate-pulse">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <div className="h-6 w-48 bg-[#0d1400]/10 rounded-full" />
                <div className="h-3.5 w-32 bg-[#0d1400]/5 rounded" />
              </div>
              <div className="text-right space-y-2">
                <div className="h-3.5 w-24 bg-[#0d1400]/5 rounded ml-auto" />
                <div className="h-8 w-28 bg-[#0d1400]/10 rounded ml-auto" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mt-8">
              <div className="md:col-span-7 space-y-4">
                <div className="h-12 w-3/4 bg-[#0d1400]/10 rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-[#0d1400]/5 rounded" />
                  <div className="h-4 w-5/6 bg-[#0d1400]/5 rounded" />
                </div>
              </div>
              <div className="md:col-span-5 border-l-2 border-[#aaff00]/20 pl-6 py-2 space-y-2 bg-neutral-50/50 rounded-r-lg p-3">
                <div className="h-3 w-full bg-[#0d1400]/5 rounded" />
                <div className="h-3 w-5/6 bg-[#0d1400]/5 rounded" />
                <div className="h-2.5 w-1/3 bg-[#0d1400]/5 rounded" />
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="relative border border-[#0d1400] overflow-hidden p-6 md:p-12 transition-all duration-500 rounded-[20px] shadow-xs flex flex-col justify-between min-h-[340px] bg-white"
            style={{
              borderColor: isBankaiActive ? '#aaff00' : '#0d1400',
              boxShadow: isBankaiActive ? '0 0 20px rgba(170, 255, 0, 0.2)' : 'none'
            }}
          >
            {/* Subtle stylized logo background watermark */}
            <div className="absolute right-0 bottom-0 opacity-10 font-display font-extrabold text-[120px] md:text-[200px] leading-none select-none pointer-events-none transform translate-y-12 translate-x-12 uppercase">
              {collection.id.slice(0, 3)}
            </div>

            {/* Top tagline and active count badge */}
            <div className="flex justify-between items-start gap-4 z-10">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 bg-[#0d1400] text-white text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                  <Zap className="w-3 h-3 text-[#aaff00] fill-current" />
                  {editorial.slogan}
                </span>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-1 block">
                  PEER-VETTED MERCHANDISE PACKS
                </p>
              </div>
              
              <div className="text-right">
                <span className="text-xs font-mono font-bold block">LICENSING DIRECTORY</span>
                <span className="text-3xl font-display font-bold text-[#0d1400] block">{collection.count}+ VECTORS</span>
              </div>
            </div>

            {/* Main Title, description, and quotes block */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mt-8 z-10">
              <div className="md:col-span-7 space-y-4">
                <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter text-[#0d1400] leading-none uppercase">
                  {collection.name}
                </h1>
                <p className="text-sm text-neutral-600 max-w-xl font-sans leading-relaxed">
                  {editorial.description}
                </p>
              </div>

              <div className="md:col-span-5 border-l-2 border-[#aaff00] pl-6 py-2 space-y-2 bg-neutral-50/50 rounded-r-lg p-3">
                <p className="text-xs italic text-neutral-700 font-sans leading-relaxed">
                  "{editorial.quote}"
                </p>
                <p className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                  — {editorial.speaker} // SERIES ANTHOLOGY
                </p>
              </div>
            </div>
          </div>
        )}

        {/* INTERACTIVE CUSTOM COMPONENT CORNER - UNIQUE TO EVERY SINGLE ANIME */}
        {isLoading ? (
          <div className="border border-[#0d1400]/10 bg-white rounded-[16px] overflow-hidden flex flex-col md:flex-row animate-pulse">
            <div className="p-6 md:p-8 md:w-2/5 border-b md:border-b-0 md:border-r border-[#0d1400]/10 flex flex-col justify-between space-y-6 bg-neutral-50">
              <div className="space-y-3">
                <div className="h-5 w-28 bg-[#0d1400]/10 rounded" />
                <div className="h-7 w-48 bg-[#0d1400]/10 rounded" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-[#0d1400]/5 rounded" />
                  <div className="h-3.5 w-5/6 bg-[#0d1400]/5 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-[#0d1400]/5 rounded" />
                <div className="h-4 w-32 bg-[#0d1400]/10 rounded" />
              </div>
            </div>
            <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-center items-center space-y-4 min-h-[220px]">
              <div className="h-10 w-48 bg-[#0d1400]/10 rounded-full animate-pulse" />
              <div className="h-16 w-full max-w-sm bg-[#0d1400]/5 rounded-xl border border-[#0d1400]/5" />
            </div>
          </div>
        ) : (
          <div className="border border-[#0d1400] bg-white rounded-[16px] overflow-hidden flex flex-col md:flex-row">
            {/* Left panel describing the interactive tool */}
            <div className="p-6 md:p-8 md:w-2/5 border-b md:border-b-0 md:border-r border-[#0d1400] flex flex-col justify-between space-y-6 bg-neutral-50">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-[#0d1400] px-2.5 py-0.5 bg-[#aaff00] border border-[#0d1400] rounded-sm">
                  SERIES-SPECIFIC PLAYGROUND
                </div>
                <h3 className="font-display font-bold text-xl text-[#0d1400] tracking-tight">
                  {collection.id === 'naruto' && "Ninja Chakra Aura Infusion"}
                  {collection.id === 'one-piece' && "Grand Line Bounty System"}
                  {collection.id === 'demon-slayer' && "Nichirin Breathing Art Style Matrix"}
                  {collection.id === 'attack-on-titan' && "Rumbling Screen Ink Thermometer"}
                  {collection.id === 'jujutsu-kaisen' && "Domain Expansion Vector Simulator"}
                  {collection.id === 'dragon-ball' && "Saiyan Scouter Radar Scanner"}
                  {collection.id === 'bleach' && "Bankai Hollow-Invert Protocol"}
                  {collection.id === 'death-note' && "The Shinigami Notebook Code"}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                  Each core collection features a tailored simulator built specifically for POD apparel creators to calibrate layouts, colors, curing heat, or check high-power vector specifications!
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#0d1400]/10">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">VIBE PROTOCOL:</span>
                <span className="text-xs font-mono font-bold text-[#0d1400] flex items-center gap-1.5 uppercase">
                  <Shield className="w-4 h-4 text-[#aaff00] fill-current stroke-[#0d1400]" />
                  {editorial.vibeTag}
                </span>
              </div>
            </div>

            {/* Right panel hosting the custom interactive UI */}
            <div className="p-6 md:p-8 md:w-3/5 flex items-center justify-center min-h-[220px]">
              
              {/* Naruto Interactive Playground */}
              {collection.id === 'naruto' && (
                <div className="w-full space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-[#0d1400] uppercase font-bold">Chakra Aura Glow ({auraLevel}%)</label>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={auraLevel}
                        onChange={(e) => setAuraLevel(Number(e.target.value))}
                        className="w-full accent-[#0d1400] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-[#0d1400] uppercase font-bold">Aura Signature</label>
                      <div className="flex gap-1">
                        {['Nine-Tails Red', 'Sage Orange', 'Chidori Blue'].map((sig) => (
                          <button
                            key={sig}
                            onClick={() => setChakraColor(sig)}
                            className={`px-2 py-1 text-[9px] font-mono border rounded uppercase font-bold transition-all ${chakraColor === sig ? 'bg-[#0d1400] text-[#aaff00]' : 'bg-white text-neutral-500 hover:border-neutral-400'}`}
                          >
                            {sig.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Simulated Glowing Mockup Canvas */}
                  <div className="border border-[#0d1400] p-4 bg-neutral-900 rounded-xl relative overflow-hidden flex items-center justify-between">
                    <div className="space-y-1 z-10">
                      <p className="text-[10px] text-[#aaff00] font-mono uppercase tracking-widest font-bold">AURA GLOW ANALYSIS</p>
                      <p className="text-xs text-white max-w-xs font-sans">
                        With {auraLevel}% {chakraColor} glow. Output files include dedicated neon layer maps for secondary screen sweeps.
                      </p>
                    </div>
                    {/* Dynamic glowing core circle */}
                    <div 
                      className="w-16 h-16 rounded-full shrink-0 animate-pulse transition-all"
                      style={{
                        backgroundColor: chakraColor === 'Nine-Tails Red' ? '#ff2a3b' : chakraColor === 'Sage Orange' ? '#ffedd5' : '#3b82f6',
                        boxShadow: `0 0 ${auraLevel / 2}px ${auraLevel / 3}px ${chakraColor === 'Nine-Tails Red' ? '#ff2a3b' : chakraColor === 'Sage Orange' ? '#f59e0b' : '#3b82f6'}`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* One Piece Interactive Playground */}
              {collection.id === 'one-piece' && (
                <div className="w-full space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-[#0d1400] uppercase font-bold">WANTED PIRATE CODENAME</label>
                      <input 
                        type="text" 
                        value={bountyName}
                        onChange={(e) => setBountyName(e.target.value.toUpperCase())}
                        placeholder="e.g. STRAW HAT LUFFY"
                        className="w-full px-3 py-1.5 border border-[#0d1400] rounded-full text-xs font-mono bg-white uppercase text-[#0d1400]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-[#0d1400] uppercase font-bold">Berry Bounty Estimator</label>
                      <input 
                        type="range" 
                        min="30000000" 
                        max="5000000000" 
                        step="50000000"
                        value={bountyVal}
                        onChange={(e) => setBountyVal(Number(e.target.value))}
                        className="w-full accent-[#0d1400] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Wanted Poster Card Mockup */}
                  <div className="border border-[#0d1400] p-4 bg-amber-50 rounded-xl flex gap-4 items-center">
                    <div className="w-12 h-16 border border-[#0d1400] bg-yellow-100 flex items-center justify-center font-display font-extrabold text-neutral-700 text-center text-xs shrink-0 rounded uppercase">
                      Dead or Alive
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">GRAND LINE WARRANT</p>
                      <p className="text-xs font-bold font-display text-[#0d1400]">{bountyName || "WANTED REBEL"}</p>
                      <p className="text-xs font-mono font-bold text-[#b91c1c]">
                        ฿ {bountyVal.toLocaleString()} BERRY
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Demon Slayer Interactive Playground */}
              {collection.id === 'demon-slayer' && (
                <div className="w-full space-y-4">
                  <p className="text-[10px] font-mono text-[#0d1400] uppercase font-bold mb-1">SELECT BREATHING ELEMENTAL STYLE</p>
                  <div className="grid grid-cols-4 gap-2">
                    {['Water', 'Thunder', 'Flame', 'Beast'].map((form) => (
                      <button
                        key={form}
                        onClick={() => setBreathingForm(form)}
                        className={`py-2 text-[10px] font-mono border rounded-lg font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${breathingForm === form ? 'bg-[#0d1400] text-white border-[#0d1400]' : 'bg-neutral-50 hover:bg-neutral-100 text-[#0d1400]'}`}
                      >
                        <Zap className={`w-3.5 h-3.5 ${form === 'Water' ? 'text-blue-500' : form === 'Thunder' ? 'text-yellow-400' : form === 'Flame' ? 'text-red-500' : 'text-emerald-500'}`} />
                        {form}
                      </button>
                    ))}
                  </div>

                  <div className="p-3.5 border border-[#0d1400] bg-white rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-mono text-[9px] text-neutral-400 uppercase">RECOMMENDED MERCH FABRIC</p>
                      <p className="font-bold font-display text-[#0d1400] mt-0.5">
                        {breathingForm === 'Water' && "Deep Ocean Navy Blanks"}
                        {breathingForm === 'Thunder' && "Washed Ash Charcoal"}
                        {breathingForm === 'Flame' && "Stark Pitch Jet Black"}
                        {breathingForm === 'Beast' && "Vintage Sandstone Canvas"}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-[#aaff00] border border-[#0d1400] px-2 py-0.5 rounded font-bold">
                      300 DPI READY
                    </span>
                  </div>
                </div>
              )}

              {/* Attack on Titan Interactive Playground */}
              {collection.id === 'attack-on-titan' && (
                <div className="w-full space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                      <span className="uppercase text-[#0d1400]">INK DRYING TEMPERATURE</span>
                      <span className="text-[#ef4444]">{cureTemp}°F</span>
                    </div>
                    <input 
                      type="range" 
                      min="260" 
                      max="400" 
                      value={cureTemp}
                      onChange={(e) => setCureTemp(Number(e.target.value))}
                      className="w-full accent-[#0d1400] cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 border border-[#0d1400] bg-white rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${cureTemp < 300 ? 'bg-yellow-500' : cureTemp > 360 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} 
                      />
                      <div>
                        <p className="font-mono text-[9px] text-neutral-400 uppercase">HEAT SINTER STATE</p>
                        <p className="font-bold text-[#0d1400] mt-0.5">
                          {cureTemp < 300 && "Under-cured: ink will wash out!"}
                          {cureTemp >= 300 && cureTemp <= 360 && "Perfect Sinter: optimal wash durability!"}
                          {cureTemp > 360 && "Over-burned: garment fibers scorched!"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                      {cureTemp < 300 ? 'WARNING' : cureTemp > 360 ? 'DANGER' : 'OPTIMAL'}
                    </span>
                  </div>
                </div>
              )}

              {/* Jujutsu Kaisen Interactive Playground */}
              {collection.id === 'jujutsu-kaisen' && (
                <div className="w-full space-y-4">
                  <p className="text-[10px] font-mono text-[#0d1400] uppercase font-bold text-center">CURSED ENERGY EXPANSION CONSOLE</p>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setIsDomainActive(true);
                        setDomainProgress(0);
                      }}
                      className="px-6 py-2.5 bg-[#a855f7] hover:bg-[#aaff00] hover:text-[#0d1400] text-white border border-[#0d1400] rounded-full text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                    >
                      {isDomainActive && domainProgress < 100 ? "UNLEASHING DOMAIN..." : "ACTIVATE DOMAIN EXPANSION"}
                    </button>
                  </div>

                  {/* Expansion progress bar */}
                  {isDomainActive && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <div className="flex justify-between items-center text-[9px] font-mono text-neutral-400 uppercase">
                        <span>Cursed Energy Barrier Status</span>
                        <span>{domainProgress}% Locked</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 border border-[#0d1400] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#a855f7] transition-all duration-100"
                          style={{ width: `${domainProgress}%` }}
                        />
                      </div>
                      {domainProgress === 100 && (
                        <p className="text-[10px] text-[#a855f7] font-mono font-bold text-center mt-1 uppercase">
                          ★ Malevolent Shrine has locked down your POD workspace!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Dragon Ball Interactive Playground */}
              {collection.id === 'dragon-ball' && (
                <div className="w-full space-y-4">
                  <p className="text-[10px] font-mono text-[#0d1400] uppercase font-bold text-center">SAIYAN FORCE FIELD DECODER</p>
                  <div className="flex justify-center">
                    <button
                      onClick={handleScouterScan}
                      disabled={isScanning}
                      className="px-6 py-2.5 bg-[#f97316] text-white border border-[#0d1400] rounded-full text-xs font-mono font-bold uppercase hover:bg-white hover:text-[#0d1400] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                      {isScanning ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin" />
                          SCANNING FORCE FIELDS...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          DECODE CURRENT DESIGN LEVEL
                        </>
                      )}
                    </button>
                  </div>

                  {isScanning && (
                    <div className="h-6 w-full bg-orange-50 border border-dashed border-[#f97316] rounded animate-pulse flex items-center justify-center text-[10px] font-mono text-[#f97316]">
                      SCANNING VECTOR NODES...
                    </div>
                  )}

                  {scanResult !== null && (
                    <div className="p-3 border-2 border-[#f97316] bg-amber-50 rounded-xl text-center space-y-1 animate-scaleIn">
                      <p className="text-[9px] font-mono text-[#f97316] uppercase font-bold">SCOUTER RESOLUTION METRICS</p>
                      <p className="font-display font-extrabold text-xl text-[#0d1400]">
                        POWER LEVEL: <span className="text-red-600">{scanResult.toLocaleString()}</span>
                      </p>
                      <p className="text-[10px] font-mono text-neutral-500 italic mt-0.5">
                        "Coded values are off the charts! This vector file is 100% ready for physical garments!"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Bleach Interactive Playground */}
              {collection.id === 'bleach' && (
                <div className="w-full space-y-4 text-center">
                  <p className="text-[10px] font-mono text-[#0d1400] uppercase font-bold">SOUL REAPER CONTRAST PROTOCOL</p>
                  <h4 className="font-display font-bold text-base text-[#0d1400]">
                    {isBankaiActive ? "★ BANKAI MONOCHROME MODE ACTIVATED ★" : "RELEASE HOLLOW BANKAI INVERSION"}
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto font-sans">
                    Click the button below to toggle the ultimate dark/light ink inversion mode. It showcases how bleach-splatters look on pitch black garments!
                  </p>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setIsBankaiActive(!isBankaiActive)}
                      className={`px-6 py-2.5 border rounded-full text-xs font-mono font-bold uppercase transition-all cursor-pointer ${isBankaiActive ? 'bg-[#aaff00] text-[#0d1400] border-[#aaff00]' : 'bg-[#0d1400] text-white border-[#0d1400] hover:bg-white hover:text-[#0d1400]'}`}
                    >
                      {isBankaiActive ? "SEAL BANKAI ENERGY" : "EXECUTE BANKAI RELEASE"}
                    </button>
                  </div>
                </div>
              )}

              {/* Death Note Interactive Playground */}
              {collection.id === 'death-note' && (
                <div className="w-full space-y-3">
                  <p className="text-[10px] font-mono text-[#0d1400] uppercase font-bold">THE SHINIGAMI APPAREL RULEBOOK</p>
                  
                  {/* Rule pills */}
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {[0, 1, 2, 3].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedNoteRule(idx)}
                        className={`px-3 py-1 border text-[9px] font-mono uppercase font-bold transition-all rounded-full cursor-pointer ${selectedNoteRule === idx ? 'bg-[#0d1400] text-[#aaff00] border-[#0d1400]' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-500 border-neutral-300'}`}
                      >
                        RULE {idx + 1}
                      </button>
                    ))}
                  </div>

                  {/* Selected Rule description box */}
                  <div className="p-4 border border-[#0d1400] bg-neutral-900 text-[#0d1400] rounded-xl font-mono text-[11px] leading-relaxed select-all">
                    <p className="text-[#aaff00] font-bold uppercase mb-1">{deathNoteRules[selectedNoteRule].rule}</p>
                    <p className="text-white italic">"{deathNoteRules[selectedNoteRule].detail}"</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* GUIDELINE BADGE BAR */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`guideline-skeleton-${idx}`} className="p-4 border border-[#0d1400]/10 bg-white rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0d1400]/5 shrink-0" />
                <div className="space-y-2 flex-1 animate-pulse">
                  <div className="h-3 w-20 bg-[#0d1400]/10 rounded" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-[#0d1400]/5 rounded" />
                    <div className="h-3 w-5/6 bg-[#0d1400]/5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-[#0d1400] bg-white rounded-xl flex items-start gap-3">
              <div className="p-2 border border-[#0d1400] rounded-lg bg-neutral-50 shrink-0 text-[#0d1400]">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <p className="font-mono text-[10px] text-neutral-400 uppercase font-bold">Vetted Print specs</p>
                <p className="text-xs text-[#0d1400] font-sans leading-relaxed mt-0.5">
                  {editorial.guideline}
                </p>
              </div>
            </div>

            <div className="p-4 border border-[#0d1400] bg-white rounded-xl flex items-start gap-3">
              <div className="p-2 border border-[#0d1400] rounded-lg bg-neutral-50 shrink-0 text-[#0d1400]">
                <BadgeInfo className="w-4 h-4" />
              </div>
              <div>
                <p className="font-mono text-[10px] text-neutral-400 uppercase font-bold">Licensing scope</p>
                <p className="text-xs text-[#0d1400] font-sans leading-relaxed mt-0.5">
                  Each download includes non-exclusive rights for infinite prints, standard DTG separates, and raw vector trace files.
                </p>
              </div>
            </div>

            <div className="p-4 border border-[#0d1400] bg-white rounded-xl flex items-start gap-3">
              <div className="p-2 border border-[#0d1400] rounded-lg bg-neutral-50 shrink-0 text-[#0d1400]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-mono text-[10px] text-neutral-400 uppercase font-bold">POD-Ready Guarantee</p>
                <p className="text-xs text-[#0d1400] font-sans leading-relaxed mt-0.5">
                  Coded files are 100% background-cleared. No stray pixels or fuzzy halos. Zero-bleed guaranteed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collection specific product results and catalog title */}
        <div className="space-y-6">
          <div className="border-b border-[#0d1400] pb-4 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight">
                Design Catalog ({collectionProducts.length})
              </h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                EXCLUSIVE VECTORS TAGGED WITH "{collection.tag.toUpperCase()}"
              </p>
            </div>

            {/* Collection inner filter search */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Inner search input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="px-4 py-2 border border-[#0d1400] rounded-full text-xs font-mono uppercase tracking-wider bg-white text-[#0d1400] w-full sm:w-60 focus:outline-hidden"
              />

              {/* Sub tag pills */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {uniqueTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveSubFilter(tag)}
                    className={`px-3 py-1.5 text-[9px] font-mono border uppercase font-bold rounded-full cursor-pointer transition-all ${activeSubFilter === tag ? 'bg-[#0d1400] text-white border-[#0d1400]' : 'bg-white text-neutral-500 hover:border-[#0d1400]'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Collection products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={`collection-product-skeleton-${idx}`}
                  className="border border-[#0d1400]/10 bg-white overflow-hidden flex flex-col justify-between animate-pulse"
                  style={{ borderRadius: '12px' }}
                >
                  {/* Image Box Skeleton */}
                  <div className="relative aspect-square border-b border-[#0d1400]/5 bg-neutral-50/70 p-6 flex items-center justify-center">
                    <div className="w-2/3 h-2/3 bg-[#0d1400]/5 rounded-xl border border-[#0d1400]/5 animate-pulse"></div>
                  </div>

                  {/* Text Specs Skeleton */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        {/* Category Skeleton */}
                        <div className="h-2.5 w-16 bg-[#0d1400]/5 rounded font-mono"></div>
                        {/* Downloads Skeleton */}
                        <div className="h-2.5 w-12 bg-[#0d1400]/5 rounded font-mono"></div>
                      </div>
                      {/* Title Skeleton */}
                      <div className="h-4 w-3/4 bg-[#0d1400]/10 rounded font-display"></div>
                      {/* Creator Name Skeleton */}
                      <div className="h-3 w-1/3 bg-[#0d1400]/5 rounded font-mono"></div>
                    </div>

                    {/* Foot pricing actions Skeleton */}
                    <div className="flex items-center justify-between border-t border-[#0d1400]/5 pt-3 mt-auto">
                      {/* Price Skeleton */}
                      <div className="h-4 w-12 bg-[#0d1400]/10 rounded font-mono"></div>
                      {/* Favorite Button Skeleton */}
                      <div className="h-7 w-7 bg-[#0d1400]/5 rounded border border-[#0d1400]/5"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : collectionProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center border border-dashed border-[#0d1400]/20 space-y-2">
                <HelpCircle className="w-8 h-8 mx-auto text-neutral-300 animate-bounce" />
                <h4 className="font-display font-bold text-base">No designs found matching filters</h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto font-sans leading-relaxed">
                  Try clearing your search query or switching the tag pills to explore other related designs.
                </p>
              </div>
            ) : (
              collectionProducts.map((product) => {
                const isFav = favorites.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group border border-[#0d1400] bg-white overflow-hidden transition-all duration-300 hover:border-[#aaff00] flex flex-col justify-between hover:shadow-md"
                    style={{ borderRadius: '12px' }}
                  >
                    {/* Graphic Canvas Render block */}
                    <div 
                      onClick={() => onSelectProduct(product)}
                      className="relative aspect-square border-b border-[#0d1400]/10 bg-neutral-50 p-6 flex items-center justify-center cursor-pointer overflow-hidden"
                    >
                      <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-[1.04]">
                        <DesignRenderer imageKey={product.imageKey} className="w-full h-full object-contain" />
                      </div>

                      {/* Corner tag Badges */}
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-[#0d1400] text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5">
                          {product.badge}
                        </span>
                      )}

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-[#0d1400]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white border border-[#0d1400] px-4 py-2 text-xs font-mono font-bold text-[#0d1400] uppercase tracking-wider rounded-full">
                          Open Specs
                        </span>
                      </div>
                    </div>

                    {/* Text specs */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                            {product.category}
                          </span>
                          <span className="text-xs font-mono text-neutral-500 flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5 opacity-60" />
                            {product.downloads.toLocaleString()}
                          </span>
                        </div>
                        
                        <h4 
                          onClick={() => onSelectProduct(product)}
                          className="font-display font-bold text-sm text-[#0d1400] line-clamp-1 hover:underline cursor-pointer"
                        >
                          {product.title}
                        </h4>
                        
                        <p className="text-[10px] font-mono text-neutral-400">
                          By @{product.creatorName}
                        </p>
                      </div>

                      {/* Foot pricing actions */}
                      <div className="flex items-center justify-between border-t border-[#0d1400]/5 pt-3 mt-auto">
                        <span className="font-mono font-bold text-sm text-[#0d1400]">
                          ${product.price.toFixed(2)}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => onToggleFavorite(product.id)}
                            className={`p-1.5 border rounded-lg cursor-pointer ${isFav ? 'bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444]' : 'border-[#0d1400]/10 text-neutral-400 hover:text-[#0d1400] hover:border-[#0d1400]'} transition-colors`}
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                          
                          <button
                            onClick={() => onPurchase(product)}
                            className="px-3.5 py-1.5 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] transition-colors font-mono font-bold text-[10px] uppercase rounded-lg border border-[#0d1400] cursor-pointer"
                          >
                            License
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
