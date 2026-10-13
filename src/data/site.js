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
  titleA: 'The AI operating system for modern business',
  titleB: undefined,
  text: 'AI agents that do the work and cut the cost of running it, inside the tools you already use.',
  primary: 'Book a demo',
  secondary: 'See it in action',
};

// Hero film: the same request flow on four channels (illustrative scenarios,
// fictional customers). Timing lives in HeroFilm.jsx; copy lives here.
// Each scene: inbound message, Aurora's reply, customer confirms, Aurora books,
// then one decision goes to a person before the final confirmation.
export const heroFilm = {
  chapters: ['Listen', 'Understand', 'Act', 'Confirm'],
  scenes: [
    {
      key: 'sms',
      channel: 'Text message',
      mode: 'chat',
      industry: 'Real estate',
      contact: 'Sarah K.',
      initials: 'SK',
      sub: 'New inquiry · 2BR Maple St',
      ref: 'REQ-2048',
      lines: [
        { who: 'customer', text: 'Hi! Is the 2-bedroom on Maple Street still available? Could I see it this weekend?' },
        { who: 'aurora', text: 'It is. Saturday at 11:00 with Dana is open. Shall I book it?' },
        { who: 'customer', text: 'Yes, please. Is there an application fee?' },
        { who: 'aurora', text: 'You are booked for Saturday at 11:00. I have asked Dana about the fee.' },
        { who: 'aurora', text: 'Good news: Dana has waived the fee. See you on Saturday.' },
      ],
      steps: [
        { title: 'Request understood', detail: 'Viewing · 2BR Maple St' },
        { title: 'Calendar checked', detail: 'Sat 11:00 open · Dana' },
        { title: 'Policy applied', detail: 'Fee changes need approval' },
      ],
      actions: [
        { sys: 'CRM', title: 'Lead updated', detail: 'Stage: Viewing booked' },
        { sys: 'Calendar', title: 'Viewing booked', detail: 'Sat 11:00 · 42 Maple St' },
        { sys: 'Tasks', title: 'Follow-up set', detail: 'Fri 18:00 · confirm attendance' },
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
      lines: [
        { who: 'customer', text: 'Our water heater is leaking into the basement. Can someone come today?' },
        { who: 'aurora', text: 'I can send Luis today between 2 and 4. First, please close the cold-water valve on top of the tank.' },
        { who: 'customer', text: 'Done. Two to four works.' },
        { who: 'aurora', text: 'You are booked. Same-day slots need a quick sign-off from dispatch. One moment.' },
        { who: 'aurora', text: 'Confirmed: Luis arrives between 2 and 4. You will get a text when he is close.' },
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
      industry: 'Wellness & Healthcare',
      contact: 'Website visitor',
      initials: 'WV',
      sub: 'Web chat · New patient',
      ref: 'APT-5520',
      lines: [
        { who: 'customer', text: 'Hi, I am a new patient. Can I book a cleaning next week?' },
        { who: 'aurora', text: 'Welcome! Dr. Patel has Tuesday at 10:30 or Thursday at 16:15. Which suits you?' },
        { who: 'customer', text: 'Thursday at 16:15, please.' },
        { who: 'aurora', text: 'Booked with Dr. Patel. Your intake form is in your inbox, and the front desk will check your insurance.' },
        { who: 'aurora', text: 'Your insurance is verified. See you on Thursday at 16:15.' },
      ],
      steps: [
        { title: 'New patient', detail: 'Cleaning · next week' },
        { title: 'Availability checked', detail: 'Thu 16:15 · Dr. Patel' },
        { title: 'Clinic rules applied', detail: 'Intake form before visit' },
      ],
      actions: [
        { sys: 'CRM', title: 'Patient profile created', detail: 'New patient · web chat' },
        { sys: 'Calendar', title: 'Appointment booked', detail: 'Thu 16:15 · Dr. Patel' },
        { sys: 'Tasks', title: 'Intake form sent', detail: 'Reminder Wed 09:00' },
      ],
      approval: { ask: 'Verify insurance details?', by: 'Front desk', role: 'Clinic team', result: 'Insurance verified' },
    },
    {
      key: 'email',
      channel: 'Email',
      mode: 'email',
      industry: 'Property management',
      contact: 'Jordan Lee',
      initials: 'JL',
      sub: 'Tenant · Unit 4B',
      subject: 'Kitchen faucet leaking',
      desk: 'Maintenance desk',
      ref: 'WO-311',
      lines: [
        { who: 'customer', text: 'Hi, the kitchen faucet in 4B has been leaking since this morning. Could someone take a look?' },
        { who: 'aurora', text: 'Thanks, Jordan. A plumber can come tomorrow between 9 and 11. Does that work for you?' },
        { who: 'customer', text: 'Tomorrow morning is perfect, thank you.' },
        { who: 'aurora', text: 'Scheduled. I will confirm as soon as the owner approves the quote.' },
        { who: 'aurora', text: 'All set: the quote is approved and there is no charge to you. See you tomorrow, 9–11.' },
      ],
      steps: [
        { title: 'Request classified', detail: 'Maintenance · plumbing' },
        { title: 'Lease checked', detail: 'Repair covered by owner' },
        { title: 'Vendor found', detail: 'Tomorrow 9–11 am' },
      ],
      actions: [
        { sys: 'CRM', title: 'Work order opened', detail: 'WO-311 · Unit 4B' },
        { sys: 'Calendar', title: 'Plumber scheduled', detail: 'Tomorrow 9–11 am' },
        { sys: 'Tasks', title: 'Owner notified', detail: 'Quote $240 attached' },
      ],
      approval: { ask: 'Approve the $240 quote?', by: 'Alex', role: 'Property manager', result: 'Quote approved' },
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
    { key: 'realty', wide: '/video/hero-1.mp4', tall: '/video/hero-1-v.mp4', poster: PHOTOS + 'hero-1-1600.webp', posterTall: PHOTOS + 'hero-1-v-720.webp', icon: 'calendar', title: 'Viewing booked', detail: 'Real estate · Sat 11:00' },
    { key: 'clinic', wide: '/video/hero-2.mp4', tall: '/video/hero-2-v.mp4', poster: PHOTOS + 'hero-2-1600.webp', posterTall: PHOTOS + 'hero-2-v-720.webp', icon: 'service', title: 'Appointment moved', detail: 'Clinic · Thu 2:10 pm' },
    { key: 'service', wide: '/video/hero-3.mp4', tall: '/video/hero-3-v.mp4', poster: PHOTOS + 'hero-3-1600.webp', posterTall: PHOTOS + 'hero-3-v-720.webp', icon: 'invoice', title: 'Invoice sent', detail: 'Home services · paid by link' },
    { key: 'ops', wide: '/video/hero-4.mp4', tall: '/video/hero-4-v.mp4', poster: PHOTOS + 'hero-4-1600.webp', posterTall: PHOTOS + 'hero-4-v-720.webp', icon: 'report', title: 'Weekly report ready', detail: 'Operations · sent to the team' },
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
      title: 'Your sales development rep.',
      line: 'Answers every lead, qualifies it and books the meeting with the right rep.',
      kpis: ['Speed to lead', 'Meetings booked', 'Conversion rate'],
      agent: 'Sales agent',
      chip: { icon: 'calendar', title: 'Meeting booked', detail: 'Thu 11:00' },
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
      { key: 'inbox', title: 'One inbox for every channel', text: 'Web chat, email, text and calls land in one list, tagged by what each one needs.' },
      { key: 'action', title: 'Every action on the record', text: 'See the exact request Aurora sent to your system, and who approved it.' },
      { key: 'handoff', title: 'Take over in one click', text: 'Assign a conversation, switch from the agent to a person and back, with the full history in view.' },
      { key: 'dashboard', title: 'Today at a glance', text: 'Unread conversations, open handoffs and how much the agents handled, the moment you sign in.' },
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
  security: {
    eyebrow: 'Security and trust',
    titleA: 'Autonomy you set.',
    titleB: 'Every step on record.',
    items: [
      { icon: 'rules', title: 'Rules before autonomy', text: 'You decide what Aurora does alone, what waits for a person and what it never does. Limits apply the same way at 3 pm and at 3 am.' },
      { icon: 'roles', title: 'Access per role', text: 'Permissions are set per role, team and channel, so each agent only sees and does what its job needs.' },
      { icon: 'audit', title: 'A full audit log', text: 'Every action is recorded with the request, the rule that applied and who approved it.' },
      { icon: 'handoff', title: 'A person can step in', text: 'Your team can take over any conversation at any moment, and Aurora hands off with the full history.' },
      { icon: 'data', title: 'Your data stays yours', text: 'Your data is never used to train shared models.' },
      { icon: 'golive', title: 'Nothing goes live untested', text: 'Aurora is tested on real questions from your own data, and goes live only when you approve.' },
    ],
  },
  faq: [
    ['What is an AI agent platform?', 'An AI agent platform runs AI agents that answer requests and do work inside your business systems. Aurora is built as an AI operating system: every agent shares one memory of each customer and employee, one set of rules and one audit log, across sales, service and internal operations.'],
    ['How is Aurora different from a chatbot?', 'A chatbot answers questions in one channel. Aurora understands the request, applies your rules, does the work in your CRM, calendar and other systems, follows up until the task is closed and asks a person to approve anything above the limits you set.'],
    ['Which channels does Aurora work on?', 'Phone, text message, web chat, email and WhatsApp with customers, and Slack and email for your own team. A conversation that moves between channels stays one conversation, with its full history.'],
    ['Which systems does Aurora connect to?', 'Aurora works inside the tools you already use, including CRMs such as HubSpot and Salesforce, Google Calendar and Microsoft Outlook calendars, email, messaging, your phone system and payment tools. Nothing needs to be replaced.'],
    ['How does Aurora decide what it can do on its own?', 'You set the rules. Each action is allowed, needs approval or is never allowed, with limits such as refund or discount amounts. When a request crosses a limit, Aurora asks the right person and continues once they decide.'],
    ['Can my team take over a conversation?', 'Yes. Anyone with access can step into a conversation at any moment. Aurora hands off with the full history and picks up again when your team is done.'],
    ['Is our data used to train AI models?', 'No. Your data is never used to train shared models. Access is set per role and every action is recorded in the audit log.'],
  ],
};

export const footer = {
  tagline: 'Divine Tech AI builds Aurora, the AI operating system for businesses and organizations.',
};

// Home page industries section: a card per vertical, each linking to its page.
export const industriesSection = {
  eyebrow: 'Industries',
  titleA: 'Made for businesses',
  titleB: 'where every inquiry counts.',
  text: 'Each industry has its own problem, its own process and its own value. Aurora does not replace your process. It joins it.',
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
