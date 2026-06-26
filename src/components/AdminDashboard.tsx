import React, { useState } from 'react';
import { Product, Creator, PlatformConfig } from '../types';
import { DesignRenderer } from './DesignRenderer';
import { 
  Search, ShieldCheck, AlertTriangle, Trash2, UserCheck, 
  Settings, Activity, DollarSign, Layers, Download, 
  RefreshCw, Plus, CheckCircle2, ThumbsUp, ThumbsDown, Zap,
  Sliders, AlertOctagon, Save, PlusCircle, CreditCard, TrendingUp,
  X, Info, Edit, Ban, CheckCircle, UserPlus, HelpCircle
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  creators: Creator[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateCreators: (creators: Creator[]) => void;
  onNavigateToView: (view: 'marketplace' | 'dashboard' | 'detail' | 'creator' | 'admin') => void;
  onLogout?: () => void;
  platformConfig: PlatformConfig;
  onUpdatePlatformConfig: (config: PlatformConfig) => Promise<void>;
}

// Custom structure for newly pending approvals
interface PendingDesign {
  id: string;
  title: string;
  creatorName: string;
  category: string;
  imageKey: string;
  price: number;
}

// Mock Sales record
interface SalesRecord {
  id: string;
  date: string;
  productTitle: string;
  creatorName: string;
  price: number;
  commission: number;
  buyer: string;
  status: 'settled' | 'refunded' | 'payout_pending';
}

// Mock Registered Buyer account
interface BuyerAccount {
  uid: string;
  email: string;
  displayName: string;
  registeredAt: string;
  status: 'active' | 'suspended';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  creators,
  onUpdateProducts,
  onUpdateCreators,
  onNavigateToView,
  onLogout,
  platformConfig,
  onUpdatePlatformConfig
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'analytics' | 'designs' | 'creators' | 'approvals' | 'sales' | 'logs' | 'flow'>('analytics');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Inspector edit states
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Add product modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('one-piece');
  const [newPrice, setNewPrice] = useState('29.00');
  const [newImageKey, setNewImageKey] = useState('samurai_crimson');
  const [newTags, setNewTags] = useState('streetwear, vector, anime');
  const [newDescription, setNewDescription] = useState('Premium high-quality vector print ready for oversizes.');

  // User management sub-tab state
  const [userSubTab, setUserSubTab] = useState<'creators' | 'buyers'>('creators');

  // Platform Config edit states
  const [cfgMaintenance, setCfgMaintenance] = useState(platformConfig.maintenanceMode);
  const [cfgDisableRegs, setCfgDisableRegs] = useState(platformConfig.disableRegistrations);
  const [cfgCommission, setCfgCommission] = useState(platformConfig.commissionFee.toString());
  const [cfgBannerText, setCfgBannerText] = useState(platformConfig.featuredBannerText);
  const [cfgAnnounceSub, setCfgAnnounceSub] = useState(platformConfig.announcementSub);
  const [cfgFreeDownloads, setCfgFreeDownloads] = useState(platformConfig.allowInstantFreeDownloads);
  const [isConfigSaving, setIsConfigSaving] = useState(false);
  const [configSaveSuccess, setConfigSaveSuccess] = useState(false);

  // Mock registered buyers
  const [buyers, setBuyers] = useState<BuyerAccount[]>([
    { uid: 'b1', email: 'samurai_fan@gmail.com', displayName: 'Samurai Jack', registeredAt: '2026-05-12', status: 'active' },
    { uid: 'b2', email: 'anime_print_shop@outlook.com', displayName: 'Printify Merchant', registeredAt: '2026-06-01', status: 'active' },
    { uid: 'b3', email: 'streetwear_co@yahoo.com', displayName: 'HypeDrop Apparel', registeredAt: '2026-06-15', status: 'active' },
    { uid: 'b4', email: 'luffy_enthusiast@gmail.com', displayName: 'GrandLine Merch', registeredAt: '2026-06-20', status: 'suspended' },
    { uid: 'b5', email: 'kurosaki_repro@gmail.com', displayName: 'Ichigo Prints', registeredAt: '2026-06-24', status: 'active' }
  ]);

  // Mock Sales ledger
  const [salesHistory, setSalesHistory] = useState<SalesRecord[]>([
    { id: 'TXN-82901', date: 'Just now', productTitle: 'The Great Straw Hat Jolly Roger', creatorName: 'Yuki Sato', price: 35.00, commission: 5.25, buyer: 'Printify Merchant', status: 'settled' },
    { id: 'TXN-82894', date: '30 mins ago', productTitle: 'Minimalist Samurai Crimson Moon', creatorName: 'InkWave', price: 29.00, commission: 4.35, buyer: 'Samurai Jack', status: 'settled' },
    { id: 'TXN-82882', date: '3 hrs ago', productTitle: 'Cyberpunk Oni Mech Unit-01', creatorName: 'Ren Kuroda', price: 32.00, commission: 4.80, buyer: 'HypeDrop Apparel', status: 'payout_pending' },
    { id: 'TXN-82875', date: '8 hrs ago', productTitle: 'Cursed King Eyes & Domain Stamp', creatorName: 'InkWave', price: 24.00, commission: 3.60, buyer: 'Ichigo Prints', status: 'settled' },
    { id: 'TXN-82869', date: '1 day ago', productTitle: 'Breath of Water Nichirin Wave', creatorName: 'InkWave', price: 30.00, commission: 4.50, buyer: 'GrandLine Merch', status: 'refunded' }
  ]);

  // Pending queue state (populated with mock items that can be approved to the live products state)
  const [pendingQueue, setPendingQueue] = useState<PendingDesign[]>([
    {
      id: 'pending-1',
      title: 'Neon Cyberpunk Samurai',
      creatorName: 'InkWave',
      category: 'Samurai',
      imageKey: 'samurai_crimson',
      price: 24.99
    },
    {
      id: 'pending-2',
      title: 'Hollow Mask Tag Splash',
      creatorName: 'Yuki Sato',
      category: 'Bleach',
      imageKey: 'hollow_mask',
      price: 21.00
    },
    {
      id: 'pending-3',
      title: 'Domain Expansion Terminal',
      creatorName: 'Ren Kuroda',
      category: 'Jujutsu Kaisen',
      imageKey: 'cursed_eyes',
      price: 18.50
    }
  ]);

  // System logs state
  const [systemLogs, setSystemLogs] = useState<Array<{ id: string; event: string; time: string; type: 'info' | 'warn' | 'success' }>>([
    { id: 'log-1', event: 'Database connection verified - 300 DPI vector cache is warm', time: '10 mins ago', type: 'info' },
    { id: 'log-2', event: 'Global payout of $452.12 processed for ambassador referrals', time: '1 hr ago', type: 'success' },
    { id: 'log-3', event: 'Low resolution asset check flag triggered on Creator Tanaka profile', time: '3 hrs ago', type: 'warn' },
    { id: 'log-4', event: 'New vector compilation build successfully compiled (release 2.1.0)', time: '5 hrs ago', type: 'success' }
  ]);

  // Calculate metrics
  const totalDownloads = products.reduce((acc, p) => acc + p.downloads, 0);
  const estimatedRevenue = products.reduce((acc, p) => acc + (p.downloads * p.price * (platformConfig.commissionFee / 100)), 0); 
  const averagePrice = products.length ? products.reduce((acc, p) => acc + p.price, 0) / products.length : 0;

  // Search and filter live products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Toggle "Featured" badge state
  const handleToggleFeatured = (productId: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const isCurrentlyFeatured = p.badge === 'Trending' || p.badge === 'Popular';
        return {
          ...p,
          badge: isCurrentlyFeatured ? undefined : 'Trending'
        };
      }
      return p;
    });
    onUpdateProducts(updated);
    
    const product = products.find(p => p.id === productId);
    const isFeatured = product?.badge !== 'Trending' && product?.badge !== 'Popular';
    addLog(`Toggled Featured status ${isFeatured ? 'ON' : 'OFF'} for design "${product?.title}"`, 'success');
  };

  // De-list design
  const handleDeleteProduct = (productId: string) => {
    const confirmed = window.confirm("Are you sure you want to de-list and archive this design license? It will be removed from the live explore catalog.");
    if (confirmed) {
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
      setSelectedProduct(null);
      addLog(`De-listed design license "${products.find(p => p.id === productId)?.title}"`, 'warn');
    }
  };

  // Toggle Creator Verified status
  const handleToggleCreatorVerify = (creatorId: string) => {
    const updated = creators.map((c) => {
      if (c.id === creatorId) {
        return { ...c, verified: !c.verified };
      }
      return c;
    });
    onUpdateCreators(updated);
    
    const cr = creators.find(c => c.id === creatorId);
    const isVerified = !cr?.verified;
    addLog(`${isVerified ? 'Verified' : 'Revoked verification from'} Creator @${cr?.name}`, isVerified ? 'success' : 'warn');
  };

  // Suspend general buyer account
  const handleToggleBuyerStatus = (uid: string) => {
    setBuyers(prev => prev.map(b => {
      if (b.uid === uid) {
        const nextStatus = b.status === 'active' ? 'suspended' : 'active';
        addLog(`${nextStatus === 'suspended' ? 'Suspended' : 'Activated'} user account ${b.displayName}`, nextStatus === 'suspended' ? 'warn' : 'success');
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  // Promote general buyer to creator
  const handlePromoteUser = (buyer: BuyerAccount) => {
    // Check if they are already creators
    if (creators.some(c => c.username === buyer.email.split('@')[0])) {
      alert("This user is already a creator.");
      return;
    }
    const newCreatorId = `c-new-${Date.now()}`;
    const newCreator: Creator = {
      id: newCreatorId,
      name: buyer.displayName,
      username: buyer.email.split('@')[0] || 'creator',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      designsCount: 0,
      followers: 120,
      sales: 0,
      bio: 'Premium vector merchandise curator.',
      verified: false
    };
    onUpdateCreators([...creators, newCreator]);
    addLog(`Promoted user ${buyer.displayName} to active Creator console status`, 'success');
    alert(`${buyer.displayName} has been successfully promoted to a Creator!`);
  };

  // Approve a pending design
  const handleApprovePending = (pending: PendingDesign) => {
    const newProduct: Product = {
      id: pending.id,
      title: pending.title,
      creatorId: 'c1',
      creatorName: pending.creatorName,
      price: pending.price,
      imageKey: pending.imageKey,
      category: pending.category,
      downloads: 0,
      likes: 0,
      rating: 5.0,
      reviewsCount: 0,
      tags: [pending.category.toLowerCase(), 'vector', 'premium', 'new'],
      description: `High-fidelity anime vector graphic for apparel printing. Hand-separated and print-tested with standard water-based discharge settings.`,
      fileFormats: ['SVG', 'PNG', 'EPS'],
      includedFiles: ['Scalable Vector Source (.svg)', 'Print-Ready Transparent Artwork (.png)', 'Production Separation Sheets (.pdf)'],
      createdAt: new Date().toISOString()
    };

    onUpdateProducts([newProduct, ...products]);
    setPendingQueue(pendingQueue.filter(p => p.id !== pending.id));
    addLog(`Approved design upload "${pending.title}" onto live catalog`, 'success');
  };

  // Reject a pending design
  const handleRejectPending = (pendingId: string, title: string) => {
    setPendingQueue(pendingQueue.filter(p => p.id !== pendingId));
    addLog(`Rejected design upload "${title}" - resolution verification failed`, 'warn');
  };

  // Save full updates of product details
  const handleSaveProductEdits = (productId: string) => {
    const numPrice = parseFloat(editPrice);
    if (isNaN(numPrice) || numPrice <= 0) {
      alert("Please enter a valid numeric price greater than 0.");
      return;
    }

    const updated = products.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          title: editTitle,
          category: editCategory,
          price: numPrice,
          tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
          description: editDescription
        };
      }
      return p;
    });

    onUpdateProducts(updated);
    const updatedProd = updated.find(p => p.id === productId);
    if (updatedProd) {
      setSelectedProduct(updatedProd);
    }
    addLog(`Updated details and licensing rate for "${editTitle}"`, 'success');
    alert("Changes saved successfully!");
  };

  // Publish a new product curated by admin
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("Please enter a title.");
      return;
    }
    const numPrice = parseFloat(newPrice);
    if (isNaN(numPrice) || numPrice <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    const newProd: Product = {
      id: `p-admin-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      price: numPrice,
      imageKey: newImageKey,
      downloads: 0,
      likes: 0,
      rating: 5.0,
      reviewsCount: 0,
      creatorId: 'c1', // Admin / InkWave
      creatorName: 'InkWave', // default creator or admin
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      description: newDescription,
      fileFormats: ['PNG', 'SVG', 'AI', 'EPS'],
      includedFiles: ['Transparent PNG (4500x5400px)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)'],
      createdAt: new Date().toISOString()
    };

    onUpdateProducts([newProd, ...products]);
    addLog(`Published new curated design "${newTitle}" to the storefront`, 'success');
    
    // reset form and close modal
    setNewTitle('');
    setNewTags('streetwear, vector, anime');
    setNewDescription('Premium high-quality vector print ready for oversizes.');
    setIsAddModalOpen(false);
    alert(`Curated design "${newTitle}" is now live on the storefront!`);
  };

  // Add system logs
  const addLog = (event: string, type: 'info' | 'warn' | 'success') => {
    const newLog = {
      id: `log-${Date.now()}`,
      event,
      time: 'Just now',
      type
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  // Load a quick configuration preset
  const handleApplyPreset = (preset: 'default' | 'promo' | 'lockdown') => {
    if (preset === 'default') {
      setCfgMaintenance(false);
      setCfgDisableRegs(false);
      setCfgCommission('15');
      setCfgBannerText("Premium Anime T-Shirt Designs Built To Sell");
      setCfgAnnounceSub("Download professionally crafted anime-inspired artwork ready for custom apparel brands, Etsy, and print-on-demand stores.");
      setCfgFreeDownloads(false);
      addLog("Applied Default Platform Operation Preset config", "info");
    } else if (preset === 'promo') {
      setCfgMaintenance(false);
      setCfgDisableRegs(false);
      setCfgCommission('10'); // promotional fee
      setCfgBannerText("SUMMER DROP PROMOTION // 10% CREATOR COMMISSION FEE");
      setCfgAnnounceSub("Join the fast-growing anime apparel merchant program. Reduced licensing rates live for the next 48 hours!");
      setCfgFreeDownloads(false);
      addLog("Applied Promotional Launch Preset config", "success");
    } else if (preset === 'lockdown') {
      setCfgMaintenance(true); // locked
      setCfgDisableRegs(true);
      setCfgCommission('20');
      setCfgBannerText("SYSTEM LOCKED FOR UPGRADES");
      setCfgAnnounceSub("InkWave repositories are undergoing scheduled infrastructure maintenance. Regular services resume shortly.");
      setCfgFreeDownloads(false);
      addLog("Applied Maintenance Lockdown Preset config", "warn");
    }
  };

  // Trigger Mock Payout
  const handleTriggerPayout = (txnId: string) => {
    setSalesHistory(prev => prev.map(txn => {
      if (txn.id === txnId) {
        addLog(`Triggered royalty payout of $${(txn.price - txn.commission).toFixed(2)} to Creator for transaction ${txnId}`, 'success');
        return { ...txn, status: 'settled' };
      }
      return txn;
    }));
  };

  // Trigger Mock Refund
  const handleTriggerRefund = (txnId: string) => {
    setSalesHistory(prev => prev.map(txn => {
      if (txn.id === txnId) {
        addLog(`Issued full customer refund of $${txn.price.toFixed(2)} for transaction ${txnId}`, 'warn');
        return { ...txn, status: 'refunded' };
      }
      return txn;
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-[#0d1400] font-sans pb-16">
      {/* Admin Title Banner */}
      <div className="border-b border-[#0d1400] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#0d1400] text-[#aaff00] text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 fill-[#aaff00] stroke-[#0d1400]" />
                InkWave Administrator Suite
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                SYSTEM ONLINE
              </span>
            </div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tight leading-none text-[#0d1400] mt-3">
              Global Repository Oversight
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-1 uppercase tracking-wider">
              Control vector files, manage creator reputation levels, and track checkout percentages.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start flex-wrap">
            <button
              onClick={() => onNavigateToView('marketplace')}
              className="px-5 py-2.5 bg-white border border-[#0d1400] text-[#0d1400] hover:bg-neutral-50 transition-all text-xs font-mono font-bold uppercase rounded-full cursor-pointer shadow-xs"
            >
              ← Back to Storefront
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-[#aaff00] text-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-all text-xs font-mono font-bold uppercase rounded-full border border-[#0d1400] cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              New Curated Design
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-5 py-2.5 bg-[#ef4444] text-white hover:bg-[#ef4444]/90 transition-all text-xs font-mono font-bold uppercase rounded-full cursor-pointer shadow-xs"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Quick Metrics Deck */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 border border-[#0d1400] bg-white rounded-xl space-y-1 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center text-[#0d1400]/60">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Total Downloads</span>
              <Download className="w-4 h-4 text-[#0d1400]/40" />
            </div>
            <p className="font-display font-black text-3xl text-[#0d1400]">{totalDownloads.toLocaleString()}</p>
            <p className="text-[10px] font-mono text-neutral-400">Total design licenses exported across creators</p>
          </div>

          <div className="p-5 border border-[#0d1400] bg-white rounded-xl space-y-1 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center text-[#0d1400]/60">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Est. Admin Commission</span>
              <DollarSign className="w-4 h-4 text-[#0d1400]/40" />
            </div>
            <p className="font-display font-black text-3xl text-[#0d1400]">${estimatedRevenue.toFixed(2)}</p>
            <p className="text-[10px] font-mono text-emerald-600 font-bold uppercase">{platformConfig.commissionFee}% commission fee live</p>
          </div>

          <div className="p-5 border border-[#0d1400] bg-white rounded-xl space-y-1 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center text-[#0d1400]/60">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Designs Database</span>
              <Layers className="w-4 h-4 text-[#0d1400]/40" />
            </div>
            <p className="font-display font-black text-3xl text-[#0d1400]">{products.length} Items</p>
            <p className="text-[10px] font-mono text-neutral-400">{creators.length} verified apparel creators</p>
          </div>

          <div className="p-5 border border-[#0d1400] bg-[#aaff00]/5 rounded-xl space-y-1 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center text-[#0d1400]/60">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold font-black text-[#0d1400]">Pending Approvals</span>
              <Activity className="w-4 h-4 text-[#0d1400]/55" />
            </div>
            <p className={`font-display font-black text-3xl ${pendingQueue.length > 0 ? 'text-red-600' : 'text-[#0d1400]'}`}>
              {pendingQueue.length} Uploads
            </p>
            <p className="text-[10px] font-mono text-neutral-500 font-bold">Needs manual vector tracing review</p>
          </div>
        </div>
      </div>

      {/* Main Console Workspace Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Tabs and Content Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tabs header */}
          <div className="flex border-b border-[#0d1400] gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${activeTab === 'analytics' ? 'border-[#0d1400] text-[#0d1400]' : 'border-transparent text-neutral-400 hover:text-[#0d1400]'}`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              ANALYTICS SUMMARY
            </button>

            <button
              onClick={() => setActiveTab('designs')}
              className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'designs' ? 'border-[#0d1400] text-[#0d1400]' : 'border-transparent text-neutral-400 hover:text-[#0d1400]'}`}
            >
              DESIGNS CATALOG ({products.length})
            </button>
            
            <button
              onClick={() => setActiveTab('creators')}
              className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'creators' ? 'border-[#0d1400] text-[#0d1400]' : 'border-transparent text-neutral-400 hover:text-[#0d1400]'}`}
            >
              USER & CREATORS ({creators.length + buyers.length})
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer relative ${activeTab === 'approvals' ? 'border-[#0d1400] text-[#0d1400]' : 'border-transparent text-neutral-400 hover:text-[#0d1400]'}`}
            >
              APPROVAL QUEUE
              {pendingQueue.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('sales')}
              className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${activeTab === 'sales' ? 'border-[#0d1400] text-[#0d1400]' : 'border-transparent text-neutral-400 hover:text-[#0d1400]'}`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              SALES LEDGER
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'logs' ? 'border-[#0d1400] text-[#0d1400]' : 'border-transparent text-neutral-400 hover:text-[#0d1400]'}`}
            >
              SYSTEM EVENT LOGS
            </button>

            <button
              onClick={() => setActiveTab('flow')}
              className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${activeTab === 'flow' ? 'border-[#0d1400] text-[#0d1400]' : 'border-transparent text-neutral-400 hover:text-[#0d1400]'}`}
            >
              <Sliders className="w-3.5 h-3.5" />
              FLOW CONTROLS
            </button>
          </div>

          {/* TAB 0: ANALYTICS OVERVIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SVG Visual Sales Line Chart */}
                <div className="p-5 border border-[#0d1400] bg-white rounded-xl space-y-4">
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider">Estimated Revenue Surge (Last 7 Days)</h3>
                    <p className="text-[10px] text-neutral-400 font-mono">Real-time checkout commissions</p>
                  </div>
                  
                  <div className="relative">
                    <svg className="w-full h-40" viewBox="0 0 360 140">
                      {/* Grid Lines */}
                      <line x1="10" y1="20" x2="350" y2="20" stroke="#f4f4f5" strokeDasharray="3,3" />
                      <line x1="10" y1="60" x2="350" y2="60" stroke="#f4f4f5" strokeDasharray="3,3" />
                      <line x1="10" y1="100" x2="350" y2="100" stroke="#f4f4f5" strokeDasharray="3,3" />
                      <line x1="10" y1="120" x2="350" y2="120" stroke="#e4e4e7" strokeWidth="1" />
                      
                      {/* Area Chart Gradient */}
                      <path
                        d="M 30 120 L 30 110 L 80 90 L 130 100 L 180 70 L 230 50 L 280 35 L 330 15 L 330 120 Z"
                        fill="url(#chartGrad)"
                        opacity="0.1"
                      />
                      
                      {/* Polyline chart line */}
                      <polyline
                        fill="none"
                        stroke="#0d1400"
                        strokeWidth="2.5"
                        points="30,110 80,90 130,100 180,70 230,50 280,35 330,15"
                      />
                      
                      {/* Data Point Circles */}
                      <circle cx="30" cy="110" r="4" fill="#aaff00" stroke="#0d1400" strokeWidth="2" />
                      <circle cx="80" cy="90" r="4" fill="#aaff00" stroke="#0d1400" strokeWidth="2" />
                      <circle cx="130" cy="100" r="4" fill="#aaff00" stroke="#0d1400" strokeWidth="2" />
                      <circle cx="180" cy="70" r="4" fill="#aaff00" stroke="#0d1400" strokeWidth="2" />
                      <circle cx="230" cy="50" r="4" fill="#aaff00" stroke="#0d1400" strokeWidth="2" />
                      <circle cx="280" cy="35" r="4" fill="#aaff00" stroke="#0d1400" strokeWidth="2" />
                      <circle cx="330" cy="15" r="4" fill="#aaff00" stroke="#0d1400" strokeWidth="2" />
                      
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#aaff00" />
                          <stop offset="100%" stopColor="#aaff00" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="flex justify-between px-2 text-[9px] font-mono text-neutral-400 mt-2">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* Category performance list */}
                <div className="p-5 border border-[#0d1400] bg-white rounded-xl space-y-4">
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider">Top-Performing Collections</h3>
                    <p className="text-[10px] text-neutral-400 font-mono">Catalog breakdown by downloads share</p>
                  </div>

                  <div className="space-y-3 font-mono text-[10px]">
                    {[
                      { name: 'One Piece', count: 18, color: 'bg-blue-500', percentage: '75%' },
                      { name: 'Naruto', count: 12, color: 'bg-amber-500', percentage: '60%' },
                      { name: 'Jujutsu Kaisen', count: 14, color: 'bg-purple-500', percentage: '55%' },
                      { name: 'Demon Slayer', count: 15, color: 'bg-sky-500', percentage: '50%' },
                      { name: 'Mecha / Samurai', count: 9, color: 'bg-[#aaff00]', percentage: '40%' }
                    ].map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-[#0d1400]">{cat.name}</span>
                          <span className="text-[10px] text-neutral-400">{cat.count} downloads ({cat.percentage})</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={`h-full ${cat.color}`} style={{ width: cat.percentage }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Security Health status */}
              <div className="p-5 border border-[#0d1400] bg-white rounded-xl space-y-4">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 fill-current" />
                  InkWave Repository Health Status
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-3 border border-neutral-100 bg-neutral-50/50 rounded-lg">
                    <span className="text-[9px] font-mono text-neutral-400 block uppercase">Vector Store</span>
                    <strong className="text-emerald-600 text-xs font-mono">100% HEALTHY</strong>
                  </div>
                  <div className="p-3 border border-neutral-100 bg-neutral-50/50 rounded-lg">
                    <span className="text-[9px] font-mono text-neutral-400 block uppercase">Payout API</span>
                    <strong className="text-emerald-600 text-xs font-mono">OPERATIONAL</strong>
                  </div>
                  <div className="p-3 border border-neutral-100 bg-neutral-50/50 rounded-lg col-span-2 sm:col-span-1">
                    <span className="text-[9px] font-mono text-neutral-400 block uppercase">Active Traffic</span>
                    <strong className="text-[#0d1400] text-xs font-mono">148 CONCURRENT</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: LIVE DESIGNS MANAGEMENT */}
          {activeTab === 'designs' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Filter Toolbelt */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search design database by title or creator..."
                    className="w-full pl-10 pr-4 py-2.5 border border-[#0d1400] rounded-full text-xs font-mono uppercase tracking-wider bg-white focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {['All', 'naruto', 'one-piece', 'demon-slayer', 'attack-on-titan', 'jujutsu-kaisen'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-2 text-[10px] font-mono uppercase tracking-wider font-bold border rounded-full cursor-pointer transition-all ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'bg-[#0d1400] text-white border-[#0d1400]' : 'bg-white text-neutral-500 border-neutral-300 hover:border-[#0d1400]'}`}
                    >
                      {cat === 'All' ? 'ALL ANIME' : cat.split('-')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Designs Catalog List */}
              <div className="border border-[#0d1400] bg-white rounded-xl overflow-hidden divide-y divide-[#0d1400]/10 shadow-xs">
                {filteredProducts.length === 0 ? (
                  <div className="p-12 text-center text-neutral-400 space-y-2 font-mono text-xs">
                    <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 animate-bounce" />
                    <p>NO DESIGNS MATCHING SEARCH CRITERIA</p>
                  </div>
                ) : (
                  filteredProducts.map((p) => {
                    const isFeatured = p.badge === 'Trending' || p.badge === 'Popular';
                    return (
                      <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Image Thumbnail */}
                          <div className="w-12 h-12 border border-[#0d1400] bg-neutral-100 p-0.5 shrink-0 rounded overflow-hidden flex items-center justify-center">
                            <DesignRenderer imageKey={p.imageKey} className="w-full h-full object-contain" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-sans font-bold text-sm text-[#0d1400] truncate">{p.title}</h4>
                              <span className="text-[8px] font-mono px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-neutral-600 uppercase">
                                {p.category}
                              </span>
                              {isFeatured && (
                                <span className="text-[8px] font-mono px-1.5 py-0.5 bg-[#aaff00] border border-[#0d1400] text-[#0d1400] font-bold uppercase rounded-sm flex items-center gap-0.5">
                                  <Zap className="w-2.5 h-2.5 fill-current" /> FEATURED
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                              Uploaded by <span className="text-[#0d1400] font-bold">@{p.creatorName}</span> • {p.downloads} downloads • Price: <strong>${p.price.toFixed(2)}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Interactive actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => {
                              setSelectedProduct(p);
                              setEditTitle(p.title);
                              setEditCategory(p.category);
                              setEditTags(p.tags.join(', '));
                              setEditPrice(p.price.toString());
                              setEditDescription(p.description);
                              // Smooth scroll to inspect panel on mobile
                              if (window.innerWidth < 1024) {
                                document.querySelector('.sticky')?.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="px-3 py-1.5 border border-[#0d1400] text-[#0d1400] hover:bg-[#0d1400] hover:text-white rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" /> Inspect / Edit
                          </button>

                          {/* Toggle Feature Status */}
                          <button
                            onClick={() => handleToggleFeatured(p.id)}
                            className={`p-1.5 border rounded-lg cursor-pointer transition-colors ${isFeatured ? 'bg-[#aaff00]/20 border-[#0d1400] text-[#0d1400]' : 'border-neutral-300 text-neutral-400 hover:border-[#0d1400] hover:text-[#0d1400]'}`}
                            title="Toggle Feature on Storefront"
                          >
                            <Zap className="w-4 h-4 fill-current" />
                          </button>

                          {/* Delete from catalog */}
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 border border-red-200 hover:bg-red-500 hover:text-white rounded-lg text-red-500 transition-all cursor-pointer"
                            title="De-list and archive license"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: USER & CREATORS MANAGEMENT */}
          {activeTab === 'creators' && (
            <div className="space-y-4 animate-fadeIn">
              {/* User management sub-tabs */}
              <div className="flex border-b border-neutral-200 gap-4 mb-2">
                <button
                  onClick={() => setUserSubTab('creators')}
                  className={`pb-2 text-xs font-mono uppercase tracking-wider font-bold border-b-2 cursor-pointer ${userSubTab === 'creators' ? 'border-[#0d1400] text-[#0d1400]' : 'border-transparent text-neutral-400'}`}
                >
                  Creators Catalog ({creators.length})
                </button>
                <button
                  onClick={() => setUserSubTab('buyers')}
                  className={`pb-2 text-xs font-mono uppercase tracking-wider font-bold border-b-2 cursor-pointer ${userSubTab === 'buyers' ? 'border-[#0d1400] text-[#0d1400]' : 'border-transparent text-neutral-400'}`}
                >
                  Registered Buyers ({buyers.length})
                </button>
              </div>

              {/* Creators Sub-tab */}
              {userSubTab === 'creators' && (
                <div className="border border-[#0d1400] bg-white rounded-xl overflow-hidden divide-y divide-[#0d1400]/10 shadow-xs">
                  {creators.map((c) => (
                    <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full border-2 border-[#0d1400] bg-[#0d1400] overflow-hidden flex items-center justify-center text-[#aaff00] font-display font-black text-sm uppercase shrink-0">
                          {c.avatarUrl ? (
                            <img 
                              src={c.avatarUrl} 
                              alt={c.name}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.opacity = '0';
                              }}
                            />
                          ) : null}
                          {(c.name || 'Creator').slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-sans font-bold text-sm text-[#0d1400] hover:underline cursor-pointer">
                              {c.name}
                            </h4>
                            <span className="text-[9px] font-mono text-neutral-400 font-semibold">@{c.username}</span>
                            {c.verified ? (
                              <span className="text-[8px] font-mono bg-[#0d1400] text-[#aaff00] border border-[#0d1400] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 uppercase">
                                <ShieldCheck className="w-2.5 h-2.5 text-[#aaff00] fill-current" />
                                VERIFIED
                              </span>
                            ) : (
                              <span className="text-[8px] font-mono border border-neutral-300 text-neutral-400 px-1.5 py-0.5 rounded-full uppercase">
                                Unverified
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-mono text-neutral-400 mt-0.5 max-w-md">
                            {c.bio}
                          </p>
                          <div className="flex gap-4 mt-1 font-mono text-[9px] uppercase tracking-wider text-neutral-500">
                            <span>Downloads: <strong className="text-[#0d1400]">{(products.filter(p => p.creatorId === c.id).reduce((sum, p) => sum + (p.downloads || 0), 0)).toLocaleString()}</strong></span>
                            <span>Sales: <strong className="text-[#0d1400]">{(c.sales || 0).toLocaleString()}</strong></span>
                            <span>Designs: <strong className="text-[#0d1400]">{products.filter(p => p.creatorId === c.id).length} active</strong></span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleCreatorVerify(c.id)}
                        className={`px-4 py-2 border rounded-full text-[10px] font-mono font-bold uppercase cursor-pointer transition-all self-end sm:self-center ${c.verified ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500' : 'bg-[#0d1400] text-white border-[#0d1400] hover:bg-[#aaff00] hover:text-[#0d1400]'}`}
                      >
                        {c.verified ? "REVOKE BADGE" : "VERIFY CREATOR"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Buyers Sub-tab */}
              {userSubTab === 'buyers' && (
                <div className="border border-[#0d1400] bg-white rounded-xl overflow-hidden divide-y divide-[#0d1400]/10 shadow-xs">
                  {buyers.map((b) => (
                    <div key={b.uid} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#0d1400] text-[#aaff00] flex items-center justify-center font-display font-black text-sm rounded-full uppercase border border-[#0d1400] shrink-0">
                          {(b.displayName || b.email || 'User').slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-sans font-bold text-sm text-[#0d1400]">{b.displayName || b.email || 'User'}</h4>
                            <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-sm ${b.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {b.status}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                            Email: <strong className="text-[#0d1400] font-normal">{b.email}</strong> • Registered: {b.registeredAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {b.status === 'active' && (
                          <button
                            onClick={() => handlePromoteUser(b)}
                            className="px-3 py-1.5 bg-neutral-100 hover:bg-[#aaff00] hover:text-[#0d1400] text-[#0d1400] border border-neutral-300 hover:border-[#0d1400] rounded-full text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <UserPlus className="w-3 h-3" />
                            Promote to Creator
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleBuyerStatus(b.uid)}
                          className={`px-3 py-1.5 border rounded-full text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1 ${b.status === 'suspended' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-500 hover:text-white' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-500 hover:text-white'}`}
                        >
                          <Ban className="w-3 h-3" />
                          {b.status === 'suspended' ? "Activate" : "Suspend"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: APPROVAL QUEUE */}
          {activeTab === 'approvals' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 border border-[#0d1400] bg-[#aaff00]/5 rounded-xl space-y-1">
                <p className="font-mono text-[10px] text-[#0d1400] uppercase font-bold">Trace & Rasterization Audits</p>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  The admin oversight pipeline checks all incoming vector paths to ensure high precision, closed paths, and no overlaps. Approved items are immediately populated into the live storefront catalog with a base 15% platform markup.
                </p>
              </div>

              <div className="border border-[#0d1400] bg-white rounded-xl overflow-hidden divide-y divide-[#0d1400]/10 shadow-xs">
                {pendingQueue.length === 0 ? (
                  <div className="p-16 text-center space-y-3 font-mono">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-[#0d1400] fill-[#aaff00]" />
                    <h4 className="font-bold text-sm">APPROVAL QUEUE CLEAR</h4>
                    <p className="text-[10px] text-neutral-400 max-w-xs mx-auto font-sans leading-relaxed">
                      All newly submitted vectors have been successfully evaluated. Ready for next community upload batch.
                    </p>
                  </div>
                ) : (
                  pendingQueue.map((item) => (
                    <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-neutral-100 border border-[#0d1400] p-0.5 shrink-0 rounded flex items-center justify-center overflow-hidden">
                          <DesignRenderer imageKey={item.imageKey} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-sans font-bold text-sm text-[#0d1400]">{item.title}</h4>
                            <span className="text-[9px] font-mono bg-neutral-100 border border-neutral-300 text-neutral-600 uppercase px-1.5 py-0.2">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                            By creator <span className="text-[#0d1400] font-bold">@{item.creatorName}</span> • Requested price: ${item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 font-mono text-[9px] uppercase font-bold text-neutral-500">
                            <span className="text-emerald-600">✓ VECTORS CLEANED</span>
                            <span>•</span>
                            <span className="text-emerald-600">✓ 300 DPI ALIGNMENT</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleRejectPending(item.id, item.title)}
                          className="px-4 py-2 border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-white rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          REJECT
                        </button>
                        
                        <button
                          onClick={() => handleApprovePending(item)}
                          className="px-4 py-2 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] border border-[#0d1400] rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          APPROVE TO LIVE
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SALES LEDGER */}
          {activeTab === 'sales' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 border border-[#0d1400] bg-white rounded-xl shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="font-sans font-bold text-sm">Recent Transactions Ledger</h3>
                    <p className="text-[10px] text-neutral-400 font-mono">Real-time breakdown of royalty checkouts and platform commissions.</p>
                  </div>
                  <div className="bg-[#aaff00]/10 text-[#0d1400] px-3 py-1 border border-[#0d1400]/20 text-[10px] font-mono font-bold uppercase rounded-md">
                    Total Transactions: {salesHistory.length}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-400 font-mono text-[9px] uppercase tracking-wider">
                        <th className="py-2.5">TXN ID</th>
                        <th className="py-2.5">Product</th>
                        <th className="py-2.5">Creator</th>
                        <th className="py-2.5">Total ($)</th>
                        <th className="py-2.5">Markup ($)</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-mono">
                      {salesHistory.map((txn) => (
                        <tr key={txn.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 font-bold text-[#0d1400]">{txn.id}</td>
                          <td className="py-3 font-sans font-semibold max-w-[150px] truncate text-[#0d1400]" title={txn.productTitle}>
                            {txn.productTitle}
                          </td>
                          <td className="py-3 text-[#0d1400]">@{txn.creatorName.split(' ')[0]}</td>
                          <td className="py-3 font-bold text-[#0d1400]">${txn.price.toFixed(2)}</td>
                          <td className="py-3 text-emerald-600 font-bold">+${txn.commission.toFixed(2)}</td>
                          <td className="py-3">
                            <span className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider ${txn.status === 'settled' ? 'bg-emerald-100 text-emerald-800' : txn.status === 'refunded' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                              {txn.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {txn.status === 'payout_pending' ? (
                              <button
                                onClick={() => handleTriggerPayout(txn.id)}
                                className="px-2 py-1 bg-[#0d1400] hover:bg-[#aaff00] hover:text-[#0d1400] text-white border border-[#0d1400] rounded text-[8px] font-bold uppercase cursor-pointer"
                              >
                                Pay Creator
                              </button>
                            ) : txn.status === 'settled' ? (
                              <button
                                onClick={() => handleTriggerRefund(txn.id)}
                                className="px-2 py-1 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 border border-red-200 rounded text-[8px] font-bold uppercase cursor-pointer"
                              >
                                Refund
                              </button>
                            ) : (
                              <span className="text-[9px] text-neutral-400">Locked</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM EVENT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border border-[#0d1400] bg-neutral-900 text-white rounded-xl p-5 font-mono text-xs space-y-3 shadow-inner max-h-[400px] overflow-y-auto select-all">
                <div className="flex justify-between items-center text-[#aaff00] border-b border-white/10 pb-2 mb-2 uppercase text-[10px] tracking-widest font-bold">
                  <span>Platform Incident & Audit Log</span>
                  <span className="animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#aaff00] rounded-full"></span>
                    SYSTEM STABLE
                  </span>
                </div>
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex justify-between gap-4 border-b border-white/5 pb-2">
                    <span className="text-neutral-500 shrink-0 select-none">[{log.time}]</span>
                    <span className={`flex-1 ${log.type === 'warn' ? 'text-red-400 font-semibold' : log.type === 'success' ? 'text-[#aaff00]' : 'text-neutral-300'}`}>
                      {log.event}
                    </span>
                    <span className="text-[9px] uppercase px-1 rounded-sm bg-white/5 text-neutral-400 select-none shrink-0 h-4 flex items-center">
                      {log.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: WEBSITE OPERATIONS / FLOW CONTROLS */}
          {activeTab === 'flow' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 border border-[#0d1400] bg-white rounded-xl space-y-6">
                <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#0d1400] tracking-tight flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-[#aaff00] fill-[#0d1400]" />
                      Global Operations & Controls
                    </h3>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mt-1">
                      Manipulate live user traffic, toggle access restrictions, or dynamically update monetization margins.
                    </p>
                  </div>
                  
                  {/* Preset Configurations */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleApplyPreset('default')}
                      className="px-2 py-1 bg-neutral-100 hover:bg-[#0d1400] hover:text-white border border-neutral-300 rounded text-[9px] font-mono font-bold uppercase cursor-pointer"
                      title="Load default settings"
                    >
                      Default
                    </button>
                    <button
                      onClick={() => handleApplyPreset('promo')}
                      className="px-2 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-emerald-800 rounded text-[9px] font-mono font-bold uppercase cursor-pointer"
                      title="Load summer drops promo settings"
                    >
                      Promo
                    </button>
                    <button
                      onClick={() => handleApplyPreset('lockdown')}
                      className="px-2 py-1 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 text-red-800 rounded text-[9px] font-mono font-bold uppercase cursor-pointer"
                      title="Load emergency shutdown/maintenance settings"
                    >
                      Lockdown
                    </button>
                  </div>
                </div>

                {configSaveSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-500 text-emerald-800 rounded-lg text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>SUCCESS: OPERATIONS PLATFORM CONFIGURATION APPLIED AND CACHED TO CLOUD INSTANCE!</span>
                  </div>
                )}

                <div className="space-y-5 divide-y divide-[#0d1400]/10">
                  {/* Section 1: Traffic & Flow Failsafes */}
                  <div className="space-y-4 pt-4 first:pt-0 border-none">
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#0d1400]">
                      I. Live Traffic & Security Failsafes
                    </h4>
                    
                    <div className="space-y-3">
                      {/* Maintenance Toggle */}
                      <label className="flex items-start gap-3 p-3 border border-neutral-200 hover:border-[#0d1400] rounded-xl cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={cfgMaintenance}
                          onChange={(e) => setCfgMaintenance(e.target.checked)}
                          className="mt-1 accent-[#0d1400]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[#0d1400] block">Enable Maintenance Mode (Site Lockout)</span>
                          <span className="text-neutral-400 font-sans text-[11px]">
                            Forces a premium "System Under Construction" splash screen for all regular visitors. (Administrators stay authenticated to bypass the lockout).
                          </span>
                        </div>
                      </label>

                      {/* Registration Restrictions */}
                      <label className="flex items-start gap-3 p-3 border border-neutral-200 hover:border-[#0d1400] rounded-xl cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={cfgDisableRegs}
                          onChange={(e) => setCfgDisableRegs(e.target.checked)}
                          className="mt-1 accent-[#0d1400]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[#0d1400] block">Lock User Registrations (Sign-ups Closed)</span>
                          <span className="text-neutral-400 font-sans text-[11px]">
                            Disables the sign-up feature. Recommended during promotional surges or server maintenance to preserve database pipelines.
                          </span>
                        </div>
                      </label>

                      {/* Free / Demo Download flow */}
                      <label className="flex items-start gap-3 p-3 border border-neutral-200 hover:border-[#0d1400] rounded-xl cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={cfgFreeDownloads}
                          onChange={(e) => setCfgFreeDownloads(e.target.checked)}
                          className="mt-1 accent-[#0d1400]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[#0d1400] block">Instant Demo Downloads (Bypass Payment Gateway)</span>
                          <span className="text-neutral-400 font-sans text-[11px]">
                            Overrides the checkout loop, marking all items as free and enabling instant zip/vector download triggers for effortless testing.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Section 2: Monetization Flow */}
                  <div className="space-y-4 pt-5">
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#0d1400]">
                      II. Platform Payout & Commission Margin
                    </h4>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold text-[#0d1400]">Platform Fee Percentage (%)</label>
                        <span className="font-mono text-[#0d1400] bg-neutral-100 px-2 py-0.5 rounded font-bold">{cfgCommission}% Commission</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="40"
                        step="1"
                        value={cfgCommission}
                        onChange={(e) => setCfgCommission(e.target.value)}
                        className="w-full accent-[#0d1400] cursor-pointer"
                      />
                      <p className="text-[10px] text-neutral-400 leading-normal">
                        Defines the percentage markup cut that InkWave keeps from each design download sale. Affects the dynamic "Est. Admin Commission" calculations on your admin overview.
                      </p>
                    </div>
                  </div>

                  {/* Section 3: Headline Announcement Slogan */}
                  <div className="space-y-4 pt-5">
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#0d1400]">
                      III. Storefront Landing Hero Copy
                    </h4>

                    <div className="space-y-3.5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-[#0d1400] uppercase font-bold">Primary Hero Headline</label>
                        <input
                          type="text"
                          value={cfgBannerText}
                          onChange={(e) => setCfgBannerText(e.target.value)}
                          placeholder="e.g. Premium Anime T-Shirt Designs Built To Sell"
                          className="w-full px-3 py-2.5 border border-[#0d1400] text-xs font-sans rounded-xl bg-white text-[#0d1400] focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-[#0d1400] uppercase font-bold">Hero Description Copy</label>
                        <textarea
                          rows={3}
                          value={cfgAnnounceSub}
                          onChange={(e) => setCfgAnnounceSub(e.target.value)}
                          placeholder="Provide a detailed storefront subtitle copy."
                          className="w-full px-3 py-2.5 border border-[#0d1400] text-xs font-sans rounded-xl bg-white text-[#0d1400] focus:outline-hidden resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Operations Action */}
                <div className="pt-4 border-t border-[#0d1400]/10 flex justify-end">
                  <button
                    onClick={async () => {
                      setIsConfigSaving(true);
                      setConfigSaveSuccess(false);
                      try {
                        const updated: PlatformConfig = {
                          maintenanceMode: cfgMaintenance,
                          disableRegistrations: cfgDisableRegs,
                          commissionFee: parseInt(cfgCommission, 10) || 15,
                          featuredBannerText: cfgBannerText,
                          announcementSub: cfgAnnounceSub,
                          allowInstantFreeDownloads: cfgFreeDownloads
                        };
                        await onUpdatePlatformConfig(updated);
                        setConfigSaveSuccess(true);
                        addLog(`Updated global platform configuration settings: Maintenance=${cfgMaintenance ? 'ON' : 'OFF'}, FreeDownloads=${cfgFreeDownloads ? 'ON' : 'OFF'}, Commission=${cfgCommission}%`, 'success');
                        setTimeout(() => setConfigSaveSuccess(false), 5000);
                      } catch (err) {
                        alert("Error saving settings: " + err);
                      } finally {
                        setIsConfigSaving(false);
                      }
                    }}
                    disabled={isConfigSaving}
                    className="px-6 py-3 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] disabled:bg-neutral-300 disabled:text-neutral-500 font-mono text-xs font-bold uppercase tracking-wider rounded-full border border-[#0d1400] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {isConfigSaving ? "Saving Configuration..." : "Save Operations Configuration"}
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* SIDE BAR: SPECIFIC DESIGN CONSOLE CONTROLS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-[#0d1400] bg-white rounded-[16px] p-6 space-y-6 sticky top-24 shadow-xs">
            <div>
              <h3 className="font-display font-bold text-lg text-[#0d1400] tracking-tight">
                Inspect / Edit License
              </h3>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                Select a live design from the catalog to adjust title, categories, tags, licensing rates, or archive it.
              </p>
            </div>

            {selectedProduct ? (
              <div className="space-y-4">
                {/* Visual Preview */}
                <div className="aspect-square border border-[#0d1400] bg-neutral-50 p-6 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <DesignRenderer imageKey={selectedProduct.imageKey} className="w-full h-full object-contain" />
                  <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono bg-[#0d1400] text-white px-2 py-0.5 rounded uppercase">
                    {selectedProduct.category}
                  </span>
                </div>

                {/* Input Fields */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="space-y-1">
                    <label className="block text-[9px] text-[#0d1400] uppercase font-bold">Design Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-[#0d1400] rounded bg-white text-[#0d1400]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[9px] text-[#0d1400] uppercase font-bold">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-2 py-2 border border-[#0d1400] rounded bg-white text-[#0d1400]"
                      >
                        <option value="One Piece">One Piece</option>
                        <option value="Naruto">Naruto</option>
                        <option value="Demon Slayer">Demon Slayer</option>
                        <option value="Attack on Titan">Attack on Titan</option>
                        <option value="Jujutsu Kaisen">Jujutsu Kaisen</option>
                        <option value="Dragon Ball">Dragon Ball</option>
                        <option value="Bleach">Bleach</option>
                        <option value="Death Note">Death Note</option>
                        <option value="Mecha">Mecha</option>
                        <option value="Samurai">Samurai</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] text-[#0d1400] uppercase font-bold">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-[#0d1400] rounded bg-white text-[#0d1400]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] text-[#0d1400] uppercase font-bold">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      className="w-full px-3 py-2 border border-[#0d1400] rounded bg-white text-[#0d1400]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] text-[#0d1400] uppercase font-bold">Description</label>
                    <textarea
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-[#0d1400] rounded bg-white text-[#0d1400] resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleSaveProductEdits(selectedProduct.id)}
                      className="flex-1 py-2 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] transition-all text-xs font-mono font-bold uppercase rounded border border-[#0d1400] cursor-pointer"
                    >
                      Save Updates
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="px-3 py-2 border border-neutral-300 hover:bg-neutral-50 rounded text-xs font-mono font-bold uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Actions list */}
                <div className="space-y-2 pt-3 border-t border-neutral-200">
                  <button
                    onClick={() => handleToggleFeatured(selectedProduct.id)}
                    className="w-full py-2.5 border border-[#0d1400] text-[#0d1400] hover:bg-neutral-50 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    {selectedProduct.badge === 'Trending' || selectedProduct.badge === 'Popular' ? "UNFEATURE FROM HOME" : "FEATURE ON FRONTPAGE"}
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(selectedProduct.id)}
                    className="w-full py-2.5 border border-red-200 hover:bg-red-500 hover:text-white rounded-lg text-red-500 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    DE-LIST & ARCHIVE LICENSE
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center border border-dashed border-[#0d1400]/20 rounded-xl space-y-2 text-neutral-400 font-mono text-xs">
                <Settings className="w-6 h-6 mx-auto text-neutral-300 animate-spin" style={{ animationDuration: '4s' }} />
                <p className="max-w-[180px] mx-auto text-[10px]">SELECT ANY LIVE LICENSE ON THE LEFT TO BEGIN REAL-TIME AUDITS</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CREATE PRODUCT CURATED MODAL FORM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1400]/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#0d1400] text-[#0d1400] flex flex-col max-h-[calc(100vh-2rem)] rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="p-5 border-b border-[#0d1400] flex justify-between items-center bg-neutral-50 shrink-0 font-mono">
              <div>
                <h3 className="font-display text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-[#aaff00] fill-[#0d1400]" />
                  Publish Curated Vector Design
                </h3>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
                  Directly populate the live catalog with premium artwork
                </p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 border border-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-colors rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="p-6 space-y-4 overflow-y-auto font-mono text-xs">
              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase font-bold text-neutral-500">Design Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimalist Samurai Crimson Moon"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#0d1400] rounded bg-white text-[#0d1400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase font-bold text-neutral-500">Category Collection</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2 py-2 border border-[#0d1400] rounded bg-white text-[#0d1400]"
                  >
                    <option value="One Piece">One Piece</option>
                    <option value="Naruto">Naruto</option>
                    <option value="Demon Slayer">Demon Slayer</option>
                    <option value="Attack on Titan">Attack on Titan</option>
                    <option value="Jujutsu Kaisen">Jujutsu Kaisen</option>
                    <option value="Dragon Ball">Dragon Ball</option>
                    <option value="Bleach">Bleach</option>
                    <option value="Death Note">Death Note</option>
                    <option value="Mecha">Mecha</option>
                    <option value="Samurai">Samurai</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase font-bold text-neutral-500">Base Licensing Rate ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[#0d1400] rounded bg-white text-[#0d1400]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase font-bold text-neutral-500">Artwork Model Preview</label>
                  <select
                    value={newImageKey}
                    onChange={(e) => setNewImageKey(e.target.value)}
                    className="w-full px-2 py-2 border border-[#0d1400] rounded bg-white text-[#0d1400]"
                  >
                    <option value="samurai_crimson">Samurai Crimson Moon (Red/Black)</option>
                    <option value="straw_hat_pirate">Straw Hat Pirate Skull (Ink Splatter)</option>
                    <option value="oni_mech">Oni Mech Purple (Violent HUD)</option>
                    <option value="cursed_eyes">Cursed King Eyes (Sukuna Lines)</option>
                    <option value="chakra_seal">Chakra Stomach Seal (Orange/Black)</option>
                    <option value="colossal_titan">Colossal Steam Giant (Woodblock print)</option>
                    <option value="shinigami_apple">Death God Red Apple (Minimalist)</option>
                    <option value="nichirin_wave">Nichirin Sword Wave (Blue Wave)</option>
                    <option value="hollow_mask">Hollow Mask Red Paint (Graffiti)</option>
                    <option value="power_level">Vaporwave HUD Power Scan (Green Radar)</option>
                  </select>
                </div>

                {/* Visual Thumbnail of selected artwork key */}
                <div className="border border-[#0d1400] bg-neutral-50 rounded flex items-center justify-center p-2 h-14 overflow-hidden">
                  <DesignRenderer imageKey={newImageKey} className="h-full object-contain" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase font-bold text-neutral-500">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. samurai, sun, minimalist, apparel"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 border border-[#0d1400] rounded bg-white text-[#0d1400]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase font-bold text-neutral-500">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#0d1400] rounded bg-white text-[#0d1400] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] font-mono text-xs font-bold uppercase tracking-wider transition-colors border border-[#0d1400] rounded-xl cursor-pointer mt-4"
              >
                Publish Curator Vector Design
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
