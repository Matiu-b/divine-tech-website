// Home services page: five scenes, each one screen. Aurora out front with customers and behind the scenes with the team
// (field technicians, freelancers, the office). The company, people and figures are illustrative.

const PHOTOS = '/img/photos/';

export const hsHero = {
  eyebrow: 'Aurora for home services',
  titleA: 'Your team is on a job.',
  titleB: 'Aurora runs the rest.',
  text: 'Out front, Aurora answers every call, quotes from your price book and books the technician. Behind the scenes, it plans the routes, checks freelancer invoices and briefs the owner.',
  textShort: 'Aurora answers every call and books the job. Behind the scenes, it plans routes, checks invoices and briefs the owner.',
  secondary: 'Hear Aurora',
  secondaryHref: '#hear',
  lanes: { customers: 'Customer', team: 'Team' },
  media: {
    poster: PHOTOS + 'tech-hvac-1440.webp',
    srcSet: PHOTOS + 'tech-hvac-640.webp 640w, ' + PHOTOS + 'tech-hvac-960.webp 960w, ' + PHOTOS + 'tech-hvac-1440.webp 1440w',
    video: null,
    focus: '34% 50%',
    alt: 'A home-services technician checking readings on a tablet beside an outdoor AC unit, his van behind him',
  },
  // the live feed over the photo: one for a customer, one for the team, in turn
  events: [
    { lane: 'customers', icon: 'service', title: 'Call answered', detail: 'AC not cooling, after hours' },
    { lane: 'team', icon: 'report', title: 'Routes set for 14 techs', detail: 'Grouped by area and skill' },
    { lane: 'customers', icon: 'send', title: 'Quote sent', detail: 'From your price book' },
    { lane: 'team', icon: 'invoice', title: 'Freelancer invoice checked', detail: 'Hours matched to time on site' },
    { lane: 'customers', icon: 'calendar', title: 'Technician booked', detail: 'Today 1 to 3 pm, Jake' },
    { lane: 'team', icon: 'approval', title: 'Time off approved', detail: 'Jobs moved to Jake’s route' },
    { lane: 'customers', icon: 'mail', title: 'Review request sent', detail: 'After the job, with photos' },
    { lane: 'team', icon: 'crm', title: 'Part found for a tech', detail: 'Van 7, six minutes away' },
  ],
};

export const hsHear = {
  titleA: 'Hear Aurora at work.',
  text: 'The same voice on the phone with your customers at night and with the owner every morning. Press play on either.',
  textShort: 'With a customer at night, with the owner every morning. Press play.',
  note: 'Recorded examples with an AI voice. The company and people are illustrative.',
  team: 'What your team sees',
  calls: [
    {
      key: 'customer',
      tab: 'With a customer',
      tabShort: 'Customer',
      name: 'An after-hours call',
      sentence: 'An AC dies at 8:40 pm. Aurora checks the easy fix, quotes the after-hours fee and books a tech for tonight.',
      media: { poster: '/media/home-services/hear-customer-1400.webp', srcSet: '/media/home-services/hear-customer-900.webp 900w, /media/home-services/hear-customer-1400.webp 1400w', video: null, focus: '50% 40%' },
      call: {
        audio: '/media/home-services/call-customer.mp3',
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
      tabShort: 'Your team',
      name: 'The morning brief',
      sentence: 'At 8 am the owner hears the night in a minute: what got booked, which invoice was held, and who’s off Friday.',
      media: { poster: '/media/home-services/hear-brief-1400.webp', srcSet: '/media/home-services/hear-brief-900.webp 900w, /media/home-services/hear-brief-1400.webp 1400w', video: null, focus: '50% 40%' },
      call: {
        audio: '/media/home-services/call-brief.mp3',
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

export const hsDay = {
  titleA: 'One AI teammate, from 9 to 5.',
  text: 'A day at a company with 14 technicians in the field and a bench of freelancers. Some of the work faces customers. Most of it runs the company.',
  textShort: 'A day with 14 technicians and a bench of freelancers. Most of the work runs the company.',
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

export const hsLive = {
  titleA: 'Live in hours, under your rules.',
  text: 'No technical project on your side. Aurora works inside your phone, calendar and field service software, and nothing goes live until you approve it.',
  textShort: 'No technical project on your side, and nothing goes live until you approve it.',
  more: { label: 'See the platform', href: '/platform' },
  labels: { prev: 'Previous step', next: 'Next step' },
  steps: [
    { key: 'map', who: 'Our experts, with you', name: 'We map your company', sentence: 'One working session turns how your office runs today into a plan: which jobs Aurora takes, and what each should change.' },
    { key: 'connect', who: 'Aurora', name: 'Aurora connects your tools', sentence: 'Phone, texts, email, calendar, your field service software and payments. It works inside them, so nobody learns a new system.' },
    { key: 'rules', who: 'You approve', name: 'Your rules, then go live', sentence: 'You set the limits and who approves what. Every action is logged, and you switch it on when the tests pass.' },
  ],
  rules: [
    { text: 'Discounts above 5%', who: 'Manager approves' },
    { text: 'Freelancer invoices over $1,500', who: 'Owner approves' },
    { text: 'Time off with cover found', who: 'Aurora approves' },
    { text: 'Refunds', who: 'Always a person' },
  ],
  // the map drawn in step 1, in this company's words
  board: { title: 'How Northline works', sourceLabels: ['Calls', 'Texts', 'Jobs', 'Invoices'], nodeLabels: ['New job', 'Quote', 'Dispatch tech', 'Owner OK', 'Invoice & pay'] },
  log: 'Every action logged · Who, what and why',
  live: { off: 'Approve and go live', on: 'Live' },
};

export const hsClosing = {
  titleA: 'Ready to scale with us?',
  titleB: 'Book a demo.',
  text: 'Aurora answers your customers and runs the office behind them, so the team you have handles more jobs. Bring one real process and watch it work.',
  next: [
    { time: 'Now', text: 'Leave your details' },
    { time: 'Minutes later', text: 'Aurora calls you, so you hear it first-hand' },
    { time: 'Within days', text: 'We map one of your processes together' },
  ],
};
