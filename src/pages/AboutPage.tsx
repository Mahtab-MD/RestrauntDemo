import React from 'react';
import { MapPin, ExternalLink, MessageCircle, ArrowRight } from 'lucide-react';
import menuData from '../data/menu.json';
import { buildWhatsAppOrderUrl } from '../utils/restaurantLogic';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { restaurant } = menuData;
  const whatsappOrderHref = buildWhatsAppOrderUrl(restaurant.whatsappNumber, '');

  return (
    <div>
      {/* Header Banner */}
      <section className="bg-[#1F1A17] text-[#FAF6F0] py-8 border-b border-[#332B26]">
        <div className="site-container">
          <p className="text-[13px] font-medium text-[#E5C170] mb-1">
            Established {restaurant.established} · {restaurant.legalName}
          </p>
          <h1 className="text-[26px] sm:text-[32px] font-heritage font-bold text-[#FAF6F0] leading-tight">
            About {restaurant.name} &amp; Find Us
          </h1>
          <p className="text-[15px] text-[#D5CCC3] mt-1">
            Located {restaurant.address.landmark} in Potheri, Kattankulathur.
          </p>
        </div>
      </section>

      <div className="site-container py-8 sm:py-12 space-y-8">
        {/* Story & Dining Room Card */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white border border-[#E5DDD2] rounded-xl p-5 sm:p-6 shadow-xs">
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-heritage font-bold text-[#1F1A17] mb-3 leading-tight">
              Coal-fired dum handis in Potheri
            </h2>
            <p className="text-[15px] text-[#1F1A17] leading-relaxed mb-3">
              Founded in {restaurant.established} by proprietor {restaurant.proprietor},{' '}
              {restaurant.name} serves {restaurant.cuisine.join(', ')} food in Potheri, Kattankulathur.
            </p>
            <p className="text-[15px] text-[#5C534E] leading-relaxed mb-4">
              Every biryani handi is cooked over slow charcoal and served with Mirchi ka Salan and raita for dine-in guests and takeaway parcels.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#FAF6F0] border border-[#E5DDD2] rounded-lg p-3">
                <span className="block font-semibold text-[#6E1D1B] text-[15px]">
                  {restaurant.priceRangeShort}
                </span>
                <span className="text-[13px] text-[#5C534E]">Typical spend per person</span>
              </div>
              <div className="bg-[#FAF6F0] border border-[#E5DDD2] rounded-lg p-3">
                <span className="block font-semibold text-[#6E1D1B] text-[15px]">
                  80 Seats
                </span>
                <span className="text-[13px] text-[#5C534E]">Counter &amp; AC dining hall</span>
              </div>
            </div>
          </div>

          <figure className="bg-[#FAF6F0] border border-[#E5DDD2] rounded-xl overflow-hidden">
            <img
              src="/images/interior.jpg"
              alt="Bawarchi dining room and takeaway counter in Potheri"
              width={800}
              height={450}
              loading="lazy"
              className="w-full h-auto object-cover block"
            />
            <figcaption className="p-3 text-[13px] text-[#5C534E]">
              Ground-floor parcel counter and air-conditioned family dining room on Pillayar Koil Street.
            </figcaption>
          </figure>
        </section>

        {/* Map, Address & Service Hours */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Clean Embedded Map */}
          <div className="border border-[#E5DDD2] rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="h-64 sm:h-72 w-full bg-[#EAE0D3]">
              <iframe
                allowFullScreen
                className="w-full h-full border-0 block"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={restaurant.address.mapsEmbedUrl}
                title="Bawarchi Potheri Kattankulathur Map"
              />
            </div>
            <div className="p-4 bg-white border-t border-[#E5DDD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="grid grid-cols-[18px_1fr] items-start gap-2 text-[14px] text-[#1F1A17]">
                <MapPin className="w-4 h-4 text-[#6E1D1B] mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  {restaurant.address.street}, {restaurant.address.city}
                </span>
              </div>
              <a
                href={restaurant.address.mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-11 px-4 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white text-[14px] font-semibold inline-flex items-center justify-center gap-1.5 transition-subtle shrink-0"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Address, Directions & Hours */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E5DDD2] rounded-xl p-5 shadow-xs">
              <h2 className="font-heritage font-semibold text-[18px] text-[#1F1A17] mb-2">
                Address &amp; landmark
              </h2>
              <p className="text-[15px] text-[#1F1A17] leading-relaxed mb-3">
                {restaurant.address.full} ({restaurant.address.landmark}).
              </p>
              <ul className="space-y-2 text-[15px] text-[#5C534E] border-t border-[#E5DDD2] pt-3">
                {restaurant.seatingAndParking.directions.map((dir, i) => (
                  <li key={i}>
                    <strong className="text-[#1F1A17]">{dir.title}:</strong> {dir.detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-[#E5DDD2] rounded-xl p-5 shadow-xs">
              <h2 className="font-heritage font-semibold text-[18px] text-[#1F1A17] mb-3">
                Service hours (IST)
              </h2>
              <dl className="divide-y divide-[#E5DDD2] text-[15px]">
                {restaurant.hours.sessions.map((s, idx) =>
                  s.stackBelow ? (
                    <div key={idx} className="py-3">
                      <dt className="font-medium text-[#1F1A17]">{s.label}</dt>
                      <dd className="text-[14px] text-[#5C534E] mt-1">{s.time}</dd>
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="py-3 grid grid-cols-[1fr_auto] items-baseline gap-x-4"
                    >
                      <dt className="font-medium text-[#1F1A17] min-w-0">{s.label}</dt>
                      <dd className="font-semibold text-[#6E1D1B] text-right whitespace-nowrap">
                        {s.time}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            </div>
          </div>
        </section>

        {/* Bottom CTA Pair */}
        <section className="bg-[#F3ECE1] border border-[#E5DDD2] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heritage font-semibold text-[20px] text-[#1F1A17]">
              Ready to order?
            </h2>
            <p className="text-[15px] text-[#5C534E] mt-0.5">
              Browse the full menu or message our counter on WhatsApp.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('/menu')}
              className="w-full sm:w-auto h-11 px-5 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
            >
              <span>Browse Menu</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href={whatsappOrderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-11 px-5 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-[#0D2815] font-bold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>WhatsApp Order</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
