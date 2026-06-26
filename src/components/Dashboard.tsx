import React, { useState } from 'react';
import { Product, SaleRecord, UserProfile } from '../types';
import { PRODUCTS } from '../data';
import { DesignRenderer } from './DesignRenderer';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  Plus, TrendingUp, Download, DollarSign, Layers, Trash2, 
  Settings, CheckCircle, RefreshCw, AlertCircle, Share2, Copy, FilePlus, Calendar, Zap,
  UploadCloud
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface DashboardProps {
  onAddProduct: (newProduct: Product) => void;
  creatorProducts: Product[];
  onDeleteProduct: (id: string) => void;
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  onUpgradeToCreator: () => Promise<void>;
}

// Initial sales seed data for charts
const ANALYTICS_DATA = [
  { name: 'Jan', sales: 4200, downloads: 140 },
  { name: 'Feb', sales: 5100, downloads: 170 },
  { name: 'Mar', sales: 6200, downloads: 210 },
  { name: 'Apr', sales: 5800, downloads: 195 },
  { name: 'May', sales: 7400, downloads: 245 },
  { name: 'Jun', sales: 9100, downloads: 310 },
];

export const Dashboard: React.FC<DashboardProps> = ({
  onAddProduct,
  creatorProducts,
  onDeleteProduct,
  user,
  userProfile,
  onUpgradeToCreator
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'upload' | 'payouts' | 'affiliate'>('overview');
  
  // Dynamic Live Calculations for Analytics
  const isMockTanaka = !user || user.uid === 'c1';
  
  const liveDownloads = isMockTanaka 
    ? 1245 
    : creatorProducts.reduce((sum, p) => sum + (p.downloads || 0), 0);
    
  const liveRevenue = isMockTanaka 
    ? 37840 
    : creatorProducts.reduce((sum, p) => sum + ((p.downloads || 0) * p.price), 0);
    
  const liveAffiliateRevenue = isMockTanaka ? 2150 : 0;
  const liveReferralsCount = isMockTanaka ? 23 : 0;

  const liveAnalyticsData = isMockTanaka
    ? ANALYTICS_DATA
    : [
        { name: 'Jan', sales: 0, downloads: 0 },
        { name: 'Feb', sales: 0, downloads: 0 },
        { name: 'Mar', sales: Math.round(liveRevenue * 0.15), downloads: Math.round(liveDownloads * 0.15) },
        { name: 'Apr', sales: Math.round(liveRevenue * 0.25), downloads: Math.round(liveDownloads * 0.25) },
        { name: 'May', sales: Math.round(liveRevenue * 0.25), downloads: Math.round(liveDownloads * 0.25) },
        { name: 'Jun', sales: Math.round(liveRevenue * 0.35), downloads: Math.round(liveDownloads * 0.35) },
      ];

  const liveTransactions = isMockTanaka 
    ? [
        { title: 'Minimalist Samurai Crimson Moon', subtitle: 'United States • Commercial License', amount: 29.00 },
        { title: 'Cursed King Eyes & Domain Stamp', subtitle: 'United Kingdom • Extended License', amount: 60.00 },
        { title: 'The Great Straw Hat Jolly Roger', subtitle: 'Germany • Commercial License', amount: 35.00 },
      ]
    : creatorProducts
        .filter(p => (p.downloads || 0) > 0)
        .flatMap((p) => {
          const locations = ['United States', 'Japan', 'United Kingdom', 'Germany', 'France', 'Australia', 'Canada'];
          const licenses = ['Commercial License', 'Extended License', 'Personal Use License'];
          const txs = [];
          const limit = Math.min(p.downloads || 0, 3);
          for (let i = 0; i < limit; i++) {
            const loc = locations[(p.title.length + i) % locations.length];
            const lic = licenses[(Math.round(p.price) + i) % licenses.length];
            txs.push({
              title: p.title,
              subtitle: `${loc} • ${lic}`,
              amount: p.price,
            });
          }
          return txs;
        })
        .slice(0, 5);
  
  // Upload Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Streetwear');
  const [price, setPrice] = useState('29.00');
  const [tags, setTags] = useState('Samurai, Streetwear, Cyberpunk');
  const [description, setDescription] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['PNG', 'SVG', 'AI', 'EPS']);
  const [selectedImageKey, setSelectedImageKey] = useState<string>('samurai_crimson');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Payout Form State
  const [payoutMethod, setPayoutMethod] = useState<'paypal' | 'stripe'>('paypal');
  const [payoutAccount, setPayoutAccount] = useState('hiroshi.tanaka@designstudio.jp');
  const [payoutAmount, setPayoutAmount] = useState('500');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutHistory, setPayoutHistory] = useState<any[]>([
    { id: 'TX-9011', date: '2026-05-15', amount: 840, method: 'PayPal', status: 'Completed' },
    { id: 'TX-8742', date: '2026-04-10', amount: 1250, method: 'PayPal', status: 'Completed' },
    { id: 'TX-7622', date: '2026-03-01', amount: 610, method: 'Stripe Connect', status: 'Completed' },
  ]);

  // Affiliate State
  const [copiedCode, setCopiedCode] = useState(false);
  const [referralPackDownloaded, setReferralPackDownloaded] = useState(false);
  const affiliateLink = 'https://inkwave.com/join?ref=tanaka99';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadReferralPack = () => {
    setReferralPackDownloaded(true);
    setTimeout(() => setReferralPackDownloaded(false), 3000);
  };

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, or SVG).');
      return;
    }
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        setSelectedImageKey(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !description.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const newProduct: Product = {
        id: `custom-p-${Date.now()}`,
        title,
        category,
        tags: tagsArray,
        price: parseFloat(price) || 29,
        downloads: 0,
        likes: 0,
        rating: 5.0,
        reviewsCount: 0,
        imageKey: selectedImageKey,
        creatorId: user ? user.uid : 'c1',
        creatorName: userProfile?.displayName || user?.displayName || 'InkWave',
        description,
        fileFormats: selectedFormats,
        includedFiles: selectedFormats.map((f) => {
          if (f === 'PNG') return 'Transparent PNG (4500x5400px, 300 DPI)';
          if (f === 'SVG') return 'Scalable Vector SVG';
          if (f === 'AI') return 'Adobe Illustrator Source (.ai)';
          if (f === 'EPS') return 'Encapsulated PostScript (.eps)';
          return `${f} Asset Package`;
        }),
        createdAt: new Date().toISOString().split('T')[0]
      };

      onAddProduct(newProduct);
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('29.00');
      setSelectedImageKey('samurai_crimson');
      setUploadedFileName('');
      
      setTimeout(() => {
        setUploadSuccess(false);
        setActiveTab('portfolio');
      }, 1500);
    }, 1500);
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) return;

    setIsProcessingPayout(true);

    setTimeout(() => {
      const newTx = {
        id: `TX-${(Math.random() * 9000 + 1000).toFixed(0)}`,
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(payoutAmount),
        method: payoutMethod === 'paypal' ? 'PayPal' : 'Stripe Connect',
        status: 'Processing'
      };

      setPayoutHistory([newTx, ...payoutHistory]);
      setIsProcessingPayout(false);
      setPayoutSuccess(true);
      setPayoutAmount('');
      
      setTimeout(() => setPayoutSuccess(false), 3000);
    }, 2000);
  };

  const toggleFormat = (format: string) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter((f) => f !== format));
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  if (user && (!userProfile || userProfile.role !== 'creator')) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-16 text-[#0d1400]">
        <div className="border-4 border-[#0d1400] rounded-3xl bg-white p-8 md:p-12 space-y-8 shadow-2xl animate-fadeIn text-center relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-[#aaff00]"></div>
          
          <div className="max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 bg-[#0d1400] text-[#aaff00] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Layers className="w-10 h-10" />
            </div>
            
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 bg-[#aaff00] text-[#0d1400] text-xs font-mono uppercase tracking-widest font-black px-3.5 py-1.5 rounded-full border border-[#0d1400]">
                Buyer Account Verified
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight">
                Unlock Creator Studio
              </h2>
              <p className="text-sm text-neutral-500 font-sans leading-relaxed">
                Hi <span className="font-bold text-[#0d1400]">{userProfile.displayName || user?.email}</span>! Your account is currently set to a **Buyer Account** to browse and download high-resolution vector assets.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-y border-[#0d1400]/20 py-6 my-2">
              <div className="space-y-1">
                <span className="text-xs font-mono font-black uppercase tracking-wider block text-[#0d1400]">85% Royalties</span>
                <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">Retain direct earnings on all vector asset sales with zero hidden cuts.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-black uppercase tracking-wider block text-[#0d1400]">Analytics Hub</span>
                <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">Track views, downloads, likes, and payouts in real-time instantly.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-black uppercase tracking-wider block text-[#0d1400]">Creator Badge</span>
                <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">Get verified to showcase your designs to thousands of world-class brands.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={onUpgradeToCreator}
                className="w-full py-4 bg-[#0d1400] text-[#aaff00] hover:bg-[#aaff00] hover:text-[#0d1400] font-mono text-xs font-bold uppercase tracking-widest transition-all border-2 border-[#0d1400] rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4 fill-current" />
                Become an InkWave Creator
              </button>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                Instant activation • Start uploading your custom vector designs immediately
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 text-[#0d1400]">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#0d1400] pb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[#0d1400]">Creator Console</h2>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            CREATOR PROFILE: {userProfile?.displayName?.toUpperCase() || user?.displayName?.toUpperCase() || 'INKWAVE'} // @{userProfile?.displayName?.toLowerCase().replace(/\s+/g, '_') || user?.email?.split('@')[0] || 'creator_profile'}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('upload')}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] transition-colors text-xs font-mono font-bold tracking-wider uppercase rounded-full border border-[#0d1400] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Upload Design
        </button>
      </div>

      {/* Dashboard Sidebar Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-3 flex lg:flex-col overflow-x-auto lg:overflow-x-visible border border-[#0d1400] divide-x lg:divide-x-0 lg:divide-y divide-[#0d1400] bg-white rounded-[12px] overflow-hidden">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3.5 text-left text-xs font-mono font-bold uppercase tracking-wider shrink-0 w-full transition-colors cursor-pointer ${activeTab === 'overview' ? 'bg-[#0d1400] text-white' : 'hover:bg-neutral-50'}`}
          >
            Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-3.5 text-left text-xs font-mono font-bold uppercase tracking-wider shrink-0 w-full transition-colors cursor-pointer ${activeTab === 'portfolio' ? 'bg-[#0d1400] text-white' : 'hover:bg-neutral-50'}`}
          >
            My Designs ({creatorProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-3.5 text-left text-xs font-mono font-bold uppercase tracking-wider shrink-0 w-full transition-colors cursor-pointer ${activeTab === 'upload' ? 'bg-[#0d1400] text-white' : 'hover:bg-neutral-50'}`}
          >
            Upload New Vector
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-3.5 text-left text-xs font-mono font-bold uppercase tracking-wider shrink-0 w-full transition-colors cursor-pointer ${activeTab === 'payouts' ? 'bg-[#0d1400] text-white' : 'hover:bg-neutral-50'}`}
          >
            Payouts & Ledger
          </button>
          <button
            onClick={() => setActiveTab('affiliate')}
            className={`px-4 py-3.5 text-left text-xs font-mono font-bold uppercase tracking-wider shrink-0 w-full transition-colors cursor-pointer ${activeTab === 'affiliate' ? 'bg-[#0d1400] text-white' : 'hover:bg-neutral-50'}`}
          >
            Affiliate Program
          </button>
        </aside>

        {/* Dashboard Panels */}
        <main className="lg:col-span-9 bg-white border border-[#0d1400] p-6 md:p-8 rounded-[12px]">
          
          {/* TAB 1: OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-[#0d1400] bg-neutral-50/40 rounded-[12px]">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Total Revenue</span>
                  <p className="font-display font-bold text-2xl mt-1 text-[#0d1400] flex items-center">
                    <DollarSign className="w-5 h-5 opacity-60" />
                    {liveRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] font-mono text-[#aaff00] bg-[#0d1400] px-2 py-0.5 rounded-full font-bold mt-2 inline-block">
                    {isMockTanaka ? '+14.2% MoM' : 'Live Earnings'}
                  </span>
                </div>

                <div className="p-4 border border-[#0d1400] bg-neutral-50/40 rounded-[12px]">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Total Downloads</span>
                  <p className="font-display font-bold text-2xl mt-1 text-[#0d1400] flex items-center gap-1">
                    <Download className="w-5 h-5 opacity-60 text-[#0d1400]" />
                    {liveDownloads.toLocaleString()}
                  </p>
                  <span className="text-[10px] font-mono text-[#aaff00] bg-[#0d1400] px-2 py-0.5 rounded-full font-bold mt-2 inline-block">
                    {isMockTanaka ? '+8.5% MoM' : 'Live Downloads'}
                  </span>
                </div>

                <div className="p-4 border border-[#0d1400] bg-neutral-50/40 rounded-[12px]">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Active Artwork</span>
                  <p className="font-display font-bold text-2xl mt-1 text-[#0d1400] flex items-center gap-1.5">
                    <Layers className="w-5 h-5 opacity-60" />
                    {creatorProducts.length}
                  </p>
                  <span className="text-[10px] font-mono text-[#0d1400] border border-[#0d1400] px-2 py-0.5 rounded-full mt-2 inline-block">
                    100% Quality
                  </span>
                </div>

                <div className="p-4 border border-[#0d1400] bg-neutral-50/40 rounded-[12px]">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Affiliate Revenue</span>
                  <p className="font-display font-bold text-2xl mt-1 text-[#0d1400] flex items-center">
                    <DollarSign className="w-5 h-5 opacity-60" />
                    {liveAffiliateRevenue.toLocaleString()}
                  </p>
                  <span className="text-[10px] font-mono text-[#aaff00] bg-[#0d1400] px-2 py-0.5 rounded-full font-bold mt-2 inline-block">
                    {liveReferralsCount} Referrals
                  </span>
                </div>
              </div>

              {/* Chart widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-[#0d1400] rounded-[12px] space-y-4">
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0d1400]">Monthly Royalty Inflow ($)</h4>
                    <p className="text-[11px] text-neutral-400 font-mono">GROSS EARNINGS COLLECTED VIA STRIPE & PAYPAY</p>
                  </div>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={liveAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#aaff00" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#aaff00" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#0d1400" fontSize={10} fontFamily="monospace" />
                        <YAxis stroke="#0d1400" fontSize={10} fontFamily="monospace" />
                        <Tooltip />
                        <Area type="monotone" dataKey="sales" stroke="#0d1400" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 border border-[#0d1400] rounded-[12px] space-y-4">
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0d1400]">Licensed Downloads (#)</h4>
                    <p className="text-[11px] text-neutral-400 font-mono">CREATIVE ASSET LICENSES REDEEMED BY SHIPPERS</p>
                  </div>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={liveAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#0d1400" fontSize={10} fontFamily="monospace" />
                        <YAxis stroke="#0d1400" fontSize={10} fontFamily="monospace" />
                        <Tooltip />
                        <Bar dataKey="downloads" fill="#0d1400" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Real-time Sales Feed */}
              <div className="border border-[#0d1400] p-5 space-y-4 bg-neutral-50/20 rounded-[12px]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-neutral-600 shrink-0" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">Live Transaction Feed</span>
                </div>
                
                <div className="divide-y divide-[#0d1400]/10 text-xs">
                  {liveTransactions.length === 0 ? (
                    <div className="py-6 text-center text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
                      No purchases yet. Once buyers license your designs, your live stream will flow here!
                    </div>
                  ) : (
                    liveTransactions.map((tx, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center">
                        <div>
                          <span className="font-bold">{tx.title}</span>
                          <p className="text-[10px] text-neutral-400 font-mono uppercase mt-0.5">{tx.subtitle}</p>
                        </div>
                        <span className="font-mono font-bold text-[#aaff00] bg-[#0d1400] px-2 py-0.5 rounded-full border border-[#0d1400]">
                          +${tx.amount.toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO MANAGEMENT */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-lg font-bold text-[#0d1400]">My Uploaded Designs</h4>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  MANAGE PRODUCT VISIBILITY, DOWNLOAD STATISTICS, AND PRICE LISTS
                </p>
              </div>

              <div className="border border-[#0d1400] divide-y divide-[#0d1400] bg-white rounded-[12px] overflow-hidden">
                {creatorProducts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400 font-mono">
                    No designs uploaded yet. Go to "Upload New Vector" to publish your first asset!
                  </div>
                ) : (
                  creatorProducts.map((p) => (
                    <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 border border-[#0d1400] p-0.5 bg-white shrink-0 rounded-lg overflow-hidden">
                          <DesignRenderer imageKey={p.imageKey} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono bg-[#0d1400] text-white px-2 py-0.5 rounded-full uppercase border border-[#0d1400]">
                            {p.category}
                          </span>
                          <h5 className="font-sans font-bold text-sm text-[#0d1400] mt-1.5">{p.title}</h5>
                          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            Uploaded: {p.createdAt} • Rating: {p.rating.toFixed(1)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-[#0d1400]/10 pt-3 sm:pt-0">
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-neutral-400 block">Earnings</span>
                          <span className="font-mono font-bold text-sm text-[#0d1400]">${(p.downloads * p.price).toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-neutral-400 block">Downloads</span>
                          <span className="font-mono font-bold text-sm text-[#0d1400]">{p.downloads}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-neutral-400 block">Price</span>
                          <span className="font-mono font-bold text-sm text-[#0d1400]">${p.price.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-2 border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors rounded-full cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: UPLOAD NEW ARTWORK */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-lg font-bold text-[#0d1400]">Publish New Anime Vector Design</h4>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  SUBMIT LOSSLESS FLAT DESIGN GRAPHICS COMPATIBLE WITH WORLD-WIDE POD SYSTEMS
                </p>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#0d1400]/60 mb-1.5">Design Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Cyberpunk Shinigami Future Mask"
                      className="w-full px-4 py-2.5 border border-[#0d1400] focus:outline-hidden text-xs bg-white rounded-full"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#0d1400]/60 mb-1.5">Anime Collection / Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#0d1400] focus:outline-hidden text-xs bg-white rounded-full appearance-none cursor-pointer"
                    >
                      <option value="Samurai">Samurai Collection</option>
                      <option value="One Piece">One Piece Collection</option>
                      <option value="Naruto">Naruto Collection</option>
                      <option value="Jujutsu Kaisen">Jujutsu Kaisen Collection</option>
                      <option value="Demon Slayer">Demon Slayer Collection</option>
                      <option value="Mecha">Mecha & Cyberpunk</option>
                      <option value="Dragon Ball">Dragon Ball Collection</option>
                      <option value="Bleach">Bleach Collection</option>
                      <option value="Death Note">Death Note Collection</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#0d1400]/60 mb-1.5">Default License Price (USD)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="29.00"
                      className="w-full px-4 py-2.5 border border-[#0d1400] focus:outline-hidden text-xs bg-white rounded-full"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#0d1400]/60 mb-1.5">Keywords / Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Samurai, Streetwear, Graphic, Ink"
                      className="w-full px-4 py-2.5 border border-[#0d1400] focus:outline-hidden text-xs bg-white rounded-full"
                    />
                  </div>
                </div>

                {/* Upload Media files of designs image */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#0d1400]/60 mb-2">
                    Upload Design Media File (Image / Graphic)
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      dragActive ? 'border-[#aaff00] bg-[#aaff00]/5' : 'border-[#0d1400]/30 hover:border-[#0d1400]/70 bg-neutral-50/50'
                    }`}
                  >
                    <input
                      type="file"
                      id="design-file-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="design-file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      {selectedImageKey && (selectedImageKey.startsWith('data:image/') || selectedImageKey.startsWith('http')) ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-24 h-24 border border-[#0d1400] rounded-lg overflow-hidden bg-white shadow-xs">
                            <img src={selectedImageKey} alt="Preview" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-[11px] font-mono text-[#0d1400] font-bold">
                            {uploadedFileName || 'uploaded-design.png'}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">
                            Click or drag to replace image
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 bg-white border border-[#0d1400]/10 rounded-full shadow-xs text-neutral-400">
                            <UploadCloud className="w-6 h-6 text-[#0d1400]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#0d1400] mb-0.5">
                              Drag and drop your design image here
                            </p>
                            <p className="text-[10px] font-mono text-neutral-400 uppercase">
                              PNG, JPG, JPEG, or SVG up to 10MB
                            </p>
                          </div>
                          <span className="mt-1 px-4 py-1.5 bg-[#0d1400] text-white text-[10px] font-mono rounded-full hover:bg-[#aaff00] hover:text-[#0d1400] transition-colors uppercase font-bold">
                            Browse Files
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Formats Checkbox */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#0d1400]/60 mb-2">Available Formats Included in Package</label>
                  <div className="flex gap-4 flex-wrap">
                    {['PNG', 'SVG', 'AI', 'EPS', 'PDF'].map((fmt) => (
                      <label key={fmt} className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#0d1400]">
                        <input
                          type="checkbox"
                          checked={selectedFormats.includes(fmt)}
                          onChange={() => toggleFormat(fmt)}
                          className="w-4 h-4 border-[#0d1400] accent-[#0d1400] rounded"
                        />
                        <span>{fmt} (Lossless)</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#0d1400]/60 mb-1.5">Design Specs & Store pitch</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how screen printing screens should be organized, DTG performance, or streetwear inspiration details..."
                    className="w-full px-4 py-3 border border-[#0d1400] focus:outline-hidden text-xs bg-white rounded-[12px]"
                  />
                </div>

                {uploadSuccess && (
                  <div className="p-4 bg-[#aaff00]/25 text-[#0d1400] border border-[#0d1400] text-xs flex items-center gap-2 rounded-[12px]">
                    <CheckCircle className="w-5 h-5 text-[#0d1400]" />
                    <span>Design package verified, pre-rendered successfully and added to your portfolio!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-4 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] font-mono font-bold tracking-widest text-xs uppercase border border-[#0d1400] transition-colors flex items-center justify-center gap-2 rounded-full cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      COMPILING SOURCE FILES & ALIGNING VECTORS...
                    </>
                  ) : (
                    <>
                      <FilePlus className="w-4 h-4" />
                      PUBLISH DESIGN TO MARKETPLACE
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: PAYOUTS & ledger */}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-lg font-bold text-[#0d1400]">Royalties & Earnings Payouts</h4>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  CURRENT ACCUMULATED WITHDRAWABLE BALANCE: <span className="text-[#0d1400] font-bold font-mono">$12,450.00</span>
                </p>
              </div>

              {/* Withdraw setup form */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                <form onSubmit={handlePayoutSubmit} className="md:col-span-5 border border-[#0d1400] p-5 bg-neutral-50/50 space-y-4 rounded-[12px]">
                  <h5 className="font-mono text-xs font-bold uppercase tracking-widest text-[#0d1400]">Trigger Withdrawal</h5>
                  
                  <div>
                    <label className="block text-[10px] font-mono text-[#0d1400] mb-1.5 uppercase">Payout Provider</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPayoutMethod('paypal')}
                        className={`py-2 text-center text-[10px] font-mono border rounded-full transition-colors cursor-pointer ${payoutMethod === 'paypal' ? 'border-[#0d1400] bg-[#0d1400] text-white font-bold' : 'border-[#0d1400] bg-white text-[#0d1400] hover:bg-neutral-50'}`}
                      >
                        PayPal Express
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayoutMethod('stripe')}
                        className={`py-2 text-center text-[10px] font-mono border rounded-full transition-colors cursor-pointer ${payoutMethod === 'stripe' ? 'border-[#0d1400] bg-[#0d1400] text-white font-bold' : 'border-[#0d1400] bg-white text-[#0d1400] hover:bg-neutral-50'}`}
                      >
                        Stripe Connect
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#0d1400] mb-1.5 uppercase">ACCOUNT EMAIL/ID</label>
                    <input
                      type="text"
                      required
                      value={payoutAccount}
                      onChange={(e) => setPayoutAccount(e.target.value)}
                      className="w-full px-4 py-2 border border-[#0d1400] focus:outline-hidden text-xs bg-white font-mono rounded-full"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#0d1400] mb-1.5 uppercase">AMOUNT TO WITHDRAW (USD)</label>
                    <input
                      type="number"
                      required
                      max={12450}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-[#0d1400] focus:outline-hidden text-xs bg-white font-mono rounded-full"
                    />
                  </div>

                  {payoutSuccess && (
                    <div className="p-3 bg-[#aaff00]/25 text-[#0d1400] border border-[#0d1400] text-[11px] flex items-center gap-1.5 rounded-[12px]">
                      <CheckCircle className="w-4 h-4" />
                      <span>Payout requested. Funds usually settle in 24 hours.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessingPayout}
                    className="w-full py-2.5 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] font-mono text-xs font-bold uppercase transition-colors rounded-full border border-[#0d1400] cursor-pointer"
                  >
                    {isProcessingPayout ? 'PROCESSING PAYOUT...' : 'REQUEST EARNINGS DISPERSAL'}
                  </button>
                </form>

                {/* Ledger lists */}
                <div className="md:col-span-7 space-y-4">
                  <h5 className="font-mono text-xs font-bold uppercase tracking-wider">Historical Transactions Ledger</h5>
                  <div className="border border-[#0d1400] overflow-x-auto rounded-[12px]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-[#0d1400] font-mono text-[10px] text-[#0d1400] uppercase tracking-wider">
                          <th className="p-3">TRANSACTION ID</th>
                          <th className="p-3">DATE</th>
                          <th className="p-3">METHOD</th>
                          <th className="p-3">AMOUNT</th>
                          <th className="p-3 text-right">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#0d1400]/10">
                        {payoutHistory.map((tx) => (
                          <tr key={tx.id} className="hover:bg-neutral-50/50">
                            <td className="p-3 font-mono text-[#0d1400]">{tx.id}</td>
                            <td className="p-3 font-mono text-neutral-500">{tx.date}</td>
                            <td className="p-3 text-neutral-600">{tx.method}</td>
                            <td className="p-3 font-bold text-[#0d1400]">${tx.amount.toFixed(2)}</td>
                            <td className="p-3 text-right">
                              <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded-full border border-[#0d1400] ${tx.status === 'Completed' ? 'bg-[#aaff00] text-[#0d1400]' : 'bg-amber-100 text-amber-800'}`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AFFILIATE PROGRAM */}
          {activeTab === 'affiliate' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-lg font-bold text-[#0d1400]">InkWave Ambassador Affiliate Program</h4>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  DRIVE CUSTOM TRAFFIC TO INKWAVE ASSETS AND GET 15% OF EVERY ROYALTY FEE SECURED
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-7 space-y-4">
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                    Affiliate programs are critical multipliers for t-shirt design shops. Share premium anime vector packs on your design blog, YouTube tutorials, Pinterest boards, or social media channels using your tracking token, and watch your earnings stream increase automatically.
                  </p>

                  <div className="p-4 border border-[#0d1400] bg-neutral-50/50 space-y-3 rounded-[12px]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#0d1400]/60">Your Custom Ambassador Link</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={affiliateLink}
                        className="flex-1 px-4 py-2.5 border border-[#0d1400] text-xs font-mono bg-white select-all text-[#0d1400] focus:outline-hidden rounded-full"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-5 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1 shrink-0 rounded-full border border-[#0d1400] cursor-pointer"
                      >
                        {copiedCode ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedCode ? 'COPIED' : 'COPY'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h5 className="font-mono text-xs font-bold uppercase tracking-wider">How Payouts Work</h5>
                    <ul className="list-disc pl-5 text-xs text-neutral-600 space-y-1.5 font-sans">
                      <li><strong>15% Baseline Reward</strong>: You earn a 15% slice on every successful download generated via your referral link.</li>
                      <li><strong>30-Day Cookies</strong>: Even if the POD merchant logs out and returns to buy later in the month, you still secure the credit.</li>
                      <li><strong>Instant Crediting</strong>: Affiliate payouts are added to your Withdrawals balance immediately upon payment verification.</li>
                    </ul>
                  </div>
                </div>

                {/* Affiliate analytics box */}
                <div className="md:col-span-5 border border-[#0d1400] p-5 space-y-4 rounded-[12px] bg-neutral-50/30">
                  <h5 className="font-mono text-xs font-bold uppercase tracking-widest text-[#0d1400]">Referral Performance</h5>
                  <div className="divide-y divide-neutral-200 text-xs font-mono">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-neutral-400">TOTAL REFERRALS</span>
                      <span className="font-bold text-[#0d1400]">48 clicks</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-neutral-400">CONVERTED SIGNUPS</span>
                      <span className="font-bold text-[#0d1400]">23 merchants</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-neutral-400">CONVERSION RATE</span>
                      <span className="font-bold text-[#0d1400] bg-[#aaff00] px-2 py-0.5 rounded-full border border-[#0d1400] text-[10px]">47.9%</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-neutral-400">ESTIMATED UNPAID</span>
                      <span className="font-bold text-[#0d1400]">$184.20</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleDownloadReferralPack}
                      className="w-full py-2.5 border border-[#0d1400] bg-white text-[#0d1400] hover:bg-[#0d1400] hover:text-white text-xs font-mono font-bold uppercase transition-colors rounded-full cursor-pointer"
                    >
                      DOWNLOAD PROMO CREATIVES
                    </button>
                    {referralPackDownloaded && (
                      <p className="text-[10px] text-[#0d1400] font-mono text-center mt-2 animate-fadeIn uppercase font-bold">
                        Promo materials downloaded to browser storage successfully!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
