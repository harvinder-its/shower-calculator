'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'How much does a custom frameless shower enclosure cost?',
    a: 'The cost depends on the size, glass type, and hardware finish. Clear glass starts at $45–$55 per sq ft, Low Iron at $55–$70, and ShowerGuard at $65–$85. Use the calculator above to get an instant estimate for your specific dimensions.',
  },
  {
    q: 'What is the difference between frameless and semi-frameless shower doors?',
    a: 'Frameless shower doors use thick tempered glass (3/8" or 1/2") with no metal frame, giving a sleek modern look. Semi-frameless doors have a minimal frame only on the edges. Framed doors have a full metal frame around all panels.',
  },
  {
    q: 'How long does installation take?',
    a: 'Most custom shower enclosures are installed in 1–2 days after the glass has been fabricated. Fabrication typically takes 5–10 business days after the on-site measurement visit.',
  },
  {
    q: 'What glass types do you offer?',
    a: 'We offer three glass types: Clear tempered glass (standard), Low Iron glass (ultra-clear, no green tint), and ShowerGuard glass (permanent easy-clean coating that prevents mineral build-up).',
  },
  {
    q: 'Is the online quote final?',
    a: 'The online estimate gives you a reliable price range. A final price is confirmed after a free on-site measurement visit where we verify dimensions and discuss any site-specific requirements.',
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <dl className="divide-y divide-gray-200">
      {FAQS.map(({ q, a }, i) => (
        <div key={q} data-anim="faq-item">
          <dt>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="w-full flex items-center justify-between py-5 text-left gap-4 group"
            >
              <span className="font-semibold text-[#0f0f0f] text-sm group-hover:text-[#0070a6] transition-colors">
                {q}
              </span>
              <span
                className="shrink-0 w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center transition-all"
                style={{
                  background: open === i ? '#0070a6' : 'white',
                  borderColor: open === i ? '#0070a6' : undefined,
                }}
                aria-hidden="true"
              >
                <svg
                  className="w-2.5 h-2.5 transition-transform duration-200"
                  style={{
                    color: open === i ? 'white' : '#9ca3af',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
          </dt>
          <dd
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: open === i ? '200px' : '0px' }}
          >
            <p className="pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
