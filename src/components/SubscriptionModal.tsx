import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Copy, CheckCircle, Clock, Shield, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface SubscriptionModalProps {
  onClose: () => void;
}

const UPI_ID = 'kousar.nlr@axl';

export default function SubscriptionModal({ onClose }: SubscriptionModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'3months' | '6months'>('3months');

  const plans = {
    '3months': { label: '3 Months', price: '₹499', savings: null },
    '6months': { label: '6 Months', price: '₹699', savings: 'Save ₹299' },
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaidClick = () => {
    const plan = plans[selectedPlan];
    const message = encodeURIComponent(
      `Hello, I have paid ${plan.price} for the ${plan.label} Loco Pilot Psychometric Test Series subscription. Please activate my account.\n\nUPI ID paid to: ${UPI_ID}`
    );
    window.open(`https://wa.me/919491917842?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-700/60 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-gray-900 border-b border-gray-700/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Shield size={16} className="text-blue-400" />
              </div>
              <h2 className="text-white font-bold text-lg">Activate Your Subscription</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Plan selection */}
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Choose a Plan
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(plans) as [keyof typeof plans, typeof plans[keyof typeof plans]][]).map(([key, plan]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      selectedPlan === key
                        ? 'border-blue-500 bg-blue-600/15'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    {plan.savings && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full">
                        {plan.savings}
                      </span>
                    )}
                    <div className="text-2xl font-black text-white">{plan.price}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{plan.label} access</div>
                    {selectedPlan === key && (
                      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-3 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                Scan to Pay via PhonePe / UPI
              </p>
              <div className="w-48 h-48 bg-white rounded-xl p-2 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/images/Phone_pe_QR_Code_Kousar.jpeg"
                  alt="PhonePe UPI QR Code - Pathan Kousar"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <p className="text-gray-500 text-xs">PATHAN KOUSAR</p>
            </div>

            {/* UPI ID */}
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">
                UPI ID
              </p>
              <div className="flex items-center gap-2 p-3 bg-gray-800/70 border border-gray-700/50 rounded-xl">
                <CreditCard size={16} className="text-blue-400 flex-shrink-0" />
                <span className="flex-1 text-white font-mono text-sm">{UPI_ID}</span>
                <button
                  onClick={handleCopyUPI}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold rounded-lg transition-all duration-200"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={12} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* After payment instructions */}
            <div className="p-4 bg-amber-950/30 border border-amber-700/30 rounded-xl">
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
                After Payment — What To Do
              </p>
              <ol className="space-y-2">
                {[
                  'Take a clear screenshot of your payment confirmation',
                  'Click "I Have Paid" below to open WhatsApp',
                  'Send the payment screenshot to our support team',
                  'Your subscription will be activated within 12 hours',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-amber-200/80 text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Activation notice */}
            <div className="flex items-center gap-2.5 p-3 bg-gray-800/40 border border-gray-700/40 rounded-xl">
              <Clock size={16} className="text-gray-400 flex-shrink-0" />
              <p className="text-gray-400 text-sm">
                Activation takes up to <span className="text-white font-semibold">12 hours</span> after payment confirmation.
              </p>
            </div>

            {/* WhatsApp support note */}
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <MessageCircle size={13} className="text-green-500" />
              <span>WhatsApp Support: <span className="text-gray-300">+91 94919 17842</span></span>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="sticky bottom-0 flex gap-3 px-5 py-4 bg-gray-900 border-t border-gray-700/50">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 font-semibold text-sm hover:bg-gray-800 hover:text-white transition-all duration-200"
            >
              Close
            </button>
            <button
              onClick={handlePaidClick}
              className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(22,163,74,0.35)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)] transition-all duration-200"
            >
              <MessageCircle size={16} />
              I Have Paid
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
