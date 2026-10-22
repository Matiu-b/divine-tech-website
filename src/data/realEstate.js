// Real estate page (v3, components/industry/RealEstateV3.jsx): only what is specific to real estate; the home and platform
// pages tell the rest. Times are illustrative. Imported by the real estate page only, so it stays out of the code every
// page loads (the nav, footer and home cards read the light fields in industries.js).

export const realEstate = {
  hero: {
    eyebrow: 'Aurora for real estate',
    titleA: 'The AI ISA for',
    titleB: 'real estate brokerages.',
    text: 'Aurora answers every lead from portals, ads, calls and texts in seconds, qualifies it, books the showing with the right broker and keeps every deal moving. Your brokers just sell.',
    // phones: the same promise in one line, so the call card fits on the first screen
    textShort: 'Aurora answers every lead in seconds, qualifies it and books the showing. Your brokers just sell.',
    // The listing from the call, and the call itself: a buyer phones about it at night and Aurora answers. Recorded in ElevenLabs v4;
    // `at` / `end` are where each caption starts and ends in the recording (ms), `words` when each
    // word is spoken, from the start of its caption. Names, prices and times are illustrative.
    film: {
      image: {
        src: '/media/real-estate/house-4-1600.webp',
        srcSet: '/media/real-estate/house-4-900.webp 900w, /media/real-estate/house-4-1200.webp 1200w, /media/real-estate/house-4-1600.webp 1600w, /media/real-estate/house-4-2000.webp 2000w',
      },
      // the same scene, alive: a young couple walks up the sidewalk and stops at the For Sale sign, pointing at the house.
      // It plays once and holds on them there (locked-off camera)
      video: '/media/real-estate/house-4-couple.mp4',
      poster: '/media/real-estate/house-4-couple-poster.webp',
      once: true,
      alt: 'The Maple Street listing at dusk: a craftsman house with a two-car garage, a fenced backyard and a For Sale sign on the lawn',
    },
    call: {
      audio: '/media/real-estate/call-c.mp3',
      duration: 62580,
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
        { label: 'Book', at: 52330 },
      ],
      // what Aurora records while she talks, shown as it happens
      notes: [
        { at: 34200, title: 'Pre-approved', detail: 'Up to $550K' },
        { at: 53970, title: 'Showing booked', detail: 'Sat 11:00 am · with Jess' },
        { at: 58670, title: 'Text sent', detail: 'Address and broker contact' },
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
        { who: 'aurora', at: 44740, end: 50550, text: "Jess, the listing broker, has Saturday at eleven... or Sunday at two. Which works better?", words: [0, 260, 540, 860, 1180, 1560, 1940, 2220, 3210, 3340, 3700, 4160, 5040, 5320, 5560] },
        { who: 'buyer', at: 50930, end: 52330, text: "Saturday at eleven works.", words: [0, 380, 700, 1020] },
        { who: 'aurora', at: 52330, end: 55690, text: "Done! You're booked with Jess, Saturday at eleven.", words: [0, 1380, 1580, 1760, 1980, 2840, 2840, 3120] },
        { who: 'aurora', at: 56250, end: 59670, text: "I'll text you the address and her number right now. See you Saturday!", words: [0, 240, 420, 640, 760, 1060, 1380, 1540, 1780, 2080, 2940, 3020, 3140] },
        { who: 'buyer', at: 60350, end: 61970, text: "Great... thanks, Aurora.", words: [0, 980, 1480] },
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
      { key: 'looking', group: 'obj', label: '“Just looking”', values: ['Follow up'] },
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
      { row: 'handoff', value: 0, channel: 'via text', trigger: 'We’re pre-approved. Can we see it this weekend?', action: 'Books the tour and hands the lead to the right broker, with the full history.', result: 'Tour booked · Marcus has the history', tone: 'ok', reply: 'Sunday at 2 works. You’re booked with Marcus, and he has our whole conversation, so no need to repeat yourself.' },
      { row: 'looking', value: 0, channel: 'via Zillow', trigger: 'Just looking for now.', action: 'Sends a few homes that match and checks back in two weeks.', result: 'In follow-up · next touch in 14 days', tone: 'wait', reply: 'No rush at all. I’ll send a few homes like this one and check back in two weeks. Sound good?' },
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
    text: 'Most buyers aren’t ready on day one. Here’s how Aurora brought one back, from a single call to the closing table.',
    // One lead's journey in three steps: the call that brought her back, the showing, the closing.
    // Emma is the buyer from the speed-to-lead section; Marcus is the broker there too. Illustrative.
    lead: { name: 'Emma Clarke', initials: 'EC', intro: 'Asked about 18 Willow Court in March, then went quiet' },
    labels: { team: 'What your team sees', prev: 'Previous step', next: 'Next step', you: 'Aurora', text: 'Text', locked: 'Hear the call first' },
    steps: [
      {
        key: 'call', name: 'Reactivation call', date: 'Jun 2', icon: 'phone',
        media: { video: '/media/real-estate/emma-desk.mp4', poster: '/media/real-estate/emma-desk-poster.webp', focus: '50% 22%' },
        happened: 'Two months silent. One AI call, two objections handled, a tour booked.',
        call: {
          audio: '/media/real-estate/emma-call-2.mp3',
          duration: 72910,
          title: 'Aurora calls Emma',
          meta: 'Sound on',
          listen: 'Hear Aurora’s call',
          again: 'Hear it again',
          sound: 'Sound on',
          pause: 'Pause the call',
          resume: 'Resume the call',
          caller: 'Emma',
          // without sound the step shows these moments of the call; with sound, every line as it is spoken
          moments: [8, 10, 16],
          momentLabels: ['Objection', 'Answer', 'Booked'],
          prompt: 'Three moments from the call. Press play to hear all of it.',
          // the recording's loudness in 96 slices, for the waveform
          wave: [0.63,  0.49,  0.76,  0.77,  0.59,  0.68,  0.45,  0.93,  0.19,  0.34,  0.51,  0.29,  0.14,  0.22,  0.47,  0.3,  0.23,  0.61,  0.23,  0.83,  0.71,  0.83,  0.41,  0.91,  0.54,  0.79,  0.64,  0.75,  0.17,  0.69,  1.0,  0.6,  0.25,  0.73,  0.45,  0.61,  0.72,  0.14,  0.65,  0.78,  0.48,  0.64,  0.46,  0.51,  0.6,  0.73,  0.21,  0.75,  0.63,  0.54,  0.69,  0.67,  0.61,  0.53,  0.31,  0.86,  0.73,  0.15,  0.51,  0.63,  0.62,  0.71,  0.36,  0.43,  0.66,  0.65,  0.28,  0.63,  0.62,  0.61,  0.72,  0.81,  0.31,  0.68,  0.67,  0.31,  0.5,  0.23,  0.76,  0.68,  0.15,  0.63,  0.37,  0.4,  0.69,  0.59,  0.75,  0.42,  0.81,  0.59,  0.67,  0.56,  0.81,  0.64,  0.44,  0.7],
          captions: [
          {who: "aurora", at: 0, end: 4240, text: "Hi, Emma. It's Aurora, the AI assistant at Harbor Lane Realty.", words: [0, 720, 1300, 1500, 2320, 2360, 2680, 3040, 3380, 3620, 3880]},
          {who: "aurora", at: 4840, end: 6100, text: "Is now an okay time?", words: [0, 220, 560, 700, 900]},
          {who: "lead", at: 6560, end: 8780, text: "Oh, hi. I'm at work. One sec.", words: [0, 440, 1160, 1300, 1380, 1900, 2020], cue: "whispering"},
          {who: "lead", at: 10280, end: 12400, text: "Okay, I stepped out. Go ahead.", words: [0, 680, 940, 1140, 1720, 1880]},
          {who: "aurora", at: 12980, end: 16400, text: "Thanks, Emma. You asked about Willow Court back in March,", words: [0, 460, 1220, 1440, 1680, 1980, 2280, 2560, 2840, 3060]},
          {who: "aurora", at: 16960, end: 21300, text: "and a three-bedroom just listed two streets away, with the big yard you wanted.", words: [0, 280, 480, 1140, 1460, 1860, 2160, 2500, 2840, 3220, 3400, 3580, 3820, 4000]},
          {who: "aurora", at: 21900, end: 23980, text: "Are you still thinking about a move this summer?", words: [0, 160, 340, 620, 980, 1260, 1420, 1540, 1820]},
          {who: "lead", at: 25400, end: 27940, text: "Honestly? We kind of put it on hold.", words: [0, 560, 1120, 1480, 1660, 1840, 1980, 2140], cue: "sighs"},
          {who: "lead", at: 27940, end: 32780, text: "We’d have to sell our condo first, and the timing just feels… impossible.", words: [0, 840, 960, 1140, 1300, 1600, 1840, 2640, 2820, 2940, 3240, 3500, 3980]},
          {who: "aurora", at: 33560, end: 37660, text: "That makes total sense. Most of our buyers are selling at the same time.", words: [0, 40, 320, 700, 1820, 2040, 2260, 2400, 2680, 2900, 3120, 3300, 3420, 3600], cue: "calm"},
          {who: "aurora", at: 38300, end: 43420, text: "Marcus can value your condo and line up the sale with the purchase, so you’re not paying for two places.", words: [0, 0, 280, 600, 840, 1240, 1620, 1840, 2000, 2160, 2380, 2580, 2720, 3240, 3580, 3820, 3940, 4180, 4420, 4620]},
          {who: "lead", at: 44060, end: 47380, text: "Hm. And how fast would that even happen?", words: [0, 1080, 1340, 1720, 2100, 2380, 2540, 2800], cue: "skeptical"},
          {who: "aurora", at: 47960, end: 50400, text: "That’s exactly what the valuation tells you.", words: [0, 320, 760, 1120, 1260, 1640, 2080]},
          {who: "aurora", at: 50860, end: 54920, text: "Marcus could show you the house on Saturday… and stop by your condo right after.", words: [0, 300, 520, 720, 840, 960, 1140, 1340, 2160, 2520, 2800, 3000, 3160, 3460, 3660], cue: "building"},
          {who: "aurora", at: 55380, end: 56440, text: "Ten, or eleven?", words: [0, 240, 780]},
          {who: "lead", at: 58680, end: 60860, text: "Okay… eleven works.", words: [0, 1680, 1740], cue: "warming up"},
          {who: "aurora", at: 61620, end: 66040, text: "Perfect! You’re booked with Marcus, Saturday at eleven, and your condo right after.", words: [0, 860, 1060, 1180, 1400, 2120, 2280, 2620, 3140, 3340, 3500, 3820, 4140], cue: "excited"},
          {who: "aurora", at: 66520, end: 67660, text: "I’ll text you the address now!", words: [0, 120, 280, 460, 580, 800]},
          {who: "lead", at: 68140, end: 72360, text: "Okay… now I’m actually excited. Thanks, Aurora!", words: [0, 1520, 1820, 2120, 2560, 3680, 4060], cue: "laughs"},
          ],
          // what the brokerage sees as the call goes
          notes: [
            { at: 0, text: 'CRM · Cold lead · Calling now' },
            { at: 27940, text: 'CRM · Objection: condo to sell' },
            { at: 38300, text: 'CRM · Seller lead · Valuation offered' },
            { at: 61620, text: 'Calendar · Sat 11:00 · Showing + valuation' },
          ],
        },
        team: 'CRM · Cold → Active · Showing Sat 11:00',
      },
      {
        key: 'showing', name: 'The showing', date: 'Jun 6', icon: 'calendar',
        media: { video: '/media/real-estate/emma-showing.mp4', poster: '/media/real-estate/emma-showing-poster.webp', focus: '50% 38%' },
        happened: 'Marcus walks in with the full call notes. The condo is valued the same day, and an offer goes in.',
        thread: [
          { who: 'aurora', text: 'Morning, Emma! Marcus will meet you at 12 Aspen Court at 11, then head over to your condo.' },
          { who: 'aurora', text: 'How did the house feel?' },
          { who: 'lead', text: 'We love it. Can Marcus write an offer today?' },
        ],
        team: 'CRM · Offer requested · Condo valued',
      },
      {
        key: 'closing', name: 'Closing day', date: 'Jul 24', icon: 'crm',
        media: { video: '/media/real-estate/emma-closing.mp4', poster: '/media/real-estate/emma-closing-poster.webp', focus: '50% 42%' },
        happened: 'A reminder on what to bring, keys in hand, and her condo sold the same month. Two deals from one quiet lead.',
        thread: [
          { who: 'aurora', text: 'Big day, Emma! Closing is at 2 at the title office. Bring your ID, and Marcus will have the keys.' },
          { who: 'lead', text: 'Signed! We have the keys!' },
          { who: 'aurora', text: 'Welcome home, Emma.' },
        ],
        team: 'CRM · 2 deals closed · Bought + sold',
      },
    ],
    kpi: {
      badge: 'Patented KPI Agent',
      title: 'Measured against your goals.',
      text: 'You set a goal for each part of the brokerage. Every week the KPI Agent measures Aurora against it and changes what holds a number back. Bigger changes wait for your approval.',
      goalLabel: 'Goal',
      legend: { goal: 'Your goal', now: 'This year', last: 'Last year' },
      since: 'Beating the goal since week',
      story: { cause: 'Cause found', change: 'Change made', result: 'Result' },
      result: 'Past the goal from week {n}, and well above last year.',
      weekLabel: 'Week',
      slipping: 'Slipping',
      note: 'An example. The goals, weekly figures and changes are illustrative.',
      weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
      // illustrative weekly values, 0 to 1 of the chart height: this year against the same weeks last year
      goals: [
        {
          key: 'sales', area: 'Sales', name: 'Showings booked', target: '12 a week', goal: 0.68,
          values: [0.5, 0.4, 0.34, 0.52, 0.66, 0.78, 0.88, 0.94],
          last: [0.42, 0.4, 0.44, 0.41, 0.45, 0.43, 0.47, 0.46],
          dip: 'Fewer showings booked than the same week last year.', cause: 'Buyers were asked when suits them, and many never answered.',
          change: { after: 2, text: 'Aurora offers two showing times in the first reply instead of asking when suits.' },
        },
        {
          key: 'followup', area: 'Follow-up', name: 'Follow-up replies', target: '3 in 10 leads', goal: 0.6,
          values: [0.46, 0.38, 0.32, 0.5, 0.63, 0.74, 0.84, 0.9],
          last: [0.36, 0.38, 0.35, 0.37, 0.4, 0.38, 0.41, 0.4],
          dip: 'Fewer leads answer their follow-up.', cause: 'Check-ins like “still looking?” rarely get a reply.',
          change: { after: 2, text: 'Follow-ups open with a new listing in the buyer’s range instead of a check-in.' },
        },
        {
          key: 'service', area: 'Service', name: 'Buyer satisfaction', target: '4.5 out of 5', goal: 0.74,
          values: [0.62, 0.58, 0.55, 0.5, 0.66, 0.8, 0.87, 0.93],
          last: [0.58, 0.6, 0.57, 0.59, 0.61, 0.6, 0.62, 0.6],
          dip: 'Buyer ratings slip below last year.', cause: 'Questions about offers waited until the next day for a broker.',
          change: { after: 3, text: 'Questions about offers go to a broker the same day.' },
        },
        {
          key: 'ops', area: 'Operations', name: 'Showings attended', target: '9 in 10', goal: 0.78,
          values: [0.66, 0.56, 0.48, 0.62, 0.74, 0.84, 0.9, 0.95],
          last: [0.6, 0.58, 0.62, 0.6, 0.61, 0.59, 0.63, 0.62],
          dip: 'More buyers miss their showings.', cause: 'Reminders went out by email. Buyers read texts.',
          change: { after: 2, text: 'Showing reminders move from email to a text two hours before.', who: 'Approved by Marcus' },
        },
        {
          key: 'docs', area: 'Documents', name: 'Signed before the tour', target: '9 in 10 tours', goal: 0.78,
          values: [0.5, 0.38, 0.52, 0.66, 0.8, 0.86, 0.92, 0.96],
          last: [0.3, 0.32, 0.31, 0.33, 0.32, 0.35, 0.34, 0.36],
          dip: 'Fewer agreements signed before the tour.', cause: 'The buyer agreement was sent on the day of the tour.',
          change: { after: 1, text: 'The buyer agreement goes out for e-signature with the showing confirmation.' },
        },
      ],
    },
    note: 'An example. Names, dates, homes and messages are illustrative.',
  },
  // the closing call to action, for a brokerage
  closing: {
    titleA: 'Ready to scale with us?',
    titleB: 'Book a demo.',
    text: 'Aurora answers, qualifies, books and follows up on every lead, so the brokers you have handle more deals. Bring one of your listings and hear it work.',
  },
  // the tools Aurora connects to, by kind, with their brand icons (shown only to name them); each kind ends in 'and more'
  stack: {
    titleA: 'Works with the tools',
    titleB: 'your brokerage runs on.',
    text: 'During setup Aurora is connected to your CRM, your lead sources and your brokers’ calendars. Leads keep arriving where they do now, and every conversation is logged to the lead’s record.',
    more: 'and more',
    groups: [
      {
        label: 'CRM',
        items: [
          { name: 'Follow Up Boss', icon: '/media/logos/followupboss-96.webp' },
          { name: 'BoldTrail (kvCORE)', icon: '/media/logos/boldtrail-96.webp' },
          { name: 'Lofty', icon: '/media/logos/lofty-96.webp' },
          { name: 'HubSpot', mark: 'hubspot' },
          { name: 'Salesforce', icon: '/img/logos/salesforce.svg' },
        ],
      },
      {
        label: 'Lead sources',
        items: [
          { name: 'Zillow', icon: '/media/logos/zillow-96.webp' },
          { name: 'Realtor.com', icon: '/media/logos/realtor-96.webp' },
          { name: 'Homes.com', icon: '/media/logos/homes-96.webp' },
        ],
      },
      {
        label: 'Calendars',
        items: [
          { name: 'Google Calendar', icon: '/img/logos/google-calendar.svg' },
          { name: 'Outlook', icon: '/img/logos/outlook.svg' },
        ],
      },
      {
        label: 'Phone systems',
        items: [
          { name: 'RingCentral', icon: '/img/logos/ringcentral.svg', wordmark: true },
          { name: '3CX', icon: '/img/logos/3cx.svg' },
        ],
      },
      {
        label: 'Email',
        items: [
          { name: 'Gmail', icon: '/img/logos/gmail.svg' },
          { name: 'Outlook', icon: '/img/logos/outlook.svg' },
        ],
      },
      {
        label: 'Channels',
        items: [
          { name: 'Phone', mark: 'phone' },
          { name: 'Text', glyph: 'text' },
          { name: 'WhatsApp', mark: 'whatsapp' },
          { name: 'Web chat', glyph: 'chat' },
        ],
      },
    ],
    languages: { label: 'Languages', items: ['English', 'Español'] },
    note: 'Product names and logos belong to their owners and are shown only to name the tools Aurora connects to.',
  },
  faqMore: { text: 'Want the full picture?', guide: 'Read our guide to AI lead follow-up for brokerages', link: 'see the platform', join: 'or', href: '/platform' },
};
