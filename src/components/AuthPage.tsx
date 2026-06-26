import React, { useState } from 'react';
import { Mail, Lock, Shield, Zap, User, Layers, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { auth, loginWithGoogle, getUserProfile, saveUserProfile, saveCreatorToDb } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { UserProfile, Creator } from '../types';

interface AuthPageProps {
  onBack: () => void;
  onAuthSuccess?: () => void;
  onProfileUpdate?: (profile: UserProfile) => void;
  disableRegistrations?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  onBack, 
  onAuthSuccess, 
  onProfileUpdate, 
  disableRegistrations 
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'buyer' | 'creator'>('buyer');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [tempGoogleUser, setTempGoogleUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const gUser = await loginWithGoogle();
      const existingProfile = await getUserProfile(gUser.uid);
      if (!existingProfile) {
        if (disableRegistrations) {
          setError("New registrations are temporarily suspended by the operations admin. Please check back later!");
          setLoading(false);
          return;
        }
        // First-time google user: show role selection step
        setTempGoogleUser(gUser);
        setShowRoleSelection(true);
      } else {
        if (onProfileUpdate) onProfileUpdate(existingProfile);
        if (onAuthSuccess) onAuthSuccess();
        onBack();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempGoogleUser) return;
    setLoading(true);
    setError(null);
    try {
      const profile: UserProfile = {
        uid: tempGoogleUser.uid,
        email: tempGoogleUser.email || '',
        displayName: tempGoogleUser.displayName || 'Creator User',
        role: role,
        createdAt: new Date().toISOString()
      };
      await saveUserProfile(profile);
      
      if (role === 'creator') {
        const newCreator: Creator = {
          id: tempGoogleUser.uid,
          name: profile.displayName,
          username: profile.email.split('@')[0] || 'user',
          avatarUrl: tempGoogleUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          designsCount: 0,
          followers: 0,
          sales: 0,
          bio: 'Graphic artist and premium design merchant.',
          verified: false
        };
        await saveCreatorToDb(newCreator);
      }

      if (onProfileUpdate) onProfileUpdate(profile);
      if (onAuthSuccess) onAuthSuccess();
      onBack();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save your account type choice.');
    } finally {
      setLoading(false);
      setShowRoleSelection(false);
      setTempGoogleUser(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (disableRegistrations) {
          setError("New registrations are temporarily suspended by the operations admin. Please check back later!");
          setLoading(false);
          return;
        }
        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update display name if provided
        if (displayName && userCredential.user) {
          await updateProfile(userCredential.user, { displayName });
        }
        // Save user profile with selected role in firestore
        const profile: UserProfile = {
          uid: userCredential.user.uid,
          email: email,
          displayName: displayName || 'User',
          role: role,
          createdAt: new Date().toISOString()
        };
        await saveUserProfile(profile);

        if (role === 'creator') {
          const newCreator: Creator = {
            id: userCredential.user.uid,
            name: profile.displayName,
            username: profile.email.split('@')[0] || 'user',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            designsCount: 0,
            followers: 0,
            sales: 0,
            bio: 'Graphic artist and premium design merchant.',
            verified: false
          };
          await saveCreatorToDb(newCreator);
        }

        if (onProfileUpdate) onProfileUpdate(profile);
      } else {
        // Login user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const profile = await getUserProfile(userCredential.user.uid);
        if (!profile) {
          const fallbackProfile: UserProfile = {
            uid: userCredential.user.uid,
            email: email,
            displayName: userCredential.user.displayName || email.split('@')[0] || 'User',
            role: 'buyer',
            createdAt: new Date().toISOString()
          };
          await saveUserProfile(fallbackProfile);
          if (onProfileUpdate) onProfileUpdate(fallbackProfile);
        } else {
          if (onProfileUpdate) onProfileUpdate(profile);
        }
      }
      if (onAuthSuccess) onAuthSuccess();
      onBack();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showRoleSelection) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-neutral-50 animate-fadeIn">
        <div className="w-full max-w-md bg-white border border-[#0d1400] text-[#0d1400] flex flex-col rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-[#0d1400] flex justify-between items-center bg-neutral-50 shrink-0">
            <div>
              <h3 className="font-display text-lg font-black uppercase tracking-tight">
                Select Account Type
              </h3>
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">
                Complete your InkWave profile setup
              </p>
            </div>
          </div>

          <form onSubmit={handleRoleSelectionSubmit} className="p-6 space-y-6">
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              Welcome <span className="font-bold text-[#0d1400]">{tempGoogleUser?.displayName}</span>! Please choose your primary account goal below:
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-4 border-2 rounded-xl text-left transition-all flex flex-col justify-between h-32 cursor-pointer ${role === 'buyer' ? 'border-[#0d1400] bg-[#aaff00]/10' : 'border-[#0d1400]/10 hover:border-[#0d1400]/30'}`}
              >
                <div className={`p-2 rounded-lg w-fit ${role === 'buyer' ? 'bg-[#0d1400] text-[#aaff00]' : 'bg-neutral-100 text-neutral-400'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider block text-[#0d1400]">Buyer</span>
                  <span className="text-[10px] text-neutral-400 font-sans mt-0.5 block">Download vector art templates.</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('creator')}
                className={`p-4 border-2 rounded-xl text-left transition-all flex flex-col justify-between h-32 cursor-pointer ${role === 'creator' ? 'border-[#0d1400] bg-[#aaff00]/10' : 'border-[#0d1400]/10 hover:border-[#0d1400]/30'}`}
              >
                <div className={`p-2 rounded-lg w-fit ${role === 'creator' ? 'bg-[#0d1400] text-[#aaff00]' : 'bg-neutral-100 text-neutral-400'}`}>
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider block text-[#0d1400]">Creator/Seller</span>
                  <span className="text-[10px] text-neutral-400 font-sans mt-0.5 block">Upload designs & earn royalties.</span>
                </div>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] font-mono text-xs font-bold uppercase tracking-wider transition-colors border border-[#0d1400] rounded-xl cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Confirm & Setup Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 bg-white text-[#0d1400] overflow-hidden animate-fadeIn">
      
      {/* Left Column: Visual Artwork and Selling points (Sleek Dark Theme) */}
      <div className="lg:col-span-5 relative bg-gradient-to-br from-[#0d1400] via-[#1a2c03] to-[#050800] text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden border-r border-[#0d1400]">
        
        {/* Abstract background graphics (HUD details) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <circle cx="90%" cy="10%" r="200" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5 10" />
            <circle cx="10%" cy="80%" r="150" fill="none" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        {/* Back Button */}
        <button 
          onClick={onBack}
          className="relative z-10 flex items-center gap-2 text-xs font-mono text-[#aaff00] hover:underline uppercase tracking-wider cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>

        {/* Core Marketing message */}
        <div className="space-y-6 relative z-10 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#aaff00]/10 border border-[#aaff00]/30 rounded-full">
            <Zap className="w-3.5 h-3.5 text-[#aaff00]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#aaff00] font-bold">INKWAVE CREATOR NETWORK</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-extrabold uppercase tracking-tight leading-none text-white max-w-sm">
            Access The Ultimate Anime Asset Vault.
          </h2>

          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-sans max-w-md">
            Download vector source files, manage your royalties, and join the leading community of custom streetwear clothing brand designers.
          </p>

          {/* Feature list */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-[#aaff00]/20 text-[#aaff00] rounded-sm">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">Commercial merchandise licensing</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-1 bg-[#aaff00]/20 text-[#aaff00] rounded-sm">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">SVG Vectors & high-res 300 DPI PNGs</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-1 bg-[#aaff00]/20 text-[#aaff00] rounded-sm">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">15% commission fees for artist sales</span>
            </div>
          </div>
        </div>

        {/* Footer Brand Info */}
        <div className="relative z-10 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          INKWAVE EST. 2026 // SECURED GATEWAY
        </div>
      </div>

      {/* Right Column: Interactive Login/Signup Form */}
      <div className="lg:col-span-7 p-6 md:p-16 flex flex-col justify-center bg-white">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          {/* Headline Tabs */}
          <div className="space-y-4">
            <div className="flex border-b border-neutral-200">
              <button
                onClick={() => { setIsSignUp(false); setError(null); }}
                className={`flex-1 pb-3 text-sm font-mono uppercase tracking-wider font-bold transition-colors border-b-2 text-center cursor-pointer ${!isSignUp ? 'border-[#0d1400] text-[#0d1400]' : 'border-transparent text-neutral-400 hover:text-[#0d1400]/75'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsSignUp(true); setError(null); }}
                className={`flex-1 pb-3 text-sm font-mono uppercase tracking-wider font-bold transition-colors border-b-2 text-center cursor-pointer ${isSignUp ? 'border-[#0d1400] text-[#0d1400]' : 'border-transparent text-neutral-400 hover:text-[#0d1400]/75'}`}
              >
                Sign Up
              </button>
            </div>
            
            <p className="text-xs text-neutral-500">
              {isSignUp 
                ? 'Create a new buyer or seller account to start managing your premium digital designs.' 
                : 'Sign in to access your purchased downloads, creator tools, and user console.'
              }
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Social Sign-in Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 border border-[#0d1400] hover:bg-neutral-50 transition-colors rounded-xl flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Separator */}
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-300 uppercase tracking-widest my-2">
            <div className="h-px bg-neutral-200 flex-1"></div>
            <span>or email gateway</span>
            <div className="h-px bg-neutral-200 flex-1"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5 animate-slideDown">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-[#0d1400]/20 rounded-xl text-sm font-sans focus:outline-hidden focus:border-[#0d1400] transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-[#0d1400]/20 rounded-xl text-sm font-sans focus:outline-hidden focus:border-[#0d1400] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-2.5 bg-neutral-50 border border-[#0d1400]/20 rounded-xl text-sm font-sans focus:outline-hidden focus:border-[#0d1400] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-neutral-400 hover:text-[#0d1400]"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2 pt-1 animate-slideDown">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">
                  Account Intention
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`py-2 px-3 border-2 rounded-xl text-center text-xs font-mono font-bold transition-all cursor-pointer ${role === 'buyer' ? 'border-[#0d1400] bg-[#aaff00]/10 text-[#0d1400]' : 'border-[#0d1400]/10 text-neutral-400 hover:border-[#0d1400]/30'}`}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('creator')}
                    className={`py-2 px-3 border-2 rounded-xl text-center text-xs font-mono font-bold transition-all cursor-pointer ${role === 'creator' ? 'border-[#0d1400] bg-[#aaff00]/10 text-[#0d1400]' : 'border-[#0d1400]/10 text-neutral-400 hover:border-[#0d1400]/30'}`}
                  >
                    Creator / Seller
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] font-mono text-xs font-bold uppercase tracking-wider transition-colors border border-[#0d1400] rounded-xl cursor-pointer mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <p className="text-[10px] text-neutral-400 text-center leading-normal max-w-[280px] mx-auto font-sans">
            By signing in, you agree to our Terms of Service & Privacy Policy guidelines.
          </p>

        </div>
      </div>
      
    </div>
  );
};
