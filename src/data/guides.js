// Free guides (lead magnets) promoted on social. Each one gets a page at /guides/<slug> with a
// download button for the PDF in public/guides/. The page view and the download are reported to
// GTM and the Meta Pixel (lib/tracking.js), so guide readers can be retargeted.
// Pages are prerendered with noindex: they are landing pages for social traffic, not search pages.

export const guidePath = (slug) => `/guides/${slug}`;

export const guides = [
  {
    slug: 'call-playbook',
    title: 'The Call Playbook',
    eyebrow: 'Free playbook · 8 pages',
    dek: 'Cold calls, warm calls, and what to say back to the ten objections your team will hear this week. Written for real-estate and home-service sales teams.',
    pdf: '/guides/the-call-playbook.pdf',
    highlights: [
      'The five-step cold call that books the meeting',
      'Warm calls: the first three lines and four questions',
      'Ten objections and what to say back',
      'Voicemail and the day 0 to day 14 follow-up texts',
    ],
    inside: [
      'Before you dial',
      'The cold call in five steps',
      'Warm calls: the lead who reached out first',
      'Ten objections and what to say',
      'Voicemail and the follow-up texts',
      'When the calls run themselves',
    ],
    auroraNote: 'With Aurora, your agents answer new leads in seconds, send the follow-up texts and book the meeting in your calendar.',
    meta: {
      title: 'The Call Playbook: free scripts for sales teams · Divine Tech AI',
      description: 'Free playbook for real-estate and home-service sales teams: cold calls, warm calls, ten objections and the follow-up texts, ready to copy.',
    },
  },
];
