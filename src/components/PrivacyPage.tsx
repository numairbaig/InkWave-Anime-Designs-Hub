import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, Search, Eye, Key, Database, RefreshCw, Layers } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const policies = [
    {
      id: "collection",
      title: "1. Information We Collect Securely",
      tags: ["auth", "google", "profile", "email", "data"],
      content: "When you sign in to InkWave via our Google Auth gateway, we fetch your unique database UID, secure verified email address, and user profile display avatar. No personal passwords or sensitive credentials are ever processed or cached within our systems. This profile data is used strictly to compile customized creator portfolio views and manage authorized buyer license catalogs."
    },
    {
      id: "payouts",
      title: "2. Payment Records & Merchant Auditing",
      tags: ["stripe", "payment", "sales", "royalties", "payouts"],
      content: "For creators earning royalties on our platform, we capture essential merchant records, including PayPal IDs, country codes, and transaction histories. For buyers, checkout transactions are processed by certified third-party token processors. Your full credit card numbers or banking passwords are never processed, stored, or visible on our nodes."
    },
    {
      id: "tracking",
      title: "3. Cookies & Referral Tracking Footprints",
      tags: ["cookies", "affiliate", "tracking", "ambassador"],
      content: "Our Ambassador Program uses standard, privacy-first browser tracking cookies to trace referral codes for up to 30 days. These cookies contain nothing but non-PII alphanumeric affiliate slugs to award sales credit to correct ambassadors."
    },
    {
      id: "storage",
      title: "4. Cloud Encryption & Data Integrity Pipelines",
      tags: ["security", "firebase", "firestore", "encryption"],
      content: "All design vectors, user profiles, and catalog entries are housed in encrypted Google Cloud Firestore instances with strict authorization rules. We enforce HTTPS protocols for all visual canvas renders, download distributions, and payload queries to prevent packet sniffing or malicious data injection."
    },
    {
      id: "compliance",
      title: "5. CCPA / GDPR Purge Guidelines & User Rights",
      tags: ["gdpr", "ccpa", "delete", "purge", "rights"],
      content: "You retain full ownership of your personal profile. Under GDPR and CCPA regulations, you have absolute rights to inspect, update, or completely delete your information. To request a complete database purge of your creator assets or purchase records, please submit a ticket via our operations team."
    }
  ];

  const getFilteredPolicies = () => {
    if (!searchQuery) return policies;
    const query = searchQuery.toLowerCase();
    return policies.filter(
      p => p.title.toLowerCase().includes(query) || 
           p.content.toLowerCase().includes(query) ||
           p.tags.some(t => t.includes(query))
    );
  };

  return (
    <div id="privacy-page" className="min-h-screen bg-white text-[#0d1400] pb-24 font-sans">
      {/* Editorial Header */}
      <div className="border-b border-[#0d1400]/10 bg-neutral-50 py-4">
        <div className="max-w-4xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2 border border-[#0d1400]/15 hover:border-[#0d1400] text-[#0d1400] rounded-full text-xs font-mono font-bold uppercase transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Marketplace
          </button>
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
            // DOCUMENT: INK_PRIVACY_V1.9
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-12 md:pt-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#aaff00]/20 border border-[#0d1400]/20 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#0d1400] font-bold">
          <Shield className="w-3 h-3 text-[#0d1400]" />
          SECURITY DECLARED
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0d1400] leading-none">
          InkWave Privacy Policy
        </h1>
        <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-500 uppercase tracking-wider pb-6 border-b border-[#0d1400]/10">
          <span>LAST MODIFIED: June 25, 2026</span>
          <span>•</span>
          <span>GOVERNING BODY: INKWAVE PRIVACY GUILD</span>
          <span>•</span>
          <span className="text-[#aaff00] bg-[#0d1400] font-bold px-2 py-0.5">SECURE SHIELD ACTIVE</span>
        </div>
      </div>

      {/* Interactive Search Tool */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10">
        <div className="bg-neutral-50 border border-[#0d1400] p-6 rounded-2xl space-y-4">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-sm">Policy Search Index</h4>
            <p className="text-[11px] text-neutral-500">
              Filter our clauses by keyword (e.g. type "cookies", "delete", "stripe", "firebase") to locate target policies instantly.
            </p>
          </div>
          <div className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search privacy topics..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#0d1400]/20 focus:border-[#0d1400] rounded-xl text-xs font-mono focus:outline-hidden uppercase tracking-wider"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 space-y-12">
        {getFilteredPolicies().length === 0 ? (
          <div className="py-12 text-center border border-dashed border-[#0d1400]/20 rounded-2xl text-neutral-400">
            <p className="text-sm font-mono uppercase tracking-wider">No matching policies located</p>
            <p className="text-xs font-sans mt-1">Try adjusting your keyword to find related security sections.</p>
          </div>
        ) : (
          getFilteredPolicies().map((p) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="font-display font-bold text-lg text-[#0d1400] flex items-center gap-2">
                {p.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">{p.content}</p>
              
              {/* Tags display */}
              <div className="flex gap-1.5 pt-1">
                {p.tags.map(t => (
                  <span key={t} className="text-[9px] font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded uppercase font-bold">
                    #{t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
