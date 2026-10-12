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
];

// Footer "Explore" column.
export const footerLinks = [
  { href: '/platform', label: 'Platform' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/platform#teams', label: 'Teams' },
  { href: '/platform#security', label: 'Security' },
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
  text: 'Aurora answers your customers on any channel, then does the work in the systems you already run on.',
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
  // Phone view of the diagram: one request at a time, from a channel through Aurora into a system.
  // ch = index in channels, sys = index in systems.
  examples: [
    { ch: 0, ask: 'I want to book a viewing for Saturday.', sys: 1, done: 'Viewing booked · Sat 10:30' },
    { ch: 1, ask: 'Can I move my appointment to Thursday?', sys: 1, done: 'Moved to Thu 11:00' },
    { ch: 2, ask: 'Do you have a 2-bedroom under $3,000?', sys: 3, done: 'Two matches sent' },
    { ch: 3, ask: 'Please send me the March invoice.', sys: 2, done: 'Invoice sent · follow-up set' },
    { ch: 4, ask: "I'm interested in the downtown listing.", sys: 0, done: 'New lead added · qualified' },
    { ch: 5, ask: 'Refund $340 on order 4821?', sys: 4, done: 'Sent to Dana for approval' },
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

export const understandVisual = {
  sources: [
    { name: 'Price book', kind: 'PDF' },
    { name: 'Service policies', kind: 'DOC' },
    { name: 'Website and FAQs', kind: 'WEB' },
    { name: 'CRM fields', kind: 'CRM' },
  ],
  rules: [
    { kind: 'Rule', text: 'Never quote a final price. Offer a viewing instead.' },
    { kind: 'Process', text: 'New lead → qualify → book → follow up' },
    { kind: 'Approval', text: 'Discounts above 5% need a manager' },
    { kind: 'Exception', text: 'Returning clients skip qualification' },
    { kind: 'Escalation', text: 'Complaints reach a person within the hour' },
  ],
};

export const workVisual = [
  { t: '09:14', ch: 'Web chat', text: 'Answered a question about parking' },
  { t: '09:14', ch: 'CRM', text: 'Qualified lead · budget, timeline, area' },
  { t: '09:15', ch: 'Calendar', text: 'Booked a viewing · Sat 11:00 with Dana' },
  { t: '09:15', ch: 'SMS', text: 'Sent confirmation and directions' },
  { t: '09:15', ch: 'Tasks', text: 'Created a follow-up · Fri 18:00' },
  { t: '09:21', ch: 'Voice', text: 'Moved a showing to Monday 10:30' },
  { t: '09:22', ch: 'CRM', text: 'Logged call notes to the record' },
  { t: '09:30', ch: 'Email', text: 'Sent the application link' },
  { t: '09:34', ch: 'Team', text: 'Handed a complaint to Dana with full context' },
];

export const controlVisual = {
  title: 'Approval required',
  item: 'Refund of $340 · Order 4821',
  reason: 'Above the $250 limit you set',
  requester: 'Requested by Aurora',
  approver: 'Dana K. · Operations',
  permissions: [
    ['Book and reschedule appointments', 'Allowed'],
    ['Refunds up to $250', 'Allowed'],
    ['Refunds above $250', 'Needs approval'],
    ['Change prices', 'Not allowed'],
  ],
  audit: [
    ['14:12', 'Refund requested', 'Aurora'],
    ['14:14', 'Approved', 'Dana K.'],
    ['14:14', 'Refund issued · Order 4821', 'Aurora'],
  ],
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
    filters: ['2 bedrooms', 'Up to $3,000', 'Parking', 'Downtown'],
    scanned: '1,248 listings',
    results: [
      ['42 Maple St', '$2,850', 'Parking'],
      ['18 Cedar Ave', '$2,990', 'Parking'],
    ],
    reply: 'Two match: 42 Maple St at $2,850 and 18 Cedar Ave at $2,990, both with parking. Want the details?',
    checks: ['Answer matches your data', 'Prices from the live database', 'Nothing promised outside policy'],
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
