import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Instagram,
  Menu,
  X,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import menuData from '../data/menu.json';
import { getOpenStatus, buildWhatsAppOrderUrl } from '../utils/restaurantLogic';

export type RoutePath =
  | '/'
  | '/menu'
  | '/about'
  | '/contact'
  | '/thank-you'
  | '/privacy'
  | '/terms'
  | '/404'
  | '/error';

interface LayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentPath, onNavigate, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(() => getOpenStatus(new Date()));

  const { restaurant } = menuData;
  const whatsappOrderHref = buildWhatsAppOrderUrl(restaurant.whatsappNumber, '');

  useEffect(() => {
    const timer = setInterval(() => {
      setOpenStatus(getOpenStatus(new Date()));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('#')) {
      if (currentPath !== '/') {
        e.preventDefault();
        onNavigate('/' + path);
      }
      setMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'Find Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="antialiased min-h-screen flex flex-col pb-safe-bottom-bar text-[#1F1A17] bg-[#FAF6F0]">
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#6E1D1B] focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* STICKY TOP BAR: Live IST Status, Desktop Nav & Mobile Hamburger */}
      <header className="bg-[#1F1A17] text-[#FAF6F0] border-b border-[#332B26] sticky top-0 z-50">
        <div className="site-container min-h-[52px] py-2 flex items-center justify-between gap-3">
          {/* Brand & Live IST Status */}
          <div className="flex items-center gap-2.5 min-w-0">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="font-heritage font-bold text-[18px] text-[#FAF6F0] tracking-tight whitespace-nowrap shrink-0"
            >
              {restaurant.name}
            </a>

            <span className="text-[#5C534E]" aria-hidden="true">
              ·
            </span>

            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                  openStatus.isOpen ? 'bg-[#25D366]' : 'bg-[#C6922C]'
                }`}
                aria-hidden="true"
              />
              <span
                data-testid="open-status-badge"
                className={`font-semibold text-[13px] whitespace-nowrap ${
                  openStatus.isOpen ? 'text-[#25D366]' : 'text-[#E5C170]'
                }`}
              >
                {openStatus.badgeText}
              </span>
              <span className="text-[#5C534E] hidden sm:inline" aria-hidden="true">
                ·
              </span>
              <span
                className="text-[#D5CCC3] text-[13px] truncate hidden sm:inline"
                title={`${restaurant.hours.summary} (Current IST: ${openStatus.istTimeFormatted})`}
              >
                {restaurant.hours.shortStrip}
              </span>
            </div>
          </div>

          {/* Desktop Navigation + Location Link */}
          <div className="flex items-center gap-2 shrink-0">
            <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(e) => handleLinkClick(e, item.path)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`px-3 py-1.5 rounded-md text-[14px] font-medium transition-subtle whitespace-nowrap ${
                      isActive
                        ? 'bg-[#6E1D1B] text-white'
                        : 'text-[#EAE2D8] hover:text-white hover:bg-[#2C2521]'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <a
              className="hidden sm:inline-flex items-center gap-1.5 text-[13px] text-[#E5C170] hover:text-white shrink-0 font-medium px-2 py-1.5 rounded-md transition-subtle"
              href={restaurant.address.mapsSearchUrl}
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Open Potheri, Kattankulathur location in Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C6922C] shrink-0" aria-hidden="true" />
              <span>Potheri</span>
            </a>

            {/* Accessible Mobile Hamburger Button (44px+ tap target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-1 rounded-md text-[#FAF6F0] hover:bg-[#2C2521] transition-subtle"
            >
              <span className="sr-only">Menu</span>
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-drawer"
            aria-label="Mobile navigation"
            className="md:hidden bg-[#26201C] border-t border-[#382F2A]"
          >
            <div className="site-container py-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      onClick={(e) => handleLinkClick(e, item.path)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`min-h-[44px] px-3.5 py-2.5 rounded-md font-semibold text-[14px] flex items-center justify-between border transition-subtle ${
                        isActive
                          ? 'bg-[#6E1D1B] text-white border-[#8E2A27]'
                          : 'bg-[#1F1A17] text-[#FAF6F0] border-[#382F2A] hover:border-[#C6922C]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-80" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-[#382F2A] flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#D5CCC3]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C6922C] shrink-0" aria-hidden="true" />
                  <span>{restaurant.address.short}</span>
                </span>
                <div className="flex items-center gap-4">
                  <a
                    href="/privacy"
                    onClick={(e) => handleLinkClick(e, '/privacy')}
                    className="underline hover:text-white py-1"
                  >
                    Privacy
                  </a>
                  <a
                    href="/terms"
                    onClick={(e) => handleLinkClick(e, '/terms')}
                    className="underline hover:text-white py-1"
                  >
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* MAIN CONTENT LANDMARK */}
      <main id="main-content" className="flex-grow">
        {children}
      </main>

      {/* FOOTER (FSSAI shown once, in the footer only; icons & text aligned on one grid) */}
      <footer className="bg-[#1F1A17] text-[#FAF6F0] pt-12 pb-10 border-t border-[#332B26]">
        <div className="site-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#332B26]">
            {/* Column 1: Brand & Story */}
            <div className="space-y-2">
              <h2 className="font-heritage font-bold text-[20px] text-[#FAF6F0]">
                {restaurant.name}
              </h2>
              <p className="text-[15px] text-[#D5CCC3] leading-relaxed">
                {restaurant.tagline}. Serving {restaurant.cuisine.join(', ')} dishes in Potheri since {restaurant.established}.
              </p>
              <p className="text-[13px] text-[#A89E96] pt-1">
                {restaurant.legalName} · Proprietor: {restaurant.proprietor}
              </p>
            </div>

            {/* Column 2: Direct Contact Grid */}
            <div>
              <h3 className="font-heritage font-semibold text-[18px] text-[#FAF6F0] mb-3">
                Contact
              </h3>
              <ul className="space-y-2.5 text-[15px] text-[#D5CCC3]">
                <li className="grid grid-cols-[20px_1fr] items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C6922C]" aria-hidden="true" />
                  <a className="hover:text-white underline" href={`tel:${restaurant.phoneTel}`}>
                    {restaurant.phoneDisplay}
                  </a>
                </li>
                <li className="grid grid-cols-[20px_1fr] items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" aria-hidden="true" />
                  <a
                    className="hover:text-white underline"
                    href={whatsappOrderHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp: {restaurant.phoneDisplay}
                  </a>
                </li>
                <li className="grid grid-cols-[20px_1fr] items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C6922C]" aria-hidden="true" />
                  <a className="hover:text-white underline break-all" href={`mailto:${restaurant.email}`}>
                    {restaurant.email}
                  </a>
                </li>
                <li className="grid grid-cols-[20px_1fr] items-center gap-2.5">
                  <Instagram className="w-4 h-4 text-[#C6922C]" aria-hidden="true" />
                  <a
                    className="hover:text-white underline"
                    href={restaurant.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {restaurant.instagramHandle}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Location & Hours */}
            <div>
              <h3 className="font-heritage font-semibold text-[18px] text-[#FAF6F0] mb-3">
                Location &amp; Hours
              </h3>
              <div className="grid grid-cols-[20px_1fr] items-start gap-2.5 text-[15px] text-[#D5CCC3]">
                <MapPin className="w-4 h-4 text-[#C6922C] mt-1" aria-hidden="true" />
                <div>
                  <p className="leading-relaxed">
                    {restaurant.address.full} ({restaurant.address.landmark})
                  </p>
                  <p className="text-[13px] text-[#A89E96] mt-1.5">
                    {restaurant.hours.summary}
                  </p>
                  <a
                    className="mt-2.5 inline-flex items-center gap-1 text-[14px] font-semibold text-[#E5C170] hover:text-white underline"
                    href={restaurant.address.mapsSearchUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#332B26] text-[13px] text-[#D5CCC3]">
            <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="hover:text-white underline">
                Home
              </a>
              <a href="/menu" onClick={(e) => handleLinkClick(e, '/menu')} className="hover:text-white underline">
                Menu
              </a>
              <a href="/about" onClick={(e) => handleLinkClick(e, '/about')} className="hover:text-white underline">
                About &amp; Find Us
              </a>
              <a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="hover:text-white underline">
                Contact
              </a>
              <a href="/privacy" onClick={(e) => handleLinkClick(e, '/privacy')} className="hover:text-white underline">
                Privacy Policy
              </a>
              <a href="/terms" onClick={(e) => handleLinkClick(e, '/terms')} className="hover:text-white underline">
                Terms of Use
              </a>
            </nav>

            <span className="text-[#A89E96]">
              FSSAI License No. {restaurant.fssaiLicense}
            </span>
          </div>

          {/* Copyright & Sample Notice */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[13px] text-[#A89E96]">
            <p>© 2026 {restaurant.legalName}. All rights reserved.</p>
            <p>{restaurant.demoBanner}</p>
          </div>
        </div>
      </footer>

      {/* PERSISTENT MOBILE BOTTOM BAR (Equal height 48px buttons, WhatsApp wider, safe-area inset) */}
      <nav
        aria-label="Quick mobile actions"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1F1A17] border-t border-[#382F2A] px-3 pt-2 bottom-bar-safe shadow-lg"
      >
        <div className="grid grid-cols-[1fr_1.6fr_1fr] items-center gap-2 max-w-xl mx-auto">
          <a
            className="h-12 px-2 rounded-lg bg-[#2C2521] border border-[#3E342E] text-[#FAF6F0] hover:bg-[#382F2A] font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-subtle whitespace-nowrap"
            href={`tel:${restaurant.phoneTel}`}
          >
            <Phone className="w-4 h-4 text-[#C6922C] shrink-0" aria-hidden="true" />
            <span>Call</span>
          </a>

          <a
            className="h-12 px-3 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-[#0D2815] font-bold text-[14px] flex items-center justify-center gap-1.5 transition-subtle whitespace-nowrap"
            href={whatsappOrderHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>

          <a
            className="h-12 px-2 rounded-lg bg-[#2C2521] border border-[#3E342E] text-[#FAF6F0] hover:bg-[#382F2A] font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-subtle whitespace-nowrap"
            href={restaurant.address.mapsSearchUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MapPin className="w-4 h-4 text-[#C6922C] shrink-0" aria-hidden="true" />
            <span>Directions</span>
          </a>
        </div>
      </nav>
    </div>
  );
};
