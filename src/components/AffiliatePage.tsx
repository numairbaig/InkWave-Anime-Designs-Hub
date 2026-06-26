import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, DollarSign, Award, ArrowUpRight, Check, X, ShieldCheck, 
  Users, TrendingUp, HelpCircle, ArrowLeft, RefreshCw, Send, CheckCircle2 
} from 'lucide-react';
import { saveAffiliateApplication } from '../lib/firebase';
import { UserProfile, AffiliateApplication } from '../types';

interface AffiliatePageProps {
  user: any;
  userProfile: UserProfile | null;
  onBack: () => void;
  onOpenAuth?: () => void;
}

export const AffiliatePage: React.FC<AffiliatePageProps> = ({
  user,
  userProfile,
  onBack,
  onOpenAuth
}) => {
  // Earnings Simulator State
  const [referrals, setReferrals] = useState(15);
  const [avgCart, setAvgCart] = useState(45);

  // Calculated stats
  const commissionFee = 15; // 15% commission
  const monthlyEarnings = referrals * avgCart * (commissionFee / 100);
  const annualEarnings = monthlyEarnings * 12;

  // Application Form State
  const [fullName, setFullName] = useState(userProfile?.displayName || '');
  const [email, setEmail] = useState(userProfile?.email || user?.email || '');
  const [platform, setPlatform] = useState('instagram');
  const [handle, setHandle] = useState('');
  const [followers, setFollowers] = useState('');
  const [motivation, setMotivation] = useState('');
  const [customPromo, setCustomPromo] = useState('AMB_ANIME_STREET');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // FAQs Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !handle || !followers || !motivation) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const appId = 'app_' + Math.random().toString(36).substring(2, 11);
      const appData: AffiliateApplication = {
        id: appId,
        userId: user ? user.uid : 'anonymous',
        fullName,
        email,
        platform,
        handle,
        followerCount: followers,
        motivation,
        promoCode: customPromo.toUpperCase().replace(/\s/g, ''),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await saveAffiliateApplication(appData);
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Error transmitting application. Please verify parameters.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FAQS = [
    {
      q: "How does the InkWave Ambassador program work?",
      a: "It is simple: you promote our elite anime design packs, vectors, and PNG sets using your exclusive referral link or customized promo code. When a buyer registers and completes any vector purchase, you securely receive 15% of the total checkout value directly to your account balance."
    },
    {
      q: "What is the cookie duration for referred buyers?",
      a: "We utilize a robust 30-day cookie window. If a creator or brand owner visits InkWave through your referral code and purchases any artwork bundle within 30 days, you get credited with the royalty."
    },
    {
      q: "Are there any minimum limits for payouts?",
      a: "No! Unlike legacy networks that hold your funds hostage, we settle payouts instantly on request once a month with no minimum threshold, sent securely via bank deposit or PayPal transfer."
    },
    {
      q: "Can I refer myself for purchases?",
      a: "Self-referrals are strictly prohibited. The program is designed to bring brand-new garment printers, apparel designers, and print-on-demand stores onto the InkWave platform. Self-referrals will lead to application closure."
    },
    {
      q: "Do I need a massive social media following to apply?",
      a: "Absolutely not! We value quality over quantity. If you run a YouTube channel reviewing apparel setups, write a high-vibe screen-printing blog, or share stunning design boards on Pinterest, you are a perfect candidate regardless of follower numbers."
    }
  ];

  return (
    <div id="affiliate-page" className="min-h-screen bg-white text-[#0d1400] pb-24">
      {/* Editorial Header */}
      <div className="border-b border-[#0d1400]/10 bg-neutral-50 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2 border border-[#0d1400]/15 hover:border-[#0d1400] text-[#0d1400] rounded-full text-xs font-mono font-bold uppercase transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Marketplace
          </button>
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold hidden sm:inline">
            // OFFICIAL PARTNER NETWORK
          </span>
        </div>
      </div>

      {/* Hero Visual Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#aaff00]/20 border border-[#0d1400]/20 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#0d1400] font-bold">
            <Zap className="w-3 h-3 text-[#0d1400] fill-current" />
            INKWAVE PARTNER HUB
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0d1400] leading-[1.05]">
            Monetize Creative Energy. Earn <span className="underline decoration-[#aaff00] decoration-8">15% Royalties</span>.
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 max-w-xl leading-relaxed font-sans">
            Print-on-demand brands, Etsy merchants, and custom streetwear shops constantly search for high-fidelity vectors to expand their apparel lines. Recommend our peer-vetted anime artwork downloads and claim recurring rewards.
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-4 pt-4 max-w-md">
            <div className="p-4 border border-[#0d1400] bg-neutral-50 rounded-xl space-y-1">
              <DollarSign className="w-5 h-5 text-[#0d1400] mb-1" />
              <div className="font-display font-black text-xl">15%</div>
              <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Per Sale Royalty</div>
            </div>
            <div className="p-4 border border-[#0d1400] bg-neutral-50 rounded-xl space-y-1">
              <Users className="w-5 h-5 text-[#0d1400] mb-1" />
              <div className="font-display font-black text-xl">30 Days</div>
              <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Cookie Window</div>
            </div>
            <div className="p-4 border border-[#0d1400] bg-neutral-50 rounded-xl space-y-1">
              <TrendingUp className="w-5 h-5 text-[#0d1400] mb-1" />
              <div className="font-display font-black text-xl">Instant</div>
              <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Payout Settled</div>
            </div>
          </div>
        </div>

        {/* Static Vector Decorative Board */}
        <div className="lg:col-span-5 border-2 border-[#0d1400] p-6 rounded-2xl bg-[#aaff00]/5 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#aaff00]/20 rounded-full blur-2xl -z-10" />
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#0d1400]/10 pb-4">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Ambassador Kit</span>
              <span className="font-mono text-[10px] text-[#0d1400] font-black uppercase bg-[#aaff00] px-2.5 py-0.5">Asset Active</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black text-2xl tracking-tight uppercase leading-none">VEND SANS DESIGN SYSTEM</h3>
              <p className="text-[11px] text-neutral-500 font-mono">RESOLUTIONS: CMYK SEPARATED // SVG SCALABLE // 300 DPI PNG</p>
            </div>
            <div className="p-4 border border-[#0d1400] bg-white rounded-xl space-y-1">
              <p className="text-[10px] font-mono uppercase text-neutral-400">Sample referral link</p>
              <p className="text-xs font-mono text-[#0d1400] font-bold overflow-x-auto no-scrollbar">
                https://inkwave.com/ref/amb_anime_street
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full border border-[#0d1400] bg-white flex items-center justify-center font-display font-extrabold text-[#0d1400]">
              IW
            </div>
            <div>
              <p className="text-xs font-bold font-display">InkWave Operations Group</p>
              <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">Compliance Registry Secure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20">
        <div className="border border-[#0d1400] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Inputs */}
          <div className="md:col-span-7 p-8 md:p-12 space-y-8 bg-neutral-50">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#0d1400] font-extrabold uppercase tracking-widest block">// PROJECTED ESTIMATOR</span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#0d1400] tracking-tight">
                Simulate Your Ambassador Earnings
              </h3>
              <p className="text-xs text-neutral-500 font-sans max-w-md leading-relaxed">
                Move the sliders to project how much you can earn based on monthly registered apparel checkout bundles.
              </p>
            </div>

            <div className="space-y-6">
              {/* Slider 1 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="uppercase tracking-wider text-neutral-500 font-bold">Monthly Referred Sales</span>
                  <span className="text-[#0d1400] font-black bg-white border border-[#0d1400] px-3 py-1 rounded-sm">{referrals} Purchases</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="150" 
                  value={referrals} 
                  onChange={(e) => setReferrals(parseInt(e.target.value))}
                  className="w-full accent-[#0d1400] cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                  <span>1 sale</span>
                  <span>150 sales</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="uppercase tracking-wider text-neutral-500 font-bold">Average Purchase Value</span>
                  <span className="text-[#0d1400] font-black bg-white border border-[#0d1400] px-3 py-1 rounded-sm">${avgCart} USD</span>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="300" 
                  value={avgCart} 
                  onChange={(e) => setAvgCart(parseInt(e.target.value))}
                  className="w-full accent-[#0d1400] cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                  <span>$15</span>
                  <span>$300</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Metrics Display */}
          <div className="md:col-span-5 bg-[#0d1400] text-white p-8 md:p-12 flex flex-col justify-between space-y-8 relative">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#aaff00] uppercase tracking-widest font-black block">EARNINGS SCOREBOARD</span>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Estimates based on our flat <span className="text-[#aaff00] font-mono font-bold">15% commission rate</span> per transaction.
              </p>
            </div>

            <div className="space-y-6 py-4">
              <div className="border-b border-neutral-800 pb-4">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Monthly Payout (Est.)</span>
                <span className="font-display font-black text-4xl sm:text-5xl text-[#aaff00] tracking-tighter">
                  ${monthlyEarnings.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Annual Payout (Est.)</span>
                <span className="font-display font-black text-2xl text-white tracking-tighter">
                  ${annualEarnings.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider border-t border-neutral-800 pt-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#aaff00]" />
              <span>Real-Time Bank Settlements Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forms & Steps Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Step Guide List */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#0d1400] uppercase tracking-widest font-extrabold block">// PROGRAM GUIDELINES</span>
            <h3 className="font-display font-bold text-2xl text-[#0d1400] tracking-tight">
              Three Steps to Infinite Royalties
            </h3>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              We look for creators, graphic designers, print consultants, and anime influencers who represent authentic street aesthetics.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#0d1400] text-[#aaff00] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#0d1400]">
                01
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm">Register Application</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                  Complete the authorized onboarding form on the right. Designate your target referral slug (promo code) to secure your tracking link.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-[#0d1400] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#0d1400]/20">
                02
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm">Promote InkWave Graphics</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                  Review our designs on TikTok, place pin boards on Pinterest, or embed referral links inside screen-printing design blogs.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-[#0d1400] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#0d1400]/20">
                03
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm">Claim Instant Bank Settles</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                  Watch sales update instantly in real-time in the secure cloud ledger. Claim payouts with no arbitrary retention delays.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel Container */}
        <div className="lg:col-span-7">
          <div className="border border-[#0d1400] rounded-2xl bg-white p-8 space-y-6 shadow-xs">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-16 h-16 bg-[#aaff00]/10 text-[#0d1400] border-2 border-[#0d1400] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#0d1400]" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-neutral-100 px-3 py-1 text-[#0d1400] font-bold">APPLICATION REGISTERED</span>
                  <h3 className="font-display font-extrabold text-2xl">Onboarding Complete!</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto font-sans leading-relaxed">
                    Thank you, {fullName}. Our editorial design guild is reviewing your channels. Your customized tracker slug <strong className="font-mono text-[#0d1400] font-extrabold bg-[#aaff00]/20 px-1.5 py-0.5 rounded">{customPromo.toUpperCase()}</strong> has been pre-allocated. Payout clearance details will follow via <strong>{email}</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 border border-[#0d1400] text-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-colors text-xs font-mono font-bold uppercase rounded-full cursor-pointer"
                >
                  Submit Another Form
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleApply} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-xl">Onboarding Application Form</h3>
                  <p className="text-xs text-neutral-500 font-sans">
                    Register your partner footprint securely below. Review cycles settle in 24 hours.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-mono uppercase tracking-wider border border-red-200">
                    {errorMessage}
                  </div>
                )}

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kenji Sato"
                      className="w-full px-4 py-2.5 border border-[#0d1400]/25 focus:border-[#0d1400] rounded-xl text-sm font-sans focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">Contact Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sato@gmail.com"
                      className="w-full px-4 py-2.5 border border-[#0d1400]/25 focus:border-[#0d1400] rounded-xl text-sm font-sans focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">Primary Platform *</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#0d1400]/25 bg-white focus:border-[#0d1400] rounded-xl text-sm font-sans focus:outline-hidden cursor-pointer"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube Creator</option>
                      <option value="tiktok">TikTok Channel</option>
                      <option value="pinterest">Pinterest Boards</option>
                      <option value="blog">Garment Printing Blog</option>
                      <option value="other">Other Referral Platform</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">Handle / URL *</label>
                    <input 
                      type="text" 
                      required
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="e.g. @sato_streetwear"
                      className="w-full px-4 py-2.5 border border-[#0d1400]/25 focus:border-[#0d1400] rounded-xl text-sm font-sans focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">Estimated Followers/Subscribers *</label>
                    <input 
                      type="text" 
                      required
                      value={followers}
                      onChange={(e) => setFollowers(e.target.value)}
                      placeholder="e.g. 15,000"
                      className="w-full px-4 py-2.5 border border-[#0d1400]/25 focus:border-[#0d1400] rounded-xl text-sm font-sans focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">Custom Referral Promo Code *</label>
                    <input 
                      type="text" 
                      required
                      value={customPromo}
                      onChange={(e) => setCustomPromo(e.target.value.toUpperCase().replace(/\s/g, ''))}
                      placeholder="AMB_ANIME_STREET"
                      className="w-full px-4 py-2.5 border border-[#0d1400]/25 focus:border-[#0d1400] rounded-xl text-sm font-mono uppercase focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold block">Explain Your Audience & Promotion Plan *</label>
                  <textarea 
                    required
                    rows={3}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Describe how you plan to refer customers (e.g. making tutorials on t-shirt mockups, reviewing vectors, sharing resources with clothing brand startups)..."
                    className="w-full px-4 py-3 border border-[#0d1400]/25 focus:border-[#0d1400] rounded-xl text-sm font-sans focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] transition-colors border border-[#0d1400] text-xs font-mono font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      SECURELY TRANSMITTING...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      SUBMIT APPLICATION
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-extrabold block">// FREQUENTLY ASKED QUESTIONS</span>
          <h3 className="font-display font-bold text-2xl sm:text-3xl">Answers to Every Onboarding Query</h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="border border-[#0d1400] rounded-xl bg-white overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex justify-between items-center bg-neutral-50/50 hover:bg-neutral-50 transition-colors font-display font-bold text-sm text-[#0d1400]"
                >
                  <span>{faq.q}</span>
                  <span className={`transform transition-transform text-xs text-neutral-400 font-mono ${isOpen ? 'rotate-45' : ''}`}>
                    {isOpen ? '✕' : '＋'}
                  </span>
                </button>
                {isOpen && (
                  <div className="p-5 border-t border-[#0d1400]/10 text-xs text-neutral-600 font-sans leading-relaxed bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
