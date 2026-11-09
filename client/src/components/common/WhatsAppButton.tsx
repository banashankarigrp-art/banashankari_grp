import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { COMPANY_INFO } from '@shared/types';

export const WhatsAppButton: React.FC<{ defaultMessage?: string }> = ({
  defaultMessage = 'Hello Banashankari Enterprises, I would like to enquire about your properties and construction services in Bangalore.',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  const handleSend = () => {
    const encoded = encodeURIComponent(message);
    window.open(`${COMPANY_INFO.whatsappUrl}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Banashankari Enterprises</h4>
                <p className="text-xs text-emerald-100">Direct WhatsApp Assistance</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 shadow-sm leading-relaxed">
              Hello! Reach out to Ramesh S H and our Bangalore property team directly on WhatsApp for instantaneous assistance.
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-500">Your message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSend}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-sm transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open in WhatsApp (+91 997 253 6991)</span>
            </button>
          </div>
        </div>
      )}

      {/* Trigger floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-gold-glow flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group relative focus:outline-none"
        aria-label="Chat on WhatsApp with Banashankari Enterprises"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold-400 rounded-full border-2 border-white animate-pulse" />
        <MessageSquare className="w-7 h-7" />
        <span className="sr-only">Chat on WhatsApp</span>
      </button>
    </div>
  );
};
