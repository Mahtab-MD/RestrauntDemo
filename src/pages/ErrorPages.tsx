import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, RotateCw, ArrowLeft, Utensils } from 'lucide-react';
import menuData from '../data/menu.json';
import { buildWhatsAppOrderUrl } from '../utils/restaurantLogic';

interface ErrorPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<ErrorPageProps> = ({ onNavigate }) => {
  const { restaurant } = menuData;
  const whatsappOrderHref = buildWhatsAppOrderUrl(restaurant.whatsappNumber, '');

  return (
    <div className="site-container py-12">
      <div className="max-w-xl mx-auto bg-white border border-[#E5DDD2] rounded-xl p-6 sm:p-8 shadow-xs text-center">
        <span className="inline-block text-[13px] font-semibold text-[#6E1D1B] mb-1">
          404 · Page not found
        </span>
        <h1 className="text-[24px] sm:text-[28px] font-heritage font-bold text-[#1F1A17]">
          This dish isn&apos;t on our stove today.
        </h1>
        <p className="text-[15px] text-[#5C534E] mt-2 leading-relaxed">
          The page you requested could not be found. Return to our home page, browse the full menu, or call our counter directly.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full h-11 px-4 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/menu')}
            className="w-full h-11 px-4 rounded-lg bg-[#F3ECE1] hover:bg-[#EAE0D3] border border-[#E5DDD2] text-[#1F1A17] font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
          >
            <Utensils className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Full Menu</span>
          </button>

          <a
            href={`tel:${restaurant.phoneTel}`}
            className="w-full h-11 px-4 rounded-lg bg-[#1F1A17] hover:bg-[#2C2521] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle"
          >
            <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Call Us</span>
          </a>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E5DDD2] text-[14px] text-[#5C534E]">
          Prefer to order on WhatsApp?{' '}
          <a
            href={whatsappOrderHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#1E6B3A] underline"
          >
            Message {restaurant.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
};

export const ServerErrorPage: React.FC<ErrorPageProps> = ({ onNavigate }) => {
  const { restaurant } = menuData;
  const whatsappOrderHref = buildWhatsAppOrderUrl(restaurant.whatsappNumber, '');
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [mode, setMode] = useState<'500' | 'offline' | 'generic'>('500');

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      setMode('offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const stateContent = {
    '500': {
      kicker: '500 · Server error',
      title: 'We couldn’t load the page right now.',
      description:
        'Something went wrong while loading this view. Our Potheri counter is open as usual — you can call or WhatsApp us directly below.',
    },
    offline: {
      kicker: 'Offline · No network connection',
      title: 'You appear to be offline.',
      description:
        'Check your mobile data or Wi-Fi connection and reload, or call our kitchen directly at +91 98765 43210.',
    },
    generic: {
      kicker: 'Service notice',
      title: 'Something went wrong.',
      description:
        'A temporary issue interrupted this page. Please reload or return to the home page.',
    },
  }[mode];

  return (
    <div className="site-container py-10">
      <div className="max-w-xl mx-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 bg-[#F3ECE1] border border-[#E5DDD2] rounded-xl p-3 text-[13px]">
          <span className="font-semibold text-[#1F1A17]">State preview:</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode('500')}
              className={`min-h-[44px] px-3 py-2 rounded-lg font-semibold text-[13px] cursor-pointer inline-flex items-center transition-subtle ${
                mode === '500'
                  ? 'bg-[#6E1D1B] text-white'
                  : 'bg-white text-[#1F1A17] border border-[#E5DDD2]'
              }`}
            >
              500 Error
            </button>
            <button
              type="button"
              onClick={() => setMode('offline')}
              className={`min-h-[44px] px-3 py-2 rounded-lg font-semibold text-[13px] cursor-pointer inline-flex items-center transition-subtle ${
                mode === 'offline'
                  ? 'bg-[#6E1D1B] text-white'
                  : 'bg-white text-[#1F1A17] border border-[#E5DDD2]'
              }`}
            >
              Offline {isOffline ? '(Active)' : ''}
            </button>
            <button
              type="button"
              onClick={() => setMode('generic')}
              className={`min-h-[44px] px-3 py-2 rounded-lg font-semibold text-[13px] cursor-pointer inline-flex items-center transition-subtle ${
                mode === 'generic'
                  ? 'bg-[#6E1D1B] text-white'
                  : 'bg-white text-[#1F1A17] border border-[#E5DDD2]'
              }`}
            >
              Generic Error
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD2] rounded-xl p-6 sm:p-8 shadow-xs text-center">
          <span className="inline-block text-[13px] font-semibold text-[#6E1D1B] mb-1">
            {stateContent.kicker}
          </span>
          <h1 className="text-[24px] sm:text-[28px] font-heritage font-bold text-[#1F1A17]">
            {stateContent.title}
          </h1>
          <p className="text-[15px] text-[#5C534E] mt-2 leading-relaxed">
            {stateContent.description}
          </p>

          <div className="my-6 bg-[#FAF6F0] border border-[#E5DDD2] rounded-lg p-4 text-left text-[14px] space-y-1.5">
            <p>
              <strong>Phone:</strong>{' '}
              <a href={`tel:${restaurant.phoneTel}`} className="underline font-semibold">
                {restaurant.phoneDisplay}
              </a>
            </p>
            <p>
              <strong>Address:</strong> {restaurant.address.full} ({restaurant.address.landmark})
            </p>
            <p>
              <strong>Hours:</strong> {restaurant.hours.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full h-11 px-4 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
            >
              <RotateCw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Reload Page</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full h-11 px-4 rounded-lg bg-[#F3ECE1] hover:bg-[#EAE0D3] border border-[#E5DDD2] text-[#1F1A17] font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Back to Home</span>
            </button>

            <a
              href={whatsappOrderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 px-4 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-[#0D2815] font-bold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>WhatsApp Order</span>
            </a>

            <a
              href={`tel:${restaurant.phoneTel}`}
              className="w-full h-11 px-4 rounded-lg bg-[#1F1A17] hover:bg-[#2C2521] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Call {restaurant.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
