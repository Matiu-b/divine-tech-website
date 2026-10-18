// Home services page: five scenes, each one screen. Aurora out front with customers and behind the scenes with the team
// (field technicians, freelancers, the office). The company, people and figures are illustrative.

const PHOTOS = '/img/photos/';

export const hsHero = {
  eyebrow: 'Aurora for home services',
  titleA: 'Your team is on a job.',
  titleB: 'Aurora runs the rest.',
  text: 'Out front, Aurora answers every call, quotes from your price book and books the technician. Behind the scenes, it plans the routes, checks freelancer invoices and briefs the owner.',
  textShort: 'Aurora answers every call and books the job. Behind the scenes, it runs the office.',
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
  // over the photo: the same moment, out front and behind the scenes (the moments of the day further down the page)
  panel: { title: 'Aurora at Northline', working: 'Working on it' },
  sides: { customers: 'For a customer', team: 'For your team' },
  moments: [
    {
      time: '9:00 am',
      customers: { icon: 'service', title: 'Call answered', detail: 'AC not cooling, booked for 1 pm' },
      team: { icon: 'report', title: 'Routes set for 14 techs', detail: 'Grouped by area and skill' },
    },
    {
      time: '10:15 am',
      customers: { icon: 'send', title: 'Quote sent', detail: 'Water heater, from your price book' },
      team: { icon: 'invoice', title: 'Invoice held for Dana', detail: '6 h billed, 4.5 h on site' },
    },
    {
      time: '12:40 pm',
      customers: { icon: 'message', title: 'On-the-way text sent', detail: 'Jake arrives in 12 minutes' },
      team: { icon: 'crm', title: 'Part found for Mike', detail: 'Van 7, six minutes away' },
    },
    {
      time: '2:10 pm',
      customers: { icon: 'calendar', title: 'Visit moved, confirmed', detail: 'Pine Ave, now 4:45 pm' },
      team: { icon: 'approval', title: 'Route reshuffled', detail: 'A job ran an hour long' },
    },
    {
      time: '4:55 pm',
      customers: { icon: 'mail', title: 'Review request sent', detail: 'After the job, with photos' },
      team: { icon: 'report', title: 'Day summary to Dana', detail: '39 jobs, 1 needs her OK' },
    },
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
      media: { poster: '/media/home-services/hear-customer-2-1400.webp', srcSet: '/media/home-services/hear-customer-2-900.webp 900w, /media/home-services/hear-customer-2-1400.webp 1400w', video: null, focus: '50% 40%' },
      call: {
        audio: '/media/home-services/call-customer-2.mp3',
        duration: 55040,
        title: 'Customer call',
        meta: 'Sound on',
        listen: 'Hear the call',
        again: 'Hear it again',
        pause: 'Pause the call',
        resume: 'Resume the call',
        caller: 'Customer',
        wave: [0.77, 0.66, 0.43, 0.66, 0.68, 0.74, 0.17, 0.19, 0.67, 0.16, 0.69, 0.45, 0.34, 0.61, 0.58, 0.64, 0.85, 0.32, 0.56, 0.67, 0.16, 1.0, 0.71, 0.64, 0.68, 0.69, 0.43, 0.8, 0.59, 0.2, 0.38, 0.2, 0.42, 0.76, 0.8, 0.73, 0.73, 0.44, 0.17, 0.47, 0.49, 0.3, 0.49, 0.72, 0.16, 0.61, 0.32, 0.35, 0.51, 0.54, 0.2, 0.65, 0.78, 0.68, 0.41, 0.14, 0.79, 0.48, 0.42, 0.32, 0.37, 0.27, 0.55, 0.52, 0.23, 0.69, 0.69, 0.21, 0.7, 0.43, 0.72, 0.6, 0.7, 0.35, 0.23, 0.43, 0.21, 0.4, 0.42, 0.14, 0.33, 0.5, 0.79, 0.46, 0.24, 0.49, 0.69, 0.7, 0.38, 0.76, 0.56, 0.64, 0.3, 0.29, 0.83, 0.17],
        captions: [
          { who: "aurora", at: 0, end: 3660, text: "Northline Home Services, this is Aurora, the AI assistant.", words: [0, 620, 860, 1840, 1980, 2180, 2860, 2920, 3280], cue: "warm, calm" },
          { who: "aurora", at: 4240, end: 5140, text: "How can I help tonight?", words: [0, 180, 320, 440, 620] },
          { who: "lead", at: 5680, end: 11620, text: "Hi, yes. Our AC stopped cooling about an hour ago, and it’s getting pretty warm in here.", words: [0, 540, 1520, 1680, 1940, 2360, 2700, 3000, 3240, 3500, 4060, 4240, 4600, 4820, 5200, 5500, 5680], cue: "calm, a little tired" },
          { who: "lead", at: 11960, end: 15160, text: "We have a baby at home, so I’d rather not wait too long.", words: [0, 200, 320, 460, 640, 900, 1320, 1540, 2000, 2200, 2460, 2660, 2880] },
          { who: "aurora", at: 15640, end: 17820, text: "I understand. Let’s get that sorted.", words: [0, 200, 1300, 1600, 1720, 1920], cue: "concerned, steady" },
          { who: "aurora", at: 18480, end: 21420, text: "Is the outdoor unit running at all, or is it quiet?", words: [0, 220, 400, 780, 1120, 1380, 1580, 1940, 2300, 2520, 2680] },
          { who: "lead", at: 22040, end: 25260, text: "It’s quiet, I think. I don’t hear anything.", words: [0, 420, 1140, 1300, 2160, 2400, 2560, 2780], cue: "uncertain" },
          { who: "aurora", at: 25820, end: 28540, text: "Okay, that’s often a tripped breaker.", words: [0, 860, 1480, 1840, 2000, 2300] },
          { who: "aurora", at: 29100, end: 31380, text: "Could you check the panel for a switch marked AC?", words: [0, 140, 300, 480, 640, 900, 1160, 1320, 1560, 1900], cue: "gently" },
          { who: "lead", at: 32200, end: 34900, text: "No, it looks fine. Nothing’s tripped.", words: [0, 680, 900, 1040, 1940, 2280] },
          { who: "aurora", at: 35260, end: 36500, text: "Then it’s a job for a tech.", words: [0, 240, 440, 540, 700, 900, 1100], cue: "confident" },
          { who: "aurora", at: 37220, end: 38660, text: "Jake can be there first thing at eight…", words: [0, 40, 220, 380, 560, 820, 1040, 1180], cue: "brightening" },
          { who: "aurora", at: 39020, end: 43400, text: "or tonight, with a $120 after-hours fee. Which works better?", words: [0, 260, 840, 1080, 1200, 1900, 2860, 3600, 3800, 4040] },
          { who: "lead", at: 44280, end: 45100, text: "Tonight, please.", words: [0, 400], cue: "relieved" },
          { who: "aurora", at: 45900, end: 47920, text: "Done. Jake will be there by 9:15.", words: [0, 860, 900, 1060, 1200, 1400, 1560], cue: "upbeat" },
          { who: "aurora", at: 48460, end: 50540, text: "I’ll text you his photo and a live ETA.", words: [0, 200, 360, 520, 700, 1020, 1320, 1460, 1700] },
          { who: "aurora", at: 51200, end: 51880, text: "Hang in there.", words: [0, 160, 340], cue: "warm" },
          { who: "lead", at: 52480, end: 54400, text: "Great. Thank you so much.", words: [0, 820, 1000, 1180, 1560], cue: "grateful" },
        ],
        notes: [
          { at: 0, text: 'Phone · After hours · New call' },
          { at: 5680, text: 'CRM · New customer · AC not cooling' },
          { at: 25820, text: 'Troubleshooting · Breaker checked' },
          { at: 39020, text: 'Quote · After-hours fee $120' },
          { at: 45900, text: 'Dispatch · Jake · 9:15 pm · ETA texted' },
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
        audio: '/media/home-services/call-brief-2.mp3',
        duration: 43310,
        title: 'Morning brief',
        meta: 'Sound on',
        listen: 'Hear the brief',
        again: 'Hear it again',
        pause: 'Pause the brief',
        resume: 'Resume the brief',
        caller: 'Dana · Owner',
        wave: [0.71, 0.74, 0.18, 0.65, 0.54, 0.25, 0.14, 1.0, 0.42, 0.15, 0.72, 0.25, 0.14, 0.5, 0.23, 0.61, 0.35, 0.35, 0.35, 0.68, 0.23, 0.66, 0.64, 0.49, 0.38, 0.15, 0.5, 0.53, 0.71, 0.5, 0.14, 0.59, 0.49, 0.61, 0.3, 0.54, 0.42, 0.65, 0.44, 0.21, 0.5, 0.79, 0.47, 0.16, 0.73, 0.25, 0.64, 0.57, 0.65, 0.53, 0.31, 0.69, 0.66, 0.66, 0.18, 0.58, 0.71, 0.15, 0.71, 0.96, 0.83, 0.25, 0.65, 0.75, 0.4, 0.14, 0.76, 0.15, 0.6, 0.6, 0.35, 0.68, 0.17, 0.56, 0.51, 0.57, 0.35, 0.52, 0.57, 0.58, 0.33, 0.43, 0.4, 0.6, 0.19, 0.77, 0.74, 0.66, 0.14, 0.45, 0.51, 0.59, 0.64, 0.24, 0.66, 0.35],
        captions: [
          { who: "aurora", at: 0, end: 2580, text: "Good morning, Dana. Here’s your eight o’clock brief.", words: [0, 240, 780, 1380, 1660, 1780, 1980, 2300], cue: "bright, warm" },
          { who: "lead", at: 3400, end: 5100, text: "Morning. Go ahead.", words: [0, 1040, 1300], cue: "sleepy" },
          { who: "aurora", at: 6180, end: 11240, text: "Yesterday, 39 jobs done, and 12 new requests came in overnight. All booked.", words: [0, 400, 840, 1140, 1600, 2100, 2460, 2760, 3120, 3420, 3580, 4440, 4720], cue: "upbeat" },
          { who: "aurora", at: 11740, end: 13400, text: "Two of them are furnace installs.", words: [0, 200, 340, 560, 760, 1160], cue: "proud" },
          { who: "aurora", at: 14100, end: 17620, text: "Routes are set for 14 techs, and Mike’s part is waiting in van 7.", words: [0, 40, 240, 420, 640, 1020, 1640, 1880, 2260, 2380, 2560, 2820, 3040, 3180], cue: "matter-of-fact" },
          { who: "aurora", at: 18080, end: 19280, text: "One thing needs you.", words: [0, 360, 560, 820], cue: "serious, lowering her voice" },
          { who: "aurora", at: 19960, end: 24260, text: "Rivera billed six hours on job 405, but he was on site four and a half.", words: [0, 20, 420, 740, 1140, 1420, 1580, 2660, 2840, 2980, 3080, 3260, 3480, 3820, 3980, 4060] },
          { who: "aurora", at: 24740, end: 25580, text: "I’ve held the invoice.", words: [0, 260, 400, 540] },
          { who: "lead", at: 26080, end: 29060, text: "Pay the four and a half, and ask him about the rest.", words: [0, 180, 360, 600, 720, 860, 1260, 1860, 2120, 2280, 2520, 2680], cue: "thoughtful" },
          { who: "aurora", at: 29060, end: 30220, text: "Will do.", words: [0, 840], cue: "warm" },
          { who: "aurora", at: 30700, end: 36200, text: "And Ana asked for Friday off. Her jobs fit on Jake’s route, so I approved it under your rule.", words: [0, 300, 680, 960, 1160, 1420, 2260, 2360, 2560, 2800, 3000, 3320, 3760, 3980, 4240, 4520, 4740, 4940, 5160], cue: "lighter" },
          { who: "lead", at: 36920, end: 39620, text: "That’s great. What would I do without you?", words: [0, 180, 1360, 1500, 1640, 1780, 2000, 2300], cue: "amused" },
          { who: "aurora", at: 40200, end: 42840, text: "Drink your coffee in peace. Have a good day.", words: [0, 160, 420, 720, 1000, 1980, 2080, 2200, 2320], cue: "playful" },
        ],
        notes: [
          { at: 0, text: 'Brief · 8:00 am · to Dana' },
          { at: 6180, text: 'Jobs · 39 done · 12 booked overnight' },
          { at: 14100, text: 'Routes · 14 techs · part in van 7' },
          { at: 19960, text: 'Invoice #2291 · held · 6.0 h vs 4.5 h' },
          { at: 26080, text: 'Invoice · paid for 4.5 h · Rivera asked' },
          { at: 30700, text: 'Time off · Ana · Fri · approved by rule' },
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
