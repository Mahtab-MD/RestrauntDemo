import React from 'react';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import menuData from '../data/menu.json';
import { MenuBoard } from '../components/MenuBoard';
import { buildWhatsAppOrderUrl } from '../utils/restaurantLogic';

interface MenuPageProps {
  onNavigate: (path: string) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onNavigate }) => {
  const { restaurant } = menuData;
  const whatsappOrderHref = buildWhatsAppOrderUrl(restaurant.whatsappNumber, '');

  return (
    <div>
      {/* Page Header Banner */}
      <section className="bg-[#1F1A17] text-[#FAF6F0] py-8 border-b border-[#332B26]">
        <div className="site-container flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-[#E5C170] mb-1">
              All prices in ₹ · {restaurant.priceRange}
            </p>
            <h1 className="text-[26px] sm:text-[32px] font-heritage font-bold text-[#FAF6F0] leading-tight">
              {restaurant.name} — Menu
            </h1>
            <p className="text-[15px] text-[#D5CCC3] mt-1">{restaurant.tagline}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 shrink-0">
            <a
              href={whatsappOrderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-4 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-[#0D2815] font-bold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>WhatsApp Order</span>
            </a>
            <a
              href={`tel:${restaurant.phoneTel}`}
              className="h-11 px-4 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Call {restaurant.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Dietary Legend Bar */}
      <div className="site-container pt-6">
        <div className="bg-white border border-[#E5DDD2] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-[14px]">
          <div className="flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-2 font-medium text-[#1F1A17]">
              <span className="veg-badge" aria-hidden="true">
                <span className="veg-dot" />
              </span>
              <span>Vegetarian</span>
            </span>
            <span className="inline-flex items-center gap-2 font-medium text-[#1F1A17]">
              <span className="non-veg-badge" aria-hidden="true">
                <span className="non-veg-dot" />
              </span>
              <span>Non-Vegetarian</span>
            </span>
          </div>
          <span className="text-[13px] text-[#5C534E]">
            Select Order next to any dish to message our counter on WhatsApp.
          </span>
        </div>
      </div>

      {/* Interactive Menu Board */}
      <MenuBoard showSearch={true} showAllergenNotice={true} />

      {/* Bottom Group Order Callout */}
      <section className="site-container pb-12">
        <div className="bg-[#F3ECE1] border border-[#E5DDD2] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heritage font-semibold text-[20px] text-[#1F1A17]">
              Ordering for a family gathering or hostel group?
            </h2>
            <p className="text-[15px] text-[#5C534E] mt-1">
              We pack family biryani handis and group trays with extra salan and raita.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="w-full sm:w-auto h-11 px-5 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle shrink-0 cursor-pointer"
          >
            <span>Send Group Enquiry</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
};
