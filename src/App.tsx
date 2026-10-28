/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage, TermsOfUsePage } from './pages/LegalPages';
import { NotFoundPage, ServerErrorPage } from './pages/ErrorPages';

interface PageSeoMeta {
  title: string;
  description: string;
  canonicalPath: string;
}

const PAGE_SEO: Record<string, PageSeoMeta> = {
  '/': {
    title: 'Bawarchi — Hyderabadi Dum Biryani & North Indian Classics | Potheri',
    description:
      'Bawarchi in Potheri, Kattankulathur serves Hyderabadi dum biryani, Chicken 65, Butter Chicken, and North Indian classics. Order on WhatsApp or call +91 98765 43210.',
    canonicalPath: '/',
  },
  '/menu': {
    title: 'Full Menu & Rate Board — Bawarchi | Potheri, Kattankulathur',
    description:
      'Browse the full Bawarchi rate board with prices in ₹: Chicken Dum Biryani (₹180), Mutton Biryani (₹260), Chicken 65 (₹150), Butter Chicken (₹190), Paneer Butter Masala (₹160), breads & drinks.',
    canonicalPath: '/menu',
  },
  '/about': {
    title: 'About Us & Directions — Bawarchi Near Potheri Railway Gate',
    description:
      'Find Bawarchi at No. 24, Pillayar Koil Street, Potheri, Kattankulathur – 603203 (near the Potheri railway gate). Open daily 11:00 AM to 11:30 PM (Fridays from 12:30 PM).',
    canonicalPath: '/about',
  },
  '/contact': {
    title: 'Contact & Direct WhatsApp Order — Bawarchi Potheri',
    description:
      'Call +91 98765 43210, message on WhatsApp, or use our pre-filled order form to order from Bawarchi in Potheri, Kattankulathur.',
    canonicalPath: '/contact',
  },
  '/thank-you': {
    title: 'Order Message Ready — Bawarchi Potheri',
    description:
      'Your pre-filled WhatsApp or email order message for Bawarchi is ready to send.',
    canonicalPath: '/contact',
  },
  '/privacy': {
    title: 'Privacy Policy — Bawarchi Foods',
    description:
      'Privacy Policy for Bawarchi Foods under the Digital Personal Data Protection Act, 2023 (India).',
    canonicalPath: '/privacy',
  },
  '/terms': {
    title: 'Terms of Use — Bawarchi Foods',
    description:
      'Terms of Use for Bawarchi Foods in Potheri, Kattankulathur, governed by the laws of India and courts at Chengalpattu, Tamil Nadu.',
    canonicalPath: '/terms',
  },
  '/404': {
    title: 'Page Not Found (404) — Bawarchi Potheri',
    description:
      'We could not find that page. Return to the Bawarchi home page, check the full biryani menu, or call +91 98765 43210.',
    canonicalPath: '/404',
  },
  '/error': {
    title: 'Service Notice — Bawarchi Potheri',
    description:
      'Something went wrong loading the page. Call Bawarchi directly at +91 98765 43210 or order on WhatsApp.',
    canonicalPath: '/error',
  },
};

function normalizePathname(rawPath: string): string {
  if (!rawPath || rawPath === '') return '/';
  const cleaned = rawPath.split('?')[0].split('#')[0];
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    return cleaned.slice(0, -1);
  }
  return cleaned;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== 'undefined' ? normalizePathname(window.location.pathname) : '/'
  );

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePathname(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Update per-page SEO title, meta description, OpenGraph, and canonical URL dynamically
  useEffect(() => {
    try {
      const seo = PAGE_SEO[currentPath] || PAGE_SEO['/404'];
      document.title = seo.title;

      const setMetaContent = (selector: string, content: string) => {
        const el = document.querySelector(selector);
        if (el) el.setAttribute('content', content);
      };

      setMetaContent('meta[name="description"]', seo.description);
      setMetaContent('meta[property="og:title"]', seo.title);
      setMetaContent('meta[property="og:description"]', seo.description);
      setMetaContent('meta[name="twitter:title"]', seo.title);
      setMetaContent('meta[name="twitter:description"]', seo.description);

      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl && typeof window !== 'undefined') {
        canonicalEl.setAttribute('href', `${window.location.origin}${seo.canonicalPath}`);
      }
    } catch {
      // Fail gracefully — never let a DOM metadata update break page rendering
    }
  }, [currentPath]);

  const handleNavigate = (target: string) => {
    try {
      const [pathPart, hashPart] = target.split('#');
      const nextPath = normalizePathname(pathPart || '/');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', target);
      }
      setCurrentPath(nextPath);

      if (hashPart) {
        setTimeout(() => {
          const el = document.getElementById(hashPart);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      setCurrentPath('/');
    }
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={handleNavigate} />;
      case '/menu':
        return <MenuPage onNavigate={handleNavigate} />;
      case '/about':
        return <AboutPage onNavigate={handleNavigate} />;
      case '/contact':
        return <ContactPage initialSubmitted={false} onNavigate={handleNavigate} />;
      case '/thank-you':
        return <ContactPage initialSubmitted={true} onNavigate={handleNavigate} />;
      case '/privacy':
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case '/terms':
        return <TermsOfUsePage onNavigate={handleNavigate} />;
      case '/error':
      case '/500':
        return <ServerErrorPage onNavigate={handleNavigate} />;
      case '/404':
      default:
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentPath={currentPath} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}
