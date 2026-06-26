import React, { useState } from 'react';
import { X, Mail, Lock, Shield, User, Layers } from 'lucide-react';
import { auth, loginWithGoogle, getUserProfile, saveUserProfile, saveCreatorToDb } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { UserProfile, Creator } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
  onProfileUpdate?: (profile: UserProfile) => void;
  disableRegistrations?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, onProfileUpdate, disableRegistrations }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'buyer' | 'creator'>('buyer');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [tempGoogleUser, setTempGoogleUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
        onClose();
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
      onClose();
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
      onClose();
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1400]/80 backdrop-blur-xs">
        <div className="w-full max-w-md bg-white border border-[#0d1400] text-[#0d1400] flex flex-col max-h-[calc(100vh-2rem)] rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-5 border-b border-[#0d1400] flex justify-between items-center bg-neutral-50 shrink-0">
            <div>
              <h3 className="font-display text-lg font-black uppercase tracking-tight">
                Select Account Type
              </h3>
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">
                Complete your InkWave profile setup
              </p>
            </div>
            <button 
              onClick={() => {
                setShowRoleSelection(false);
                setTempGoogleUser(null);
                onClose();
              }}
              className="p-2 border border-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-colors rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleRoleSelectionSubmit} className="p-6 space-y-6 overflow-y-auto">
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              Welcome <span className="font-bold text-[#0d1400]">{tempGoogleUser?.displayName}</span>! To help us tailor your experience, please choose your primary account goal below:
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1400]/80 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-[#0d1400] text-[#0d1400] flex flex-col max-h-[calc(100vh-2rem)] rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="p-5 border-b border-[#0d1400] flex justify-between items-center bg-neutral-50 shrink-0">
          <div>
            <h3 className="font-display text-lg font-black uppercase tracking-tight">
              {isSignUp ? 'Create your InkWave Account' : 'Welcome back to InkWave'}
            </h3>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">
              {isSignUp ? 'Start downloading & selling designs' : 'Sign in to access your designs'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border border-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-colors rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Social login option */}
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

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 uppercase tracking-widest my-2">
            <div className="h-px bg-neutral-200 flex-1"></div>
            <span>or</span>
            <div className="h-px bg-neutral-200 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-[#0d1400]/20 rounded-xl text-sm font-sans focus:outline-hidden focus:border-[#0d1400]"
                />
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
                  className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-[#0d1400]/20 rounded-xl text-sm font-sans focus:outline-hidden focus:border-[#0d1400]"
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
                  type="password"
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-[#0d1400]/20 rounded-xl text-sm font-sans focus:outline-hidden focus:border-[#0d1400]"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`py-2 px-3 border-2 rounded-xl text-center text-xs font-mono font-bold transition-all cursor-pointer ${role === 'buyer' ? 'border-[#0d1400] bg-[#aaff00]/10 text-[#0d1400]' : 'border-[#0d1400]/10 text-neutral-400 hover:border-[#0d1400]/30'}`}
                  >
                    Buyer Account
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
              className="w-full py-3 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] font-mono text-xs font-bold uppercase tracking-wider transition-colors border border-[#0d1400] rounded-xl cursor-pointer mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Switch Tab */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-xs font-mono text-[#0d1400]/70 hover:text-[#0d1400] hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
