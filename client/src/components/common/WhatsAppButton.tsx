import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';

interface FloatingContactButtonsProps {
  defaultMessage?: string;
}

export const WhatsAppButton: React.FC<FloatingContactButtonsProps> = ({
  defaultMessage,
}) => {
  const { phone, phoneCallUrl, whatsappNumber, getWhatsAppUrl } = useSettings();
  const { isKn, t } = useLanguage();

  const msg =
    defaultMessage ||
    (isKn
      ? 'ನಮಸ್ಕಾರ ಬನಶಂಕರಿ ಎಂಟರ್‌ಪ್ರೈಸಸ್, ಬೆಂಗಳೂರಿನಲ್ಲಿ ನಿಮ್ಮ ಆಸ್ತಿಗಳು ಮತ್ತು ಸೇವೆಗಳ ಕುರಿತು ವಿಚಾರಿಸಲು ನಾನು ಬಯಸುತ್ತೇನೆ.'
      : 'Hello Banashankari Enterprises, I would like to enquire about your properties and services in Bangalore.');

  const whatsappUrl = getWhatsAppUrl(msg);

  return (
    <aside
      aria-label={isKn ? 'ತ್ವರಿತ ಸಂಪರ್ಕ ಆಯ್ಕೆಗಳು' : 'Quick Connect Options'}
      className="fixed top-[72%] -translate-y-1/2 right-3 sm:right-5 z-50 flex flex-col items-center gap-3 sm:gap-3.5 select-none"
    >
      {/* 1. WhatsApp Floating App Icon (First / On top) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isKn ? 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ಚಾಟ್ ಮಾಡಿ' : 'Chat directly on WhatsApp'}
        title={`${t('tooltip.whatsapp', 'WhatsApp Chat')} (${whatsappNumber || phone})`}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[22px] bg-gradient-to-b from-[#3CF36C] via-[#2CE161] to-[#20BA53] text-white flex items-center justify-center shadow-xl shadow-green-950/25 hover:shadow-2xl hover:shadow-green-950/35 transition-all duration-200 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 sm:w-9 sm:h-9"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* White speech bubble outline */}
          <path
            d="M16 4.2C9.48 4.2 4.2 9.48 4.2 16c0 2.25.63 4.35 1.72 6.16L4.2 27.8l5.83-1.53c1.74 1 3.75 1.57 5.97 1.57 6.52 0 11.8-5.28 11.8-11.84C27.8 9.48 22.52 4.2 16 4.2z"
            fill="none"
            stroke="white"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* White phone handset inside */}
          <path
            d="M21.2 19.1c-.28-.14-1.65-.81-1.9-.91-.25-.09-.44-.14-.62.14-.19.28-.72.91-.88 1.09-.16.19-.32.21-.6.07-.28-.14-1.18-.44-2.25-1.4-.84-.75-1.4-1.66-1.57-1.94-.17-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.17.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.62-1.51-.86-2.07-.23-.54-.46-.47-.62-.48h-.53c-.19 0-.49.07-.75.35-.25.28-.98.96-.98 2.33 0 1.38 1.01 2.7 1.15 2.89.14.19 1.98 3.02 4.79 4.23.67.29 1.19.46 1.6.59.67.21 1.28.18 1.77.11.54-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.19-.53-.33z"
            fill="white"
          />
        </svg>
        <span className="sr-only">Chat on WhatsApp</span>
      </a>

      {/* 2. Direct Phone Call Floating App Icon (Second / Below) */}
      <a
        href={phoneCallUrl}
        aria-label={isKn ? 'ರಮೇಶ್ ಎಸ್ ಹೆಚ್ ಅವರಿಗೆ ನೇರ ಫೋನ್ ಕರೆ' : 'Direct Phone Call to Ramesh S H'}
        title={`${t('tooltip.call', 'Direct Call')} (${phone})`}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[22px] bg-gradient-to-b from-[#FF6E40] via-[#FF5221] to-[#E63900] text-white flex items-center justify-center shadow-xl shadow-orange-950/25 hover:shadow-2xl hover:shadow-orange-950/35 transition-all duration-200 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
        <span className="sr-only">Call Banashankari Enterprises</span>
      </a>
    </aside>
  );
};

export const FloatingContactButtons = WhatsAppButton;
