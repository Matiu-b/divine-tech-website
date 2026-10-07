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
  address: '1441 Broadway, New York, NY 10018, USA',
  logo: '/img/dta-logo-t.webp', // Divine Tech AI horizontal logo (transparent, light wordmark)
  symbol: '/img/dta-symbol-t.webp', // Divine Tech AI glass mark
};

export const nav = [
  { href: '#platform', label: 'Platform' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#teams', label: 'Teams' },
  { href: '#security', label: 'Security' },
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
  eyebrow: 'Aurora by Divine Tech AI',
  titleA: 'Aurora runs the work.',
  titleB: 'Your team runs the business.',
  text: 'Aurora is an AI operating layer that understands how your company works, handles customers on every channel and completes the follow-through inside the systems you already use. Your people stay in charge of what matters.',
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
      key: 'whatsapp',
      channel: 'WhatsApp',
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
      industry: 'Healthcare',
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

export const statement = {
  a: 'Most AI talks.',
  b: 'Aurora works.',
  text: 'Answers are where the job starts, not where it ends. Aurora books the appointment, updates the record, sends the follow-up and brings in a person when the moment calls for one.',
};

// Atmosphere photography: AI-generated stills (OpenArt, Nano Banana 2) in one
// warm, sunny look. Files live in /public/img/photos; `lqip` is a tiny blurred
// preview shown until the photo arrives, so nothing jumps while it loads.
const PHOTOS = '/img/photos/';
const srcSet = (name, widths) => widths.map((w) => PHOTOS + name + '-' + w + '.webp ' + w + 'w').join(', ');

export const moment = {
  titleA: 'Step away.',
  titleB: 'The work keeps moving.',
  text: 'Aurora answers, books and follows up on every channel, so your people get their time back.',
  photo: {
    src: PHOTOS + 'moment-1600.webp',
    srcSet: srcSet('moment', [960, 1600, 2400]),
    mobileSrcSet: srcSet('moment-sq', [720, 1080]),
    alt: 'Three colleagues laughing together on the grass in a sunny park while one of them checks her phone',
    lqip: 'data:image/webp;base64,UklGRuAAAABXRUJQVlA4INQAAADQBQCdASogABIAPu1gp02ppSMiMAgBMB2JbACnFYzkwPdGaIVPx6SF4vHdd1qolZ+4nr0YX0gAAP7cS9Qqm7G8thbNxuhg2tlt7P7RgzcsgCup7vxO5U1z4SNgACCwo21XEhr/Pi2yda1plwtGeOvac9dho1g6gER9FjwAZ9frjlFl5FV0d23UscS3T7sMK+kem1ni3ifbpRtrAoKkuSvM70BR/OvI3kmB+HC1zB0UaT7hsAYvmptb/rzgyL+DoDG7fXRwE9CbjUjvEP6RtML474AAAA==',
    lqipMobile: 'data:image/webp;base64,UklGRgwBAABXRUJQVlA4IAABAAAwBgCdASoYABgAPu1qqFAppiOiqA1RMB2JbACdM1dv/i2Jy3mtDQMkSdbjqqQ9YVDlTVem/S38U02AAP6pt7IVuSi5Xq+Mlgx9vN6z0N/jHvGDk4P9B2ST0yGvjBqJ5YQ3OEvmijKbKwmGHYcqNP20icTqPYMiVKeHnVPRgyr/lNapqTrCGqIjtwqkwO7n8k3CjJgNA0zuEX96MdrwX7ZP7pMCmt919zvVxZs/ZnvZVk3stI84ogLjPMPN/jlt8YduOVvtSKh4F5QwSvJBKomI427dSB/iRD96q+UZid6FKp6/0tmO5EE795LWjOIO8e1TlJ9B2HemyHEBqF7LAAAA',
  },
  // Illustrative live activity shown over the photo (examples, not customer data).
  events: [
    { icon: 'calendar', title: 'Viewing booked', detail: 'Sat 11:00 · 42 Maple St' },
    { icon: 'message', title: 'New lead answered', detail: 'WhatsApp · 2BR inquiry' },
    { icon: 'qualified', title: 'Lead qualified', detail: 'Budget, timeline, area' },
    { icon: 'send', title: 'Follow-up sent', detail: 'Quote · Unit 4B' },
    { icon: 'service', title: 'Request resolved', detail: 'Appointment moved to Thu' },
    { icon: 'approval', title: 'Invoice approved', detail: 'Routed to Dana · Finance' },
    { icon: 'crm', title: 'CRM updated', detail: 'Notes logged after the call' },
  ],
};

export const platform = {
  eyebrow: 'Platform',
  titleA: 'One operating layer.',
  titleB: 'Between your customers and your systems.',
  text: 'Aurora sits between the channels your customers use and the systems your team relies on. It understands each request, applies your rules and carries the work through to done.',
  channels: ['Web chat', 'WhatsApp', 'Voice', 'SMS', 'Email'],
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
  notes: [
    ['One context, every channel', 'A conversation that starts on WhatsApp and continues by phone stays one conversation, with its full history.'],
    ['Your rules on every decision', 'Policies, limits and exceptions are applied the same way at 3 pm and at 3 am.'],
    ['Real actions in real systems', 'Aurora updates the CRM, books the slot and creates the task, instead of leaving a summary for someone else.'],
  ],
};

export const capabilities = [
  {
    key: 'understand',
    index: '01',
    title: 'Understands the business',
    text: 'Aurora learns how your company actually operates: what you sell, how a lead becomes a customer, the policies that apply and the exceptions nobody wrote down. Then it shows you the processes it will run.',
    points: ['Processes', 'Knowledge', 'Rules', 'Systems', 'Exceptions'],
  },
  {
    key: 'work',
    index: '02',
    title: 'Does the work',
    text: 'It answers, qualifies, books, updates records and follows up until the task is closed, inside the tools your team already uses. Real work completed, not summaries handed back to a person.',
    points: ['Answers', 'Qualifies', 'Books', 'Updates systems', 'Follows up', 'Executes actions'],
  },
  {
    key: 'control',
    index: '03',
    title: 'Operates with control',
    text: 'You decide what Aurora handles alone and what needs a person. Approvals, hand-offs, permissions and limits are built in, and every action is visible and on record.',
    points: ['Human approvals', 'Hand-offs', 'Permissions', 'Auditability', 'Limits'],
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
  { t: '09:14', ch: 'WhatsApp', text: 'Answered a question about parking' },
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

export const demo = {
  eyebrow: 'Product',
  titleA: 'Watch Aurora do the work.',
  titleB: 'Not summarize it.',
  text: 'One real conversation, start to finish. The customer writes, Aurora answers, and the CRM, calendar and task list update on their own.',
  note: 'Scripted demo built from typical flows. Names, times and prices are examples.',
};

export const howItWorks = {
  eyebrow: 'How it works',
  titleA: 'Describe it once.',
  titleB: 'Aurora configures the rest.',
  text: 'The setup, configuration and business fit that used to take a project team happen inside one automatic cycle. Your team reviews and approves. It does not build.',
  steps: [
    { name: 'Describe', text: 'Explain the business in plain language: what you sell, how a lead becomes a customer, what must never happen. Share the documents you already have.' },
    { name: 'Configure', text: 'Aurora builds its own setup: flows, integrations, knowledge, tone of voice and rules. No forms, no consultants.' },
    { name: 'Adapt', text: 'It runs test cycles on your real cases, finds the gaps and tunes itself until the results match how you work.' },
    { name: 'Run', text: 'It goes live on your channels and keeps learning from every conversation, with your approval on anything that changes the business.' },
  ],
  describe: {
    prompt: 'We sell and rent apartments in Brooklyn. Leads come from our website, Instagram ads and walk-ins. Book viewings with the listing agent. Never promise a price.',
    files: ['price-list.pdf', 'policies.docx', 'listings.csv'],
  },
  configure: ['Lead intake flow', 'Viewing scheduler', 'CRM sync', 'Agent calendars', 'Knowledge from 3 sources', 'Tone: warm and concise'],
  adapt: [
    ['Weekend viewing request', 'Pass'],
    ['Price negotiation', 'Adjusted: offers a viewing'],
    ['After-hours inquiry', 'Adjusted: tone'],
    ['Complaint', 'Escalates to a manager'],
  ],
  run: ['Web chat', 'WhatsApp', 'Voice'],
};

export const speed = {
  eyebrow: 'Implementation',
  titleA: 'Live in days.',
  titleB: 'Not months.',
  text: 'A traditional AI rollout is a project: discovery, scoping, building, integrating, training, fixing. Aurora compresses it, because the system does the configuring.',
  traditional: { label: 'Traditional rollout', sub: 'Consultants, developers and a long queue', segs: ['Discovery', 'Scoping', 'Build', 'Integrations', 'Training', 'Fixes'] },
  aurora: { label: 'With Aurora', sub: 'One AI-driven cycle', segs: ['Describe', 'Configure', 'Adapt', 'Run'] },
  benefits: [
    ['Less manual work', 'Setup, configuration and business fit run inside the cycle. People review instead of building.'],
    ['Fewer people to launch', 'No implementation team on your side. One owner who knows the business is enough.'],
    ['Value from the first day', 'Value starts on the first live day and compounds as Aurora learns from every interaction.'],
  ],
};

// Two more real-life moments between Implementation and Solutions (PhotoDuo.jsx).
export const duo = {
  label: 'Aurora at work in the field and at the front desk',
  items: [
    {
      key: 'field',
      caption: 'On the road, every call still gets answered.',
      chip: { icon: 'calendar', title: 'Job booked', detail: 'Today 3–5 pm' },
      mobileAspect: 'aspect-[4/5]',
      photo: {
        src: PHOTOS + 'duo-tech-1024.webp',
        srcSet: srcSet('duo-tech', [640, 1024, 1600]),
        sizes: '(min-width: 1440px) 760px, (min-width: 768px) 58vw, calc(100vw - 32px)',
        position: 'object-[40%_50%]',
        alt: 'A home-services technician smiling at his phone while sitting by his van on a sunny suburban street',
        lqip: 'data:image/webp;base64,UklGRigBAABXRUJQVlA4IBwBAACwBQCdASoeABgAPu1wsFKppiSiqAgBMB2JaAAIFo6JzX/4WUiWkyWVPOrdXWEzC++wzoHPtAAA/ppGvbfobt/HpbQyymsea6KVb2Ukvu5Payj71a3OPPXb8K6EXbaKGb+I/PPHSSp6cqTl5CGcx5yGWbZWsGuF3z0u32XDSRYD/+GN7YMzluoewsJo59zxfKk0e7AgaJ3obYK3MyEP7OYTsvX2mUXo4SEKPS2VDzAA+JSMP13yNBFUdI/t7J9LppBAe5sSLG7TZ/Tq/lLMTn32sosWCShUCOwB86at5HC67XTiOKQwT6MnUIWGUHG1aBdGC8f/hCWLpPOb6ZMaNpzIHUhxvbMHU/YyxnjFEQynwknQM2yUAeY9XzQAAA==',
      },
    },
    {
      key: 'desk',
      caption: 'Front desk time goes back to patients.',
      chip: { icon: 'service', title: 'Appointment confirmed', detail: 'Thu 2:10 pm' },
      mobileAspect: 'aspect-[4/5]',
      photo: {
        src: PHOTOS + 'duo-clinic-900.webp',
        srcSet: srcSet('duo-clinic', [560, 900, 1280]),
        sizes: '(min-width: 1440px) 540px, (min-width: 768px) 41vw, calc(100vw - 32px)',
        position: 'object-[60%_50%]',
        alt: 'A clinic receptionist laughing with an older patient at a sunlit front desk surrounded by plants',
        lqip: 'data:image/webp;base64,UklGRgwBAABXRUJQVlA4IAABAADQBQCdASoYAB4APu1qr1CppaQiqAqpMB2JZgCdBAgR8pvtZtywc6PcVvlCOJw1erFdT0tQECzgAP6vB91T70wxDxBSXGVHWMk08o7Xa/gIOmXtlynOi/8GFdve49o7IIa7mflPGJFMZCDVFwyN/fTePh14Bghj1TBBT+oUa1DWh6o3fAKS4yvWvmWGp/vmkF2xKNQ6fRlI5uQB37OaVxTERBUkygUPudmV1FVOZ6ELig3pEY697z17c0T6gOVK0FO+m2hQ81zwRWJWfAd8huub51+sZWQgyNvR7sbuHUIjtMnpw/F0S+5i9y0wYNSeH8iaVeC0qROZLug7XbGmAAAA',
      },
    },
  ],
};

export const solutions = {
  eyebrow: 'Solutions',
  titleA: 'Made for businesses',
  titleB: 'where every inquiry counts.',
  text: 'Each industry has its own problem, its own process and its own value. Aurora does not replace your process. It joins it.',
  items: [
    {
      key: 're',
      label: 'Real estate',
      short: 'Answer every lead in seconds, book viewings automatically and follow up until the deal moves.',
      tone: 'stone',
      problem: [
        'Leads arrive around the clock from portals, ads, calls and WhatsApp, and the first agent to answer usually wins.',
        'Agents spend hours qualifying, scheduling and chasing follow-ups instead of showing properties.',
      ],
      fit: [
        "Connects to your CRM, lead sources and agents' calendars.",
        'Answers within seconds and qualifies budget, timeline and area.',
        "Books viewings into the right agent's calendar and confirms the day before.",
      ],
      value: [
        ['Revenue', 'More booked viewings from the same ad spend.'],
        ['Time', 'First response in seconds instead of hours.'],
        ['Headcount', 'Agents show properties instead of chasing leads.'],
        ['Operations', 'Every lead handled the same way, every time.'],
      ],
      chips: ['New lead · 2BR Maple St', 'Viewing booked · Sat 11:00', 'Follow-up · Fri 18:00'],
    },
    {
      key: 'hc',
      label: 'Healthcare',
      short: 'Answer every call, keep the schedule full and give front-desk time back to patients.',
      tone: 'mist',
      problem: [
        'Front desks are overwhelmed: missed calls, long holds and the same questions all day.',
        'No-shows and late cancellations leave expensive gaps in the schedule.',
      ],
      fit: [
        'Connects to your practice management and scheduling system.',
        'Schedules, confirms and reschedules appointments on calls and messages.',
        'Routes urgent cases to staff immediately, with approval on anything sensitive.',
      ],
      value: [
        ['Revenue', 'Fewer empty slots when every appointment is confirmed.'],
        ['Time', 'Calls answered on the first ring, including after hours.'],
        ['Headcount', 'Staff focus on patients in the room, not the phone queue.'],
        ['Operations', 'Consistent intake and reminders across every location.'],
      ],
      chips: ['Appointment moved · Thu 2:10 pm', 'Reminder scheduled · SMS', 'Urgent case → front desk'],
    },
    {
      key: 'hs',
      label: 'Home services',
      short: 'Capture every job, quote from your price book and keep technicians on the road.',
      tone: 'dusk',
      problem: [
        "Calls come in while the team is on a job, and unanswered calls become someone else's customer.",
        'Quotes go out late and dispatch gets chaotic when demand spikes.',
      ],
      fit: [
        'Answers every call and message and captures job details and urgency.',
        'Quotes from your price book, books the job and dispatches it.',
        'Confirms arrival windows and requests reviews after the job.',
      ],
      value: [
        ['Revenue', 'No missed jobs, faster quotes, more repeat customers.'],
        ['Time', 'Same-hour quotes instead of end-of-day callbacks.'],
        ['Headcount', 'The office does not scale with call volume.'],
        ['Operations', 'Tighter schedules and fewer dispatch errors.'],
      ],
      chips: ['Job captured · AC not cooling', 'Technician · today 3–5 pm', 'Review request queued'],
    },
  ],
};

// Agents modeled on real roles, one per team (see Teams.jsx).
export const teams = {
  eyebrow: 'Teams',
  titleA: 'Agents that work like your team.',
  titleB: 'In sales, in service and inside the company.',
  text: "Each Aurora agent is modeled on a real role. It learns that role's playbook, works in the same tools and owns the same KPIs, then brings in a person whenever a decision needs one.",
  items: [
    {
      key: 'sales',
      label: 'Sales',
      title: 'Works like your sales development rep.',
      who: 'Sales reps, account executives and agents',
      does: [
        'Answers every new lead on any channel, day or night.',
        "Qualifies need, budget and timing, then books the meeting into the right rep's calendar.",
        'Follows up until the deal moves and logs every touch in the CRM.',
      ],
      gain: 'Reps spend their time in conversations that close, not on chasing, scheduling and data entry.',
      kpis: ['Speed to lead', 'Meetings booked', 'Conversion rate'],
      agent: 'Sales agent',
      chip: { icon: 'calendar', title: 'Meeting booked', detail: 'Thu 11:00' },
      photo: {
        src: PHOTOS + 'team-sales-960.webp',
        srcSet: srcSet('team-sales', [640, 960, 1440]),
        alt: 'A sales professional smiling at a message on her phone as she walks out of a sunlit office building',
        lqip: 'data:image/webp;base64,UklGRiIBAABXRUJQVlA4IBYBAACwBQCdASogABgAPu1gp02ppSOiMAgBMB2JQBajXkS4ok/o+39fA9geVS6wZkBJXnSJPlcXMpQA/A7NmBoYiez6DuS4FVqHAnKwKZ9YQCyRPqL4d7dZkcx3n8PlF2qQbOSNjHbX2mc6EvEGagocxCWXvg25/YDDjHSdHsOjiV9YXQlCa/xKKrTSaBExBWK4aUXgyI58M/YL5TBNZu/N00th0GHy2s+rBGGTwRGzTOLNKsWJb+2xHFb5Vy9L0If/HtvmrMOK1XFVO/7ucYp9UiwDKgGRr4n7SKDsIO9bW8n6ER5iPxyHj3vWR6WKsIfuwLy3/RGOd8J+P7vzgKYhUpUgfW3NsHPK/H9b9ONig8MAXD+XRsVIAA==',
      },
    },
    {
      key: 'service',
      label: 'Customer service',
      title: 'Works like your best support rep.',
      who: 'Support teams, front desks and dispatch',
      does: [
        'Answers questions on chat, phone, WhatsApp and email, around the clock.',
        'Resolves routine requests end to end: changes, cancellations, status updates and bookings.',
        'Hands complex or sensitive cases to a person, with the full history attached.',
      ],
      gain: 'The team stops answering the same questions all day and gives its time to the cases that need a person.',
      kpis: ['First response time', 'Resolution rate', 'Customer satisfaction'],
      agent: 'Service agent',
      chip: { icon: 'service', title: 'Request resolved', detail: 'Moved to Thu' },
      photo: {
        src: PHOTOS + 'team-service-960.webp',
        srcSet: srcSet('team-service', [640, 960, 1440]),
        alt: 'A support specialist with a headset laughing with a colleague at a bright office desk surrounded by plants',
        lqip: 'data:image/webp;base64,UklGRkQBAABXRUJQVlA4IDgBAADQBQCdASogABgAPu1kqk2ppaQiMAgBMB2JZACzgd5JhKWggk0BnBfE1Gij+n3noRrtrV6mq10AAP7rWrIiEkvI2baGwyp57y0RExgBT5N2ExhibNMEl/BZMgBgWvaHZivMTTetgfjR+cfWxdSu1UX4b4aNXwb2DWVhR2acyRCshn/9DSMbTEygX4metcX1q+ygz5JeJGwikZNZJcL3GdjJMqSzA8pWTWkWJcUXChh4JzsHbsGO/da8BaoWa5Okp5Q7afU/H+9AktYhiwUFtsTI7BmtCdb1PRcWUiRUnLkb1x3pr77PhmSsXqbPNqh+TjdaK2IChytkFbtBaOYFMIMi5F4BBUKurG9RwGvaak4xB4mAU/8vXMN5ZEuYgEjkel2UYI8QuAgN7viE1pby8mGWxPjSjKZAAAA=',
      },
    },
    {
      key: 'internal',
      label: 'Internal teams',
      title: 'Works like your operations coordinator.',
      who: 'Operations, finance, HR and office managers',
      does: [
        'Handles internal requests: approvals, scheduling, onboarding steps and reminders.',
        'Keeps every system up to date and chases follow-ups between departments.',
        "Answers employees' questions from your own policies and prepares the reports managers ask for.",
      ],
      gain: 'Managers get updates and approvals without chasing, and people stop retyping the same information into different systems.',
      kpis: ['Cycle time', 'Manual work hours', 'On-time completion'],
      agent: 'Operations agent',
      chip: { icon: 'approval', title: 'Invoice approved', detail: 'To Finance' },
      photo: {
        src: PHOTOS + 'team-internal-960.webp',
        srcSet: srcSet('team-internal', [640, 960, 1440]),
        alt: 'Three coworkers around a sunlit table on an office terrace, seen from above, sharing a tablet and coffee',
        lqip: 'data:image/webp;base64,UklGRkoBAABXRUJQVlA4ID4BAAAQBgCdASogABgAPu1iqE2ppaOiMAgBMB2JZgCsM2Qlug0zgxQZGvf7/1w5WHKZAqF2/4hnQGuoPAAA/n5v4PU39p1HenXUF2fAMfQ9CFKMasjt7llfHFolCLtiblj9ZpmEq+bd2ETM58tzmszBxl702uDlBSkiPMP7S54dtAiHi1l46GFhbhtDcM9hDY6dIpysD0Q2s+xhEQ7bWD/i8HW/zsy7iN1SkcsHdoxlP1RXZt1ZMhxLrw6hN+OM1Jtyy201dw852AYRMRXJH1uYa5XsA2LwQ2+3sW+0IZxaCd6nshieSLtqVGfA/Kicu87BisLRU6kdVcKgdfPpfdMCko/mj8L/ZY6xgsn1/DQFye21zGw3bpuLk1aCFLOpDCo+iXbTXTVn7LPosDqfIDEFbEAlic6ED6+weQW8TInAAAA=',
      },
    },
  ],
};

export const security = {
  eyebrow: 'Security and control',
  titleA: 'Built for trust.',
  titleB: 'Designed for control.',
  text: 'Aurora works inside boundaries you set. Sensitive decisions wait for a person, and everything it does stays visible.',
  items: [
    { key: 'data', title: 'Your data stays yours', text: 'Customer and business data is used to run your system, never to train anything shared.' },
    { key: 'approval', title: 'People approve changes', text: 'Anything that changes how the business runs waits for a human approval.' },
    { key: 'audit', title: 'Full audit trail', text: 'Every conversation, action and update is logged and searchable.' },
    { key: 'access', title: 'Access controls', text: 'Permissions per role and per channel, with data encrypted in transit and at rest.' },
  ],
};

export const closing = {
  titleA: 'See Aurora run',
  titleB: 'on your business.',
  text: 'Bring one real process. We describe it together, and you watch the system configure itself.',
};

export const footer = {
  tagline: 'Divine Tech AI builds Aurora, the AI operating layer that runs real business work across every channel.',
};

// Must match the Lead entity enum (base44/entities/Lead.jsonc).
export const leadIndustries = ['Real Estate', 'Healthcare / Medical', 'Home Services', 'Other'];
