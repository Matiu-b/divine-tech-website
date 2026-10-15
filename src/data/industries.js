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
        text: 'Aurora answers every lead from portals, ads, calls and texts in seconds, qualifies it, books the showing with the right broker and keeps every deal moving. Your brokers just sell.',
        // The listing from the call, and the call itself: a buyer phones about it at night and Aurora answers. Recorded in ElevenLabs v4;
        // `at` / `end` are where each caption starts and ends in the recording (ms), `words` when each
        // word is spoken, from the start of its caption. Names, prices and times are illustrative.
        film: {
          image: {
            src: '/media/real-estate/house-4-1600.webp',
            srcSet: '/media/real-estate/house-4-900.webp 900w, /media/real-estate/house-4-1200.webp 1200w, /media/real-estate/house-4-1600.webp 1600w, /media/real-estate/house-4-2000.webp 2000w',
          },
          alt: 'The Maple Street listing at dusk: a craftsman house with a two-car garage, a fenced backyard and a For Sale sign on the lawn',
        },
        call: {
          audio: '/media/real-estate/call-c.mp3',
          duration: 62100,
          title: 'Aurora · AI voice agent',
          listing: 'Call about a home for sale',
          caller: 'Buyer',
          waiting: 'Aurora notes what she learns here',
          // the call plays only when the visitor presses play
          listen: 'Play the call',
          again: 'Play it again',
          prompt: 'A buyer calls about a home for sale. Hear Aurora’s AI voice agent take the call.',
          sound: 'Sound on',
          pause: 'Pause the call',
          resume: 'Resume the call',
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
            { at: 58200, title: 'Text sent', detail: 'Address and broker contact' },
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
          note: 'An example call. Names, prices and times are illustrative.',
        },
      },
      race: {
        eyebrow: 'Speed to lead',
        titleA: 'Leads go to',
        titleB: 'whoever answers first.',
        text: 'Buyers text several brokers about the homes they like. The first one to reply usually gets the showing.',
        // One evening on a buyer's phone: she messages the listing brokers of three homes and hears nothing;
        // the fourth home is listed by a brokerage that runs Aurora. Every name, address, number and message is illustrative.
        // the evening as a brokerage would read it in an activity log; also the step captions on phones and tablets
        steps: [
          { time: '7:58 pm', title: '3 homes, 3 inquiries', text: 'One message to each listing broker: Elm & Co., Summit Homes, Keystone.' },
          { time: '9:46 pm', title: '0 of 3 replied', text: 'The first inquiry has waited 1h 48m. All three still say Delivered.' },
          { time: '9:47 pm', title: 'A 4th inquiry', text: '18 Willow Court, listed by Harbor Lane Realty. They run Aurora.' },
          { time: '+3 sec', title: 'Aurora replies', text: 'In her thread: the answer to her question, then a question back.' },
          { time: '9:52 pm', title: 'Tour booked, in the CRM', text: 'Qualified, booked with Marcus and filed. No other broker has replied.' },
        ],
        phone: {
          title: 'Messages',
          app: 'Homes',
          cta: 'Message broker',
          personal: [
            { key: 'dad', name: 'Dad', initials: 'D', preview: 'Call me when you get a chance', time: 'Yesterday', order: -30 },
            { key: 'book', name: 'Book club', initials: 'BC', preview: 'Priya: Next week at mine?', time: 'Yesterday', order: -20 },
            { key: 'jordan', name: 'Jordan', initials: 'J', preview: 'Haha see you tomorrow', time: '5:40 PM', order: -10 },
            { key: 'mom', name: 'Mom', initials: 'M', preview: 'Dinner on Sunday?', time: '6:12 PM', order: 12 },
            { key: 'lucy', name: 'Lucy', initials: 'L', preview: 'Did you find anything?? 🏡', time: '8:52 PM', order: 172 },
          ],
          // the homes she messages about, in order; the last one is listed by the brokerage that runs Aurora
          listings: [
            {
              key: 'elm',
              image: '/media/real-estate/listing-elm-600.webp',
              price: '$489,000',
              facts: '3 bd · 2 ba · 1,620 sq ft',
              address: '52 Elm Street',
              agent: { name: 'Rachel Wong', initials: 'RW', office: 'Elm & Co. Realty' },
              message: 'Hi! Is 52 Elm Street still available?',
              time: '7:58 PM',
              order: 118,
            },
            {
              key: 'birch',
              image: '/media/real-estate/listing-birch-600.webp',
              price: '$545,000',
              facts: '4 bd · 3 ba · 2,100 sq ft',
              address: '301 Birch Lane',
              agent: { name: 'Tom Alvarez', initials: 'TA', office: 'Summit Homes' },
              message: 'Hello, could I see 301 Birch Lane this week?',
              time: '8:31 PM',
              order: 151,
            },
            {
              key: 'oak',
              image: '/media/real-estate/listing-oak-600.webp',
              price: '$510,000',
              facts: '3 bd · 2.5 ba · 1,780 sq ft',
              address: '14 Oak Avenue',
              agent: { name: 'Sarah Kim', initials: 'SK', office: 'Keystone Realty' },
              message: 'Hi, is 14 Oak Avenue still on the market?',
              time: '9:10 PM',
              order: 190,
            },
            {
              key: 'willow',
              aurora: true,
              image: '/media/real-estate/listing-willow-600.webp',
              price: '$415,000',
              facts: '3 bd · 2.5 ba · 1,960 sq ft',
              address: '18 Willow Court',
              agent: { name: 'Harbor Lane Realty', office: 'Aurora · AI agent' },
              message: 'Hi! Is 18 Willow Court still available? What are the HOA fees?',
              time: '9:47 PM',
              order: 999,
            },
          ],
          listedBy: 'Listed by',
          agentTag: 'Listing broker',
          delivered: 'Delivered',
          noReply: 'No reply',
          typingField: 'Text Message',
          repliedIn: 'Replied in 3 sec',
          booked: 'Tour booked · Thu 6:30 pm',
          // her conversation with the brokerage that runs Aurora; `crm` names the fields each message fills
          chat: [
            { who: 'buyer', text: 'Hi! Is 18 Willow Court still available? What are the HOA fees?', crm: ['phone', 'home'] },
            { who: 'aurora', text: "Hi! Yes, it's available. The HOA is $45 a month and covers the community pool and common areas. I'm Aurora, Harbor Lane's AI assistant. May I have your name?" },
            { who: 'buyer', text: 'Emma Clarke', crm: ['name'] },
            { who: 'aurora', text: 'Thanks, Emma! When are you hoping to move, and have you talked to a lender yet?' },
            { who: 'buyer', text: 'In about two months. Pre-approved up to $450K', crm: ['timeline', 'budget'] },
            { who: 'aurora', text: "You're well within range. Marcus, the listing broker, can give you a tour Thursday at 6:30 pm. Does that work?" },
            { who: 'buyer', text: 'Thursday works for me' },
            { who: 'aurora', booked: { title: 'Tour booked', detail: 'Thu 6:30 pm · with Marcus' }, text: "You're all set. What's the best email for the details?", crm: ['tour'] },
            { who: 'buyer', text: 'emma.c@example.com', crm: ['email'] },
            { who: 'aurora', text: 'Sent! See you Thursday, Emma.' },
          ],
        },
        // wide screens: who answered her, beside the phone
        // her evening on the sofa, as long as the scene before her message reaches Aurora's brokerage (15 s)
        film: {
          video: '/media/real-estate/emma-sofa.mp4',
          poster: '/media/real-estate/emma-sofa-poster.webp',
        },
        crm: {
          title: 'Harbor Lane CRM',
          empty: 'Waiting for a new lead',
          status: ['New lead · text', 'Qualified', 'Tour booked'],
          fields: [
            { key: 'name', label: 'Name', value: 'Emma Clarke' },
            { key: 'phone', label: 'Phone', value: '(312) 555-0147' },
            { key: 'email', label: 'Email', value: 'emma.c@example.com' },
            { key: 'home', label: 'Interested in', value: '18 Willow Court' },
            { key: 'timeline', label: 'Timing', value: 'Moving in about 2 months' },
            { key: 'budget', label: 'Budget', value: 'Pre-approved · up to $450K' },
            { key: 'tour', label: 'Tour', value: 'Thu 6:30 pm · with Marcus' },
          ],
          assigned: 'Assigned to Marcus · notified',
          initial: 'M',
        },
        note: 'An example evening. Names, times and messages are illustrative.',
      },
      // Your playbook: the broker's settings on the left, one rule at a time on the right (when, what Aurora does, result).
      // Every name, time and result is illustrative.
      rules: {
        eyebrow: 'Your rules',
        titleA: 'Handles the objection.',
        titleB: 'Holds the line.',
        text: 'You set what Aurora never says, what needs your OK first, and how it answers buyers who push back.',
        panel: { title: 'Your playbook', sub: 'Harbor Lane Realty', edited: 'Set by you' },
        groups: [
          { key: 'guard', label: 'Guardrails' },
          { key: 'obj', label: 'Objections' },
        ],
        rows: [
          { key: 'price', group: 'guard', icon: 'price', label: 'Final prices', values: ['Never', 'Ask me first'] },
          { key: 'fair', group: 'guard', icon: 'fair', label: 'Who lives in the area', values: ['Never discuss'] },
          { key: 'stop', group: 'guard', icon: 'stop', label: 'Opt-out requests', values: ['Stop at once'] },
          { key: 'handoff', group: 'guard', icon: 'handoff', label: 'Ready to tour', values: ['Hand to a broker'] },
          { key: 'looking', group: 'obj', label: '“Just looking”', values: ['Nurture'] },
          { key: 'broker', group: 'obj', label: '“I already have a broker”', values: ['Step back'] },
          { key: 'high', group: 'obj', label: '“The price is too high”', values: ['Find their range'] },
          { key: 'preapp', group: 'obj', label: '“Not pre-approved yet”', values: ['Lender intro'] },
        ],
        flow: { when: 'Buyer', then: 'Aurora', result: 'Result' },
        scenes: [
          { row: 'price', value: 0, channel: 'via text', trigger: 'What’s the lowest the seller would take?', action: 'Doesn’t name a number. Offers a call with the listing broker.', result: 'Call booked · Marcus notified', tone: 'ok', reply: 'I can’t share the seller’s bottom line, but Marcus, the listing broker, can talk numbers with you. Free for a quick call at 10 tomorrow?' },
          { row: 'price', value: 1, channel: 'via text', trigger: 'What’s the lowest the seller would take?', action: 'Holds the reply and asks you first.', result: 'Approval sent to Marcus · one tap', tone: 'wait', reply: 'Good question. Let me check with the listing broker and get back to you within the hour.' },
          { row: 'fair', value: 0, channel: 'via web chat', trigger: 'Is it a good area for families like mine?', action: 'Talks about the home, schools and commute. Never about who lives nearby.', result: 'Fair Housing rule applied', tone: 'shield', reply: 'I can’t speak to who lives in the area, but I can send you the schools, the commute and the parks nearby. Want the list?' },
          { row: 'stop', value: 0, channel: 'via text', trigger: 'STOP', action: 'Confirms once and never texts again.', result: 'Opted out · follow-ups cancelled', tone: 'stop', reply: 'Got it. You won’t hear from us again.' },
          { row: 'handoff', value: 0, channel: 'via text', trigger: 'We’re pre-approved. Can we see it Saturday?', action: 'Books the tour and hands the lead to the right broker, with the full history.', result: 'Tour booked · Marcus has the history', tone: 'ok', reply: 'Saturday at 11 works. You’re booked with Marcus, and he has our whole conversation, so no need to repeat yourself.' },
          { row: 'looking', value: 0, channel: 'via Zillow', trigger: 'Just looking for now.', action: 'Sends a few homes that match and checks back in two weeks.', result: 'Nurture · next touch in 14 days', tone: 'wait', reply: 'No rush at all. I’ll send a few homes like this one and check back in two weeks. Sound good?' },
          { row: 'broker', value: 0, channel: 'via text', trigger: 'I already have a broker.', action: 'Thanks them and steps back. No pressure, no follow-ups.', result: 'Marked: working with a broker', tone: 'stop', reply: 'Thanks for letting us know, and good luck with the search!' },
          { row: 'high', value: 0, channel: 'via text', trigger: 'The price is too high for us.', action: 'Asks their range and suggests homes that fit it.', result: '3 homes in range sent', tone: 'ok', reply: 'Understood. What range feels right? I’ll send homes nearby that fit it.' },
          { row: 'preapp', value: 0, channel: 'on a call', trigger: 'We’re not pre-approved yet.', action: 'Offers an intro to a lender you work with.', result: 'Lender intro requested', tone: 'ok', reply: 'No problem. We work with a great local lender. Want me to set up a quick intro?' },
        ],
        note: 'An example playbook. Rules, names and replies are illustrative.',
      },
      // After the first reply: what Aurora keeps doing for a lead over the following weeks, and the KPI Agent that
      // measures it. Every name, message and change is illustrative.
      after: {
        eyebrow: 'After the first reply',
        titleA: 'The first reply is day one.',
        titleB: 'Aurora keeps every lead moving.',
        text: 'Most buyers aren’t ready this week. Aurora reminds, follows up, revives and books, on your rules, until they are.',
        // one card per job, each drawn as the thing it is (a lock-screen reminder, listings, a CRM row, a booking)
        steps: [
          {
            key: 'remind', when: 'Day 1', title: 'Showing reminders', text: 'Confirms the tour and reminds the buyer the day before.',
            app: 'Harbor Lane Realty', clock: '8:02', date: 'Friday, October 17',
            msg: 'Reminder: tomorrow at 11 am, 18 Willow Court with Marcus. Reply C to confirm.', reply: 'C', result: 'Confirmed',
          },
          {
            key: 'nurture', when: 'Week 2', title: 'Leads not ready yet', text: 'Sends homes that match and checks in on the timing they gave.',
            msg: 'Two new homes in your range just listed near Oak Park. Want to see either one?',
            homes: [
              { image: '/media/real-estate/listing-birch-600.webp', price: '$452K', meta: '3 bd · 2 ba' },
              { image: '/media/real-estate/listing-oak-600.webp', price: '$478K', meta: '4 bd · 3 ba' },
            ],
            pick: 1, result: 'Tour requested',
          },
          {
            key: 'revive', when: 'Month 3', title: 'Old leads, back to life', text: 'Works through the leads in your CRM that went quiet.',
            name: 'Dan Morales', initials: 'DM', before: 'Last contact 94 days ago', after: 'Replied just now', cold: 'Cold', active: 'Active',
            msg: 'Hi Dan, are you still thinking about a move this spring?', reply: 'Yes, probably April.',
          },
          {
            key: 'seller', when: 'Any day', title: 'Seller leads', text: 'Qualifies homeowners and books the listing appointment.',
            address: '214 Cedar Lane', tag: 'Home valuation', msg: 'Marcus can come by on Thursday. Which time works?',
            slots: ['Thu 3:00', 'Thu 5:00', 'Fri 10:00'], pick: 1, result: 'Listing appointment booked',
          },
        ],
        kpi: {
          badge: 'Patented KPI Agent',
          title: 'And it gets better every week.',
          text: 'It measures Aurora against your numbers, like speed to lead, showings and no-shows, and improves how it works. Bigger changes wait for your approval.',
          steps: [
            { tag: 'Measured', text: 'No-shows rose on Saturday showings.' },
            { tag: 'Cause found', text: 'Reminders went out by email. Buyers read texts.' },
            { tag: 'Fix suggested', text: 'A text reminder two hours before.', who: 'Approved by Marcus' },
            { tag: 'Improved', text: 'No-shows back on target. The change is logged.' },
          ],
        },
        note: 'An example. Names, messages and the change are illustrative.',
      },
      // the closing call to action, for a brokerage
      closing: {
        titleA: 'Send us one listing.',
        titleB: 'Hear Aurora answer a buyer about it.',
        text: 'Share one of your listings. We set Aurora up on it, and you hear it answer a buyer, qualify them and book the showing.',
      },
      faqMore: { text: 'Want the full picture of how Aurora works?', link: 'See the platform', href: '/platform' },
    },
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
    faq: [
      ['What is an AI ISA for real estate?', 'An AI ISA (inside sales agent) answers and qualifies a brokerage’s leads the way a human ISA does, by phone, text, chat and email. Aurora replies to every new lead in seconds, asks about budget, timing and area, books the showing or listing appointment with the right broker and follows up until the lead is ready.'],
      ['How fast does Aurora reply to a new lead?', 'Within seconds, on the channel the lead came from, at any hour. A portal inquiry at 9:47 pm gets an answer at 9:47 pm, not the next morning.'],
      ['Can Aurora book showings in my brokers’ calendars?', 'Yes. During setup Aurora is connected to your brokers’ calendars and your routing rules, so it books the showing with the right broker, sends the confirmation and address, and reminds the client the day before.'],
      ['Does Aurora work with our CRM and lead sources?', 'Aurora works inside the systems your team already uses. During setup it is connected to your CRM, such as HubSpot or Salesforce, your lead sources and your brokers’ Google or Outlook calendars, and every conversation is logged to the lead’s record.'],
      ['Will Aurora quote prices or negotiate?', 'Only within the rules you set. You can tell it never to quote a final price and to offer a showing or a call with a broker instead. Anything outside your rules goes to a broker for approval.'],
      ['What happens when a lead is ready to talk to a broker?', 'Aurora hands the lead to the right broker with the full conversation, and your team can step into any conversation at any moment.'],
      FAQ_CHANNELS,
      FAQ_LIVE,
      ['How much does Aurora cost for a brokerage?', 'Aurora is priced for each brokerage. The price depends on what Aurora takes on, from new leads to follow-up and showings, the channels it covers and the systems it connects to. We map your process first, then send a proposal based on that plan.'],
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
