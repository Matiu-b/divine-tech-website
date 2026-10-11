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
  { href: '/#platform', label: 'Platform' },
  { href: '/#how-it-works', label: 'How it works' },
  { label: 'Industries', children: 'industries' },
  { href: '/#security', label: 'Security' },
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
  text: 'Every inquiry answered in seconds, on WhatsApp, phone, email and web. Bookings made, records updated and follow-ups sent inside the systems you already use, with your approval on what matters.',
  primary: 'Book a demo',
  secondary: 'See how it works',
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

export const platform = {
  eyebrow: 'Platform',
  titleA: 'Most AI talks.',
  titleB: 'Aurora works.',
  text: 'Aurora is an AI operating layer between the channels your customers use and the systems your team relies on. It understands each request, applies your rules and carries the work through to done.',
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

export const howItWorks = {
  eyebrow: 'How it works',
  titleA: 'Describe it once.',
  titleB: 'Live in days, not months.',
  text: 'The setup that used to take consultants and developers happens inside one automatic cycle. Aurora configures itself and your team approves. It does not build.',
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

// Home page industries section: a card per vertical, each linking to its page.
export const industriesSection = {
  eyebrow: 'Industries',
  titleA: 'Made for businesses',
  titleB: 'where every inquiry counts.',
  text: 'Each industry has its own problem, its own process and its own value. Aurora does not replace your process. It joins it.',
};

// Must match the industry options in public/__forms.html (Netlify Forms).
export const leadIndustries = ['Real Estate', 'Wellness & Healthcare', 'Home Services', 'Other'];
