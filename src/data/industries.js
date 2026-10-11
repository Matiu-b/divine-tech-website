// Industry landing pages (/industries/:slug). `events` feed the live cards over the hero photo. One page per vertical, used as the
// destination for that vertical's ads and videos.
// Structure follows the StoryBrand frame from the site review: the customer's
// problem and what it costs, how Aurora joins the process, where people stay in
// control, and what changes. No metrics are claimed until they are verified.

const PHOTOS = '/img/photos/';
const srcSet = (name, widths) => widths.map((w) => PHOTOS + name + '-' + w + '.webp ' + w + 'w').join(', ');

// Shared answers, so every page says the same thing about the same question.
const FAQ_CHANNELS = [
  'Which channels does Aurora cover?',
  'Web chat, WhatsApp, voice, SMS and email with customers, and Slack for your team’s internal requests. A conversation that starts on one channel and continues on another stays one conversation, with its full history.',
];
const FAQ_LIVE = [
  'How long does it take to go live?',
  'Within hours. It starts with a scoping session with our team of experts, working together with AI. Aurora then sets itself up and is tested on real examples from your business, and it goes live as soon as you approve.',
];

export const industries = [
  {
    slug: 'real-estate',
    key: 're',
    label: 'Real estate',
    leadIndustry: 'Real Estate',
    meta: {
      title: 'Aurora for real estate · Answer every lead in seconds | Divine Tech AI',
      description:
        'Aurora answers every property inquiry in seconds on WhatsApp, phone, email and web, qualifies the lead, books the viewing in the right agent’s calendar and follows up until the deal moves.',
    },
    short: 'Answer every lead in seconds, book viewings, and handle the follow-up emails and paperwork.',
    hero: {
      eyebrow: 'Aurora for real estate',
      titleA: 'The first agent to reply wins the lead.',
      titleB: 'Aurora replies in seconds.',
      text: 'Aurora answers every inquiry from portals, ads, WhatsApp and calls, qualifies budget, timeline and area, books the viewing into the right agent’s calendar and follows up until the client shows.',
    },
    problem: {
      titleA: 'You pay for every lead.',
      titleB: 'Most are answered too late.',
      points: [
        ['Leads arrive around the clock', 'Portals, ads, calls and WhatsApp bring inquiries at every hour, and the first agent to answer usually wins.'],
        ['Agents chase instead of showing', 'Hours go to qualifying, scheduling and follow-ups instead of time with buyers and tenants.'],
        ['Follow-up slips', 'A viewing without a reminder or a next step is a lead that quietly goes cold.'],
      ],
      cost: 'Leads you paid for, answered first by someone else.',
    },
    caption: 'Your agents are out showing homes. Aurora answers every new lead.',
    card: { icon: 'calendar', title: 'Viewing booked', detail: 'Sat 11:00, right agent, confirmation sent' },
    events: [
      { icon: 'message', title: 'New lead answered', detail: 'WhatsApp, 2BR inquiry' },
      { icon: 'mail', title: 'Listing email written and sent', detail: '12 matching buyers, personal intro' },
      { icon: 'invoice', title: 'Commission invoice issued', detail: 'Deal 318, sent to Finance' },
      { icon: 'calendar', title: 'Viewing booked', detail: 'Sat 11:00, 42 Maple St' },
      { icon: 'report', title: 'Weekly pipeline report', detail: 'Sent to managers, Monday 08:00' },
      { icon: 'crm', title: 'CRM cleaned up', detail: '38 lead records updated' },
    ],
    how: {
      titleA: 'Aurora joins your process.',
      titleB: 'It does not replace it.',
      steps: [
        ['Answers in seconds', 'Every inquiry gets a reply on the channel it came from, day or night.'],
        ['Qualifies the lead', 'Budget, timeline and area, asked naturally and logged to your CRM.'],
        ['Books the viewing', 'Into the right agent’s calendar, with the confirmation and address sent to the client.'],
        ['Follows up', 'A reminder the day before and a next step after the viewing, until the deal moves.'],
      ],
      chips: ['New lead · 2BR Maple St', 'Viewing booked · Sat 11:00', 'Follow-up · Fri 18:00'],
      photo: {
        src: PHOTOS + 'team-sales-960.webp',
        srcSet: srcSet('team-sales', [640, 960, 1440]),
        alt: 'A real-estate professional smiling at a message on her phone as she walks out of a sunlit office building',
      },
    },
    control: {
      title: 'Your rules on every price and exception.',
      text: 'Tell Aurora what it may never do, like quoting a final price, and what needs a person, like waiving a fee. It asks, your agent approves, and every step is on record.',
    },
    value: [
      ['Revenue', 'More booked viewings from the same ad spend.'],
      ['Time', 'First response in seconds instead of hours.'],
      ['Team', 'Agents show properties instead of chasing leads.'],
      ['Operations', 'Every lead handled the same way, every time.'],
    ],
    success: 'From chasing leads to showing properties.',
    systems: ['Your CRM', 'Agent calendars', 'Listing portals', 'WhatsApp', 'Phone', 'Email', 'Web chat'],
    faq: [
      ['Will Aurora quote prices or negotiate?', 'Only within the rules you set. You can tell it never to quote a final price and to offer a viewing instead. Anything outside your rules goes to an agent for approval.'],
      ['Does it work with our CRM and calendars?', 'Aurora works inside the systems your team already uses. During setup it is connected to your CRM, lead sources and agents’ calendars.'],
      FAQ_CHANNELS,
      FAQ_LIVE,
    ],
  },
  {
    slug: 'wellness-healthcare',
    key: 'hc',
    label: 'Wellness & Healthcare',
    leadIndustry: 'Wellness & Healthcare',
    meta: {
      title: 'Aurora for wellness & healthcare · Every call answered | Divine Tech AI',
      description:
        'Aurora answers calls and messages on the first ring, books, confirms and reschedules appointments, and gives front-desk time back to the people in the room.',
    },
    short: 'Answer every call, keep the schedule full, and issue invoices and aftercare emails on their own.',
    hero: {
      eyebrow: 'Aurora for wellness & healthcare',
      titleA: 'Every call answered.',
      titleB: 'Every slot filled.',
      text: 'Aurora answers calls and messages on the first ring, books, confirms and reschedules appointments, and gives front-desk time back to the people in the room.',
    },
    problem: {
      titleA: 'The front desk is the bottleneck.',
      titleB: 'Every missed call is an empty slot.',
      points: [
        ['Missed calls and long holds', 'The phone rings while the team is with clients, and few callers leave a message.'],
        ['The same questions all day', 'Hours, prices, parking and preparation, answered again and again by people who should be with clients.'],
        ['No-shows leave gaps', 'Unconfirmed appointments and late cancellations leave expensive holes in the schedule.'],
      ],
      cost: 'Empty slots, and a front desk that never gets ahead.',
    },
    caption: 'The front desk is with a client. Aurora answers the phone.',
    card: { icon: 'invoice', title: 'Invoice issued and sent', detail: 'Payment link included, record updated' },
    events: [
      { icon: 'service', title: 'Call answered', detail: 'First ring, after hours' },
      { icon: 'invoice', title: 'Invoice issued and sent', detail: 'Visit 4821, payment link included' },
      { icon: 'mail', title: 'Aftercare email sent', detail: 'Written for this treatment' },
      { icon: 'approval', title: 'Insurance form prepared', detail: 'Ready for front desk sign-off' },
      { icon: 'calendar', title: 'Appointment confirmed', detail: 'Thu 16:15 with Dr. Patel' },
      { icon: 'report', title: 'Daily schedule summary', detail: 'Sent to the clinic manager' },
    ],
    how: {
      titleA: 'Aurora joins your front desk.',
      titleB: 'Your team stays with clients.',
      steps: [
        ['Answers on the first ring', 'Calls, WhatsApp and web chat, including evenings and weekends.'],
        ['Books and reschedules', 'Into your scheduling system, by service, practitioner and availability.'],
        ['Confirms and reminds', 'Confirmations and reminders before every visit, and a new time offered when plans change.'],
        ['Hands off what is sensitive', 'Urgent or sensitive cases go to your staff at once, with the whole conversation attached.'],
      ],
      chips: ['Appointment moved · Thu 2:10 pm', 'Reminder scheduled · SMS', 'Urgent case → front desk'],
      photo: {
        src: PHOTOS + 'duo-clinic-900.webp',
        srcSet: srcSet('duo-clinic', [560, 900, 1280]),
        alt: 'A clinic receptionist laughing with an older client at a sunlit front desk surrounded by plants',
      },
    },
    control: {
      title: 'Anything sensitive waits for a person.',
      text: 'You decide what Aurora handles alone and what goes to your staff. Every conversation and every action is logged and searchable.',
    },
    value: [
      ['Revenue', 'Fewer empty slots when every appointment is confirmed.'],
      ['Time', 'Calls answered on the first ring, including after hours.'],
      ['Team', 'Staff focus on clients in the room, not the phone queue.'],
      ['Operations', 'Consistent intake and reminders across every location.'],
    ],
    success: 'From a ringing phone to a full, confirmed schedule.',
    systems: ['Scheduling system', 'Practice management', 'CRM', 'WhatsApp', 'Phone', 'SMS', 'Web chat'],
    faq: [
      ['Does Aurora give medical advice?', 'No. Aurora is set up for scheduling, questions about your services and admin. Anything clinical or urgent goes straight to your staff.'],
      ['Can it work across several locations?', 'Yes. Intake, reminders and answers stay consistent across every location, and each booking lands in the right calendar.'],
      FAQ_CHANNELS,
      FAQ_LIVE,
    ],
  },
  {
    slug: 'home-services',
    key: 'hs',
    label: 'Home services',
    leadIndustry: 'Home Services',
    meta: {
      title: 'Aurora for home services · Never miss a job | Divine Tech AI',
      description:
        'Aurora answers every call and message, captures the job and its urgency, quotes from your price book, books the technician and keeps the customer updated until the job is done.',
    },
    short: 'Capture every job, quote from your price book, and send the invoice and follow-up after every visit.',
    hero: {
      eyebrow: 'Aurora for home services',
      titleA: 'Your team is on a job.',
      titleB: 'Aurora answers the phone.',
      text: 'Aurora answers every call and message, captures the job and how urgent it is, quotes from your price book, books the technician and keeps the customer updated until the job is done.',
    },
    problem: {
      titleA: 'Unanswered calls',
      titleB: 'become someone else’s customers.',
      points: [
        ['Calls come in mid-job', 'Nobody can pick up from a ladder or under a sink, and callers move on to the next name.'],
        ['Quotes go out late', 'End-of-day callbacks lose jobs that a same-hour quote would have won.'],
        ['Dispatch gets chaotic', 'When demand spikes, schedules, arrival windows and customer updates slip.'],
      ],
      cost: 'Jobs that went to whoever picked up first.',
    },
    caption: 'Your technician is on a job. Aurora books the next one.',
    card: { icon: 'mail', title: 'Follow-up email written and sent', detail: 'Quote, photos and next steps' },
    events: [
      { icon: 'service', title: 'Call answered', detail: 'Water heater, urgent' },
      { icon: 'send', title: 'Quote sent', detail: 'From your price book' },
      { icon: 'invoice', title: 'Job invoice issued', detail: 'Job 1186, payment link sent' },
      { icon: 'mail', title: 'Follow-up email written', detail: 'Photos, warranty and next steps' },
      { icon: 'approval', title: 'Parts order drafted', detail: 'Waiting for dispatch approval' },
      { icon: 'calendar', title: 'Technician booked', detail: 'Today 2 to 4 pm, Luis' },
    ],
    how: {
      titleA: 'Aurora runs the office.',
      titleB: 'Your technicians stay on the road.',
      steps: [
        ['Answers every call', 'Captures the job, the address and the urgency, and shares safety steps when they are needed.'],
        ['Quotes from your price book', 'Same-hour quotes based on your prices and your rules.'],
        ['Books and dispatches', 'Into the right technician’s schedule, with an arrival window the customer can rely on.'],
        ['Keeps customers updated', 'Confirmations, an on-the-way text and a review request after the job.'],
      ],
      chips: ['Job captured · AC not cooling', 'Technician · today 3–5 pm', 'Review request queued'],
      photo: {
        src: PHOTOS + 'duo-tech-1024.webp',
        srcSet: srcSet('duo-tech', [640, 1024, 1600]),
        alt: 'A home-services technician smiling at his phone while sitting by his van on a sunny suburban street',
      },
    },
    control: {
      title: 'Dispatch signs off on the exceptions.',
      text: 'Same-day slots, discounts and anything outside your price book go to dispatch for a quick approval. Everything else runs on its own, on record.',
    },
    value: [
      ['Revenue', 'No missed jobs, faster quotes, more repeat customers.'],
      ['Time', 'Same-hour quotes instead of end-of-day callbacks.'],
      ['Team', 'The office does not have to grow with call volume.'],
      ['Operations', 'Tighter schedules and fewer dispatch errors.'],
    ],
    success: 'From missed calls to a full, well-run schedule.',
    systems: ['Field service software', 'Calendars', 'CRM', 'Price book', 'Phone', 'SMS', 'WhatsApp'],
    faq: [
      ['Can Aurora give a price on the call?', 'Yes, from your own price book and rules. Anything outside them, like a discount or an unusual job, goes to your team before the customer hears a number.'],
      ['What about emergencies?', 'Aurora recognises urgent jobs, shares the safety steps you approve, and puts the job in front of dispatch right away.'],
      FAQ_CHANNELS,
      FAQ_LIVE,
    ],
  },
];

export const industryBySlug = Object.fromEntries(industries.map((i) => [i.slug, i]));
export const industryPath = (slug) => '/industries/' + slug;
