/* Template text, to be reviewed by the owner before publishing. */
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import menuData from '../data/menu.json';

interface LegalPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  const { restaurant } = menuData;

  return (
    <div>
      <section className="bg-[#1F1A17] text-[#FAF6F0] py-8 border-b border-[#332B26]">
        <div className="site-container">
          <p className="text-[13px] font-medium text-[#E5C170] mb-1">
            Digital Personal Data Protection Act, 2023 (India)
          </p>
          <h1 className="text-[26px] sm:text-[32px] font-heritage font-bold text-[#FAF6F0] leading-tight">
            Privacy Policy
          </h1>
          <p className="text-[15px] text-[#D5CCC3] mt-1">
            Last Updated: 28 October 2026 · {restaurant.legalName}
          </p>
        </div>
      </section>

      <div className="site-container py-8 sm:py-12">
        <article className="bg-white border border-[#E5DDD2] rounded-xl p-5 sm:p-8 shadow-xs space-y-6 text-[15px] text-[#1F1A17] leading-relaxed">
          <section>
            <h2 className="text-[18px] sm:text-[20px] font-heritage font-bold text-[#1F1A17] mb-2">
              1. Who We Are (Data Fiduciary)
            </h2>
            <p className="text-[#5C534E]">
              This Privacy Policy explains how <strong className="text-[#1F1A17]">{restaurant.legalName}</strong> (Proprietor:{' '}
              {restaurant.proprietor}), operating <strong className="text-[#1F1A17]">{restaurant.name}</strong> at{' '}
              {restaurant.address.full} ({restaurant.address.landmark}), handles personal data in accordance with India&apos;s{' '}
              <strong className="text-[#1F1A17]">Digital Personal Data Protection Act, 2023 (DPDP Act, 2023)</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] sm:text-[20px] font-heritage font-bold text-[#1F1A17] mb-2">
              2. What Personal Data We Collect
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-[#5C534E]">
              <li>
                <strong className="text-[#1F1A17]">Contact Form Inputs:</strong> Your name, 10-digit mobile number, optional email, and message are validated directly in your browser to generate a pre-filled WhatsApp or email message. They are not stored in any website database.
              </li>
              <li>
                <strong className="text-[#1F1A17]">WhatsApp, Phone &amp; Email Details:</strong> When you call {restaurant.phoneDisplay}, message us on WhatsApp, or email {restaurant.email}, we receive your contact number, profile name, and order details.
              </li>
              <li>
                <strong className="text-[#1F1A17]">Basic Hosting Logs:</strong> Our static web host records standard access logs (IP address, browser user-agent, timestamp) to deliver pages securely.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] sm:text-[20px] font-heritage font-bold text-[#1F1A17] mb-2">
              3. Cookies &amp; Analytics
            </h2>
            <p className="text-[#5C534E]">
              <strong className="text-[#1F1A17]">No Tracking Cookies Used:</strong> We do not use advertising pixels, cross-site tracking cookies, or behavioral analytics cookies on this website. The embedded Google Maps frame may set standard functional cookies from Google when you interact with the map.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] sm:text-[20px] font-heritage font-bold text-[#1F1A17] mb-2">
              4. Purpose, Retention &amp; No Sale of Data
            </h2>
            <p className="text-[#5C534E]">
              We use the contact details you share solely to prepare your food order, coordinate counter pickup, and answer enquiries.{' '}
              <strong className="text-[#1F1A17]">We never sell, rent, or trade your personal data to third parties.</strong> WhatsApp and email records are kept only as long as needed to fulfill orders and meet Indian accounting requirements.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] sm:text-[20px] font-heritage font-bold text-[#1F1A17] mb-2">
              5. Third-Party Services
            </h2>
            <p className="text-[#5C534E]">
              We use WhatsApp (`wa.me`) for direct order messaging, Google Maps &amp; Google Fonts for map display and typography, and static cloud hosting (Netlify, Vercel, or Cloudflare Pages).
            </p>
          </section>

          <section>
            <h2 className="text-[18px] sm:text-[20px] font-heritage font-bold text-[#1F1A17] mb-2">
              6. Your Rights &amp; Grievance Contact
            </h2>
            <p className="text-[#5C534E]">
              Under the DPDP Act, 2023, you have the right to request access to, correction of, or erasure of your personal data, or to withdraw consent. Contact{' '}
              <strong className="text-[#1F1A17]">{restaurant.proprietor}</strong> at{' '}
              <a href={`mailto:${restaurant.email}`} className="text-[#6E1D1B] underline font-semibold">
                {restaurant.email}
              </a>{' '}
              or call{' '}
              <a href={`tel:${restaurant.phoneTel}`} className="text-[#6E1D1B] underline font-semibold">
                {restaurant.phoneDisplay}
              </a>
              .
            </p>
          </section>

          <div className="pt-4 border-t border-[#E5DDD2] grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full h-11 px-4 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Home</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/terms')}
              className="w-full h-11 px-4 rounded-lg bg-[#F3ECE1] hover:bg-[#EAE0D3] border border-[#E5DDD2] text-[#1F1A17] font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
            >
              <span>Terms of Use</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export const TermsOfUsePage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  const { restaurant } = menuData;

  return (
    <div>
      <section className="bg-[#1F1A17] text-[#FAF6F0] py-8 border-b border-[#332B26]">
        <div className="site-container">
          <p className="text-[13px] font-medium text-[#E5C170] mb-1">
            Website Terms · {restaurant.legalName}
          </p>
          <h1 className="text-[26px] sm:text-[32px] font-heritage font-bold text-[#FAF6F0] leading-tight">
            Terms of Use
          </h1>
          <p className="text-[15px] text-[#D5CCC3] mt-1">
            Last Updated: 28 October 2026
          </p>
        </div>
      </section>

      <div className="site-container py-8 sm:py-12">
        <article className="bg-white border border-[#E5DDD2] rounded-xl p-5 sm:p-8 shadow-xs space-y-6 text-[15px] text-[#1F1A17] leading-relaxed">
          <section>
            <h2 className="text-[18px] sm:text-[20px] font-heritage font-bold text-[#1F1A17] mb-2">
              1. Website Use
            </h2>
            <p className="text-[#5C534E]">
              This website is operated by <strong className="text-[#1F1A17]">{restaurant.legalName}</strong> (Proprietor: {restaurant.proprietor}) at {restaurant.address.full}. By using this website, you agree to these Terms of Use.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] sm:text-[20px] font-heritage font-bold text-[#1F1A17] mb-2">
              2. Menu, Prices &amp; Availability
            </h2>
            <p className="text-[#5C534E]">
              Menu items, portion sizes, and prices (in ₹) are subject to daily availability and may change without prior notice. The price confirmed by our counter via phone or WhatsApp at the time of ordering applies.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] sm:text-[20px] font-heritage font-bold text-[#1F1A17] mb-2">
              3. Images &amp; Allergen Notice
            </h2>
            <p className="text-[#5C534E]">
              All food imagery on this site is illustrative. {restaurant.allergenNotice}
            </p>
          </section>

          <section>
            <h2 className="text-[18px] sm:text-[20px] font-heritage font-bold text-[#1F1A17] mb-2">
              4. Third-Party Links &amp; Limitation of Liability
            </h2>
            <p className="text-[#5C534E]">
              This site links to WhatsApp, Google Maps, and Instagram, which are governed by their own terms. To the fullest extent permitted by law, {restaurant.legalName} is not liable for indirect damages arising from temporary website unavailability or third-party messaging delays.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] sm:text-[20px] font-heritage font-bold text-[#1F1A17] mb-2">
              5. Governing Law &amp; Jurisdiction
            </h2>
            <p className="text-[#5C534E]">
              These Terms are governed by the laws of India, with exclusive jurisdiction in the courts at <strong className="text-[#1F1A17]">Chengalpattu, Tamil Nadu</strong>. For questions, contact{' '}
              <a href={`mailto:${restaurant.email}`} className="text-[#6E1D1B] underline font-semibold">
                {restaurant.email}
              </a>
              .
            </p>
          </section>

          <div className="pt-4 border-t border-[#E5DDD2] grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full h-11 px-4 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Home</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/privacy')}
              className="w-full h-11 px-4 rounded-lg bg-[#F3ECE1] hover:bg-[#EAE0D3] border border-[#E5DDD2] text-[#1F1A17] font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
            >
              <span>Privacy Policy</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};
