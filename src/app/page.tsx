import type { Metadata } from 'next';
import ShowerCalculator from '@/components/calculator/ShowerCalculator';
import { HeroAnimations } from '@/components/AnimatedHero';
import FAQAccordion from '@/components/FAQAccordion';

/* ─── On-page SEO metadata ──────────────────────────────────────────────── */

export const metadata: Metadata = {
  // Title with primary keyword first, brand last
  title: 'Custom Frameless Shower Quote Calculator | LusoGlass',

  description:
    'Design your custom frameless shower enclosure online and get a free instant quote. Choose from 22 glass door configurations, hardware finishes, and glass types. Serving residential and commercial clients — professional installation included.',

  // Canonical URL (update to production domain when deploying)
  alternates: {
    canonical: 'https://lusoglass.com/shower-calculator',
  },

  // Keywords (supplemental signal — used by some secondary engines)
  keywords: [
    'custom shower enclosure',
    'frameless shower door',
    'shower door quote',
    'glass shower calculator',
    'custom shower glass',
    'shower enclosure cost',
    'frameless glass shower installation',
    'LusoGlass',
    'shower door configurator',
    'tempered glass shower',
  ],

  // Open Graph — controls how the page appears when shared on Facebook, LinkedIn, WhatsApp
  openGraph: {
    type: 'website',
    url: 'https://lusoglass.com/shower-calculator',
    siteName: 'LusoGlass',
    title: 'Custom Frameless Shower Quote Calculator | LusoGlass',
    description:
      'Configure your frameless glass shower in minutes and receive a free instant price estimate. 22 enclosure templates, multiple glass types and hardware finishes.',
    images: [
      {
        url: 'https://lusoglass.com/og-shower-calculator.jpg', // replace with actual OG image
        width: 1200,
        height: 630,
        alt: 'LusoGlass custom shower calculator — design your frameless enclosure online',
      },
    ],
    locale: 'en_US',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@lusoglass',
    creator: '@lusoglass',
    title: 'Custom Frameless Shower Quote Calculator | LusoGlass',
    description:
      'Design your custom shower enclosure and get a free instant quote from LusoGlass.',
    images: ['https://lusoglass.com/og-shower-calculator.jpg'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  // Authorship / verification (replace with real codes before going live)
  verification: {
    google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_CODE',
  },
};

/* ─── JSON-LD structured data ───────────────────────────────────────────── */

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // 1. LocalBusiness — tells Google who LusoGlass is
    {
      '@type': 'LocalBusiness',
      '@id': 'https://lusoglass.com/#business',
      name: 'LusoGlass',
      url: 'https://lusoglass.com',
      logo: 'https://lusoglass.com/logo.png',
      description:
        'LusoGlass specialises in custom frameless and semi-frameless shower enclosures, glass doors, and hardware installation for residential and commercial projects.',
      priceRange: '$$',
      currenciesAccepted: 'USD',
      paymentAccepted: 'Cash, Credit Card, Check',
      areaServed: { '@type': 'Country', name: 'United States' },
      sameAs: [
        'https://lusoglass.com',
        'https://www.facebook.com/lusoglass',
        'https://www.instagram.com/lusoglass',
      ],
    },

    // 2. Service — the specific offering on this page
    {
      '@type': 'Service',
      '@id': 'https://lusoglass.com/shower-calculator#service',
      name: 'Custom Frameless Shower Enclosure',
      serviceType: 'Glass Shower Installation',
      provider: { '@id': 'https://lusoglass.com/#business' },
      description:
        'Design and install custom frameless, semi-frameless, or framed shower enclosures. Choose from 22 door configurations, clear / low-iron / ShowerGuard glass, and multiple hardware finishes.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://lusoglass.com/shower-calculator',
        description: 'Free instant quote — final price confirmed after on-site measurement.',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Shower Glass Options',
        itemListElement: [
          { '@type': 'Offer', name: 'Clear Tempered Glass', description: '$45–$55 per sq ft' },
          { '@type': 'Offer', name: 'Low Iron Glass',        description: '$55–$70 per sq ft' },
          { '@type': 'Offer', name: 'ShowerGuard Glass',     description: '$65–$85 per sq ft' },
        ],
      },
    },

    // 3. WebPage — the calculator page itself
    {
      '@type': 'WebPage',
      '@id': 'https://lusoglass.com/shower-calculator',
      url: 'https://lusoglass.com/shower-calculator',
      name: 'Custom Frameless Shower Quote Calculator | LusoGlass',
      description:
        'Interactive shower enclosure configurator — choose template, dimensions, glass type, and hardware to get a free instant price estimate.',
      isPartOf: { '@id': 'https://lusoglass.com/#business' },
      about: { '@id': 'https://lusoglass.com/shower-calculator#service' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',               item: 'https://lusoglass.com' },
          { '@type': 'ListItem', position: 2, name: 'Shower Calculator',  item: 'https://lusoglass.com/shower-calculator' },
        ],
      },
    },

    // 4. FAQPage — rich result in Google SERP
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does a custom frameless shower enclosure cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The cost depends on the size, glass type, and hardware finish. Clear glass starts at $45–$55 per sq ft, Low Iron at $55–$70, and ShowerGuard at $65–$85. Use our free calculator to get an instant estimate for your specific dimensions.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between frameless and semi-frameless shower doors?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Frameless shower doors use thick tempered glass (3/8" or 1/2") with no metal frame, giving a sleek modern look. Semi-frameless doors have a minimal frame only on the edges. Framed doors have a full metal frame around all panels.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does installation take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most custom shower enclosures are installed in 1–2 days after the glass has been fabricated. Fabrication typically takes 5–10 business days after the on-site measurement visit.',
          },
        },
        {
          '@type': 'Question',
          name: 'What glass types do you offer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We offer three glass types: Clear tempered glass (standard), Low Iron glass (ultra-clear, no green tint), and ShowerGuard glass (permanent easy-clean coating that prevents mineral build-up).',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the online quote final?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The online estimate gives you a reliable price range based on your glass type and dimensions. A final price is confirmed after a free on-site measurement visit where we verify dimensions and discuss any site-specific requirements.',
          },
        },
      ],
    },
  ],
};

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">

        {/* ── Header / Nav ── */}
        <header role="banner">
          <nav
            aria-label="Main navigation"
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
              <a href="https://lusoglass.com" aria-label="LusoGlass — go to homepage">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/lusoglass-logo.webp"
                  alt="LusoGlass — custom frameless shower enclosures"
                  width={140}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              </a>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <a
                  href="https://lusoglass.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0070a6] transition-colors hidden sm:block"
                >
                  lusoglass.com
                </a>
                <a
                  href="tel:+18005550199"
                  aria-label="Call LusoGlass"
                  className="bg-[#0070a6] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#005a87] transition-colors"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </nav>
        </header>

        {/* ── Hero ── */}
        <div className="relative pt-16 overflow-hidden" role="region" aria-label="Hero">
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-[0.07]"
                 style={{ background: 'radial-gradient(circle, #0070a6 0%, transparent 70%)' }} />
            <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
                 style={{ background: 'radial-gradient(circle, #0070a6 0%, transparent 70%)' }} />
          </div>

          <HeroAnimations />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12 text-center relative">
            <p className="inline-flex items-center gap-2 bg-[#e6f3fa] text-[#0070a6] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              Free instant quote — no commitment
            </p>

            {/* H1 — one per page, primary keyword in first 6 words */}
            <h1
              data-anim="h1"
              className="text-3xl sm:text-5xl font-bold text-[#0f0f0f] leading-tight mb-4 tracking-tight"
              style={{ fontFamily: "'Google Sans Display', 'Google Sans', sans-serif" }}
            >
              Custom shower enclosure<br />
              <span className="text-[#0070a6]">quote calculator.</span>
            </h1>

            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 font-normal leading-relaxed">
              Configure your frameless glass shower — choose from 22 enclosure templates,
              glass type, and hardware finish — and get a free instant price estimate in under 2 minutes.
            </p>

            {/* Trust signals */}
            <ul
              data-anim="trust"
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mb-14 list-none p-0"
              aria-label="Quality guarantees"
            >
              {[
                'Tempered safety glass',
                'Professional installation',
                'Lifetime warranty',
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0070a6] shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Calculator (main interactive content) ── */}
        <main id="main-content" aria-label="Shower quote calculator">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 pb-16 sm:pb-24">
            <ShowerCalculator />
          </div>
        </main>

        {/* ── FAQ section — feeds JSON-LD FAQPage and adds keyword-rich text ── */}
        <section data-anim="faq-section" aria-labelledby="faq-heading" className="bg-gray-50 border-t border-gray-100 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2
              id="faq-heading"
              data-anim="faq-heading"
              className="text-xl sm:text-2xl font-bold text-[#0f0f0f] mb-2 tracking-tight"
            >
              Frequently asked questions
            </h2>
            <p className="text-gray-500 text-sm mb-10">
              Everything you need to know before ordering a custom shower enclosure.
            </p>

            <FAQAccordion />
          </div>
        </section>

        {/* ── Footer ── */}
        <footer role="contentinfo" className="border-t border-gray-100 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
            <span>© {new Date().getFullYear()} LusoGlass. All rights reserved.</span>
            <nav aria-label="Footer navigation" className="flex items-center gap-6">
              <a href="https://lusoglass.com/privacy" className="hover:text-[#0070a6] transition-colors">Privacy Policy</a>
              <a href="https://lusoglass.com/terms"   className="hover:text-[#0070a6] transition-colors">Terms of Service</a>
              <a href="https://lusoglass.com"         className="hover:text-[#0070a6] transition-colors">lusoglass.com</a>
            </nav>
          </div>
        </footer>

      </div>
    </>
  );
}
