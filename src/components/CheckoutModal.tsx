import React, { useState } from 'react';
import { Product } from '../types';
import { CreditCard, Download, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

interface CheckoutModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: (product: Product) => void;
  allowInstantFreeDownloads?: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  isOpen,
  onClose,
  onPurchaseSuccess,
  allowInstantFreeDownloads
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [licenseType, setLicenseType] = useState<'personal' | 'commercial' | 'extended'>('commercial');

  // Stripe Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  // PayPal Form State
  const [paypalEmail, setPaypalEmail] = useState('');

  if (!isOpen) return null;

  const getPrice = () => {
    if (allowInstantFreeDownloads) return 0;
    if (licenseType === 'personal') return product.price * 0.75;
    if (licenseType === 'extended') return product.price * 2.5;
    return product.price;
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate premium payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      onPurchaseSuccess({
        ...product,
        price: getPrice()
      });
    }, 2000);
  };

  const triggerRealDownload = (format: string) => {
    // Generate actual mockup or SVG code for a real file download!
    let fileContent = '';
    let fileName = `${product.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${format.toLowerCase()}`;
    let mimeType = 'text/plain';

    if (format === 'SVG') {
      mimeType = 'image/svg+xml';
      fileContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
        <!-- InkWave Premium Anime Vector Download: ${product.title} -->
        <rect width="100%" height="100%" fill="white" />
        <text x="50%" y="45%" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0d1400" text-anchor="middle">${product.title}</text>
        <text x="50%" y="55%" font-family="monospace" font-size="12" fill="#aaff00" text-anchor="middle">LICENSED FOR: ${licenseType.toUpperCase()} USE</text>
        <text x="50%" y="65%" font-family="sans-serif" font-size="10" fill="#666" text-anchor="middle">Premium Asset by InkWave Creator: ${product.creatorName}</text>
      </svg>`;
    } else {
      fileContent = `InkWave Premium T-Shirt Asset Package\n\nAsset: ${product.title}\nCategory: ${product.category}\nFormat: ${format}\nLicense: ${licenseType.toUpperCase()}\n\nThank you for your premium purchase on InkWave. Your download is complete.`;
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1400]/80 backdrop-blur-xs">
      <div 
        id="checkout-modal"
        className="w-full max-w-xl bg-white border border-[#0d1400] text-[#0d1400] flex flex-col overflow-hidden max-h-[90vh] rounded-[12px]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#0d1400] flex justify-between items-center bg-neutral-50">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight">
              {isComplete ? "Secure Download Portal" : "Secure Checkout"}
            </h3>
            <p className="text-xs text-[#0d1400]/50 font-mono mt-0.5">
              SECURE TLS 256-BIT ENCRYPTION
            </p>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-colors rounded-full"
          >
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider">CLOSE</span>
          </button>
        </div>

        {!isComplete ? (
          <form onSubmit={handlePayment} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Design summary */}
            <div className="flex gap-4 p-4 border border-[#0d1400] bg-neutral-50/50 rounded-[12px]">
              <div className="w-16 h-16 border border-[#0d1400] bg-white p-1 flex items-center justify-center shrink-0 rounded-lg overflow-hidden">
                <div className="text-[10px] font-mono text-center text-[#0d1400]/50">
                  Artwork Pre-render
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-mono bg-[#0d1400] text-white px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
                <h4 className="font-sans font-bold text-sm truncate mt-1.5 text-[#0d1400]">{product.title}</h4>
                <p className="text-xs text-neutral-500 font-mono mt-1">Creator: {product.creatorName}</p>
              </div>
            </div>

            {/* License Type Select */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-[#0d1400]/60 mb-2">
                License Agreement
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setLicenseType('personal')}
                  className={`p-3 text-left border rounded-[12px] transition-all ${licenseType === 'personal' ? 'border-[#0d1400] bg-neutral-50 ring-1 ring-[#0d1400]' : 'border-[#0d1400] hover:bg-neutral-50'}`}
                >
                  <p className="font-bold text-xs">Personal</p>
                  <p className="text-[10px] text-neutral-500 mt-1 font-mono">Single Project</p>
                  <p className="text-xs font-bold font-mono mt-2">${(product.price * 0.75).toFixed(2)}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setLicenseType('commercial')}
                  className={`p-3 text-left border rounded-[12px] transition-all ${licenseType === 'commercial' ? 'border-[#0d1400] bg-neutral-50 ring-1 ring-[#0d1400]' : 'border-[#0d1400] hover:bg-neutral-50'}`}
                >
                  <p className="font-bold text-xs flex items-center gap-1">
                    Commercial <span className="text-[9px] bg-[#aaff00] text-[#0d1400] px-1 font-bold border border-[#0d1400] rounded-full">POD</span>
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1 font-mono">Unlimited POD</p>
                  <p className="text-xs font-bold font-mono mt-2">${product.price.toFixed(2)}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setLicenseType('extended')}
                  className={`p-3 text-left border rounded-[12px] transition-all ${licenseType === 'extended' ? 'border-[#0d1400] bg-neutral-50 ring-1 ring-[#0d1400]' : 'border-[#0d1400] hover:bg-neutral-50'}`}
                >
                  <p className="font-bold text-xs">Extended</p>
                  <p className="text-[10px] text-neutral-500 mt-1 font-mono">Full Resale Right</p>
                  <p className="text-xs font-bold font-mono mt-2">${(product.price * 2.5).toFixed(2)}</p>
                </button>
              </div>
            </div>

            {allowInstantFreeDownloads ? (
              <div className="p-5 border border-emerald-500 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-sans space-y-2">
                <div className="font-bold flex items-center gap-1.5 font-mono text-[11px] uppercase text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Instant Free Trial Mode Active!
                </div>
                <p className="leading-relaxed text-[11px]">
                  The platform administrator has bypassed payment gateways for testing. You don't need to provide any credit card or billing details. Confirming below will instantly authorize download files!
                </p>
              </div>
            ) : (
              <>
                {/* Payment Method Switcher */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-[#0d1400]/60 mb-2">
                    Payment Provider
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`py-2.5 text-center text-xs font-mono uppercase tracking-wider border rounded-full transition-all ${paymentMethod === 'stripe' ? 'border-[#0d1400] bg-[#0d1400] text-white font-bold' : 'border-[#0d1400] hover:border-[#0d1400]/60 text-[#0d1400]'}`}
                    >
                      Stripe Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`py-2.5 text-center text-xs font-mono uppercase tracking-wider border rounded-full transition-all ${paymentMethod === 'paypal' ? 'border-[#0d1400] bg-[#0d1400] text-white font-bold' : 'border-[#0d1400] hover:border-[#0d1400]/60 text-[#0d1400]'}`}
                    >
                      PayPal Express
                    </button>
                  </div>
                </div>

                {/* Payment Input Fields */}
                {paymentMethod === 'stripe' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-[#0d1400] uppercase mb-1">
                        CARDHOLDER NAME
                      </label>
                      <input
                        type="text"
                        required={!allowInstantFreeDownloads}
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-2.5 border border-[#0d1400] focus:outline-hidden text-sm bg-white rounded-full"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#0d1400] uppercase mb-1">
                        CREDIT CARD NUMBER
                      </label>
                      <input
                        type="text"
                        required={!allowInstantFreeDownloads}
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-4 py-2.5 border border-[#0d1400] focus:outline-hidden text-sm font-mono bg-white rounded-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-[#0d1400] uppercase mb-1">
                          EXPIRY DATE
                        </label>
                        <input
                          type="text"
                          required={!allowInstantFreeDownloads}
                          maxLength={5}
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2.5 border border-[#0d1400] focus:outline-hidden text-sm font-mono bg-white rounded-full"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[#0d1400] uppercase mb-1">
                          CVV CODE
                        </label>
                        <input
                          type="password"
                          required={!allowInstantFreeDownloads}
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-4 py-2.5 border border-[#0d1400] focus:outline-hidden text-sm font-mono bg-white rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-[#0d1400] uppercase mb-1">
                        PAYPAL ACCOUNT EMAIL
                      </label>
                      <input
                        type="email"
                        required={!allowInstantFreeDownloads}
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="your-paypal-email@domain.com"
                        className="w-full px-4 py-2.5 border border-[#0d1400] focus:outline-hidden text-sm bg-white rounded-full"
                      />
                    </div>
                    <div className="p-4 bg-neutral-50 border border-[#0d1400] text-xs text-neutral-500 font-mono rounded-[12px]">
                      You will be redirected briefly to PayPal secure system to confirm transaction details.
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Bottom Info Banner */}
            <div className="flex items-center gap-2 p-3 bg-neutral-50 border border-[#0d1400] rounded-[12px]">
              <ShieldCheck className="w-5 h-5 text-neutral-500 shrink-0" />
              <p className="text-[10px] text-neutral-500 font-mono uppercase leading-tight">
                SSL Secured Transaction • 100% Satisfaction Guarantee • Instant File Access
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] font-mono font-bold tracking-widest text-xs uppercase border border-[#0d1400] transition-colors flex items-center justify-center gap-2 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:border-neutral-300 rounded-full cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  AUTHENTICATING TRANSACTION...
                </>
              ) : (
                `CONFIRM & DEPOSIT $${getPrice().toFixed(2)}`
              )}
            </button>
          </form>
        ) : (
          <div className="p-8 space-y-6 text-center overflow-y-auto">
            {/* Success icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#aaff00] rounded-full border-2 border-[#0d1400] mb-2">
              <CheckCircle2 className="w-9 h-9 text-[#0d1400]" />
            </div>

            <div>
              <h4 className="font-display text-2xl font-bold tracking-tight text-[#0d1400]">Payment Approved!</h4>
              <p className="text-xs text-neutral-500 font-mono mt-2">
                ORDER ID: IW-{(Math.random() * 1000000).toFixed(0)} • LICENSE: {licenseType.toUpperCase()}
              </p>
            </div>

            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Your account has been credited. The commercial high-resolution vector assets are available for instant download below.
            </p>

            {/* Download Grid */}
            <div className="border border-[#0d1400] divide-y divide-[#0d1400] bg-neutral-50 max-w-sm mx-auto rounded-[12px] overflow-hidden">
              {product.fileFormats.map((format) => (
                <div key={format} className="flex items-center justify-between p-3.5 text-left">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#0d1400]">{format} Package</span>
                    <p className="text-[9px] text-neutral-500 font-mono uppercase">Transparent vector artwork</p>
                  </div>
                  <button
                    onClick={() => triggerRealDownload(format)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-[#0d1400] text-xs font-mono font-bold hover:bg-[#aaff00] hover:text-[#0d1400] transition-colors rounded-full"
                  >
                    <Download className="w-3.5 h-3.5" />
                    DOWNLOAD
                  </button>
                </div>
              ))}
            </div>

            {/* Done and Back Button */}
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#0d1400] text-white border border-[#0d1400] hover:bg-[#aaff00] hover:text-[#0d1400] text-xs font-mono font-bold uppercase transition-colors rounded-full"
            >
              Return to Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
