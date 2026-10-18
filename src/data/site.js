// Single source of truth for homepage copy, contact details and media slots.
// Numbers: only illustrative UI values inside product mock-ups. No performance
// metrics are claimed until they are verified with the Divine Tech AI team.

export const brand = {
  company: 'Divine Tech AI',
  product: 'Aurora',
  domain: 'divine-tech.ai',
  email: 'info@divine-tech.ai',
  phone: '+1 212-359-3395',
  phoneTel: '+12123593395',
  // All public phone numbers, shown together wherever contact details appear.
  phones: [
    { label: 'US', display: '+1 212-359-3395', tel: '+12123593395' },
    { label: 'Israel', display: '+972 54-803-7207', tel: '+972548037207' },
  ],
  address: '1441 Broadway, New York, NY 10018, USA',
};

// Company profiles: shown in the footer and published as sameAs in the Organization structured data.
export const social = [
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/divine-tech-ai/' },
  { key: 'x', label: 'X', href: 'https://x.com/DivineTechAI' },
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/divinetech.ai/' },
  { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61594900263896' },
];

// Legal entity details used by the privacy policy and cookie banner.
export const legal = {
  entity: 'Divine Tech AI, Inc.',
  address: '1441 Broadway, Suite 6171, New York, NY 10018, USA',
  phone: '+972 54-803-7207',
  phoneTel: '+972548037207',
};

// Primary navigation. `href` values starting with '/#' are sections of the home page;
// an item with `children` opens a menu (Industries lists the pages in src/data/industries.js).
export const nav = [
  { href: '/platform', label: 'Platform' },
  { label: 'Industries', children: 'industries' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/blog', label: 'Blog' },
];

// Footer "Explore" column.
export const footerLinks = [
  { href: '/platform', label: 'Platform' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/platform#teams', label: 'Teams' },
  { href: '/platform#security', label: 'Security' },
  { href: '/blog', label: 'Blog' },
];

/*
 * Media slots — swap in After Effects exports or photography without touching layout.
 * Each slot accepts null (designed fallback renders) or:
 *   { type: 'image', src, alt, srcSet?, sizes? }
 *   { type: 'video', sources: [{ src, type }], poster?, alt? }   // WebM (incl. alpha), MP4 / HEVC-alpha
 *   { type: 'lottie', src }                                       // needs a player, see MediaSlot.jsx
 */
export const media = {
  heroBackdrop: null,
  industries: { re: null, hc: null, hs: null },
  closing: null,
};

export const hero = {
  // Category headline under a small "Aurora AI OS" lockup (centered, in the spirit of wonderful.ai).
  lockup: 'AI OS',
  titleA: 'AI agents for your customers',
  titleB: 'and your team.',
  text: 'Out front they answer, book and follow up. Behind the scenes they plan, check and report. All inside the tools you already use.',
  primary: 'Book a demo',
  secondary: 'Hear Aurora',
  secondaryHref: '#hear',
  sides: { customers: 'Customers', team: 'Team' },
};

// Hero film: the same request flow on four channels (illustrative scenarios,
// fictional customers). Timing lives in HeroFilm.jsx; copy lives here.
// Each scene: inbound message, Aurora's reply, customer confirms, Aurora books,
// then one decision goes to a person before the final confirmation.
export const heroFilm = {
  chapters: ['Listen', 'Understand', 'Act', 'Confirm'],
  scenes: [
    {
      key: 'imessage',
      channel: 'iMessage',
      mode: 'imessage',
      industry: 'Real estate',
      contact: 'Sarah K.',
      initials: 'SK',
      sub: 'iMessage · 2BR Maple St',
      ref: 'REQ-2048',
      // text scenes: steps / actions / the approval happen right after these line indexes
      stepsAfter: 0,
      actionsAfter: 6,
      approvalAfter: 7,
      lines: [
        { who: 'customer', text: 'Hi! I saw your listing for the 2 bedroom on Maple St. Is it still available?' },
        { who: 'aurora', text: 'Hi Sarah! Yes, it is available from June 1. When are you hoping to move in, and how many people will live there?' },
        { who: 'customer', text: 'Around June 1, just me and my partner. Oh, and we have a dog 🐶' },
        { who: 'aurora', text: 'Good timing then. Dogs are welcome up to 50 lb, with a $300 pet deposit. How big is yours?' },
        { who: 'customer', text: 'She is about 40 lb and very calm 😅 What do we need to apply?' },
        { who: 'aurora', text: 'An online application and a $50 fee per adult. Are you both working full time, or should I add a guarantor form?' },
        { who: 'customer', text: 'We both work full time. Any chance you could waive the fee? We are moving from your Oak Ave building.' },
        { who: 'aurora', text: 'Thanks for staying with us! Let me check that with Dana, our leasing manager. One moment.' },
        { who: 'aurora', text: 'Good news: the fee is waived for both of you. I have sent the application link, it takes about 10 minutes.' },
      ],
      steps: [
        { title: 'Inquiry understood', detail: '2BR Maple St · June 1' },
        { title: 'Pet policy checked', detail: 'Dogs up to 50 lb' },
        { title: 'Fee rule applied', detail: 'Waivers need a manager' },
      ],
      actions: [
        { sys: 'CRM', title: 'Lead qualified', detail: '2 adults · dog · June 1' },
        { sys: 'Applications', title: 'Application prepared', detail: 'Maple St · 2 adults' },
        { sys: 'Tasks', title: 'Follow-up set', detail: 'Thu · check application' },
      ],
      approval: { ask: 'Waive the application fee?', by: 'Dana', role: 'Leasing manager', result: 'Fee waived' },
    },
    {
      key: 'voice',
      channel: 'Voice',
      mode: 'voice',
      industry: 'Home services',
      contact: 'Mark T.',
      initials: 'MT',
      sub: 'Inbound call · Water heater',
      ref: 'JOB-1186',
      // One recorded call (ElevenLabs Eleven v4 dialogue: Aurora and the caller). Line timings live in HeroFilm (T_VOICE).
      audio: '/audio/hero-voice-call.mp3',
      lines: [
        { who: 'customer', text: 'Hi… yeah, so our water heater’s leaking into the basement. Any chance someone can come out today?' },
        { who: 'aurora', text: 'Oh, I’m sorry, that’s no fun at all. We can definitely help. I can have Luis there today, between 2 and 4. In the meantime, could you close the cold-water valve on top of the tank?' },
        { who: 'customer', text: 'Okay… done. Two to four works.' },
        { who: 'aurora', text: 'Perfect, you’re booked. Same-day visits just need a quick sign-off from dispatch… one moment.' },
        { who: 'aurora', text: 'All set! Luis will be there between 2 and 4, and you’ll get a text when he’s on his way.' },
      ],
      steps: [
        { title: 'Urgency detected', detail: 'Active leak · same day' },
        { title: 'Schedule checked', detail: 'Luis free 2–4 pm' },
        { title: 'Safety steps shared', detail: 'Valve shut-off guidance' },
      ],
      actions: [
        { sys: 'CRM', title: 'Job created', detail: 'Water heater · urgent' },
        { sys: 'Calendar', title: 'Technician booked', detail: 'Today 2–4 pm · Luis' },
        { sys: 'Tasks', title: 'Customer updates', detail: 'Text when Luis is en route' },
      ],
      approval: { ask: 'Approve same-day slot?', by: 'Rachel', role: 'Dispatch lead', result: 'Slot approved' },
    },
    {
      key: 'webchat',
      channel: 'Web chat',
      mode: 'web',
      industry: 'B2B sales',
      contact: 'Priya N.',
      initials: 'PN',
      sub: 'Web chat · Pricing page',
      ref: 'Q-1042',
      stepsAfter: 0,
      actionsAfter: 6,
      approvalAfter: 7,
      lines: [
        { who: 'customer', text: 'Hi, we are looking at options for our support team. How does your pricing work?' },
        { who: 'aurora', text: 'Happy to help! Pricing is per seat. How many people are on the team, and are you thinking monthly or annual?' },
        { who: 'customer', text: 'About 40 agents. Annual, if it works out cheaper.' },
        { who: 'aurora', text: 'Annual saves you about 20%. Will the team also need onboarding and training?' },
        { who: 'customer', text: 'Yes, we would need onboarding. Is there a better price for 40 seats?' },
        { who: 'aurora', text: 'For 40 seats on the annual plan it is $18,000 a year. I can send a quote with a volume discount and onboarding included. Where should it go?' },
        { who: 'customer', text: 'priya.n@example.com, thanks!' },
        { who: 'aurora', text: 'Thanks, Priya. A 15% discount needs a quick sign-off from our sales manager. One moment.' },
        { who: 'aurora', text: 'Approved! Your quote for $15,300 is on its way to your inbox, valid for 14 days. I will check in on Thursday.' },
      ],
      steps: [
        { title: 'Buying intent', detail: 'Support team · pricing' },
        { title: 'Price book checked', detail: 'Annual plan · $450 a seat' },
        { title: 'Discount policy', detail: 'Over 10% needs a manager' },
      ],
      actions: [
        { sys: 'CRM', title: 'Deal created', detail: 'Q-1042 · 40 seats' },
        { sys: 'Quotes', title: 'Quote drafted', detail: '15% off · onboarding' },
        { sys: 'Tasks', title: 'Follow-up set', detail: 'Thu 10:00 · check in' },
      ],
      approval: { ask: 'Approve a 15% discount?', by: 'Daniel', role: 'Sales manager', result: 'Discount approved' },
    },
    {
      key: 'email',
      channel: 'Email',
      mode: 'email',
      industry: 'Billing',
      contact: 'Jordan Lee',
      initials: 'JL',
      sub: 'Customer · Account 2291',
      subject: 'Question about my March invoice',
      desk: 'Billing desk',
      ref: 'BIL-311',
      stepsAfter: 2,
      actionsAfter: 4,
      approvalAfter: 5,
      lines: [
        { who: 'customer', text: 'Hi, I just noticed my card was charged twice this month and I am not sure why. Could you look into it?' },
        { who: 'aurora', text: 'Hi Jordan, sorry about that, I will look into it right away. Could you confirm the email address on your account, so I check the right one?' },
        { who: 'customer', text: 'Sure, it is jordan.lee@example.com.' },
        { who: 'aurora', text: 'Thanks. I can see two charges of $240 on March 3 for the same invoice, so the second one is a duplicate. Would you like it refunded to your card, or kept as credit?' },
        { who: 'customer', text: 'Refunded to the card, please.' },
        { who: 'aurora', text: 'Of course. Refunds over $200 need a quick sign-off from our finance team. I will confirm as soon as it is approved.' },
        { who: 'aurora', text: 'Done: $240 is on its way back to your card, usually within 3–5 business days. The receipt is attached.' },
      ],
      steps: [
        { title: 'Billing issue', detail: 'Possible double charge' },
        { title: 'Payments checked', detail: '2 × $240 on Mar 3' },
        { title: 'Refund policy', detail: 'Over $200 needs finance' },
      ],
      actions: [
        { sys: 'Payments', title: 'Duplicate confirmed', detail: 'Second charge · $240' },
        { sys: 'Billing', title: 'Refund prepared', detail: '$240 to original card' },
        { sys: 'CRM', title: 'Case logged', detail: 'BIL-311 · billing' },
      ],
      approval: { ask: 'Approve the $240 refund?', by: 'Alex', role: 'Finance lead', result: 'Refund approved' },
    },
  ],
};

// Atmosphere photography: AI-generated stills (OpenArt, Nano Banana 2) in one
// warm, sunny look. Files live in /public/img/photos; `lqip` is a tiny blurred
// preview shown until the photo arrives, so nothing jumps while it loads.
const PHOTOS = '/img/photos/';
const srcSet = (name, widths) => widths.map((w) => PHOTOS + name + '-' + w + '.webp ' + w + 'w').join(', ');

// Home hero visual: a real-life moment with Aurora's work arriving as a live feed (PhotoStage.jsx).
export const heroStage = {
  caption: 'Your team steps away. Aurora keeps answering, booking and following up.',
  photo: {
    src: PHOTOS + 'moment-1600.webp',
    srcSet: srcSet('moment', [960, 1600, 2400]),
    mobileSrcSet: srcSet('moment-sq', [720, 1080]),
    alt: 'Three colleagues laughing together on the grass in a sunny park while one of them checks her phone',
    lqip: 'data:image/webp;base64,UklGRuAAAABXRUJQVlA4INQAAADQBQCdASogABIAPu1gp02ppSMiMAgBMB2JbACnFYzkwPdGaIVPx6SF4vHdd1qolZ+4nr0YX0gAAP7cS9Qqm7G8thbNxuhg2tlt7P7RgzcsgCup7vxO5U1z4SNgACCwo21XEhr/Pi2yda1plwtGeOvac9dho1g6gER9FjwAZ9frjlFl5FV0d23UscS3T7sMK+kem1ni3ifbpRtrAoKkuSvM70BR/OvI3kmB+HC1zB0UaT7hsAYvmptb/rzgyL+DoDG7fXRwE9CbjUjvEP6RtML474AAAA==',
    lqipMobile: 'data:image/webp;base64,UklGRgwBAABXRUJQVlA4IAABAAAwBgCdASoYABgAPu1qqFAppiOiqA1RMB2JbACdM1dv/i2Jy3mtDQMkSdbjqqQ9YVDlTVem/S38U02AAP6pt7IVuSi5Xq+Mlgx9vN6z0N/jHvGDk4P9B2ST0yGvjBqJ5YQ3OEvmijKbKwmGHYcqNP20icTqPYMiVKeHnVPRgyr/lNapqTrCGqIjtwqkwO7n8k3CjJgNA0zuEX96MdrwX7ZP7pMCmt919zvVxZs/ZnvZVk3stI84ogLjPMPN/jlt8YduOVvtSKh4F5QwSvJBKomI427dSB/iRD96q+UZid6FKp6/0tmO5EE795LWjOIO8e1TlJ9B2HemyHEBqF7LAAAA',
  },
  // Background clips for the home hero (generated footage, fictional people). Each has a wide version
  // for desktop and a vertical one for phones, a still poster, and one line saying what Aurora did there.
  clips: [
    { key: 'realty', wide: '/video/hero-1.mp4', tall: '/video/hero-1-v.mp4', poster: PHOTOS + 'hero-1-1600.webp', posterTall: PHOTOS + 'hero-1-v-720.webp', icon: 'calendar', title: 'Viewing booked', detail: 'Real estate · Sat 11:00', inside: { icon: 'report', title: 'Agents’ week planned', detail: 'Real estate · 14 showings' } },
    { key: 'clinic', wide: '/video/hero-2.mp4', tall: '/video/hero-2-v.mp4', poster: PHOTOS + 'hero-2-1600.webp', posterTall: PHOTOS + 'hero-2-v-720.webp', icon: 'service', title: 'Appointment moved', detail: 'Clinic · Thu 2:10 pm', inside: { icon: 'approval', title: 'Shift swap approved', detail: 'Clinic · Fri front desk' } },
    { key: 'service', wide: '/video/hero-3.mp4', tall: '/video/hero-3-v.mp4', poster: PHOTOS + 'hero-3-1600.webp', posterTall: PHOTOS + 'hero-3-v-720.webp', icon: 'invoice', title: 'Invoice sent', detail: 'Home services · paid by link', inside: { icon: 'approval', title: 'Freelancer invoice checked', detail: 'Home services · held for approval' } },
    { key: 'ops', wide: '/video/hero-4.mp4', tall: '/video/hero-4-v.mp4', poster: PHOTOS + 'hero-4-1600.webp', posterTall: PHOTOS + 'hero-4-v-720.webp', icon: 'message', title: 'Order question answered', detail: 'Operations · tracking sent', inside: { icon: 'report', title: 'Weekly report ready', detail: 'Operations · sent to the team' } },
  ],
  // Illustrative live activity shown over the photo (examples, not customer data).
  events: [
    { icon: 'calendar', title: 'Viewing booked', detail: 'Sat 11:00 · 42 Maple St' },
    { icon: 'message', title: 'New lead answered', detail: 'Text message · 2BR inquiry' },
    { icon: 'qualified', title: 'Lead qualified', detail: 'Budget, timeline, area' },
    { icon: 'send', title: 'Follow-up sent', detail: 'Quote · Unit 4B' },
    { icon: 'service', title: 'Request resolved', detail: 'Appointment moved to Thu' },
    { icon: 'approval', title: 'Invoice approved', detail: 'Routed to Dana · Finance' },
    { icon: 'crm', title: 'CRM updated', detail: 'Notes logged after the call' },
  ],
  // Buttons on the photo: pick a kind of work and the live feed shows only that (examples, not customer data).
  tasks: [
    {
      key: 'leads',
      label: 'Answer leads',
      events: [
        { icon: 'message', title: 'New lead answered', detail: 'Text message · 2BR inquiry' },
        { icon: 'qualified', title: 'Lead qualified', detail: 'Budget, timeline, area' },
        { icon: 'crm', title: 'Lead added to CRM', detail: 'Source: website chat' },
        { icon: 'message', title: 'Missed call answered', detail: 'Called back, question solved' },
      ],
    },
    {
      key: 'bookings',
      label: 'Book appointments',
      events: [
        { icon: 'calendar', title: 'Viewing booked', detail: 'Sat 11:00 · 42 Maple St' },
        { icon: 'service', title: 'Appointment moved', detail: 'Tue to Thu 2:10 pm' },
        { icon: 'send', title: 'Reminder sent', detail: 'SMS · the day before' },
        { icon: 'calendar', title: 'Consultation booked', detail: 'Mon 9:30 · front desk notified' },
      ],
    },
    {
      key: 'invoices',
      label: 'Send invoices',
      events: [
        { icon: 'invoice', title: 'Invoice issued', detail: 'INV-2041 · payment link included' },
        { icon: 'approval', title: 'Invoice approved', detail: 'Routed to Finance' },
        { icon: 'mail', title: 'Payment reminder sent', detail: 'Friendly tone · due Friday' },
        { icon: 'crm', title: 'Payment recorded', detail: 'Books updated' },
      ],
    },
    {
      key: 'followups',
      label: 'Follow up',
      events: [
        { icon: 'mail', title: 'Follow-up email sent', detail: 'Next steps after the call' },
        { icon: 'send', title: 'Quote sent', detail: 'Unit 4B · photos attached' },
        { icon: 'report', title: 'Weekly summary ready', detail: 'Sent to the team on Slack' },
        { icon: 'crm', title: 'CRM updated', detail: 'Notes logged after the call' },
      ],
    },
  ],
};

export const platform = {
  eyebrow: 'Platform',
  titleA: 'One AI operating system',
  titleB: 'for your whole business.',
  text: 'Aurora works inside every department, for your customers and for your own team, in the systems you already run on.',
  link: 'Explore the platform',
  channels: ['Voice', 'SMS', 'Web chat', 'Email', 'WhatsApp', 'Slack'],
  layers: [
    { name: 'Understand', detail: 'Intent, context and history' },
    { name: 'Decide', detail: 'Rules, knowledge and approvals' },
    { name: 'Act', detail: 'Workflows, updates and follow-up' },
  ],
  systems: [
    { name: 'CRM', detail: 'Records and pipeline' },
    { name: 'Calendars', detail: 'Bookings and schedules' },
    { name: 'Tasks', detail: 'Follow-ups and to-dos' },
    { name: 'Knowledge', detail: 'Policies and answers' },
    { name: 'Your team', detail: 'Hand-offs and approvals' },
  ],
  // Phone view: one request at a time, from a customer or from your own team, handled by
  // Aurora inside the department it belongs to. ch = index in channels.
  // from: a customer or your own team. ch = index in channels, sys = index in systems.
  examples: [
    { from: 'Customer', ch: 0, dept: 'Sales', ask: 'I want to book a viewing for Saturday.', sys: 1, done: 'Viewing booked for Sat 10:30' },
    { from: 'Your team', ch: 5, dept: 'Finance', ask: 'Send Acme the March invoice and chase it on Friday.', sys: 2, done: 'Invoice sent, reminder set for Fri' },
    { from: 'Customer', ch: 1, dept: 'Service', ask: 'Can I move my appointment to Thursday?', sys: 1, done: 'Moved to Thu 11:00' },
    { from: 'Your team', ch: 5, dept: 'Operations', ask: 'Which deals had no follow-up this week?', sys: 0, done: '6 deals flagged, tasks assigned' },
    { from: 'Customer', ch: 2, dept: 'Sales', ask: 'Do you have a 2-bedroom under $3,000?', sys: 3, done: 'Two matches sent' },
    { from: 'Your team', ch: 3, dept: 'People', ask: 'Maya starts Monday. Set up her accounts.', sys: 4, done: 'Onboarding started for Maya' },
  ],
  notes: [
    ['One context, every channel', 'A conversation that starts in web chat and continues by phone stays one conversation, with its full history.'],
    ['Your rules on every decision', 'Policies, limits and exceptions are applied the same way at 3 pm and at 3 am.'],
    ['Real actions in real systems', 'Aurora updates the CRM, books the slot and creates the task, instead of leaving a summary for someone else.'],
  ],
};

// Platform page: what Aurora does, in three capabilities (Capabilities.jsx).
export const capabilities = [
  {
    key: 'understand',
    title: 'Understands the business',
    text: 'It learns how your company runs, from your documents, systems and rules, and shows you the processes before it runs them.',
  },
  {
    key: 'work',
    title: 'Does the work',
    text: 'It answers, books, updates records and follows up until the task is closed, inside the tools your team already uses.',
  },
  {
    key: 'control',
    title: 'Operates with control',
    text: 'You decide what it does alone and what waits for a person. Every action is on record, access is set per role, and your data is never used to train shared models.',
  },
];

// The capability visuals on the platform page follow the film's first case: Sarah K. asks
// about the 2-bedroom on Maple Street, Aurora books the viewing and Dana approves the fee waiver.
export const storyCase = { who: 'Sarah K.', ref: 'REQ-2048', topic: '2BR Maple St' };

export const understandVisual = {
  sources: [
    { name: 'Listings and price sheet', kind: 'PDF' },
    { name: 'Leasing policies', kind: 'DOC' },
    { name: 'Website and FAQs', kind: 'WEB' },
    { name: 'CRM fields', kind: 'CRM' },
  ],
  rules: [
    { kind: 'Rule', text: 'Never quote a final rent. Offer a viewing instead.' },
    { kind: 'Process', text: 'New lead → qualify → book → follow up' },
    { kind: 'Approval', text: 'Fee changes need a leasing manager', used: true },
    { kind: 'Exception', text: 'Returning clients skip qualification' },
    { kind: 'Escalation', text: 'Complaints reach a person within the hour' },
  ],
};

// Everything Aurora did for Sarah's request, in order.
export const workVisual = [
  { t: '09:14', ch: 'SMS', text: 'Answered Sarah K. about 2BR Maple St' },
  { t: '09:14', ch: 'CRM', text: 'Lead created · budget, move-in, area' },
  { t: '09:15', ch: 'Calendar', text: 'Viewing booked · Sat 11:00 with Dana' },
  { t: '09:15', ch: 'SMS', text: 'Confirmation and directions sent' },
  { t: '09:15', ch: 'Team', text: 'Fee waiver sent to Dana for approval' },
  { t: '09:17', ch: 'SMS', text: 'Fee waived · Sarah told' },
  { t: '09:17', ch: 'Tasks', text: 'Follow-up set · Fri 18:00' },
];

export const controlVisual = {
  // The same case as the film: the fee question goes to a person, start to finish.
  story: {
    ask: 'Great, Saturday works. Is there an application fee?',
    rule: 'Fee changes need a leasing manager',
    hold: "You're booked for Saturday at 11:00. I've asked Dana about the fee.",
    manager: 'Dana K. · Leasing manager',
    initials: 'DK',
    done: 'Good news: Dana has waived the fee. See you on Saturday.',
  },
  item: 'Waive the application fee · REQ-2048',
};

// Outcomes (home page): what the business gets. Deliberately no percentages until there is
// pilot data to back them (US advertising claims need substantiation).
export const outcomes = {
  titleA: 'Same team. More output.',
  text: 'Aurora takes the repetitive work off every department, so costs go down, capacity goes up and more of every dollar reaches the bottom line.',
  items: [
    {
      key: 'cost',
      label: 'Savings',
      title: 'Lower cost per task',
      text: 'Calls, follow-ups, scheduling and data entry run on Aurora around the clock, without adding headcount.',
    },
    {
      key: 'speed',
      label: 'Efficiency',
      title: 'Every department moves faster',
      text: 'Sales answers in seconds, service resolves on first contact and operations closes the loop without chasing.',
      departments: ['Sales', 'Service', 'Operations'],
    },
    {
      key: 'margin',
      label: 'Profitability',
      title: 'Revenue grows faster than costs',
      text: 'More leads converted and fewer hours spent on routine work. The difference shows up in your margins.',
    },
  ],
  note: 'Every action plan starts from your numbers: where the hours go today and what each step should change.',
};

// The closing section on the home page: the same as the industry pages, with what happens after the form under the text.
export const homeClosing = {
  titleA: 'Ready to scale with us?',
  titleB: 'Book a demo.',
  text: 'Aurora answers your customers and runs the routine work behind them, so the team you have handles more. Bring one real process and watch it work.',
  next: [
    { time: 'Now', text: 'Leave your details' },
    { time: 'Minutes later', text: 'Aurora calls you, so you hear it first-hand' },
    { time: 'Within days', text: 'We map one of your processes together' },
  ],
};

// Hear Aurora (home page): two recorded calls (Eleven v4), one with a customer and one with the team. Each plays over
// its own scene, with live subtitles and what the team sees as it goes. Illustrative: the company and people are examples.
export const homeHear = {
  titleA: 'Hear Aurora at work.',
  text: 'The same voice out front with your customers and behind the scenes with your team. Press play on either.',
  note: 'Recorded examples with an AI voice. The company and people are illustrative.',
  team: 'What your team sees',
  calls: [
    {
      key: 'customer',
      tab: 'With a customer',
      name: 'An after-hours call',
      sentence: 'An AC dies at 8:40 pm. Aurora checks the easy fix, quotes the after-hours fee and books a tech for tonight.',
      media: { poster: '/media/home/hear-customer-1400.webp', srcSet: '/media/home/hear-customer-900.webp 900w, /media/home/hear-customer-1400.webp 1400w', video: null, focus: '50% 40%' },
      call: {
        audio: '/media/home/call-customer.mp3',
        duration: 48070,
        title: 'Customer call',
        meta: 'Sound on',
        listen: 'Hear the call',
        again: 'Hear it again',
        pause: 'Pause the call',
        resume: 'Resume the call',
        caller: 'Customer',
        wave: [0.79,  0.7,  0.57,  0.37,  0.79,  0.5,  0.64,  0.29,  0.37,  0.77,  0.16,  0.66,  0.17,  0.68,  0.54,  0.48,  0.32,  0.78,  0.71,  0.55,  0.16,  1.0,  0.58,  0.15,  0.79,  0.47,  0.49,  0.48,  0.16,  0.63,  0.79,  0.72,  0.73,  0.76,  0.35,  0.79,  0.15,  0.67,  0.28,  0.58,  0.2,  0.53,  0.35,  0.4,  0.67,  0.43,  0.26,  0.52,  0.49,  0.94,  0.88,  0.79,  0.75,  0.15,  0.56,  0.38,  0.18,  0.58,  0.71,  0.72,  0.31,  0.49,  0.73,  0.84,  0.18,  0.83,  0.42,  0.72,  0.78,  0.49,  0.14,  0.45,  0.17,  0.68,  0.2,  0.74,  0.58,  0.17,  0.49,  0.27,  0.77,  0.74,  0.41,  0.14,  0.41,  0.64,  0.84,  0.65,  0.35,  0.73,  0.6,  0.15,  0.64,  0.2,  0.51,  0.19],
        captions: [
          { who: "aurora", at: 0, end: 3600, text: "Northline Home Services, this is Aurora, the AI assistant.", words: [0,  620,  860,  1780,  1920,  2120,  2820,  2840,  3200], cue: "warm, calm" },
          { who: "aurora", at: 4260, end: 5100, text: "How can I help tonight?", words: [0,  120,  260,  380,  560] },
          { who: "lead", at: 5580, end: 9920, text: "Hi… our AC just died, and it’s ninety degrees in here.", words: [0,  880,  1020,  1360,  1760,  2120,  2660,  3040,  3380,  3760,  4080], cue: "stressed" },
          { who: "lead", at: 10360, end: 11140, text: "We’ve got a newborn.", words: [0,  200,  320,  460] },
          { who: "aurora", at: 11900, end: 13940, text: "Oh no. Let’s get you sorted.", words: [0,  240,  1160,  1440,  1560,  1740], cue: "concerned, steady" },
          { who: "aurora", at: 14560, end: 17760, text: "Is the outdoor unit running at all, or completely silent?", words: [0,  200,  340,  700,  1040,  1260,  1460,  1760,  2160,  2740] },
          { who: "lead", at: 18920, end: 20040, text: "Silent. Nothing.", words: [0,  740], cue: "uncertain" },
          { who: "aurora", at: 20740, end: 23060, text: "Okay. That’s often a tripped breaker.", words: [0,  700,  1100,  1420,  1580,  1900] },
          { who: "aurora", at: 23700, end: 26240, text: "Could you check the panel for a switch marked AC?", words: [0,  140,  320,  560,  760,  1060,  1360,  1520,  1780,  2060], cue: "gently" },
          { who: "lead", at: 26880, end: 28140, text: "It’s not tripped.", words: [0,  380,  620], cue: "frustrated" },
          { who: "aurora", at: 28140, end: 30140, text: "Then it’s a job for a tech.", words: [0,  800,  1040,  1180,  1380,  1620,  1760], cue: "confident" },
          { who: "aurora", at: 30820, end: 32160, text: "Jake can be there first thing at eight…", words: [0,  40,  240,  380,  560,  800,  1020,  1140], cue: "brightening" },
          { who: "aurora", at: 32580, end: 36100, text: "or tonight, with a $120 after-hours fee. Which works better?", words: [0,  180,  500,  940,  1040,  1440,  2120,  2860,  2960,  3180] },
          { who: "lead", at: 36900, end: 38580, text: "Tonight. Definitely tonight.", words: [0,  1220,  1220], cue: "relieved" },
          { who: "aurora", at: 39180, end: 41200, text: "Done. Jake will be there by 9:15.", words: [0,  860,  880,  1040,  1180,  1360,  1520], cue: "upbeat" },
          { who: "aurora", at: 42000, end: 44140, text: "I’ll text you his photo and a live ETA.", words: [0,  160,  360,  580,  760,  1040,  1380,  1520,  1740], cue: "softly" },
          { who: "aurora", at: 44820, end: 45380, text: "Hang in there.", words: [0,  100,  280], cue: "warm" },
          { who: "lead", at: 45900, end: 47460, text: "Thank you. Seriously.", words: [0,  300,  1280], cue: "grateful" },
        ],
        notes: [
          { at: 0, text: 'Phone · After hours · New call' },
          { at: 5580, text: 'CRM · New customer · AC not cooling' },
          { at: 23700, text: 'Troubleshooting · Breaker checked' },
          { at: 32580, text: 'Quote · After-hours fee $120' },
          { at: 39180, text: 'Dispatch · Jake · 9:15 pm · ETA texted' },
        ],
      },
      team: 'Dispatch · Jake · 9:15 pm · ETA texted',
    },
    {
      key: 'team',
      tab: 'With your team',
      name: 'The morning brief',
      sentence: 'At 8 am the owner hears the night in a minute: what got booked, which invoice was held, and who’s off Friday.',
      media: { poster: '/media/home/hear-brief-1400.webp', srcSet: '/media/home/hear-brief-900.webp 900w, /media/home/hear-brief-1400.webp 1400w', video: null, focus: '50% 40%' },
      call: {
        audio: '/media/home/call-brief.mp3',
        duration: 47310,
        title: 'Morning brief',
        meta: 'Sound on',
        listen: 'Hear the brief',
        again: 'Hear it again',
        pause: 'Pause the brief',
        resume: 'Resume the brief',
        caller: 'Dana · Owner',
        wave: [0.57,  0.63,  0.42,  0.64,  0.57,  0.26,  0.24,  0.21,  0.87,  0.27,  0.57,  0.48,  0.14,  0.46,  0.35,  0.66,  0.45,  0.22,  0.64,  0.37,  0.64,  0.55,  0.78,  0.29,  0.28,  0.65,  0.62,  0.49,  0.15,  0.57,  0.42,  0.55,  0.22,  0.59,  0.55,  0.57,  0.36,  0.36,  0.73,  0.49,  0.16,  0.72,  0.61,  0.5,  0.53,  0.53,  0.41,  0.27,  0.57,  0.64,  0.56,  0.14,  0.42,  0.6,  0.16,  0.74,  0.18,  0.46,  1.0,  0.75,  0.51,  0.66,  0.76,  0.3,  0.14,  0.66,  0.15,  0.54,  0.51,  0.5,  0.31,  0.58,  0.54,  0.56,  0.49,  0.5,  0.5,  0.53,  0.23,  0.43,  0.18,  0.3,  0.36,  0.16,  0.56,  0.56,  0.48,  0.4,  0.5,  0.62,  0.62,  0.22,  0.39,  0.21,  0.35,  0.19],
        captions: [
          { who: "aurora", at: 0, end: 2660, text: "Good morning, Dana. Here’s your eight o’clock brief.", words: [0,  220,  860,  1460,  1720,  1860,  2040,  2340], cue: "bright, warm" },
          { who: "lead", at: 3600, end: 5620, text: "Morning. Go ahead.", words: [0,  1380,  1720], cue: "sleepy" },
          { who: "aurora", at: 6680, end: 11580, text: "Yesterday, 39 jobs done, and 12 new requests came in overnight. All booked.", words: [0,  400,  860,  1140,  1700,  1980,  2340,  2640,  3020,  3300,  3500,  4340,  4580], cue: "upbeat" },
          { who: "aurora", at: 12060, end: 13680, text: "Two of them are furnace installs.", words: [0,  200,  360,  540,  680,  1080], cue: "proud" },
          { who: "aurora", at: 14360, end: 18060, text: "Routes are set for 14 techs, and Mike’s part is waiting in van 7.", words: [0,  60,  280,  460,  700,  1080,  1800,  2060,  2420,  2580,  2740,  2960,  3220,  3340], cue: "matter-of-fact" },
          { who: "aurora", at: 18480, end: 19740, text: "One thing needs you.", words: [0,  320,  560,  860], cue: "serious, lowering her voice" },
          { who: "aurora", at: 20480, end: 25020, text: "Rivera billed six hours on job 405, but he was on site four and a half.", words: [0,  40,  440,  780,  1240,  1520,  1700,  2820,  3020,  3160,  3280,  3480,  3700,  4060,  4220,  4320] },
          { who: "aurora", at: 25720, end: 26680, text: "I’ve held the invoice.", words: [0,  260,  420,  600] },
          { who: "lead", at: 26680, end: 31340, text: "Pay the four and a half, and ask him about the rest.", words: [0,  920,  1860,  2120,  2260,  2360,  2760,  3400,  3720,  3860,  4100,  4240], cue: "thoughtful" },
          { who: "aurora", at: 32000, end: 32340, text: "Will do.", words: [0,  60], cue: "warm" },
          { who: "aurora", at: 32940, end: 38520, text: "And Ana asked for Friday off. Her jobs fit on Jake’s route, so I approved it under your rule.", words: [0,  240,  640,  940,  1140,  1420,  2220,  2320,  2560,  2780,  2980,  3300,  3720,  3960,  4220,  4520,  4780,  5000,  5240], cue: "lighter" },
          { who: "lead", at: 39320, end: 42600, text: "Perfect. What would I do without you?", words: [0,  1780,  2060,  2220,  2360,  2580,  2900], cue: "amused" },
          { who: "aurora", at: 43200, end: 46960, text: "Drink your coffee in peace. Have a good day.", words: [0,  140,  380,  720,  1000,  2920,  3160,  3300,  3460], cue: "playful" },
        ],
        notes: [
          { at: 0, text: 'Brief · 8:00 am · to Dana' },
          { at: 6680, text: 'Jobs · 39 done · 12 booked overnight' },
          { at: 14360, text: 'Routes · 14 techs · part in van 7' },
          { at: 20480, text: 'Invoice #2291 · held · 6.0 h vs 4.5 h' },
          { at: 26680, text: 'Invoice · paid for 4.5 h · Rivera asked' },
          { at: 32940, text: 'Time off · Ana · Fri · approved by rule' },
        ],
      },
      team: 'Invoice held · Time off approved · Routes set',
    },
  ],
};

// Live in hours, under your rules (home page): how a business goes live, as three steps on one stage.
export const homeLive = {
  titleA: 'Live in hours, under your rules.',
  text: 'No technical project on your side. Aurora works inside the tools you already run, and nothing goes live until you approve it.',
  more: { label: 'See the platform', href: '/platform' },
  labels: { prev: 'Previous step', next: 'Next step' },
  steps: [
    { key: 'map', who: 'Our experts, with you', name: 'We map your business', sentence: 'One working session turns how your team works today into a plan: which jobs Aurora takes, and what each should change.' },
    { key: 'connect', who: 'Aurora', name: 'Aurora connects your tools', sentence: 'Phone, email, messaging, calendar, CRM and payments. It works inside them, so nobody learns a new system.' },
    { key: 'rules', who: 'You approve', name: 'Your rules, then go live', sentence: 'You set the limits and who approves what. Every action is logged, and you switch it on when the tests pass.' },
  ],
  rules: [
    { text: 'Discounts above 5%', who: 'Manager approves' },
    { text: 'Freelancer invoices over $1,500', who: 'Owner approves' },
    { text: 'Time off with cover found', who: 'Aurora approves' },
    { text: 'Refunds', who: 'Always a person' },
  ],
  log: 'Every action logged · Who, what and why',
  live: { off: 'Approve and go live', on: 'Live' },
};

// One working day at a home services company (home page): what Aurora does from 9 to 5, out front with customers
// and behind the scenes with the team: field technicians, freelancers, the office. Illustrative.
export const homeDay = {
  titleA: 'One AI teammate, from 9 to 5.',
  text: 'A day at a home services company with 14 technicians in the field and a bench of freelancers. Some of the work faces customers. Most of it runs the company.',
  lanes: { team: 'Your team', customers: 'Your customers' },
  labels: { prev: 'Earlier', next: 'Later' },
  company: 'Northline Home Services',
  events: [
    {
      key: 'routes', time: '9:00', lane: 'team', kind: 'routes',
      title: 'Plans the day for 14 technicians',
      text: 'Jobs grouped by area and skill, so nobody crosses town twice.',
      // routes run along the streets of a small map (viewBox 320 x 180); stops are the jobs
      routes: [
        { who: 'Jake · HVAC', jobs: 4, color: '#F25C2A', d: 'M15 145 H135 V95 H205 V45 H300', stops: [[15, 145], [135, 120], [205, 70], [300, 45]] },
        { who: 'Ana · Plumbing', jobs: 3, color: '#0A0F0E', d: 'M15 20 V45 H65 V95 H110', stops: [[15, 20], [65, 70], [110, 95]] },
        { who: 'Rivera · Freelance electrician', jobs: 2, color: '#14A36B', d: 'M240 175 V145 H310 V95', stops: [[240, 175], [310, 95]] },
      ],
    },
    {
      key: 'booking', time: '9:20', lane: 'customers', kind: 'thread',
      title: 'Books a same-day visit',
      text: 'An AC stopped working. A visit is on Jake’s route before anyone in the office reads the text.',
      thread: [
        { who: 'them', name: 'Customer', text: 'Our AC just died and it’s 90 degrees in here. Can someone come today?' },
        { who: 'aurora', text: 'Yes. Jake can be there between 1 and 3 pm. Shall I book it?' },
        { who: 'them', name: 'Customer', text: 'Please!' },
      ],
      result: 'Booked · 1–3 pm · Jake',
    },
    {
      key: 'invoice', time: '10:15', lane: 'team', kind: 'invoice',
      title: 'Checks a freelancer’s invoice',
      text: 'Hours billed against time on site. One line didn’t match, so it went to Dana before payment.',
      invoice: {
        from: 'Rivera Electric · freelancer', number: 'Invoice #2291', total: '$1,840',
        checks: [
          { ok: true, text: 'Rate matches the contract' },
          { ok: true, text: 'Job 405 closed by the customer' },
          { ok: false, text: '6.0 h billed, 4.5 h on site' },
        ],
        status: 'Sent to Dana for approval',
      },
    },
    {
      key: 'quote', time: '11:30', lane: 'customers', kind: 'quote',
      title: 'Follows up on a quote',
      text: 'A furnace replacement quoted last week. One reminder, and the deposit came in.',
      quote: { item: 'Furnace replacement', amount: '$4,200', status: 'Accepted · deposit paid' },
    },
    {
      key: 'part', time: '12:40', lane: 'team', kind: 'thread',
      title: 'Finds a part for a tech in the field',
      text: 'Mike needed a capacitor. Aurora checked every van and sent him to the nearest one.',
      thread: [
        { who: 'them', name: 'Mike · Tech', text: 'Do we have a 45/5 capacitor anywhere? Job 412.' },
        { who: 'aurora', text: 'Van 7 has two, parked 6 minutes from you. I’ve let Sam know you’re coming.' },
      ],
      result: 'Stock updated · Van 7',
    },
    {
      key: 'reroute', time: '14:10', lane: 'team', kind: 'reroute',
      title: 'Reshuffles a route that ran long',
      text: 'A job took an extra hour. Two visits moved, and both customers agreed by text.',
      moves: [
        { job: '3:00 pm · Oak St', to: 'Ana · 3:30 pm', ok: 'Customer confirmed' },
        { job: '4:00 pm · Pine Ave', to: 'Jake · 4:45 pm', ok: 'Customer confirmed' },
      ],
    },
    {
      key: 'compliance', time: '15:30', lane: 'team', kind: 'compliance',
      title: 'Keeps freelancers compliant',
      text: 'Rivera’s insurance certificate expires Friday. Aurora asked for the new one and filed it.',
      doc: { name: 'Certificate of insurance · Rivera Electric', was: 'Expires Fri, Oct 24', now: 'Renewed to Oct 2027' },
    },
    {
      key: 'summary', time: '16:55', lane: 'team', kind: 'summary',
      title: 'Wraps up the day for the owner',
      text: 'What got done, what needs a decision, and who gets paid on Friday.',
      summary: [
        ['Jobs completed', '39'],
        ['Freelancer invoices approved', '6'],
        ['Payouts scheduled', 'Fri'],
        ['Needs your OK', '1'],
      ],
    },
  ],
  note: 'An example day. The company, people and figures are illustrative.',
};

// How it works (home page): three plain steps from the customer's side, each saying who does it.
export const howItWorks = {
  eyebrow: 'How it works',
  titleA: 'Live in hours.',
  text: 'No technical project on your side. Nothing goes live until you approve it.',
  steps: [
    { who: 'Our experts, with you', tone: 'you', name: 'We map your business', text: 'Together with our AI agents, into an action plan with the impact each step should bring.' },
    { who: 'Aurora', tone: 'aurora', name: 'Aurora sets itself up', text: 'It connects your channels and systems from the plan.' },
    { who: 'You approve', tone: 'you', name: 'Test it, go live', text: 'Real questions, answered from your own data. You approve, it goes live.' },
  ],
  // Illustrative content of the step visuals (a fictional business, not customer data).
  plan: {
    company: 'Maple Realty',
    people: ['Our expert', 'You', 'AI agent'],
    rows: [
      { process: 'New lead → qualify → book a viewing', channels: 'Phone · Text · Web', owner: 'Aurora', impact: 'More viewings booked' },
      { process: 'Viewing reminders', channels: 'Text · Email', owner: 'Aurora', impact: 'Fewer no-shows' },
      { process: 'Discounts above 5%', channels: 'Slack', owner: 'Manager approves', impact: 'Margin protected' },
      { process: 'Weekly pipeline report', channels: 'Email', owner: 'Aurora', impact: 'Hours back for the team' },
    ],
  },
  connect: [
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'crm', label: 'CRM' },
    { key: 'messaging', label: 'Messaging channels', wide: true },
    { key: 'pbx', label: 'Phone system (PBX)' },
    { key: 'payments', label: 'Payments' },
  ],
  test: {
    ask: 'Do you have a 2-bedroom under $3,000 with parking, near downtown?',
    source: 'Listings database',
    scanned: '1,248 listings',
    options: [
      { addr: '42 Maple St', price: '$2,850', note: '5 min to downtown' },
      { addr: '18 Cedar Ave', price: '$2,990', note: 'Downtown' },
    ],
    pick: 'Maple St please, it fits my budget better.',
    photos: ['/img/chat/apt-living.webp', '/img/chat/apt-kitchen.webp', '/img/chat/apt-bedroom.webp'],
    photosText: 'Here it is. Want to see it this week?',
    when: 'Yes! Can I come Thursday after 5?',
    booked: 'Thursday at 5:30 works. I booked it and sent you the invite.',
    invite: { title: 'Viewing · 42 Maple St', time: 'Thu · 5:30 – 6:00 PM', note: 'Invite sent' },
    passed: '24 of 24 test cases passed',
  },
};

// Agents modeled on real roles, one per team (see Teams.jsx).
export const teams = {
  eyebrow: 'Teams',
  titleA: 'Agents that work like your team.',
  titleB: 'In sales, in service and inside the company.',
  text: undefined,
  items: [
    {
      key: 'sales',
      label: 'Sales',
      title: 'Your SDR.',
      line: 'Answers every lead, qualifies it and books the meeting with the right rep.',
      kpis: ['Speed to lead', 'Meetings booked', 'Conversion rate'],
      agent: 'Sales agent',
      chip: { icon: 'calendar', title: 'Meeting booked', detail: 'Thu 11:00' },
      // Collage media lives in /public/media/teams (see design/media/manifest.json). Names and times are illustrative.
      collage: {
        video: '/media/teams/sales.mp4',
        poster: '/media/teams/sales-poster.webp',
        object: { src: '/media/teams/sales-object-900.webp', srcSet: '/media/teams/sales-object-600.webp 600w, /media/teams/sales-object-900.webp 900w, /media/teams/sales-object-1200.webp 1200w', alt: 'A client signing a sales contract with a fountain pen, a folded stack of dollar bills beside the papers' },
        channel: 'Web chat',
        messages: [
          { from: 'in', text: 'Hi, can we see a demo this week?' },
          { from: 'aurora', text: 'Happy to. How big is the team that would use it?' },
          { from: 'in', text: 'About 25 people, mostly in sales.' },
          { from: 'aurora', text: 'Thursday 11:00 or Friday 2:00?', chips: ['Thu 11:00', 'Fri 2:00'] },
          { from: 'in', text: 'Thursday works.' },
        ],
        result: { title: 'Meeting booked', detail: 'Thu 11:00 · with Dana' },
      },
      photo: {
        src: PHOTOS + 'team-sales2-960.webp',
        srcSet: srcSet('team-sales2', [640, 960, 1440]),
        alt: 'An account executive reading a message on her phone as she walks out of a glass office building',
      },
    },
    {
      key: 'service',
      label: 'Customer service',
      title: 'Your best support rep.',
      line: 'Resolves routine requests on any channel and hands the rest to a person.',
      kpis: ['First response time', 'Resolution rate', 'Customer satisfaction'],
      agent: 'Service agent',
      chip: { icon: 'service', title: 'Request resolved', detail: 'Moved to Thu' },
      collage: {
        video: '/media/teams/service.mp4',
        poster: '/media/teams/service-poster.webp',
        object: { src: '/media/teams/service-object-900.webp', srcSet: '/media/teams/service-object-600.webp 600w, /media/teams/service-object-900.webp 900w, /media/teams/service-object-1200.webp 1200w', alt: 'A delivery box waiting on the doormat of a honey-yellow front door' },
        channel: 'Email',
        messages: [
          { from: 'in', text: 'Can my delivery move to Thursday? Order #4471' },
          { from: 'aurora', text: 'Sure. Can you confirm the delivery zip code?' },
          { from: 'in', text: '10013' },
          { from: 'aurora', text: 'Done. It now arrives Thursday, Oct 16.', checks: ['Order found', 'Carrier slot moved'] },
          { from: 'in', text: 'Perfect, thank you!' },
        ],
        result: { title: 'Request resolved', detail: 'No handoff needed' },
      },
      photo: {
        src: PHOTOS + 'team-service2-960.webp',
        srcSet: srcSet('team-service2', [640, 960, 1440]),
        alt: 'A customer support specialist with a headset working at a monitor in a bright office',
      },
    },
    {
      key: 'internal',
      label: 'Internal teams',
      title: 'Your operations coordinator.',
      line: 'Handles approvals, updates and follow-ups between teams and systems.',
      kpis: ['Cycle time', 'Manual work hours', 'On-time completion'],
      agent: 'Operations agent',
      chip: { icon: 'approval', title: 'Invoice approved', detail: 'To Finance' },
      collage: {
        video: '/media/teams/internal.mp4',
        poster: '/media/teams/internal-poster.webp',
        object: { src: '/media/teams/internal-object-900.webp', srcSet: '/media/teams/internal-object-600.webp 600w, /media/teams/internal-object-900.webp 900w, /media/teams/internal-object-1200.webp 1200w', alt: 'A printed invoice with a brass approval stamp on a walnut desk' },
        channel: 'Slack · #finance',
        messages: [
          { from: 'in', name: 'Mia', text: 'New invoice INV-2291 from Northwind, $4,800' },
          { from: 'aurora', text: 'It matches PO-118 and fits the Q4 budget.', checks: ['PO matched', 'Within budget'] },
          { from: 'aurora', text: 'Dana, approve $4,800?', chips: ['Approve', 'Decline'] },
          { from: 'in', name: 'Dana', text: 'Approved.' },
          { from: 'aurora', text: 'Sent to Finance for Friday’s payment run.' },
        ],
        result: { title: 'Invoice approved', detail: 'Sent to Finance' },
      },
      photo: {
        src: PHOTOS + 'team-internal2-960.webp',
        srcSet: srcSet('team-internal2', [640, 960, 1440]),
        alt: 'Operations and finance colleagues reviewing a report and a laptop around a meeting table',
      },
    },
  ],
};

export const closing = {
  titleA: 'See Aurora run',
  titleB: 'on your business.',
  text: 'Bring one real process. We describe it together, and you watch the system configure itself.',
};

// Platform page (/platform): the product in depth. The product film lives here only.
export const platformPage = {
  meta: {
    title: 'Aurora platform · AI agents that do the work | Divine Tech AI',
    description:
      'See Aurora work: one conversation by phone, text, web chat or email becomes a booked appointment, an updated CRM and a follow-up, with people approving what matters and every step on record.',
  },
  eyebrow: 'Platform',
  titleA: 'Most AI talks.',
  titleB: 'Aurora works.',
  text: 'Aurora books the appointment, updates the record, sends the follow-up and brings in a person when it matters. Watch one request go from first message to done.',
  note: 'Scripted demo built from typical flows. Names, times and prices are examples.',
  // How it's built: channels in, three layers, systems out. Integration names are text only:
  // no partner logos until there are agreements to show them.
  // Product tour: real Aurora console screens, redrawn with illustrative data.
  console: {
    eyebrow: 'Inside Aurora',
    titleA: 'The console',
    titleB: 'your team works in.',
    text: 'Every conversation, every action Aurora takes and every handoff to a person shows up in one place, for your whole team to see.',
    note: 'Aurora console screens. Names and figures are illustrative.',
    slides: [
      { key: 'dashboard', title: 'Today at a glance', text: 'Unread conversations, open handoffs and how much the agents handled, the moment you sign in.' },
      { key: 'inbox', title: 'One inbox for every channel', text: 'Web chat, email, text and calls land in one list, tagged by what each one needs.' },
      { key: 'action', title: 'Every action on the record', text: 'See the exact request Aurora sent to your system, and who approved it.' },
      { key: 'handoff', title: 'Take over in one click', text: 'Assign a conversation, switch from the agent to a person and back, with the full history in view.' },
    ],
  },
  architecture: {
    eyebrow: 'How it is built',
    titleA: 'An AI agent platform',
    titleB: 'between your channels and your systems.',
    text: 'Every request, from a customer or from your own team, passes through the same three layers. One memory, one set of rules, one record.',
    channels: ['Phone', 'SMS', 'Web chat', 'Email', 'WhatsApp', 'Slack'],
    layers: [
      { name: 'Understand', points: ['Who is asking and what they need', 'Full history across every channel', 'Your documents, policies and FAQs'] },
      { name: 'Decide', points: ['Your rules and limits on every step', 'What it may do alone, what needs a person', 'Hands off with the whole context'] },
      { name: 'Act', points: ['Works inside your systems, not beside them', 'Follows up until the task is closed', 'Writes every action to the audit log'] },
    ],
    systems: [
      { name: 'CRM', examples: 'HubSpot, Salesforce' },
      { name: 'Calendars', examples: 'Google Calendar, Outlook' },
      { name: 'Messaging', examples: 'Email, SMS, WhatsApp, Slack' },
      { name: 'Phone system', examples: 'Your existing numbers' },
      { name: 'Payments and invoicing', examples: 'Payment links, invoices' },
      { name: 'Knowledge', examples: 'Docs, website, price book' },
    ],
  },
  // KPI Agent: measures every agent against the business's KPIs and improves it; bigger changes need approval.
  // The board is illustrative: metric names only, no figures (no performance numbers until verified).
  kpi: {
    eyebrow: 'Patented KPI Agent',
    badge: 'Patented KPI Agent',
    titleA: 'Every agent measured.',
    titleB: 'Every week a little better.',
    text: 'The KPI Agent tracks every Aurora agent against the numbers your business runs on, spots what is slipping and improves how the agent works. Bigger changes wait for your approval.',
    // One week of one agent's KPI, told in four steps. Illustrative: no real figures.
    steps: [
      { title: 'Measures', text: 'Tracks every agent against the KPIs you set.' },
      { title: 'Finds the cause', text: 'Reads the conversations behind a drop.' },
      { title: 'Suggests a fix', text: 'Bigger changes wait for your approval.' },
      { title: 'Improves', text: 'The number recovers, and the change is logged.' },
    ],
    chart: {
      metric: 'Follow-up replies',
      agent: 'Sales agent',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      slipping: 'Below target',
      recovered: 'Back on target',
      story: [
        { tag: 'Measured', text: 'Follow-up replies dropped below your target on Wednesday.' },
        { tag: 'Cause found', text: 'Leads answer texts, but this week’s follow-ups went out by email.' },
        { tag: 'Fix suggested', text: 'Send the second follow-up by text.', who: 'Approved by Dana · Sales lead' },
        { tag: 'Improved', text: 'Replies are back above target. The change is in the log.' },
      ],
    },
    note: 'Illustrative example. Metric names and the change are examples.',
  },
  security: {
    eyebrow: 'Security and trust',
    titleA: 'Autonomy you set.',
    titleB: 'Every step on record.',
    text: 'You decide how much Aurora does on its own. Every action is on record, and your data is never used to train shared models.',
    // Four cards, each with a small product snippet (illustrative names and figures).
    items: [
      {
        key: 'rules',
        title: 'Rules you set',
        text: 'Choose what Aurora does on its own, what needs approval and what it never does.',
        mock: {
          title: 'Rules',
          rows: [
            ['auto', 'Auto', 'Answer questions'],
            ['approval', 'Approval', 'Refunds over $200'],
            ['approval', 'Approval', 'Discounts over 10%'],
            ['never', 'Never', 'Change prices'],
          ],
        },
      },
      {
        key: 'approval',
        title: 'Approvals in one tap',
        text: 'When a request crosses a limit, the right person gets it and decides.',
        mock: { tag: 'Needs approval', what: 'Refund $240', why: 'BIL-311 · over the $200 limit', who: 'Waiting for Alex · Finance' },
      },
      {
        key: 'audit',
        title: 'Every step on record',
        text: 'Each action is logged with the rule that applied and who approved it.',
        mock: {
          title: 'Audit log',
          rows: [
            ['Refund $240', 'Approved by Alex'],
            ['Discount 15%', 'Approved by Daniel'],
            ['Technician booked', 'Within rules'],
          ],
        },
      },
      {
        key: 'handoff',
        title: 'A person can step in',
        text: 'Your team can take over any conversation, with the full history.',
        mock: { ask: 'Can I talk to someone?', joined: 'Dana joined · Leasing', reply: 'Hi Sarah, I have everything here.' },
      },
    ],
  },
  faq: [
    ['What is an AI agent platform?', 'An AI agent platform runs AI agents that answer requests and do work inside your business systems. Aurora is built as an AI operating system: every agent shares one memory of each customer and employee, one set of rules and one audit log, across sales, service and internal operations.'],
    ['What happens when a customer switches channels?', 'The conversation stays one conversation. A request that starts in web chat and continues by phone or email keeps its full history, so neither Aurora nor your team asks the customer to repeat themselves.'],
    ['How does Aurora decide what it can do on its own?', 'You set the rules. Each action is allowed, needs approval or is never allowed, with limits such as refund or discount amounts. When a request crosses a limit, Aurora asks the right person and continues once they decide.'],
    ['Can my team take over a conversation?', 'Yes. Anyone with access can step into a conversation at any moment. Aurora hands off with the full history and picks up again when your team is done.'],
    ['What does the KPI Agent do?', 'The KPI Agent measures every Aurora agent against the KPIs you set for its team, such as speed to lead or resolution rate. When a number slips, it finds the cause in the conversations behind it and improves how the agent works. Small fixes stay within your rules, bigger changes wait for approval from the right person, and every change is recorded.'],
    ['Is our data used to train AI models?', 'No. Your data is never used to train shared models. Access is set per role and every action is recorded in the audit log.'],
  ],
};

export const footer = {
  tagline: 'Divine Tech AI builds Aurora, the AI operating system for businesses and organizations.',
};

// Home page industries section: a card per vertical, each linking to its page.
export const industriesSection = {
  eyebrow: 'Industries',
  titleA: 'Made for your industry.',
  text: 'Each industry has its own customers and its own back office. Aurora joins both.',
  sides: { customers: 'Customers', team: 'Team' },
};

// Must match the industry options in public/__forms.html (Netlify Forms).
export const leadIndustries = ['Real Estate', 'Wellness & Healthcare', 'Home Services', 'Other'];

// Search and link-preview metadata for pages that are not driven by another data file.
// The post-build prerender (scripts/prerender.mjs) writes these into each page's static HTML.
export const homeMeta = {
  title: 'Aurora · AI operating system for business | Divine Tech AI',
  description:
    'Aurora by Divine Tech AI is the AI operating system for business: AI agents that answer customers, work in your CRM and calendar, and ask before what matters.',
};

export const privacyMeta = {
  title: 'Privacy Policy · Divine Tech AI',
  description:
    'How Divine Tech AI, Inc. collects, uses, shares and protects personal information on divine-tech.ai and in demo requests, and the privacy rights you have.',
};

// Tools Aurora is connected to during setup, named in the FAQ and in llms.txt.
export const integrations = {
  crm: ['HubSpot', 'Salesforce'],
  calendars: ['Google Calendar', 'Microsoft Outlook'],
  channels: ['phone', 'SMS', 'web chat', 'email', 'WhatsApp', 'Slack'],
};

// Home page FAQ (also published as FAQPage structured data and in llms.txt).
// Written for search and AI answer engines: each question is phrased the way people
// search, the first sentence answers it on its own, and every answer names Aurora
// instead of "it", so any single answer still makes sense when quoted alone.
export const homeFaq = [
  [
    'What is Aurora by Divine Tech AI?',
    'Aurora is an AI operating system for business, built by Divine Tech AI, Inc. Aurora runs AI agents across sales, customer service and internal operations. The agents answer customers and employees on any channel, do the work inside the systems the business already uses, and ask a person to approve anything above the limits the business sets.',
  ],
  [
    'What is an AI operating system for business?',
    'An AI operating system for business is one layer of AI agents that works across a company’s departments, channels and software, instead of a separate chatbot or tool for each task. It understands each request, applies the company’s rules and approval limits, and takes real actions such as booking, updating records and following up. Aurora is the AI operating system built by Divine Tech AI.',
  ],
  [
    'How is Aurora different from a chatbot?',
    'Aurora completes the task, while a typical chatbot only replies. Aurora books the appointment, updates the CRM record, sends the invoice and follows up until the request is closed, inside the systems the business already uses. Aurora also works for the company’s own employees, not only for customers, and applies the company’s rules and approval limits to every action.',
  ],
  [
    'Does Aurora work for our own team, not only for customers?',
    'Yes. Employees ask Aurora on Slack, Teams, WhatsApp or email, and it does the work behind the scenes: it plans field routes by location and skill, checks freelancer invoices against the job records, finds parts, approves time off within the rules the business sets and sends the owner a daily brief.',
  ],
  [
    'Who is Aurora for?',
    'Aurora is for businesses whose teams spend much of the day on routine requests: answering leads, booking appointments, updating the CRM, sending invoices and following up. Aurora has ready-made setups for real estate, wellness and healthcare, and home services, and it fits any team with repeatable processes in sales, service or operations.',
  ],
  [
    'Which channels and tools does Aurora work with?',
    'Aurora answers on phone calls, SMS, web chat, email, WhatsApp and Slack, and works inside the tools a business already uses: CRMs such as HubSpot and Salesforce, Google Calendar and Microsoft Outlook calendars, email, the phone system and payments. The business keeps its current software; nothing needs to be replaced.',
  ],
  [
    'How long does it take to set up Aurora?',
    'Aurora goes live within hours. Divine Tech AI’s experts and AI agents map the business together with the team and turn it into an action plan. Aurora sets itself up from that plan, is tested on real questions from the business’s own data, and goes live only after the business approves. There is no technical project on the customer’s side.',
  ],
  [
    'How does a business stay in control of Aurora?',
    'The business decides what Aurora may do on its own, what needs a person’s approval and what Aurora never does. Every action Aurora takes is recorded with the request, the rule that applied and who approved it. Access is set per role, and the business’s data is never used to train shared AI models.',
  ],
  [
    'How much does Aurora cost?',
    'Aurora is priced for each business. The price depends on which departments and processes Aurora takes on, the channels it covers and the systems it connects to. Divine Tech AI maps the business’s processes first, then sends a proposal based on that plan.',
  ],
  [
    'Does Aurora replace employees?',
    'Aurora does not replace a company’s staff. Aurora takes the repetitive work off each department so people spend their time on customers and decisions, and it brings in a person whenever a request needs judgment or approval.',
  ],
];
