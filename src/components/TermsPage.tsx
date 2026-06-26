import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft, Check, BookOpen, Scale, FileText, AlertTriangle } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isCertified, setIsCertified] = useState(false);

  const sections = [
    {
      title: "1. Digital Asset Downloads & Commercial Licensing",
      content: "All vector illustrations, SVG paths, CMYK color maps, and high-resolution 300 DPI PNG designs hosted on the InkWave Digital Repository are licensed, not sold. Upon completing checkout, you are granted a non-exclusive, non-transferable, worldwide license to produce physical garments (such as t-shirts, hoodies, and jackets) bearing the purchased artwork. This commercial license permits production limits depending on checkout tiers, up to unlimited print runs."
    },
    {
      title: "2. Restricted Uses & Forbidden Exploitation",
      content: "You are strictly forbidden from copying, distributing, sub-licensing, or reselling any purchased digital files as standalone graphic assets, vector packs, NFTs, or templates. Redstributing files in shared Google Drives, Discord attachments, or community repositories is a direct violation of copyright laws. The license applies purely to physical merchandise production."
    },
    {
      title: "3. Creator Intellectual Property Protection",
      content: "Original creators on InkWave retain 100% ownership of their copyright, conceptual artwork, and vector layouts. InkWave serves as a curated digital gateway. Any unauthorized cloning, machine learning training scraping, or reverse engineering of creator designs constitutes copyright infringement and will result in direct asset removal and immediate platform closure."
    },
    {
      title: "4. No-Refund Settlement Policy",
      content: "Due to the irreversible, instantly downloadable nature of high-fidelity vector assets (SVGs, PNGs), all digital sales are final. We do not provide refunds, chargebacks, or credit exchanges. If a file is corrupted, our engineering guild guarantees replacement within 12 hours of ticket registration."
    },
    {
      title: "5. Platform Security & Automated Scraping Rules",
      content: "You are forbidden from deploying headless scrapers, web spiders, or automated script queries to copy files from the visual catalog stages. Account firewalls will permanently flag and ban malicious bot nets attempting resource exhaustion."
    }
  ];

  return (
    <div id="terms-page" className="min-h-screen bg-white text-[#0d1400] pb-24 font-sans">
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
            // DOCUMENT: INK_TERMS_V2.4
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-12 md:pt-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#aaff00]/20 border border-[#0d1400]/20 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#0d1400] font-bold">
          <Scale className="w-3 h-3 text-[#0d1400]" />
          LEGAL & COMPLIANCE
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0d1400] leading-none">
          InkWave Terms of Use
        </h1>
        <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-500 uppercase tracking-wider pb-6 border-b border-[#0d1400]/10">
          <span>LAST MODIFIED: June 25, 2026</span>
          <span>•</span>
          <span>GOVERNING BODY: INKWAVE LEGAL DIRECTORS</span>
          <span>•</span>
          <span className="text-[#0d1400] font-bold">PLATFORM: LIVE READY</span>
        </div>
      </div>

      {/* Terms Content & Interactive Side-Card */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="font-display font-bold text-lg text-[#0d1400]">{section.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Floating Certification Card */}
        <div className="lg:col-span-4 border border-[#0d1400] p-6 rounded-xl bg-neutral-50 space-y-6 lg:sticky lg:top-8">
          <div className="space-y-2">
            <span className="text-[9px] font-mono text-[#0d1400]/60 uppercase tracking-widest font-bold block">COMPLIANCE SIGN-OFF</span>
            <h4 className="font-display font-bold text-base">Acknowledge Regulations</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              By purchasing or selling design vectors on InkWave, you certify adherence to these legal parameters.
            </p>
          </div>

          <div className="border-t border-[#0d1400]/10 pt-4 space-y-4">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#0d1400]"
              />
              <span className="text-[11px] text-neutral-600 font-sans leading-tight">
                I agree to the commercial usage boundaries and download refund guidelines.
              </span>
            </label>

            {isCertified ? (
              <div className="p-3 bg-[#aaff00]/25 text-[#0d1400] border border-[#0d1400] rounded-lg text-center font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4 stroke-[3px]" />
                Regulations Certified
              </div>
            ) : (
              <button
                disabled={!isChecked}
                onClick={() => setIsCertified(true)}
                className="w-full py-2.5 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] transition-colors border border-[#0d1400] text-[10px] font-mono font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed rounded-lg cursor-pointer"
              >
                Certify Adherence
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
