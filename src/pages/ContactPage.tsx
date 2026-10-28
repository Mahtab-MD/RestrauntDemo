import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  CheckCircle2,
  Copy,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import menuData from '../data/menu.json';
import {
  ContactFormInput,
  validateContactForm,
  buildWhatsAppOrderUrl,
  buildContactWhatsAppUrl,
  buildContactMailtoUrl,
} from '../utils/restaurantLogic';

interface ContactPageProps {
  initialSubmitted?: boolean;
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  initialSubmitted = false,
  onNavigate,
}) => {
  const { restaurant } = menuData;
  const whatsappDefaultHref = buildWhatsAppOrderUrl(restaurant.whatsappNumber, '');

  const [form, setForm] = useState<ContactFormInput>({
    name: '',
    phone: '',
    email: '',
    orderOrMessage: '',
    preferredChannel: 'whatsapp',
    honeypot: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(initialSubmitted);
  const [copiedText, setCopiedText] = useState(false);

  const validation = validateContactForm(form);
  const showError = (field: keyof typeof validation.errors) =>
    (touched[field] || submitAttempted) && validation.errors[field];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const check = validateContactForm(form);
    if (check.isSpam) {
      return;
    }
    if (!check.isValid) {
      return;
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatedWhatsAppUrl = buildContactWhatsAppUrl(restaurant.whatsappNumber, form);
  const generatedMailtoUrl = buildContactMailtoUrl(restaurant.email, form);

  const handleCopySummary = () => {
    const summaryText = `Hi Bawarchi, I'd like to order: ${form.orderOrMessage.trim()}\nName: ${form.name.trim()}\nPhone: +91 ${validation.cleanedPhone}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).then(() => {
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 3000);
      });
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <section className="bg-[#1F1A17] text-[#FAF6F0] py-8 border-b border-[#332B26]">
        <div className="site-container">
          <p className="text-[13px] font-medium text-[#E5C170] mb-1">
            Direct kitchen counter · Potheri, Kattankulathur
          </p>
          <h1 className="text-[26px] sm:text-[32px] font-heritage font-bold text-[#FAF6F0] leading-tight">
            {isSubmitted ? 'Order Message Ready' : `Contact ${restaurant.name}`}
          </h1>
          <p className="text-[15px] text-[#D5CCC3] mt-1">
            Call, message on WhatsApp, or prepare a pre-filled order message below.
          </p>
        </div>
      </section>

      <div className="site-container py-8 sm:py-12 space-y-8">
        {/* THANK-YOU / CONFIRMATION STATE */}
        {isSubmitted && (
          <section
            data-testid="contact-confirmation-state"
            aria-live="polite"
            className="bg-white border border-[#1E6B3A] rounded-xl p-5 sm:p-6 shadow-xs"
          >
            <div className="grid grid-cols-[24px_1fr] items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-[#1E6B3A] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="text-[20px] sm:text-[22px] font-heritage font-bold text-[#1F1A17]">
                  Your pre-filled message is ready
                </h2>
                <p className="text-[15px] text-[#5C534E] mt-1">
                  Select your preferred option below to open your formatted message directly in{' '}
                  {form.preferredChannel === 'whatsapp' ? 'WhatsApp' : 'your email client'}.
                </p>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-[#FAF6F0] border border-[#E5DDD2] rounded-lg p-4 mb-5 text-[15px] space-y-1.5">
              <p>
                <strong>Name:</strong> {form.name.trim() || 'Guest Diner'}
              </p>
              <p>
                <strong>Mobile:</strong> +91 {validation.cleanedPhone || '9876543210'}
              </p>
              {form.email?.trim() && (
                <p>
                  <strong>Email:</strong> {form.email.trim()}
                </p>
              )}
              <p className="pt-2 border-t border-[#E5DDD2]">
                <strong>Message:</strong> &ldquo;Hi Bawarchi, I&apos;d like to order:{' '}
                {form.orderOrMessage.trim() || '1x Chicken Dum Biryani'}&rdquo;
              </p>
            </div>

            {/* Equal-Height Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={generatedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 px-5 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-[#0D2815] font-bold text-[15px] inline-flex items-center justify-center gap-2 transition-subtle"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">Open in WhatsApp</span>
              </a>

              <a
                href={generatedMailtoUrl}
                className="w-full h-12 px-5 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-subtle"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">Open in Email</span>
              </a>

              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full h-12 px-4 rounded-lg bg-[#F3ECE1] hover:bg-[#EAE0D3] border border-[#E5DDD2] text-[#1F1A17] font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
              >
                <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{copiedText ? 'Copied to Clipboard' : 'Copy Message Text'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setSubmitAttempted(false);
                }}
                className="w-full h-12 px-4 rounded-lg bg-white hover:bg-[#FAF6F0] border border-[#E5DDD2] text-[#1F1A17] font-semibold text-[14px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Edit Details</span>
              </button>
            </div>
          </section>
        )}

        {/* 4 Direct Contact Cards */}
        <section
          aria-label="Direct contact channels"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <a
            href={`tel:${restaurant.phoneTel}`}
            className="bg-white border border-[#E5DDD2] hover:border-[#6E1D1B] rounded-xl p-4 shadow-xs flex flex-col justify-between min-h-[112px] transition-subtle"
          >
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#6E1D1B]">
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Phone Counter</span>
            </div>
            <div className="mt-2">
              <span className="tabular-price font-bold text-[17px] text-[#1F1A17] block">
                {restaurant.phoneDisplay}
              </span>
              <span className="text-[13px] text-[#5C534E]">Call kitchen directly</span>
            </div>
          </a>

          <a
            href={whatsappDefaultHref}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-[#E5DDD2] hover:border-[#1E6B3A] rounded-xl p-4 shadow-xs flex flex-col justify-between min-h-[112px] transition-subtle"
          >
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1E6B3A]">
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>WhatsApp Order</span>
            </div>
            <div className="mt-2">
              <span className="tabular-price font-bold text-[17px] text-[#1F1A17] block">
                {restaurant.phoneDisplay}
              </span>
              <span className="text-[13px] text-[#5C534E]">Start pre-filled chat</span>
            </div>
          </a>

          <a
            href={`mailto:${restaurant.email}`}
            className="bg-white border border-[#E5DDD2] hover:border-[#6E1D1B] rounded-xl p-4 shadow-xs flex flex-col justify-between min-h-[112px] transition-subtle"
          >
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#6E1D1B]">
              <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Email</span>
            </div>
            <div className="mt-2">
              <span className="font-semibold text-[15px] text-[#1F1A17] block break-all">
                {restaurant.email}
              </span>
              <span className="text-[13px] text-[#5C534E]">Group orders &amp; queries</span>
            </div>
          </a>

          <a
            href={restaurant.address.mapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-[#E5DDD2] hover:border-[#6E1D1B] rounded-xl p-4 shadow-xs flex flex-col justify-between min-h-[112px] transition-subtle"
          >
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#6E1D1B]">
              <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Google Maps</span>
            </div>
            <div className="mt-2">
              <span className="font-semibold text-[15px] text-[#1F1A17] block">
                Potheri, Kattankulathur
              </span>
              <span className="text-[13px] text-[#5C534E]">Near railway gate</span>
            </div>
          </a>
        </section>

        {/* CONTACT & PRE-FILLED ORDER FORM */}
        {!isSubmitted && (
          <section className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
            <div className="md:col-span-3 bg-white border border-[#E5DDD2] rounded-xl p-5 sm:p-6 shadow-xs">
              <div className="border-b border-[#E5DDD2] pb-3 mb-5">
                <h2 className="text-[20px] sm:text-[22px] font-heritage font-bold text-[#1F1A17]">
                  Prepare a WhatsApp or email order
                </h2>
                <p className="text-[15px] text-[#5C534E] mt-1">
                  Enter your details below to format a ready-to-send message.
                </p>
              </div>

              {submitAttempted && !validation.isValid && !validation.isSpam && (
                <div
                  role="alert"
                  data-testid="form-error-banner"
                  className="mb-5 bg-red-50 border border-[#B42318] text-[#7A160E] rounded-lg p-3.5 text-[14px]"
                >
                  <p className="font-semibold mb-1">
                    Please fix the highlighted fields before continuing:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {Object.values(validation.errors).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Honeypot field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website-honeypot">
                    Leave this field empty if you are human
                  </label>
                  <input
                    id="website-honeypot"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.honeypot}
                    onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-semibold text-[14px] text-[#1F1A17] mb-1.5"
                  >
                    Your name <span className="text-[#6E1D1B]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Karthik"
                    aria-invalid={Boolean(showError('name'))}
                    aria-describedby={showError('name') ? 'error-name' : undefined}
                    className={`w-full h-11 bg-[#FAF6F0] border rounded-lg px-3.5 text-[15px] text-[#1F1A17] ${
                      showError('name') ? 'border-[#B42318] bg-red-50/40' : 'border-[#CFC4B4]'
                    }`}
                  />
                  {showError('name') && (
                    <p
                      id="error-name"
                      role="alert"
                      className="text-[13px] text-[#B42318] font-medium mt-1"
                    >
                      {validation.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block font-semibold text-[14px] text-[#1F1A17] mb-1.5"
                  >
                    10-digit Indian mobile number <span className="text-[#6E1D1B]">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    value={form.phone}
                    onBlur={() => setTouched({ ...touched, phone: true })}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 98765 43210"
                    aria-invalid={Boolean(showError('phone'))}
                    aria-describedby={showError('phone') ? 'error-phone' : undefined}
                    className={`w-full h-11 bg-[#FAF6F0] border rounded-lg px-3.5 text-[15px] text-[#1F1A17] ${
                      showError('phone') ? 'border-[#B42318] bg-red-50/40' : 'border-[#CFC4B4]'
                    }`}
                  />
                  {showError('phone') ? (
                    <p
                      id="error-phone"
                      role="alert"
                      className="text-[13px] text-[#B42318] font-medium mt-1"
                    >
                      {validation.errors.phone}
                    </p>
                  ) : (
                    <p className="text-[13px] text-[#5C534E] mt-1">
                      Valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-semibold text-[14px] text-[#1F1A17] mb-1.5"
                  >
                    Email address <span className="text-[#5C534E] font-normal">(optional)</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. student@example.com"
                    aria-invalid={Boolean(showError('email'))}
                    aria-describedby={showError('email') ? 'error-email' : undefined}
                    className={`w-full h-11 bg-[#FAF6F0] border rounded-lg px-3.5 text-[15px] text-[#1F1A17] ${
                      showError('email') ? 'border-[#B42318] bg-red-50/40' : 'border-[#CFC4B4]'
                    }`}
                  />
                  {showError('email') && (
                    <p
                      id="error-email"
                      role="alert"
                      className="text-[13px] text-[#B42318] font-medium mt-1"
                    >
                      {validation.errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-semibold text-[14px] text-[#1F1A17] mb-1.5"
                  >
                    Order items or enquiry <span className="text-[#6E1D1B]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="orderOrMessage"
                    rows={4}
                    required
                    value={form.orderOrMessage}
                    onBlur={() => setTouched({ ...touched, orderOrMessage: true })}
                    onChange={(e) => setForm({ ...form, orderOrMessage: e.target.value })}
                    placeholder="e.g. 2x Chicken Dum Biryani, 1x Chicken 65 — pickup in 20 mins."
                    aria-invalid={Boolean(showError('orderOrMessage'))}
                    aria-describedby={showError('orderOrMessage') ? 'error-message' : undefined}
                    className={`w-full bg-[#FAF6F0] border rounded-lg p-3.5 text-[15px] text-[#1F1A17] ${
                      showError('orderOrMessage')
                        ? 'border-[#B42318] bg-red-50/40'
                        : 'border-[#CFC4B4]'
                    }`}
                  />
                  {showError('orderOrMessage') && (
                    <p
                      id="error-message"
                      role="alert"
                      className="text-[13px] text-[#B42318] font-medium mt-1"
                    >
                      {validation.errors.orderOrMessage}
                    </p>
                  )}
                </div>

                <fieldset>
                  <legend className="block font-semibold text-[14px] text-[#1F1A17] mb-2">
                    Preferred channel
                  </legend>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`h-11 px-3.5 rounded-lg border cursor-pointer flex items-center gap-2 text-[14px] font-semibold transition-subtle ${
                        form.preferredChannel === 'whatsapp'
                          ? 'bg-[#EAF5EE] border-[#1E6B3A] text-[#1E6B3A]'
                          : 'bg-[#FAF6F0] border-[#E5DDD2] text-[#1F1A17]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredChannel"
                        value="whatsapp"
                        checked={form.preferredChannel === 'whatsapp'}
                        onChange={() => setForm({ ...form, preferredChannel: 'whatsapp' })}
                        className="accent-[#1E6B3A]"
                      />
                      <span>WhatsApp</span>
                    </label>

                    <label
                      className={`h-11 px-3.5 rounded-lg border cursor-pointer flex items-center gap-2 text-[14px] font-semibold transition-subtle ${
                        form.preferredChannel === 'email'
                          ? 'bg-[#FBF5E8] border-[#6E1D1B] text-[#6E1D1B]'
                          : 'bg-[#FAF6F0] border-[#E5DDD2] text-[#1F1A17]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredChannel"
                        value="email"
                        checked={form.preferredChannel === 'email'}
                        onChange={() => setForm({ ...form, preferredChannel: 'email' })}
                        className="accent-[#6E1D1B]"
                      />
                      <span>Email</span>
                    </label>
                  </div>
                </fieldset>

                <button
                  type="submit"
                  className="w-full h-12 px-5 rounded-lg bg-[#6E1D1B] hover:bg-[#571614] text-white font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-subtle cursor-pointer"
                >
                  <span>Prepare Pre-Filled Message</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </form>
            </div>

            {/* Sidebar Details */}
            <aside className="md:col-span-2 space-y-4">
              <div className="bg-white border border-[#E5DDD2] rounded-xl p-5 shadow-xs space-y-2 text-[15px]">
                <h3 className="font-heritage font-semibold text-[18px] text-[#1F1A17]">
                  Counter details
                </h3>
                <p className="text-[#5C534E] leading-relaxed">
                  <strong className="text-[#1F1A17]">{restaurant.name}</strong>
                  <br />
                  {restaurant.address.full} ({restaurant.address.landmark})
                </p>
                <p className="text-[#5C534E]">
                  <strong className="text-[#1F1A17]">Hours:</strong> {restaurant.hours.summary}
                </p>
                <p className="text-[#5C534E]">
                  <strong className="text-[#1F1A17]">Phone:</strong> {restaurant.phoneDisplay}
                </p>
              </div>

              <div className="bg-[#F3ECE1] border border-[#E5DDD2] rounded-xl p-5">
                <h3 className="font-heritage font-semibold text-[18px] text-[#1F1A17] mb-1">
                  Allergy or spice notes
                </h3>
                <p className="text-[15px] text-[#5C534E] leading-relaxed">
                  {restaurant.allergenNotice}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('/menu')}
                  className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#6E1D1B] hover:underline cursor-pointer"
                >
                  <span>Browse Full Menu</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </aside>
          </section>
        )}
      </div>
    </div>
  );
};
