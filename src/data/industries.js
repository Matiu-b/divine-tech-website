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
    // Page v3: its content is in realEstate.js, loaded by the real estate page only (src/pages/industries/RealEstatePage.jsx).
    v3: true,
    meta: {
      title: 'AI ISA for Real Estate Brokerages | Aurora by Divine Tech AI',
      description:
        'Aurora is the AI ISA for real estate brokerages: it answers every lead in seconds by phone, text and chat, qualifies it and books showings with your brokers.',
    },
    short: 'Answer every lead in seconds, book viewings, and handle the follow-up emails and paperwork.',
    hero: {
      eyebrow: 'Aurora for real estate',
      titleA: 'The first broker to reply wins the lead.',
      titleB: 'Aurora replies in seconds.',
      text: 'Aurora answers every inquiry from portals, ads, calls and texts, qualifies budget, timeline and area, books the viewing into the right broker’s calendar and follows up until the client shows.',
    },
    problem: {
      titleA: 'You pay for every lead.',
      titleB: 'Most are answered too late.',
      points: [
        ['Leads arrive around the clock', 'Portals, ads, calls and texts bring inquiries at every hour, and the first broker to answer usually wins.'],
        ['Brokers chase instead of showing', 'Hours go to qualifying, scheduling and follow-ups instead of time with buyers and tenants.'],
        ['Follow-up slips', 'A viewing without a reminder or a next step is a lead that quietly goes cold.'],
      ],
      cost: 'Leads you paid for, answered first by someone else.',
    },
    caption: 'Your brokers are out showing homes. Aurora answers every new lead.',
    card: { icon: 'calendar', title: 'Viewing booked', detail: 'Sat 11:00, right broker, confirmation sent' },
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
        ['Books the viewing', 'Into the right broker’s calendar, with the confirmation and address sent to the client.'],
        ['Follows up', 'A reminder the day before and a next step after the viewing, until the deal moves.'],
      ],
      chips: ['New lead · 2BR Maple St', 'Qualified · $3k, May, Downtown', 'Viewing booked · Sat 11:00', 'Follow-up · Fri 18:00'],
      photo: {
        src: PHOTOS + 're-agent-960.webp',
        srcSet: srcSet('re-agent', [640, 960, 1440]),
        alt: 'A real-estate broker with a tablet showing a couple around a bright, newly staged apartment',
        position: 'object-[35%_40%]',
      },
    },
    control: {
      title: 'Your rules on every price and exception.',
      text: 'Tell Aurora what it may never do, like quoting a final price, and what needs a person, like waiving a fee. It asks, your broker approves, and every step is on record.',
    },
    value: [
      ['Revenue', 'More booked viewings from the same ad spend.'],
      ['Time', 'First response in seconds instead of hours.'],
      ['Team', 'Brokers show properties instead of chasing leads.'],
      ['Operations', 'Every lead handled the same way, every time.'],
    ],
    success: 'From chasing leads to showing properties.',
    systems: ['Your CRM', 'Broker calendars', 'Listing portals', 'Phone', 'SMS', 'Email', 'Web chat', 'WhatsApp'],
    // the first six show on the page; the rest open with a button (all of them stay in the HTML and the FAQ schema)
    faqVisible: 6,
    faq: [
      ['What is an AI ISA for real estate?', 'An AI ISA (inside sales agent) answers and qualifies a brokerage’s leads the way a human ISA does, by phone, text, chat and email. Aurora replies to every new lead in seconds, asks about budget, timing and area, books the showing or listing appointment with the right broker and follows up until the lead is ready.'],
      ['Does Aurora work with our CRM and lead sources?', 'Yes. During setup Aurora is connected to the CRM your brokerage runs on, such as Follow Up Boss, BoldTrail (kvCORE), Lofty, HubSpot or Salesforce, to lead sources like Zillow, Realtor.com and Homes.com, and to your brokers’ Google or Outlook calendars. Leads keep arriving where they do now, and every conversation is logged to the lead’s record.'],
      ['Can Aurora book showings in my brokers’ calendars?', 'Yes. During setup Aurora is connected to your brokers’ calendars and your routing rules, so it books the showing with the right broker, sends the confirmation and address, and reminds the client the day before.'],
      ['Can Aurora talk to buyers in Spanish?', 'Yes. Aurora talks to buyers and sellers in Spanish as well as English, on calls and in texts, so a Spanish-speaking lead gets the same fast answer, qualification and booked showing.'],
      FAQ_LIVE,
      ['How much does Aurora cost for a brokerage?', 'Aurora is priced for each brokerage. The price depends on what Aurora takes on, from new leads to follow-up and showings, the channels it covers and the systems it connects to. We map your process first, then send a proposal based on that plan.'],
      ['How fast does Aurora reply to a new lead?', 'Within seconds, on the channel the lead came from, at any hour. A portal inquiry at 9:47 pm gets an answer at 9:47 pm, not the next morning.'],
      ['Will Aurora quote prices or negotiate?', 'Only within the rules you set. You can tell it never to quote a final price and to offer a showing or a call with a broker instead. Anything outside your rules goes to a broker for approval.'],
      ['What happens when a lead is ready to talk to a broker?', 'Aurora hands the lead to the right broker with the full conversation, and your team can step into any conversation at any moment.'],
      ['Do buyers know they’re talking to AI?', 'Yes. Aurora introduces itself as your team’s AI assistant, as in the call at the top of this page, and brings in a broker whenever a buyer asks for a person.'],
      ['How does Aurora handle Fair Housing and opt-outs?', 'Both are rules in your playbook. Aurora talks about the home, the schools and the commute, never about who lives in an area, and stops messaging anyone who opts out at once. Have your broker of record review the scripts and consent language before launch, as with any outreach.'],
      FAQ_CHANNELS,
    ],
  },
  {
    slug: 'wellness-healthcare',
    article: 'ai-receptionist-for-clinics', // the industry guide on the blog
    key: 'hc',
    label: 'Wellness & Healthcare',
    leadIndustry: 'Wellness & Healthcare',
    // Its own page design (src/components/industry/Wellness.jsx): one boutique studio's story, then clinics.
    // Its content is in wellness.js, loaded by the wellness page only (src/pages/industries/WellnessPage.jsx).
    wx: true,
    meta: {
      title: 'AI Front Desk for Wellness Studios & Clinics | Aurora by Divine Tech AI',
      description:
        'Aurora is the AI front desk for Pilates, yoga and fitness studios, spas and wellness clinics: it answers every call, books intro classes, fills the waitlist and brings members back.',
    },
    short: 'Answer every call, book the intro class, fill late cancellations from the waitlist and bring quiet members back.',
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
    // the first six show on the page; the rest open with a button (all of them stay in the HTML and the FAQ schema)
    faqVisible: 6,
    faq: [
      ['What is an AI front desk for a wellness studio?', 'An AI front desk answers the calls, texts and messages a studio’s front desk would, at any hour. Aurora answers questions about classes and prices from your own lists, books intro classes and appointments, offers freed spots to the waitlist, sends reminders and checks in with members who have gone quiet, all inside the rules you set.'],
      ['Which businesses is Aurora for?', 'Pilates, yoga, barre and fitness studios, spas and massage studios, and wellness clinics such as physiotherapy, chiropractic and aesthetics practices. Anywhere the schedule is the business and the phone rings while the team is with clients.'],
      ['Does Aurora give health or medical advice?', 'No. Aurora is set up for bookings, questions about your services and admin. Anything about an injury, a condition or treatment goes to your instructors or clinicians, and urgent cases go to your staff at once, with the conversation attached.'],
      ['Can Aurora fill late cancellations from the waitlist?', 'Yes. When a spot opens, Aurora offers it to the waitlist in order, holds it for the time you choose and books whoever says yes first, even at six in the morning. The roster updates itself.'],
      FAQ_LIVE,
      ['How much does Aurora cost for a studio or clinic?', 'Aurora is priced for each business. The price depends on what Aurora takes on, from calls and bookings to the waitlist and win-back calls, the channels it covers and the systems it connects to. We map your process first, then send a proposal based on that plan.'],
      ['Will Aurora sell memberships and packs?', 'Within the rules you set. Aurora can share prices from your list, offer an intro deal or a class pack to someone who hesitates, and hold a spot for a day. Anything outside your rules, like a special rate, waits for your approval.'],
      ['What happens when a member wants to cancel?', 'You decide. Aurora can offer a pause or a different class time first, then pass the request to your team with the full conversation, so the decision stays with a person.'],
      ['Can it work across several locations?', 'Yes. Answers, reminders and the waitlist stay consistent across every location, and each booking lands in the right calendar and the right room.'],
      ['Do clients know they’re talking to AI?', 'Yes. Aurora introduces itself as your studio’s AI assistant, as in the call at the top of this page, and brings in a person whenever a client asks for one.'],
      FAQ_CHANNELS,
    ],
  },
  {
    slug: 'home-services',
    five: true, // the page in five scenes (components/industry/HomeServices.jsx, data/homeServices.js)
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
      ['Does Aurora work for our own team, not only for customers?', 'Yes. It plans the day’s routes, finds parts for techs in the field, checks freelancer invoices against time on site, keeps certificates current and briefs the owner. The same rules and approvals apply.'],
      FAQ_CHANNELS,
      FAQ_LIVE,
    ],
  },
];

export const industryBySlug = Object.fromEntries(industries.map((i) => [i.slug, i]));
export const industryPath = (slug) => '/industries/' + slug;
