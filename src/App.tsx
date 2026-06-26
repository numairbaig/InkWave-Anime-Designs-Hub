import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Product, Creator, UserProfile, PlatformConfig } from './types';
import { CATEGORIES_LIST } from './data';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { ProductDetail } from './components/ProductDetail';
import { CreatorProfileView } from './components/CreatorProfileView';
import { Dashboard } from './components/Dashboard';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AffiliateModal } from './components/AffiliateModal';
import { AffiliatePage } from './components/AffiliatePage';
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { DesignRenderer } from './components/DesignRenderer';
import { CollectionPageView } from './components/CollectionPageView';
import { AdminDashboard } from './components/AdminDashboard';
import { 
  getProductsFromDb, getCreatorsFromDb, saveProductToDb, saveCreatorToDb, deleteProductFromDb, auth, logoutUser, getUserProfile, saveUserProfile,
  getPlatformConfigFromDb, savePlatformConfigToDb
} from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthPage } from './components/AuthPage';
import { 
  Search, SlidersHorizontal, Heart, Download, Check, 
  HelpCircle, Zap, ShoppingBag, Award, ArrowUpRight, Github, X,
  Shield, Lock, LogOut, AlertOctagon, Twitter, Instagram, Youtube, Mail, ArrowRight, Send, MessageSquare, CheckCircle2
} from 'lucide-react';

