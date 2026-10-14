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
  'Phone, text, web chat, email and WhatsApp with customers, and Slack for your team’s internal requests. A conversation that starts on one channel and continues on another stays one conversation, with its full history.',
];
const FAQ_LIVE = [
  'How long does it take to go live?',
  'Within hours. Our experts and AI agents map your business with you and build an action plan for the Aurora engine. Aurora then sets itself up from that plan, is tested on real examples from your business, and goes live as soon as you approve.',
];

export const industries = [
  {
    slug: 'real-estate',
    article: 'ai-for-real-estate-lead-follow-up', // the industry guide on the blog
    key: 're',
    label: 'Real estate',
    leadIndustry: 'Real Estate',
    // Page v3: only what is specific to real estate; the home and platform pages tell the rest. Times are illustrative.
    v3: {
      hero: {
        eyebrow: 'Aurora for real estate',
        titleA: 'The AI ISA for',
        titleB: 'real estate brokerages.',
        text: 'Aurora answers every lead from portals, ads, calls and texts in seconds, qualifies it, books the showing with the right agent and keeps every deal moving. Your agents just sell.',
        // A buyer calls about a listing at night and Aurora takes the call. Recorded in ElevenLabs v4;
        // `at` / `end` are where each caption starts and ends in the recording (ms), `words` when each
        // word is spoken, from the start of its caption. Names, prices and times are illustrative.
        film: {
          video: '/media/real-estate/hero-call.mp4',
          poster: '/media/real-estate/hero-call-poster.webp',
          alt: 'A man on the phone on a quiet street at dusk, smiling at a craftsman house with a yard sign in front',
        },
        call: {
          audio: '/media/real-estate/call-c.mp3',
          duration: 62100,
          title: 'Inbound call · 9:47 pm',
          listing: 'Maple Street listing',
          caller: 'Buyer',
          waiting: 'Aurora notes what she learns here',
          listen: 'Listen to the call',
          mute: 'Mute',
          stages: [
            { label: 'Greet', at: 0 },
            { label: 'Qualify', at: 16580 },
            { label: 'Guide', at: 36560 },
            { label: 'Book', at: 51860 },
          ],
          // what Aurora records while she talks, shown as it happens
          notes: [
            { at: 34200, title: 'Pre-approved', detail: 'Up to $550K' },
            { at: 53500, title: 'Showing booked', detail: 'Sat 11:00 am · with Jess' },
            { at: 58200, title: 'Text sent', detail: 'Address and agent contact' },
          ],
          captions: [
            { who: 'aurora', at: 0, end: 3140, text: "Hi! Thanks for calling about the house on Maple Street.", words: [0, 880, 1220, 1440, 1680, 1980, 2100, 2320, 2520, 2760] },
            { who: 'aurora', at: 3500, end: 6860, text: "This is Aurora, the team's AI assistant... how can I help?", words: [0, 80, 260, 900, 960, 1400, 1700, 2660, 2800, 2940, 3080] },
            { who: 'buyer', at: 7380, end: 11560, text: "Oh, hi. Yeah, I just drove past it. Is it still available?", words: [0, 200, 1100, 1700, 1960, 2140, 2360, 2700, 3360, 3500, 3620, 3860] },
            { who: 'aurora', at: 12260, end: 15960, text: "It is! It listed on Monday... and it's getting a lot of interest.", words: [0, 140, 780, 1000, 1200, 1480, 2400, 2560, 2760, 2920, 3100, 3260, 3380] },
            { who: 'aurora', at: 16580, end: 17380, text: "Is it for you?", words: [0, 240, 340, 520] },
            { who: 'buyer', at: 17760, end: 23540, text: "Yeah, me and my wife. We've been renting for years, so... we're kind of ready for a yard.", words: [0, 680, 860, 980, 1140, 1920, 2160, 2280, 2520, 2820, 3380, 3740, 4620, 4780, 4940, 5140, 5380, 5560] },
            { who: 'aurora', at: 23540, end: 30580, text: "Oh, I totally get that. It has a big fenced backyard... and a two-car garage.", words: [0, 740, 940, 1260, 1560, 2480, 2680, 2880, 3180, 3440, 4020, 4620, 5580, 5960, 6480] },
            { who: 'aurora', at: 31120, end: 32440, text: "Have you talked to a lender yet?", words: [0, 180, 320, 500, 700, 820, 940] },
            { who: 'buyer', at: 32860, end: 35980, text: "Yeah, we're pre-approved. Up to about five-fifty.", words: [0, 460, 800, 1900, 2020, 2200, 2480] },
            { who: 'aurora', at: 36560, end: 40160, text: "Perfect, it's listed at five-twenty-five, so you're right in range.", words: [0, 1020, 1240, 1440, 1660, 2140, 2660, 2860, 3120, 3300] },
            { who: 'aurora', at: 40820, end: 44040, text: "The best next step is to see it before the weekend gets busy.", words: [0, 180, 420, 720, 1020, 1220, 1400, 1640, 1800, 2140, 2320, 2520, 2840] },
            { who: 'aurora', at: 44660, end: 50080, text: "Jess, the listing agent, has Saturday at eleven... or Sunday at two. Which works better?", words: [0, 280, 320, 600, 1220, 1500, 1880, 2200, 2560, 3300, 3680, 3940, 4520, 4800, 5040] },
            { who: 'buyer', at: 50460, end: 51860, text: "Saturday at eleven works.", words: [0, 380, 700, 1020] },
            { who: 'aurora', at: 51860, end: 55220, text: "Done! You're booked with Jess, Saturday at eleven.", words: [0, 1380, 1580, 1760, 1980, 2840, 2840, 3120] },
            { who: 'aurora', at: 55780, end: 59200, text: "I'll text you the address and her number right now. See you Saturday!", words: [0, 240, 420, 640, 760, 1060, 1380, 1540, 1780, 2080, 2940, 3020, 3140] },
            { who: 'buyer', at: 59880, end: 61500, text: "Great... thanks, Aurora.", words: [0, 980, 1480] },
          ],
          transcriptLabel: 'Read the full call',
          note: 'An example call. Names, prices and times are illustrative.',
        },
      },
      race: {
        eyebrow: 'Speed to lead',
        titleA: 'Leads go to',
        titleB: 'whoever answers first.',
        text: 'Buyers send the same question to several agents. The first one to reply usually gets the showing.',
        lanes: [
          {
            key: 'aurora',
            label: 'With Aurora',
            steps: [
              { time: '9:47 pm', text: 'New lead from a portal' },
              { time: '9:47 pm', text: 'Aurora replies' },
              { time: '9:52 pm', text: 'Budget, timing and area qualified' },
              { time: '9:55 pm', text: 'Showing booked for Saturday' },
            ],
          },
          {
            key: 'without',
            label: 'Without Aurora',
            steps: [
              { time: '9:47 pm', text: 'New lead from a portal' },
              { time: 'Overnight', text: 'Waiting for someone to see it' },
              { time: '8:30 am', text: 'An agent replies' },
              { time: '8:31 am', text: 'Already booked with another agent' },
            ],
          },
        ],
        note: 'An illustrative evening, not measured data.',
      },
      rules: {
        eyebrow: 'Your rules',
        titleA: 'It follows your rules.',
        titleB: 'Every time.',
        items: [
          { icon: 'price', title: 'No final prices', text: 'Offers a showing or a call with an agent instead of quoting a price.' },
          { icon: 'fair', title: 'Questions about the home', text: 'Budget, timing, area and needs. Never about who the buyer is.' },
          { icon: 'consent', title: 'Contact on their terms', text: 'Replies on the channel the lead chose, and stops when asked.' },
          { icon: 'handoff', title: 'Hot leads to a person', text: 'Ready buyers and sellers go to the right agent with the full history.' },
        ],
      },
    },
    meta: {
      title: 'AI ISA for Real Estate Brokerages | Aurora by Divine Tech AI',
      description:
        'Aurora is the AI ISA for real estate brokerages: it answers every lead in seconds by phone, text and chat, qualifies it and books showings with your agents.',
    },
    short: 'Answer every lead in seconds, book viewings, and handle the follow-up emails and paperwork.',
    hero: {
      eyebrow: 'Aurora for real estate',
      titleA: 'The first agent to reply wins the lead.',
      titleB: 'Aurora replies in seconds.',
      text: 'Aurora answers every inquiry from portals, ads, calls and texts, qualifies budget, timeline and area, books the viewing into the right agent’s calendar and follows up until the client shows.',
    },
    problem: {
      titleA: 'You pay for every lead.',
      titleB: 'Most are answered too late.',
      points: [
        ['Leads arrive around the clock', 'Portals, ads, calls and texts bring inquiries at every hour, and the first agent to answer usually wins.'],
        ['Agents chase instead of showing', 'Hours go to qualifying, scheduling and follow-ups instead of time with buyers and tenants.'],
        ['Follow-up slips', 'A viewing without a reminder or a next step is a lead that quietly goes cold.'],
      ],
      cost: 'Leads you paid for, answered first by someone else.',
    },
    caption: 'Your agents are out showing homes. Aurora answers every new lead.',
    card: { icon: 'calendar', title: 'Viewing booked', detail: 'Sat 11:00, right agent, confirmation sent' },
    events: [
      { icon: 'message', title: 'New lead answered', detail: 'Text message, 2BR inquiry' },
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
      chips: ['New lead · 2BR Maple St', 'Qualified · $3k, May, Downtown', 'Viewing booked · Sat 11:00', 'Follow-up · Fri 18:00'],
      photo: {
        src: PHOTOS + 're-agent-960.webp',
        srcSet: srcSet('re-agent', [640, 960, 1440]),
        alt: 'A real-estate agent with a tablet showing a couple around a bright, newly staged apartment',
        position: 'object-[35%_40%]',
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
    systems: ['Your CRM', 'Agent calendars', 'Listing portals', 'Phone', 'SMS', 'Email', 'Web chat', 'WhatsApp'],
    faq: [
      ['What is an AI ISA for real estate?', 'An AI ISA (inside sales agent) answers and qualifies a brokerage’s leads the way a human ISA does, by phone, text, chat and email. Aurora replies to every new lead in seconds, asks about budget, timing and area, books the showing or listing appointment with the right agent and follows up until the lead is ready.'],
      ['How fast does Aurora reply to a new lead?', 'Within seconds, on the channel the lead came from, at any hour. A portal inquiry at 9:47 pm gets an answer at 9:47 pm, not the next morning.'],
      ['Can Aurora book showings in my agents’ calendars?', 'Yes. During setup Aurora is connected to your agents’ calendars and your routing rules, so it books the showing with the right agent, sends the confirmation and address, and reminds the client the day before.'],
      ['Does Aurora work with our CRM and lead sources?', 'Aurora works inside the systems your team already uses. During setup it is connected to your CRM, your lead sources and your agents’ calendars, and every conversation is logged to the lead’s record.'],
      ['Will Aurora quote prices or negotiate?', 'Only within the rules you set. You can tell it never to quote a final price and to offer a showing or a call with an agent instead. Anything outside your rules goes to an agent for approval.'],
      ['What happens when a lead is ready to talk to an agent?', 'Aurora hands the lead to the right agent with the full conversation, and your team can step into any conversation at any moment.'],
    ],
  },
  {
    slug: 'wellness-healthcare',
    article: 'ai-receptionist-for-clinics', // the industry guide on the blog
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
        ['Answers on the first ring', 'Calls, texts and web chat, including evenings and weekends.'],
        ['Books and reschedules', 'Into your scheduling system, by service, practitioner and availability.'],
        ['Confirms and reminds', 'Confirmations and reminders before every visit, and a new time offered when plans change.'],
        ['Hands off what is sensitive', 'Urgent or sensitive cases go to your staff at once, with the whole conversation attached.'],
      ],
      chips: ['Call answered · 9:42 pm', 'Appointment moved · Thu 2:10 pm', 'Reminder scheduled · SMS', 'Urgent case → front desk'],
      photo: {
        src: PHOTOS + 'clinic-desk-960.webp',
        srcSet: srcSet('clinic-desk', [640, 960, 1440]),
        alt: 'A practitioner and a front-desk colleague reviewing the day’s schedule on a tablet at a modern clinic reception',
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
    systems: ['Scheduling system', 'Practice management', 'CRM', 'Phone', 'SMS', 'Web chat', 'WhatsApp'],
    faq: [
      ['Does Aurora give medical advice?', 'No. Aurora is set up for scheduling, questions about your services and admin. Anything clinical or urgent goes straight to your staff.'],
      ['Can it work across several locations?', 'Yes. Intake, reminders and answers stay consistent across every location, and each booking lands in the right calendar.'],
      FAQ_CHANNELS,
      FAQ_LIVE,
    ],
  },
  {
    slug: 'home-services',
    article: 'ai-answering-service-for-contractors', // the industry guide on the blog
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
      chips: ['Job captured · AC not cooling', 'Quote sent · from your price book', 'Technician · today 3–5 pm', 'Review request queued'],
      photo: {
        src: PHOTOS + 'tech-hvac-960.webp',
        srcSet: srcSet('tech-hvac', [640, 960, 1440]),
        alt: 'A home-services technician checking readings on a tablet beside an outdoor HVAC unit, his van behind him',
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
