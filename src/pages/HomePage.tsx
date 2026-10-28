import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  ArrowRight,
  MapPin,
  Train,
  Users,
  Car,
  Star,
  ExternalLink,
} from 'lucide-react';
import menuData from '../data/menu.json';
import { buildWhatsAppOrderUrl } from '../utils/restaurantLogic';
import { MenuBoard } from '../components/MenuBoard';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

interface SignatureDishItem {
  id: string;
  name: string;
  type: string;
  price: number;
  badge?: string;
  image?: string;
  imageAlt?: string;
  description: string;
}

const SignatureDishCard: React.FC<{
  dish: SignatureDishItem;
  whatsappNumber: string;
}> = ({ dish, whatsappNumber }) => {
  const [imgError, setImgError] = useState(false);
  const isVeg = dish.type === 'V';
  const showPhoto = Boolean(dish.image) && !imgError;
  const dishWhatsAppHref = buildWhatsAppOrderUrl(
    whatsappNumber,
    `${dish.name} (₹${dish.price})`
  );

  return (
    <article className="box-border w-full h-[216px] sm:h-[196px] p-4 bg-white border border-[#E5DDD2] rounded-xl shadow-xs grid grid-cols-[88px_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_44px] gap-x-4 gap-y-3.5 items-start min-w-0">
      {/* Grid Cell (Row 1, Col 1): Image on the Left */}
      <div className="w-[88px] h-[88px] rounded-lg overflow-hidden bg-[#F3ECE1] border border-[#E5DDD2] shrink-0">
        {showPhoto ? (
          <img
            src={dish.image}
            alt={dish.imageAlt || dish.name}
            width={88}
            height={88}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover block"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#7A6F67] text-[12px] font-medium select-none">
            Bawarchi
          </div>
        )}
      </div>

      {/* Grid Cell (Row 1, Col 2): Details (Name, Description, Price) on the Right */}
      <div className="min-w-0 h-full flex flex-col justify-start">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 min-w-0">
          <div className="grid grid-cols-[14px_minmax(0,1fr)] items-start gap-1.5 min-w-0">
            <span className="pt-[4px]">
              {isVeg ? (
                <span className="veg-badge" title="Vegetarian" aria-label="Vegetarian">
                  <span className="veg-dot" />
                </span>
              ) : (
                <span
                  className="non-veg-badge"
                  title="Non-Vegetarian"
                  aria-label="Non-Vegetarian"
                >
                  <span className="non-veg-dot" />
                </span>
              )}
            </span>
            <h3 className="font-heritage font-semibold text-[17px] text-[#1F1A17] leading-[1.25] break-words min-w-0">
              {dish.name}
            </h3>
          </div>

          <span className="tabular-price font-bold text-[17px] text-[#6E1D1B] leading-[1.25] shrink-0">
            ₹{dish.price}
          </span>
        </div>

        <p className="text-[14px] leading-[1.45] text-[#5C534E] mt-1.5 min-w-0">
          {dish.description}
        </p>
      </div>

      {/* Grid Cell (Row 2, Col 1-2): Single Full-Width Button Row Pinned to Bottom */}
      <a
        href={dishWhatsAppHref}
        rel="noopener noreferrer"
        target="_blank"
        className="col-span-2 box-border w-full h-11 px-4 rounded-lg bg-[#FAF6F0] hover:bg-[#6E1D1B] text-[#1F1A17] hover:text-white border border-[#E5DDD2] hover:border-[#6E1D1B] font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle min-w-0 self-end"
      >
        <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="truncate">Order on WhatsApp</span>
      </a>
    </article>
  );
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { restaurant, signatureDishes, reviews } = menuData;
  const whatsappDefaultHref = buildWhatsAppOrderUrl(restaurant.whatsappNumber, '');

  return (
    <div>
      {/* HERO SECTION: Strong Hero Image Area with Dark Overlay, Equal 3-Col Stats & Equal CTA Buttons */}
      <section className="relative bg-[#1F1A17] text-[#FAF6F0] border-b border-[#332B26] overflow-hidden">
        {/* Background Hero Image with Measured Dark Scrim */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <img
            src="/images/hero.jpg"
            alt=""
            width={1280}
            height={640}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[#1F1A17]/80" />
        </div>

        <div className="relative site-container py-8 sm:py-12">
          <div className="max-w-2xl">
            <p className="text-[13px] font-medium text-[#E5C170] mb-2">
              Est. {restaurant.established} · Potheri, Kattankulathur
            </p>
            <h1 className="text-[28px] sm:text-[36px] font-heritage font-bold text-[#FAF6F0] leading-tight">
              {restaurant.name}
            </h1>
            <p className="text-[#EAE2D8] text-[16px] sm:text-[18px] mt-1.5 leading-relaxed">
              {restaurant.tagline}
            </p>

            {/* 3-Column Info Stats Grid: Equal Widths & Dividers */}
            <div className="grid grid-cols-3 divide-x divide-[#3D332D] border-y border-[#3D332D] py-4 my-6 text-center">
              <div className="px-1.5 sm:px-3 min-w-0">
                <span className="block text-[#E5C170] font-semibold text-[14px] sm:text-[16px] leading-snug">
                  Coal Dum
                </span>
                <span className="block text-[#D5CCC3] text-[12px] sm:text-[13px] mt-0.5 leading-snug">
                  Copper handi
                </span>
              </div>
              <div className="px-1.5 sm:px-3 min-w-0">
                <span className="block text-[#E5C170] font-semibold text-[14px] sm:text-[16px] leading-snug">
                  North Indian
                </span>
                <span className="block text-[#D5CCC3] text-[12px] sm:text-[13px] mt-0.5 leading-snug">
                  Tandoor &amp; curries
                </span>
              </div>
              <div className="px-1.5 sm:px-3 min-w-0">
                <span className="block text-[#E5C170] font-semibold text-[14px] sm:text-[16px] leading-snug">
                  {restaurant.priceRangeShort}
                </span>
                <span className="block text-[#D5CCC3] text-[12px] sm:text-[13px] mt-0.5 leading-snug">
                  Per person
                </span>
              </div>
            </div>

            {/* Equal-Height, Equal-Width, Matching-Radius CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                className="w-full h-12 px-4 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-[#0D2815] font-bold text-[15px] inline-flex items-center justify-center gap-2 transition-subtle min-w-0"
                href={whatsappDefaultHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">WhatsApp Order</span>
              </a>

              <a
                className="w-full h-12 px-4 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-subtle min-w-0"
                href={`tel:${restaurant.phoneTel}`}
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">Call: 98765 43210</span>
              </a>
            </div>

            <p className="text-[13px] text-[#D5CCC3] mt-4">
              Direct counter pickup and local parcels near the Potheri railway gate.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: SIGNATURE DISHES */}
      <section className="site-container pt-8 sm:pt-12 pb-4">
        {/* Section Header: Heading on left, count on right, aligned on one baseline */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pb-3 mb-6 border-b border-[#E5DDD2]">
          <h2 className="text-[24px] sm:text-[28px] font-heritage font-bold text-[#1F1A17] leading-tight">
            Signature dishes
          </h2>
          <span className="text-[13px] text-[#5C534E]">
            {signatureDishes.length} house specialties
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-[216px] sm:auto-rows-[196px] gap-4">
          {signatureDishes.map((dish) => (
            <SignatureDishCard
              key={dish.id}
              dish={dish}
              whatsappNumber={restaurant.whatsappNumber}
            />
          ))}
        </div>
      </section>

      {/* SECTION 3: FULL MENU */}
      <MenuBoard showSearch={false} showAllergenNotice={true} onNavigate={onNavigate} />

      {/* SECTION 4: HOW TO ORDER IN 30 SECONDS */}
      <section className="bg-[#F3ECE1] border-y border-[#E5DDD2] py-10 sm:py-12">
        <div className="site-container">
          <div className="mb-6">
            <h2 className="text-[24px] sm:text-[28px] font-heritage font-bold text-[#1F1A17] leading-tight">
              How to order
            </h2>
            <p className="text-[15px] text-[#5C534E] mt-1">
              Order directly from our Potheri counter with no aggregator fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E5DDD2] flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#6E1D1B] text-white font-semibold flex items-center justify-center shrink-0 text-[14px]">
                1
              </div>
              <div>
                <h3 className="font-heritage font-semibold text-[18px] text-[#1F1A17]">
                  Choose your dishes
                </h3>
                <p className="text-[15px] text-[#5C534E] mt-1 leading-relaxed">
                  Pick biryanis, starters, curries, and breads from the rate board.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E5DDD2] flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#6E1D1B] text-white font-semibold flex items-center justify-center shrink-0 text-[14px]">
                2
              </div>
              <div>
                <h3 className="font-heritage font-semibold text-[18px] text-[#1F1A17]">
                  Send on WhatsApp or call
                </h3>
                <p className="text-[15px] text-[#5C534E] mt-1 leading-relaxed">
                  Message or call our counter directly at {restaurant.phoneDisplay}.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E5DDD2] flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#6E1D1B] text-white font-semibold flex items-center justify-center shrink-0 text-[14px]">
                3
              </div>
              <div>
                <h3 className="font-heritage font-semibold text-[18px] text-[#1F1A17]">
                  Collect fresh in 15 mins
                </h3>
                <p className="text-[15px] text-[#5C534E] mt-1 leading-relaxed">
                  Packed hot in foil containers. Pay via UPI, GPay, or cash.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Pair: Equal Width & Height, Full-Width on Mobile, Primary Filled & Secondary Outlined */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            <a
              className="w-full h-12 px-5 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-[#0D2815] font-bold text-[15px] inline-flex items-center justify-center gap-2 transition-subtle min-w-0"
              href={whatsappDefaultHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Message on WhatsApp Now</span>
            </a>

            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="w-full h-12 px-5 rounded-lg bg-white hover:bg-[#FAF6F0] text-[#1F1A17] border border-[#1F1A17] font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer min-w-0"
            >
              <span className="truncate">Use Custom Order Form</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: FIND US & SERVICE HOURS */}
      <section className="site-container py-10 sm:py-12" id="find-us">
        {/* Heading with "About Our Kitchen" link placed BELOW the heading as required */}
        <div className="pb-3 mb-6 border-b border-[#E5DDD2]">
          <h2 className="text-[24px] sm:text-[28px] font-heritage font-bold text-[#1F1A17] leading-tight">
            Find us &amp; visiting details
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('/about')}
            className="mt-1.5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#6E1D1B] hover:underline cursor-pointer"
          >
            <span>About Our Kitchen</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Clean Embedded Map Card (Removed fake Google Maps Navigation header bar) */}
          <div className="border border-[#E5DDD2] rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="h-64 sm:h-72 w-full bg-[#EAE0D3]">
              <iframe
                allowFullScreen
                className="w-full h-full border-0 block"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={restaurant.address.mapsEmbedUrl}
                title="Bawarchi Potheri Kattankulathur Location Map"
              />
            </div>

            <div className="p-4 bg-white border-t border-[#E5DDD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="grid grid-cols-[18px_1fr] items-start gap-2 text-[14px] text-[#1F1A17]">
                <MapPin className="w-4 h-4 text-[#6E1D1B] mt-0.5 shrink-0" aria-hidden="true" />
                <span>Potheri, Kattankulathur – 603203</span>
              </div>

              <a
                className="w-full sm:w-auto h-11 px-4 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white text-[14px] font-semibold inline-flex items-center justify-center gap-1.5 transition-subtle shrink-0"
                href={restaurant.address.mapsSearchUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Landmark Directions & Service Hours Table */}
          <div className="space-y-6">
            {/* Address & Directions Card */}
            <div className="bg-white border border-[#E5DDD2] p-5 rounded-xl shadow-xs">
              <h3 className="font-heritage font-semibold text-[18px] text-[#1F1A17] mb-2">
                Address &amp; directions
              </h3>
              <p className="text-[15px] text-[#1F1A17] leading-relaxed mb-4">
                {restaurant.address.full} ({restaurant.address.landmark}).
              </p>

              <ul className="space-y-3 text-[15px] text-[#5C534E] border-t border-[#E5DDD2] pt-3">
                <li className="grid grid-cols-[20px_1fr] items-start gap-2.5">
                  <Train className="w-4 h-4 text-[#6E1D1B] mt-1 shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-[#1F1A17]">Station:</strong> 3 minutes walk from Potheri railway station and GST Road.
                  </span>
                </li>
                <li className="grid grid-cols-[20px_1fr] items-start gap-2.5">
                  <Users className="w-4 h-4 text-[#6E1D1B] mt-1 shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-[#1F1A17]">Dining:</strong> Ground-floor counter and 80-seat AC family dining room.
                  </span>
                </li>
                <li className="grid grid-cols-[20px_1fr] items-start gap-2.5">
                  <Car className="w-4 h-4 text-[#6E1D1B] mt-1 shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-[#1F1A17]">Parking:</strong> Two-wheeler bays in front; car parking 80m before the railway gate.
                  </span>
                </li>
              </ul>
            </div>

            {/* Service Hours Table: 2-Column Table with >=16px Gap, Long Lists Stacked on Own Line */}
            <div className="bg-white border border-[#E5DDD2] p-5 rounded-xl shadow-xs">
              <h3 className="font-heritage font-semibold text-[18px] text-[#1F1A17] mb-3">
                Service hours (IST)
              </h3>
              <dl className="divide-y divide-[#E5DDD2] text-[15px]">
                {restaurant.hours.sessions.map((session, idx) =>
                  session.stackBelow ? (
                    <div key={idx} className="py-3">
                      <dt className="font-medium text-[#1F1A17]">{session.label}</dt>
                      <dd className="text-[14px] text-[#5C534E] mt-1">{session.time}</dd>
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="py-3 grid grid-cols-[1fr_auto] items-baseline gap-x-4"
                    >
                      <dt className="font-medium text-[#1F1A17] min-w-0">{session.label}</dt>
                      <dd
                        className={`text-right whitespace-nowrap font-semibold ${
                          session.highlight ? 'text-[#6E1D1B]' : 'text-[#1F1A17]'
                        }`}
                      >
                        {session.time}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: DINER REVIEWS */}
      <section className="bg-[#FAF6F0] py-10 sm:py-12 border-t border-[#E5DDD2]">
        <div className="site-container">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pb-3 mb-6 border-b border-[#E5DDD2]">
            <h2 className="text-[24px] sm:text-[28px] font-heritage font-bold text-[#1F1A17] leading-tight">
              What diners say
            </h2>
            <span className="text-[13px] text-[#5C534E]">Sample customer feedback</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="bg-white p-5 rounded-xl border border-[#E5DDD2] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className="flex items-center gap-0.5 text-[#C6922C]"
                      aria-label="5 out of 5 stars"
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#C6922C] text-[#C6922C]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="text-[13px] text-[#5C534E]">{review.label}</span>
                  </div>
                  <p className="text-[15px] text-[#1F1A17] leading-relaxed mb-4">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="border-t border-[#E5DDD2] pt-3 flex items-center justify-between text-[13px]">
                  <span className="font-heritage font-semibold text-[15px] text-[#1F1A17]">
                    {review.name}
                  </span>
                  <span className="text-[#5C534E]">{review.context}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