export default function App() {
  // State synchronize
  const [products, setProducts] = useState<Product[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isCreatorLoading, setIsCreatorLoading] = useState(false);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  // Platform operational config
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>({
    maintenanceMode: false,
    disableRegistrations: false,
    commissionFee: 15,
    featuredBannerText: "Premium Anime T-Shirt Designs Built To Sell",
    announcementSub: "Download professionally crafted anime-inspired artwork ready for custom apparel brands, Etsy, and print-on-demand stores.",
    allowInstantFreeDownloads: false
  });

  
  // Navigation & Page State
  const [activeView, setActiveView] = useState<'marketplace' | 'dashboard' | 'admin' | 'affiliate' | 'terms' | 'privacy' | 'auth'>('marketplace');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // User authentication state
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [authActionPending, setAuthActionPending] = useState<{ type: 'buy' | 'sell'; data?: any } | null>(null);

  // Modals & Drawers state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [productToBuy, setProductToBuy] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);
  const [isIntellectualOpen, setIsIntellectualOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('inkwave_admin_authenticated') === 'true';
  });
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  // Footer Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setIsProfileLoading(true);
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching profile:', err);
        } finally {
          setIsProfileLoading(false);
        }
      } else {
        setUserProfile(null);
        setIsProfileLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Initialize products & creators from Firestore database
  useEffect(() => {
    async function initDbData() {
      setIsProductsLoading(true);
      try {
        const dbProducts = await getProductsFromDb();
        setProducts(dbProducts);
      } catch (err) {
        console.error('Failed to load products from Firestore:', err);
      }
      try {
        const dbCreators = await getCreatorsFromDb();
        setCreators(dbCreators);
      } catch (err) {
        console.error('Failed to load creators from Firestore:', err);
      }
      try {
        const dbConfig = await getPlatformConfigFromDb();
        setPlatformConfig(dbConfig);
      } catch (err) {
        console.error('Failed to load platform configuration:', err);
      } finally {
        setIsProductsLoading(false);
      }
    }
    initDbData();

    const savedFavs = localStorage.getItem('inkwave_favorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  // Handle secret routing (e.g. url path '/admin' or query '?admin=true' or '#admin')
  useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;

      if (path === '/admin' || searchParams.get('admin') === 'true' || hash === '#admin') {
        setActiveView('admin');
      }
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    window.addEventListener('hashchange', handleRouting);
    return () => {
      window.removeEventListener('popstate', handleRouting);
      window.removeEventListener('hashchange', handleRouting);
    };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterLoading(true);
    setTimeout(() => {
      setNewsletterLoading(false);
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => {
        setNewsletterSubscribed(false);
      }, 6000);
    }, 1000);
  };

  // Save favorites helper
  const handleToggleFavorite = (id: string) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((fId) => fId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('inkwave_favorites', JSON.stringify(updated));
  };

  const handleUpdatePlatformConfig = async (newConfig: PlatformConfig) => {
    try {
      await savePlatformConfigToDb(newConfig);
      setPlatformConfig(newConfig);
    } catch (err) {
      console.error('Failed to save platform operational config:', err);
    }
  };

  const handleAuthSuccess = () => {
    if (authActionPending) {
      if (authActionPending.type === 'buy') {
        const product = authActionPending.data;
        if (product) {
          setProductToBuy(product);
          setIsCheckoutOpen(true);
        }
      } else if (authActionPending.type === 'sell') {
        setActiveView('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setAuthActionPending(null);
    }
  };

  // Add Product from Creator Dashboard
  const handleAddProduct = async (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    await saveProductToDb(newProduct);
  };

  // Delete product from dashboard
  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await deleteProductFromDb(id);
  };

  // Sync products list modifications from Admin Dashboard to Firestore
  const handleUpdateProducts = async (newProductsList: Product[]) => {
    const deletedProducts = products.filter(p => !newProductsList.some(np => np.id === p.id));
    const modifiedProducts = newProductsList.filter(np => {
      const prev = products.find(p => p.id === np.id);
      return !prev || JSON.stringify(prev) !== JSON.stringify(np);
    });

    setProducts(newProductsList);

    for (const dp of deletedProducts) {
      try {
        await deleteProductFromDb(dp.id);
      } catch (err) {
        console.error(`Failed to delete product ${dp.id} from Firestore:`, err);
      }
    }

    for (const mp of modifiedProducts) {
      try {
        await saveProductToDb(mp);
      } catch (err) {
        console.error(`Failed to save product ${mp.id} to Firestore:`, err);
      }
    }
  };

  // Sync creators list modifications from Admin Dashboard to Firestore
  const handleUpdateCreators = async (newCreatorsList: Creator[]) => {
    const modifiedCreators = newCreatorsList.filter(nc => {
      const prev = creators.find(c => c.id === nc.id);
      return !prev || JSON.stringify(prev) !== JSON.stringify(nc);
    });

    setCreators(newCreatorsList);

    for (const mc of modifiedCreators) {
      try {
        await saveCreatorToDb(mc);
      } catch (err) {
        console.error(`Failed to save creator ${mc.id} to Firestore:`, err);
      }
    }
  };

  // Handle successful mock purchase
  const handlePurchaseSuccess = async (product: Product) => {
    if (!purchasedIds.includes(product.id)) {
      const updated = [...purchasedIds, product.id];
      setPurchasedIds(updated);
      
      const updatedProduct = { ...product, downloads: product.downloads + 1 };
      setProducts(prevProducts => prevProducts.map(p => {
        if (p.id === product.id) {
          return updatedProduct;
        }
        return p;
      }));
      await saveProductToDb(updatedProduct);
    }
  };

  // Filter Products based on category selection, search query and active tab pills
  const getFilteredProducts = () => {
    return products.filter((product) => {
      // 1. Category check
      const matchesCategory = selectedCategory 
        ? product.category === selectedCategory || product.tags.includes(selectedCategory)
        : true;

      // 2. Search query check
      const matchesSearch = searchQuery.trim() !== ''
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;

      // 3. Pill filter check
      let matchesFilter = true;
      if (activeFilter === 'Trending') {
        matchesFilter = product.badge === 'Trending' || product.downloads > 1200;
      } else if (activeFilter === 'New') {
        matchesFilter = product.badge === 'New Release' || product.id.startsWith('custom-p') || new Date(product.createdAt) > new Date('2026-04-01');
      } else if (activeFilter === 'Best Sellers') {
        matchesFilter = product.badge === 'Best Seller' || product.rating >= 4.9;
      } else if (activeFilter !== 'All') {
        // Specific style filter e.g. Samurai, Cyberpunk, Kawaii, Mecha, Streetwear
        matchesFilter = product.category === activeFilter || product.tags.includes(activeFilter);
      }

      return matchesCategory && matchesSearch && matchesFilter;
    });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedCreatorId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCreator = (creatorId: string) => {
    setIsCreatorLoading(true);
    setSelectedCreatorId(creatorId);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsCreatorLoading(false);
    }, 600);
  };

  const handleSelectCategory = (categoryTag: string | null) => {
    if (categoryTag === null) {
      setSelectedCategory(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCollectionLoading(true);
      setSelectedCategory(categoryTag);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setIsCollectionLoading(false);
      }, 600);
    }
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeCreator = creators.find((c) => c.id === selectedCreatorId);
  const creatorProducts = activeCreator 
    ? products.filter((p) => p.creatorId === activeCreator.id)
    : [];

  const activeCollection = CATEGORIES_LIST.find((c) => c.tag === selectedCategory);

  const favoritesList = products.filter((p) => favorites.includes(p.id));

  if (platformConfig.maintenanceMode && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 text-[#0d1400] font-sans antialiased flex flex-col justify-between p-6">
        <header className="max-w-7xl mx-auto w-full flex justify-between items-center py-4 border-b border-[#0d1400]/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0d1400] text-[#aaff00] rounded-sm flex items-center justify-center font-display font-black text-sm tracking-tighter">
              IW
            </div>
            <span className="font-display font-bold text-base tracking-tight text-[#0d1400]">
              InkWave
            </span>
          </div>
          <div>
            <button 
              onClick={() => {
                setActiveView('admin');
              }}
              className="px-4 py-2 border border-[#0d1400] text-[#0d1400] hover:bg-[#0d1400] hover:text-white rounded-full text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Staff Gateway
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center items-center text-center space-y-8 py-12">
          <div className="w-20 h-20 bg-neutral-100 text-[#ff2a3b] rounded-2xl flex items-center justify-center border border-[#ff2a3b]/10 shadow-xs">
            <AlertOctagon className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-neutral-100 text-[#0d1400] rounded-full text-[10px] font-mono uppercase tracking-widest font-bold">
              PLATFORM OFFLINE // SCHEDULED MAINTENANCE
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#0d1400] tracking-tight leading-[1.05]">
              InkWave is currently upgrading its engines.
            </h1>
            <p className="text-neutral-500 font-sans text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Our engineering guild is performing scheduled database optimizations to make vector loading even faster. Standard browse and checkouts are temporarily paused.
            </p>
          </div>

          <div className="w-full max-w-sm border border-[#0d1400] p-1 bg-white rounded-full relative overflow-hidden">
            <div className="h-2.5 bg-[#aaff00] rounded-full" style={{ width: '65%' }} />
          </div>

          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <span>Server status:</span>
            <span className="text-[#0d1400] font-bold">Safe Mode Active</span>
          </div>
        </main>

        <footer className="max-w-7xl mx-auto w-full text-center py-6 border-t border-[#0d1400]/10 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
          &copy; {new Date().getFullYear()} InkWave Ltd. All creator databases fully secure.
        </footer>

        {activeView === 'admin' && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-white border border-[#0d1400] rounded-2xl p-8 space-y-6 relative">
              <button 
                onClick={() => setActiveView('marketplace')}
                className="absolute top-4 right-4 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#0d1400] text-[#aaff00] rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 fill-[#aaff00] stroke-[#0d1400]" />
                </div>
                <h2 className="font-display font-black text-2xl uppercase tracking-tight text-[#0d1400]">
                  Repository Firewall
                </h2>
                <p className="text-xs text-neutral-400 font-mono leading-normal">
                  Staff gateway authentication required.
                </p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const userVal = formData.get('username');
                const passVal = formData.get('password');
                if (userVal === 'numairbaig' && passVal === 'NumairBaig7744$') {
                  setIsAdminAuthenticated(true);
                  localStorage.setItem('inkwave_admin_authenticated', 'true');
                  setActiveView('admin');
                } else {
                  alert('Invalid secure staff credentials!');
                }
              }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0d1400]">
                    Secure Username
                  </label>
                  <input 
                    name="username"
                    type="text" 
                    required
                    placeholder="e.g. administrator"
                    className="w-full px-4 py-3 text-xs border border-[#0d1400] rounded-xl focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0d1400]">
                    System Keyphrase
                  </label>
                  <input 
                    name="password"
                    type="password" 
                    required
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 text-xs border border-[#0d1400] rounded-xl focus:outline-hidden"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3.5 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] text-xs font-mono font-bold uppercase tracking-wider border border-[#0d1400] rounded-xl transition-colors cursor-pointer"
                >
                  Bypass Lockout
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0d1400] font-sans antialiased flex flex-col justify-between">
      
      {/* Dynamic Navigation Bar */}
      <Navigation 
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'dashboard' && !user) {
            setAuthActionPending({ type: 'sell' });
            setActiveView('auth');
          } else {
            setActiveView(view);
            setSelectedProduct(null);
            setSelectedCreatorId(null);
          }
        }}
        onScrollToSection={handleScrollToSection}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsWishlistOpen(true)}
        onOpenAffiliate={() => {
          setActiveView('affiliate');
          setSelectedProduct(null);
          setSelectedCreatorId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        userProfile={userProfile}
        onLogout={async () => {
          await logoutUser();
          setActiveView('marketplace');
        }}
        onOpenAuth={() => {
          setAuthActionPending(null);
          setActiveView('auth');
        }}
      />

      <div className="flex-1">
        {/* VIEW 1: CREATOR DASHBOARD VIEW */}
        {activeView === 'dashboard' ? (
          isProfileLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-[#0d1400]">
              <div className="w-12 h-12 border-4 border-[#0d1400] border-t-[#aaff00] rounded-full animate-spin"></div>
              <p className="font-mono text-xs uppercase tracking-widest mt-4">Loading your profile...</p>
            </div>
          ) : (
            <Dashboard 
              onAddProduct={handleAddProduct}
              creatorProducts={products.filter((p) => p.creatorId === (user ? user.uid : 'c1'))}
              onDeleteProduct={handleDeleteProduct}
              user={user}
              userProfile={userProfile}
              onUpgradeToCreator={async () => {
                if (user) {
                  const updated: UserProfile = {
                    uid: user.uid,
                    email: user.email || '',
                    displayName: userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'User',
                    role: 'creator',
                    createdAt: userProfile?.createdAt || new Date().toISOString()
                  };
                  await saveUserProfile(updated);
                  setUserProfile(updated);

                  // Create and save Creator document
                  const newCreator: Creator = {
                    id: user.uid,
                    name: updated.displayName,
                    username: user.email?.split('@')[0] || 'user',
                    avatarUrl: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    designsCount: 0,
                    followers: 0,
                    sales: 0,
                    bio: 'Graphic artist and premium design merchant.',
                    verified: false
                  };
                  await saveCreatorToDb(newCreator);
                  setCreators((prev) => [...prev, newCreator]);
                }
              }}
            />
          )
        ) : activeView === 'affiliate' ? (
          <AffiliatePage 
            user={user}
            userProfile={userProfile}
            onBack={() => {
              setActiveView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={() => {
              setAuthActionPending(null);
              setActiveView('auth');
            }}
          />
        ) : activeView === 'terms' ? (
          <TermsPage 
            onBack={() => {
              setActiveView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeView === 'privacy' ? (
          <PrivacyPage 
            onBack={() => {
              setActiveView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeView === 'admin' ? (
          isAdminAuthenticated ? (
            <AdminDashboard 
              products={products}
              creators={creators}
              onUpdateProducts={handleUpdateProducts}
              onUpdateCreators={handleUpdateCreators}
              onNavigateToView={(view) => {
                setActiveView(view);
                setSelectedProduct(null);
                setSelectedCreatorId(null);
              }}
              onLogout={() => {
                setIsAdminAuthenticated(false);
                localStorage.removeItem('inkwave_admin_authenticated');
                setActiveView('marketplace');
              }}
              platformConfig={platformConfig}
              onUpdatePlatformConfig={handleUpdatePlatformConfig}
            />
          ) : (
            /* Secure Inline Fallback Login Gate */
            <div className="min-h-[70vh] flex items-center justify-center p-4 bg-neutral-50">
              <div className="w-full max-w-md bg-white border border-[#0d1400] rounded-2xl p-8 space-y-6 shadow-xs animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-[#0d1400] text-[#aaff00] rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 fill-[#aaff00] stroke-[#0d1400]" />
                  </div>
                  <h2 className="font-display font-black text-2xl uppercase tracking-tight text-[#0d1400]">
                    Repository Firewall
                  </h2>
                  <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
                    Enter clearance for system operations
                  </p>
                </div>

                {adminLoginError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium font-mono uppercase">
                    {adminLoginError}
                  </div>
                )}
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const emailOrUser = formData.get('email') as string;
                  const pass = formData.get('password') as string;
                  setAdminLoginError(null);
                  setAdminLoginLoading(true);

                  // Local credential bypass (for offline/developer testing)
                  const isLocalAdmin = (emailOrUser === 'numairbaig' || emailOrUser === 'numairbaig@inkwave.com' || emailOrUser === 'admin@inkwave.com') && 
                                        pass === 'NumairBaig7744$';

                  if (isLocalAdmin) {
                    setIsAdminAuthenticated(true);
                    localStorage.setItem('inkwave_admin_authenticated', 'true');
                    setAdminLoginLoading(false);
                    return;
                  }

                  try {
                    // Try to log in with Firebase Authentication
                    const email = emailOrUser.includes('@') ? emailOrUser : `${emailOrUser}@inkwave.com`;
                    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
                    const firebaseUser = userCredential.user;
                    
                    // Retrieve user profile
                    let profile = await getUserProfile(firebaseUser.uid);
                    
                    // Designated admin email check
                    const isDesignatedAdmin = email.toLowerCase() === 'numairbaig@inkwave.com' || 
                                              email.toLowerCase() === 'admin@inkwave.com';

                    if (profile?.role === 'admin' || isDesignatedAdmin) {
                      // Seed profile if not set to admin
                      if (profile && profile.role !== 'admin') {
                        profile.role = 'admin';
                        await saveUserProfile(profile);
                      } else if (!profile) {
                        profile = {
                          uid: firebaseUser.uid,
                          email: email,
                          displayName: 'System Admin',
                          role: 'admin',
                          createdAt: new Date().toISOString()
                        };
                        await saveUserProfile(profile);
                      }
                      
                      setIsAdminAuthenticated(true);
                      localStorage.setItem('inkwave_admin_authenticated', 'true');
                    } else {
                      await logoutUser();
                      setAdminLoginError('Clearance denied: User lacks admin role privileges.');
                    }
                  } catch (err: any) {
                    console.error(err);
                    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                      setAdminLoginError('Invalid credentials. Clear clearances only.');
                    } else {
                      setAdminLoginError(err.message || 'Authentication protocol failed.');
                    }
                  } finally {
                    setAdminLoginLoading(false);
                  }
                }} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">Operator Email / Username</label>
                    <input 
                      name="email" 
                      type="text" 
                      required 
                      placeholder="e.g. numairbaig@inkwave.com"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-[#0d1400] rounded-xl text-sm font-sans focus:outline-hidden" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">Secure Passkey</label>
                    <input 
                      name="password" 
                      type="password" 
                      required 
                      placeholder="Enter passkey"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-[#0d1400] rounded-xl text-sm font-sans focus:outline-hidden" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={adminLoginLoading}
                    className="w-full py-3 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] disabled:bg-neutral-300 disabled:text-neutral-500 font-mono text-xs font-bold uppercase tracking-wider transition-colors border border-[#0d1400] rounded-xl cursor-pointer mt-2 flex items-center justify-center gap-2"
                  >
                    {adminLoginLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Authenticate Console'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )
        ) : activeView === 'auth' ? (
          <AuthPage 
            onBack={() => {
              setActiveView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAuthSuccess={handleAuthSuccess}
            onProfileUpdate={(profile) => setUserProfile(profile)}
            disableRegistrations={platformConfig.disableRegistrations}
          />
        ) : (
          /* VIEW 2: CORE MARKETPLACE VISUAL STAGE */
          <>
             {/* If Single product detail page is active */}
            {selectedProduct ? (
              <ProductDetail 
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
                onPurchase={(p) => {
                  if (!user) {
                    setAuthActionPending({ type: 'buy', data: p });
                    setActiveView('auth');
                  } else {
                    setProductToBuy(p);
                    setIsCheckoutOpen(true);
                  }
                }}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(selectedProduct.id)}
                onSelectCreator={handleSelectCreator}
              />
            ) : activeCreator ? (
              /* If Creator portfolio page is active */
              <CreatorProfileView 
                creator={activeCreator}
                creatorProducts={creatorProducts}
                onBack={() => setSelectedCreatorId(null)}
                onSelectProduct={handleSelectProduct}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                isLoading={isCreatorLoading}
              />
            ) : activeCollection ? (
              /* If Custom Anime Collection Page is active */
              <CollectionPageView 
                collection={activeCollection}
                products={products}
                favorites={favorites}
                onBack={() => handleSelectCategory(null)}
                onSelectProduct={handleSelectProduct}
                onToggleFavorite={handleToggleFavorite}
                isLoading={isCollectionLoading}
                onPurchase={(p) => {
                  if (!user) {
                    setAuthActionPending({ type: 'buy', data: p });
                    setActiveView('auth');
                  } else {
                    setProductToBuy(p);
                    setIsCheckoutOpen(true);
                  }
                }}
              />
            ) : (
              /* If Browse homepage is active */
              <div className="space-y-16 pb-16">
                
                {/* Visual Editorial Hero */}
                <Hero 
                  bannerText={platformConfig.featuredBannerText}
                  announcementSub={platformConfig.announcementSub}
                  onBrowseClick={() => handleScrollToSection('trending-section')}
                  onSellClick={() => {
                    if (!user) {
                      setAuthActionPending({ type: 'sell' });
                      setActiveView('auth');
                    } else {
                      setActiveView('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  onSelectCategory={handleSelectCategory}
                />

                {/* Categories Collections Card Row */}
                <div id="categories-section" className="max-w-7xl mx-auto px-4 md:px-8">
                  <Categories 
                    onSelectCategory={(categoryTag) => {
                      if (categoryTag === 'All') {
                        handleSelectCategory(null);
                      } else {
                        handleSelectCategory(categoryTag);
                      }
                    }}
                    selectedCategory={selectedCategory}
                    products={products}
                  />
                </div>

                {/* Main Design Marketplace Shelf */}
                <div id="trending-section" className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 pt-6">
                  
                  {/* Title & Filter pill bar */}
                  <div className="space-y-4 border-b border-[#0d1400]/10 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                          {selectedCategory ? `${selectedCategory} Collection` : 'Trending Anime Artwork'}
                        </h3>
                        <p className="text-xs text-neutral-500 font-mono mt-1">
                          {getFilteredProducts().length} PREMIUM MERCHANDISE PACKS DISCOVERED
                        </p>
                      </div>

                      {/* Large flat search bar */}
                      <div className="relative w-full md:w-80">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search premium designs..."
                          className="w-full pl-9 pr-4 py-2 bg-white border border-[#0d1400] text-[#0d1400] text-xs font-mono uppercase tracking-wider focus:ring-1 focus:ring-[#0d1400] focus:outline-hidden"
                        />
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                      </div>
                    </div>

                    {/* Filter Pills list */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
                      <div className="flex gap-1.5 shrink-0">
                        {[
                          'All', 'Trending', 'New', 'Best Sellers', 
                          'Cyberpunk', 'Samurai', 'Kawaii', 'Mecha', 'Streetwear'
                        ].map((pill) => {
                          const isActive = activeFilter === pill;
                          return (
                            <button
                              key={pill}
                              onClick={() => setActiveFilter(pill)}
                              className={`px-3.5 py-1.5 border font-mono text-[10px] uppercase tracking-wider font-bold transition-all duration-150 ${isActive ? 'bg-[#0d1400] text-white border-[#0d1400]' : 'bg-white text-[#0d1400] border-[#0d1400]/20 hover:border-[#0d1400]'}`}
                            >
                              {pill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Marketplace Designs Grid */}
                  <motion.div
                    key={`grid-${activeFilter}-${selectedCategory || 'all'}-${searchQuery}`}
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.05
                        }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  >
                    {isProductsLoading ? (
                      // 8 elegant skeletal cards that match the layout and design style of actual cards
                      Array.from({ length: 8 }).map((_, idx) => (
                        <div
                          key={`product-skeleton-${idx}`}
                          className="border border-[#0d1400]/10 bg-white overflow-hidden flex flex-col justify-between animate-pulse"
                          style={{ borderRadius: '12px' }}
                        >
                          {/* Image Box Skeleton */}
                          <div className="relative aspect-square border-b border-[#0d1400]/5 bg-neutral-50/70 p-6 flex items-center justify-center">
                            <div className="w-2/3 h-2/3 bg-[#0d1400]/5 rounded-xl border border-[#0d1400]/5"></div>
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
                    ) : getFilteredProducts().length === 0 ? (
                      <div className="col-span-full py-16 text-center border border-dashed border-[#0d1400]/20 space-y-3">
                        <SlidersHorizontal className="w-8 h-8 mx-auto text-neutral-300" />
                        <h4 className="font-display font-bold text-base">No designs match filter criteria</h4>
                        <p className="text-xs text-neutral-500 max-w-sm mx-auto font-sans leading-relaxed">
                          Try adjusting your filters, clearing the active collections, or search queries to discover related vector downloads.
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory(null);
                            setActiveFilter('All');
                          }}
                          className="px-4 py-1.5 border border-[#0d1400] text-xs font-mono font-bold uppercase hover:bg-neutral-50"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      getFilteredProducts().map((product) => {
                        const isFav = favorites.includes(product.id);
                        return (
                          <motion.div
                            key={product.id}
                            variants={{
                              hidden: { opacity: 0, y: 15 },
                              show: { 
                                opacity: 1, 
                                y: 0,
                                transition: {
                                  type: "spring",
                                  stiffness: 100,
                                  damping: 15,
                                }
                              }
                            }}
                            className="group border border-[#0d1400]/15 bg-white overflow-hidden transition-all duration-300 hover:border-[#0d1400] flex flex-col justify-between"
                            style={{ borderRadius: '12px' }}
                          >
                            {/* Graphic Canvas Render block */}
                            <div 
                              onClick={() => handleSelectProduct(product)}
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
                                <span className="bg-white border border-[#0d1400] px-4 py-2 text-xs font-mono font-bold text-[#0d1400] uppercase tracking-wider">
                                  Quick Preview
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
                                  onClick={() => handleSelectProduct(product)}
                                  className="font-display font-bold text-sm text-[#0d1400] line-clamp-1 hover:underline cursor-pointer"
                                >
                                  {product.title}
                                </h4>
                                
                                <button
                                  onClick={() => handleSelectCreator(product.creatorId)}
                                  className="text-[10px] font-mono text-neutral-500 hover:underline block text-left"
                                >
                                  @{product.creatorName}
                                </button>
                              </div>

                              {/* Foot pricing actions */}
                              <div className="flex items-center justify-between border-t border-[#0d1400]/5 pt-3 mt-auto">
                                <span className="font-mono font-bold text-sm text-[#0d1400]">
                                  ${product.price.toFixed(2)}
                                </span>
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => handleToggleFavorite(product.id)}
                                    className={`p-1.5 border ${isFav ? 'bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444]' : 'border-[#0d1400]/10 text-neutral-400 hover:text-[#0d1400] hover:border-[#0d1400]'} transition-colors rounded`}
                                  >
                                    <Heart className="w-4 h-4 fill-current" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </motion.div>
                </div>

                {/* Dynamic Ambassador promo board inside home */}
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <div className="border border-[#0d1400] p-6 md:p-10 bg-[#aaff00]/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2 text-center md:text-left max-w-xl">
                      <div className="inline-flex items-center gap-1.5 bg-[#0d1400] text-[#aaff00] text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5">
                        <Zap className="w-3 h-3 fill-current" />
                        InkWave Ambassador Affiliate Program
                      </div>
                      <h4 className="font-display font-bold text-xl md:text-2xl tracking-tight text-[#0d1400]">
                        Promote Anime Designs, Claim 15% Royalties
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                        Help merchants build the ultimate high-vibe streetwear drops. Create referral codes, link direct to premium vector downloads, and earn recurring payouts settled securely.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveView('affiliate');
                        setSelectedProduct(null);
                        setSelectedCreatorId(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] transition-colors text-xs font-mono font-bold uppercase tracking-wider border border-[#0d1400] shrink-0"
                    >
                      Get Referral Link
                    </button>
                  </div>
                </div>

              </div>
            )}
          </>
        )}
      </div>

      {/* FOOTER : Flat Editorial Minimalist layout */}
      <footer className="bg-[#050a00] text-[#ffffff] border-t border-neutral-900 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Top Big Branding Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800/80 pb-10 mb-8 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#aaff00] block">THE VECTOR REPOSITORY</span>
              <h2 className="font-display font-black text-4xl md:text-5xl tracking-tighter text-white uppercase select-none flex items-center gap-3">
                INKWAVE <span className="text-neutral-600 font-sans font-light text-2xl md:text-3xl">®</span>
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-mono max-w-md leading-relaxed md:text-right">
              Serving peer-vetted digital assets, high-resolution 300 DPI PNGs, and scalable SVG vectors for apparel design professionals.
            </p>
          </div>

          {/* Infinite Announcement Strip (Resolutions Section in Continuous Motion Left to Right) */}
          <div className="w-full overflow-hidden bg-[#111608]/40 border-y border-neutral-900/80 py-4 mb-12 relative rounded-xl">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050a00] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050a00] to-transparent z-10 pointer-events-none" />
            <div className="flex whitespace-nowrap overflow-x-hidden">
              <motion.div 
                initial={{ x: "-33.333%" }}
                animate={{ x: "0%" }}
                transition={{ ease: "linear", duration: 25, repeat: Infinity }}
                className="flex items-center gap-16 pr-16 text-[11px] font-mono tracking-wider shrink-0 select-none text-neutral-400"
              >
                {[1, 2, 3].map((setIndex) => (
                  <React.Fragment key={setIndex}>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#aaff00] rounded-full animate-pulse" />
                      300 DPI PNG LOSSLESS
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#aaff00] rounded-full animate-pulse" />
                      SCALABLE VECTOR SVG
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#aaff00] rounded-full animate-pulse" />
                      COMMERCIAL APPAREL LICENSE
                    </span>
                    <span className="flex items-center gap-2 text-[#aaff00] font-bold">
                      <span className="w-1.5 h-1.5 bg-[#aaff00] rounded-full animate-ping" />
                      100% CMYK VECTOR INK
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#aaff00] rounded-full animate-pulse" />
                      PEER-VETTED ORIGINAL ARTWORK
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#aaff00] rounded-full animate-pulse" />
                      INSTANT ASSET DECONSTRUCTION
                    </span>
                  </React.Fragment>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Main Grid: Responsive and beautiful layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
            
            {/* Column 1: Collections */}
            <div className="space-y-4 lg:pr-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block font-bold">Collections</span>
              <div className="flex flex-col gap-2.5 text-xs font-mono">
                {CATEGORIES_LIST.slice(0, 3).map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => { handleSelectCategory(cat.tag); }} 
                    className="text-left text-neutral-400 hover:text-[#aaff00] transition-all flex items-center group py-0.5"
                  >
                    <span className="w-0 group-hover:w-1.5 h-1.5 bg-[#aaff00] rounded-full mr-0 group-hover:mr-2 transition-all duration-300" />
                    {cat.name}
                  </button>
                ))}
                <button onClick={() => { handleSelectCategory(null); window.scrollTo({ top: 400, behavior: 'smooth' }); }} className="text-left text-[#aaff00] hover:text-white transition-all flex items-center group text-[11px] font-bold mt-1">
                  Browse All →
                </button>
              </div>
            </div>

            {/* Column 2: Platform & Creators */}
            <div className="space-y-4 md:border-x md:border-neutral-800/60 md:px-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block font-bold">Creators</span>
              <div className="flex flex-col gap-2.5 text-xs font-mono">
                <button onClick={() => { setActiveView('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left text-neutral-400 hover:text-[#aaff00] transition-all py-0.5">Creator Studio</button>
                <button onClick={() => {
                  setActiveView('affiliate');
                  setSelectedProduct(null);
                  setSelectedCreatorId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} className="text-left text-neutral-400 hover:text-[#aaff00] transition-all py-0.5">Ambassador Hub</button>
                <button onClick={() => {
                  if (!user) {
                    setAuthActionPending({ type: 'sell' });
                    setActiveView('auth');
                  } else {
                    setActiveView('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }} className="text-left text-neutral-400 hover:text-[#aaff00] transition-all py-0.5">Apply as Designer</button>
                <button onClick={() => setIsWishlistOpen(true)} className="text-left text-neutral-400 hover:text-[#aaff00] transition-all py-0.5">My Favorites</button>
              </div>
            </div>

            {/* Column 3: Stay Connected */}
            <div className="space-y-4 lg:pl-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block font-bold">Community</span>
              <div className="flex flex-col gap-3 font-mono text-xs">
                <a href="#" className="text-neutral-400 hover:text-[#aaff00] flex items-center gap-2 transition-all group py-0.5">
                  <Twitter className="w-4 h-4 text-neutral-500 group-hover:text-[#aaff00] transition-colors" />
                  <span>Twitter / X</span>
                </a>
                <a href="#" className="text-neutral-400 hover:text-[#aaff00] flex items-center gap-2 transition-all group py-0.5">
                  <Instagram className="w-4 h-4 text-neutral-500 group-hover:text-[#aaff00] transition-colors" />
                  <span>Instagram</span>
                </a>
                <a href="#" className="text-neutral-400 hover:text-[#aaff00] flex items-center gap-2 transition-all group py-0.5">
                  <MessageSquare className="w-4 h-4 text-neutral-500 group-hover:text-[#aaff00] transition-colors" />
                  <span>Discord Guild</span>
                </a>
                <a href="#" className="text-neutral-400 hover:text-[#aaff00] flex items-center gap-2 transition-all group py-0.5">
                  <Youtube className="w-4 h-4 text-neutral-500 group-hover:text-[#aaff00] transition-colors" />
                  <span>YouTube Labs</span>
                </a>
              </div>
            </div>

          </div>

          <hr className="border-neutral-900" />

          {/* Copy notes & Checkout Badges */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-mono text-neutral-400">
            <div className="space-y-2 text-center md:text-left">
              <p className="flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
                <span>© 2026 INKWAVE STUDIO INC. ALL GRAPHIC ASSETS REGISTERED UNDER LICENSED PROTOCOLS.</span>
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                <button 
                  onClick={() => {
                    setActiveView('terms');
                    setSelectedProduct(null);
                    setSelectedCreatorId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-white transition-colors cursor-pointer uppercase text-[10px]"
                >
                  Terms of Use
                </button>
                <span className="text-neutral-700">•</span>
                <button 
                  onClick={() => {
                    setActiveView('privacy');
                    setSelectedProduct(null);
                    setSelectedCreatorId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-white transition-colors cursor-pointer uppercase text-[10px]"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>

        </div>
      </footer>

      {/* INTERACTIVE PAYMENTS CHECKOUT MODAL */}
      {productToBuy && (
        <CheckoutModal 
          product={productToBuy}
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setProductToBuy(null);
          }}
          onPurchaseSuccess={handlePurchaseSuccess}
          allowInstantFreeDownloads={platformConfig.allowInstantFreeDownloads}
        />
      )}

      {/* WISHLIST/FAVORITES DRAWER */}
      <WishlistDrawer 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        favorites={favoritesList}
        onRemoveFavorite={handleToggleFavorite}
        onSelectProduct={handleSelectProduct}
      />

      {/* AMBASSADOR AFFILIATE PROMOTION MODAL */}
      <AffiliateModal 
        isOpen={isAffiliateOpen}
        onClose={() => setIsAffiliateOpen(false)}
      />

      {/* INTELLECTUAL RIGHTS INFORMATION MODAL */}
      {isIntellectualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1400]/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#0d1400] text-[#0d1400] flex flex-col overflow-hidden rounded-[12px] animate-fadeIn">
            <div className="p-5 border-b border-[#0d1400] flex justify-between items-center bg-neutral-50">
              <div>
                <h3 className="font-display text-lg font-bold">Intellectual Rights</h3>
                <p className="text-[10px] font-mono text-[#0d1400]/60 uppercase tracking-widest mt-0.5">Asset compliance & licensing</p>
              </div>
              <button 
                onClick={() => setIsIntellectualOpen(false)}
                className="p-2 border border-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-colors rounded-full cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs leading-relaxed text-neutral-600 font-sans">
              <p>
                All graphic vectors, typography styles, and illustrated artwork listed on the <strong>InkWave Digital Repository</strong> comply fully with standard copyright fair-use rules, custom screen print production parameters, and commercial licensing practices.
              </p>
              <div className="p-3 bg-[#aaff00]/5 border border-[#0d1400] rounded-lg">
                <p className="font-mono text-[10px] text-[#0d1400] font-bold uppercase mb-1">POD-Ready Guarantee</p>
                <p className="text-[11px] text-[#0d1400]/80 font-sans">
                  Files are vector-traced and pre-separated by original creators. When you purchase a design license, you get non-exclusive rights to print physical garments forever.
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-[#0d1400] bg-neutral-50 text-right">
              <button
                onClick={() => setIsIntellectualOpen(false)}
                className="px-6 py-2 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] text-xs font-mono font-bold uppercase transition-colors rounded-full border border-[#0d1400] cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURE ADMIN LOGIN OVERLAY */}
      {isAdminLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1400]/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#0d1400] text-[#0d1400] flex flex-col overflow-hidden rounded-[12px] animate-fadeIn">
            <div className="p-5 border-b border-[#0d1400] flex justify-between items-center bg-neutral-50">
              <div>
                <h3 className="font-display text-lg font-bold">Secure Access Portal</h3>
                <p className="text-[10px] font-mono text-[#0d1400]/60 uppercase tracking-widest mt-0.5">Authorized operators only</p>
              </div>
              <button 
                onClick={() => setIsAdminLoginOpen(false)}
                className="p-2 border border-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-colors rounded-full cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const user = formData.get('username') as string;
              const pass = formData.get('password') as string;
              if (user === 'numairbaig' && pass === 'NumairBaig7744$') {
                setIsAdminAuthenticated(true);
                localStorage.setItem('inkwave_admin_authenticated', 'true');
                setIsAdminLoginOpen(false);
                setActiveView('admin');
              } else {
                alert('Invalid security credentials. Access denied.');
              }
            }} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">Operator Username</label>
                <input 
                  name="username" 
                  type="text" 
                  required 
                  placeholder="e.g. numairbaig"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-[#0d1400]/20 rounded-xl text-sm font-sans focus:outline-hidden focus:border-[#0d1400]" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">Secure Passkey</label>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-[#0d1400]/20 rounded-xl text-sm font-sans focus:outline-hidden focus:border-[#0d1400]" 
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full py-3 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] font-mono text-xs font-bold uppercase tracking-wider transition-colors border border-[#0d1400] rounded-xl cursor-pointer mt-4"
              >
                Authorize Console
              </button>
            </form>
          </div>
        </div>
      )}



    </div>
  );
}
