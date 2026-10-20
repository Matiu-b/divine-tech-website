// Wellness & Healthcare page (v3, like the real estate page): one boutique studio's story told across the page.
// Linen & Light, Chloe, Nina and every name, time, price and rule here are illustrative, and each section says so.

const M = '/media/wellness/';
const sizes = (name) => [900, 1400, 2000].map((w) => `${M}${name}-${w}.webp ${w}w`).join(', ');

// Until the recordings exist, captions are timed from the script at a speaking pace; the recordings replace them.
function draft(lines) {
  let at = 0;
  return lines.map(([who, text]) => {
    const words = text.split(' ');
    const cap = { who, at, end: at + words.length * 360, text, words: words.map((_, i) => i * 360) };
    at = cap.end + 600;
    return cap;
  });
}


const heroCaps = draft([
  ['aurora', 'Hi, thanks for calling Linen and Light. This is Aurora, the studio’s AI assistant. How can I help?'],
  ['lead', 'Hi! Um, I saw you on Instagram… I’ve never done Pilates. Is that okay?'],
  ['aurora', 'Totally okay. Most of our members started as complete beginners. Can I ask what got you interested?'],
  ['lead', 'Honestly? I sit at a desk all day, and my lower back is always stiff.'],
  ['aurora', 'That’s really common. I can’t give medical advice, but our instructors adapt every class to you.'],
  ['aurora', 'And if it’s real pain, it’s worth checking with your doctor first.'],
  ['aurora', 'For a first class, I’d suggest Reformer Foundations. It’s small, slow, and made for beginners.'],
  ['lead', 'That sounds perfect. When is it?'],
  ['aurora', 'Saturday at nine, or Monday at seven in the evening. Which works better?'],
  ['lead', 'Saturday at nine.'],
  ['aurora', 'Done! You’re booked with Nina, Saturday at nine.'],
  ['aurora', 'I’ll text you a short waiver and what to bring. Grip socks help, but we keep some at the desk.'],
  ['lead', 'Amazing. Thank you, Aurora!'],
]);
const heroEnd = heroCaps[heroCaps.length - 1].end;
const heroCall = {
  audio: M + 'call-chloe-1.mp3',
  duration: heroEnd,
  title: 'Aurora · AI voice agent',
  listing: 'Call about a first class',
  caller: 'Chloe',
  waiting: 'Aurora notes what she learns here',
  listen: 'Play the call',
  again: 'Play it again',
  prompt: 'A new client calls the studio after hours. Hear Aurora’s AI voice agent take the call.',
  sound: 'Sound on',
  pause: 'Pause the call',
  resume: 'Resume the call',
  stages: [
    { label: 'Greet', at: heroCaps[0].at },
    { label: 'Get to know', at: heroCaps[2].at },
    { label: 'Recommend', at: heroCaps[6].at },
    { label: 'Book', at: heroCaps[8].at },
  ],
  notes: [
    { at: heroCaps[3].end, title: 'New to Pilates', detail: 'Desk job · wants an easy start' },
    { at: heroCaps[10].at, title: 'Intro class booked', detail: 'Sat 9:00 am · with Nina' },
    { at: heroCaps[11].at, title: 'Text sent', detail: 'Waiver and what to bring' },
  ],
  captions: heroCaps,
  note: 'An example call. Names, classes and times are illustrative.',
};

const winCaps = draft([
  ['aurora', 'Hi, Chloe. It’s Aurora, the AI assistant at Linen and Light. Is now an okay time?'],
  ['lead', 'Oh, hi! Yeah, I have a minute.'],
  ['aurora', 'We’ve missed you on the reformer. It’s been about three weeks since your last class.'],
  ['lead', 'I know… work got crazy, and the early classes just stopped working for me.'],
  ['aurora', 'That makes total sense. Would weekends be easier?'],
  ['lead', 'Weekends, yeah. Saturday mornings, maybe.'],
  ['aurora', 'Then you’ll like this. Nina has Reformer Flow on Saturdays at nine.'],
  ['lead', 'Oh, that actually works.'],
  ['aurora', 'And Nina said the classes you missed can roll over to next month, so nothing’s lost.'],
  ['lead', 'Really? That’s so nice.'],
  ['aurora', 'Want me to save you a reformer this Saturday at nine?'],
  ['lead', 'Yes, please. Book it.'],
  ['aurora', 'Done! Saturday at nine, with Nina. I’ll text you the details.'],
  ['lead', 'Thanks, Aurora. I really needed this.'],
]);
const winCall = {
  audio: M + 'call-chloe-2.mp3',
  duration: winCaps[winCaps.length - 1].end,
  title: 'Aurora calls Chloe',
  meta: 'Sound on',
  listen: 'Hear Aurora’s call',
  again: 'Hear it again',
  sound: 'Sound on',
  pause: 'Pause the call',
  resume: 'Resume the call',
  caller: 'Chloe',
  // without sound the step shows these moments of the call; with sound, every line as it is spoken
  moments: [3, 6, 12],
  momentLabels: ['Why she stopped', 'A time that fits', 'Booked'],
  prompt: 'Three moments from the call. Press play to hear all of it.',
  wave: Array.from({ length: 96 }, (_, i) => +(0.35 + 0.5 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.37))).toFixed(2)),
  captions: winCaps,
  notes: [
    { at: 0, text: 'Studio · At risk · Calling now' },
    { at: winCaps[3].at, text: 'Studio · Reason: early classes don’t fit' },
    { at: winCaps[6].at, text: 'Studio · Offered Sat 9:00 Reformer Flow' },
    { at: winCaps[12].at, text: 'Calendar · Sat 9:00 · Bed saved' },
  ],
};

export const wellnessV3 = {
  hero: {
    eyebrow: 'Aurora for wellness',
    titleA: 'The AI front desk for',
    titleB: 'wellness studios.',
    text: 'Aurora answers every call and message, books intro classes and appointments, fills late cancellations from the waitlist and brings quiet members back. For Pilates, yoga and fitness studios, spas and wellness clinics.',
    textShort: 'Aurora answers every call, books the intro class and keeps every class full.',
    more: { label: 'See the waitlist', href: '#race' },
    // the studio after closing: the phone on the desk rings and Aurora answers. Mirrored, so the desk sits under the
    // headline and the call card covers the empty end of the room; the sky behind the headline is the room's own colours.
    film: {
      image: { src: M + 'studio-night-1400.webp', srcSet: sizes('studio-night') },
      video: M + 'studio-night.mp4',
      poster: M + 'studio-night-poster.webp',
      mirror: true,
      sky: 'linear-gradient(180deg,rgba(26,20,16,0.5),rgba(26,20,16,0) 220px),linear-gradient(90deg,#3F3A34,#4E463A 18%,#77664E 40%,#5A4027 60%,#5F4326 80%,#584329)',
      alt: 'A boutique Pilates studio after closing: oak reformers, candles, an olive tree, and a phone lighting up on the front desk',
    },
    call: heroCall,
  },

  // A late cancellation at dawn, seen on Chloe's phone (she is first on the waitlist) and on the studio's roster.
  waitlist: {
    eyebrow: 'Waitlist',
    titleA: 'Every class full.',
    titleB: 'Every waitlist moving.',
    text: 'Late cancellations leave empty reformers. Aurora offers the bed to the waitlist the minute it opens, at any hour, and the roster updates itself.',
    steps: [
      { time: '6:02 am', title: 'Class full, 2 waiting', text: 'Reformer Flow at 7:00 is booked out: 12 of 12 beds, two members on the waitlist.' },
      { time: '6:12 am', title: 'A late cancellation', text: 'Jess can’t make it. A bed opens 48 minutes before class, with no one at the desk.' },
      { time: '+20 sec', title: 'Aurora texts the waitlist', text: 'Chloe is first in line. Aurora offers her the bed and holds it for 10 minutes.' },
      { time: '6:14 am', title: 'Chloe takes the bed', text: 'One reply and she’s booked. The roster updates itself, and Jess’s spot isn’t wasted.' },
      { time: '7:00 am', title: '12 of 12 on the reformers', text: 'A full class, and nobody at the studio lifted a finger before sunrise.' },
    ],
    phone: {
      studio: 'Linen & Light',
      sub: 'Aurora · AI assistant',
      earlier: { text: 'You’re #1 on the waitlist for Reformer Flow tomorrow at 7:00. I’ll text you if a bed opens.', time: 'Yesterday 8:41 PM' },
      offer: 'Good morning, Chloe! A bed just opened in Reformer Flow at 7:00 with Nina. Want it? I’ll hold it for 10 minutes.',
      reply: 'Yes!! On my way 🙌',
      booked: { title: 'You’re in', detail: 'Reformer Flow · 7:00 am · Bed 4' },
      after: 'See you at 7! Grip socks are at the desk if you need them.',
      typingField: 'Text Message',
      repliedIn: 'Offered 20 sec after the cancellation',
    },
    // her morning, from the moment the offer lands: reads it, replies, grabs her mat and goes (8 s)
    film: { video: M + 'chloe-dawn.mp4', poster: M + 'chloe-dawn-poster.webp' },
    roster: {
      title: 'Reformer Flow · 7:00 am',
      sub: 'with Nina · Linen & Light',
      bedLabel: 'Bed',
      // the twelve beds, by member initials; bed 4 is Jess's, then Chloe's
      beds: ['AL', 'MR', 'SK', 'JM', 'DP', 'EW', 'RT', 'HN', 'LB', 'OC', 'KF', 'TG'],
      swap: { bed: 3, from: 'JM', to: 'CB', name: 'Chloe B.' },
      status: ['Full · 12 of 12', '1 bed open', 'Offered to Chloe · waitlist #1', 'Full again · 12 of 12'],
      waiting: ['2 on the waitlist', '2 on the waitlist', '2 on the waitlist', '1 on the waitlist'],
      log: ['Jess cancelled · 6:12 am', 'Bed held for Chloe · 10 min', 'Chloe booked · 6:14 am'],
      done: 'No empty beds · no calls from the desk',
    },
    note: 'An example morning. Names, times and messages are illustrative.',
  },

  // Your playbook: the studio's settings on the left, one rule at a time on the right. Every name, price and reply is illustrative.
  rules: {
    eyebrow: 'Your rules',
    titleA: 'Sells the membership.',
    titleB: 'Never gives health advice.',
    text: 'You set what Aurora never says, what needs your OK first, and how it answers clients who hesitate.',
    panel: { title: 'Your playbook', sub: 'Linen & Light Studio', edited: 'Set by you' },
    groups: [
      { key: 'guard', label: 'Guardrails' },
      { key: 'obj', label: 'Objections' },
    ],
    rows: [
      { key: 'health', group: 'guard', icon: 'health', label: 'Health questions', values: ['Never advise'] },
      { key: 'price', group: 'guard', icon: 'price', label: 'Membership prices', values: ['Share the list', 'Ask me first'] },
      { key: 'pause', group: 'guard', icon: 'pause', label: 'Cancel requests', values: ['Offer a pause'] },
      { key: 'stop', group: 'guard', icon: 'stop', label: 'Opt-out requests', values: ['Stop at once'] },
      { key: 'flex', group: 'obj', label: '“I’m not flexible enough”', values: ['Beginner class'] },
      { key: 'cost', group: 'obj', label: '“It’s too expensive”', values: ['Class pack'] },
      { key: 'time', group: 'obj', label: '“I don’t have time”', values: ['Express class'] },
      { key: 'later', group: 'obj', label: '“I’ll think about it”', values: ['Hold the spot'] },
    ],
    flow: { when: 'Client', then: 'Aurora', result: 'Result' },
    scenes: [
      { row: 'health', value: 0, channel: 'via Instagram', trigger: 'I have a herniated disc. Which exercises should I avoid?', action: 'Gives no health advice. Books a call with an instructor and suggests asking their doctor.', result: 'Call with Nina · 6:00 pm', tone: 'shield', reply: 'That’s one for an instructor, and your doctor too. Nina can call you before your first class to plan around it. Free at 6 today?' },
      { row: 'price', value: 0, channel: 'via text', trigger: 'How much is unlimited a month?', action: 'Shares the price from your list, and the intro offer.', result: 'Intro month offered', tone: 'ok', reply: 'Unlimited is $219 a month. If you’re new, your first month is $99 with unlimited classes. Want me to start it?' },
      { row: 'price', value: 1, channel: 'via text', trigger: 'How much is unlimited a month?', action: 'Holds the reply and asks you first.', result: 'Approval sent to Nina · one tap', tone: 'wait', reply: 'Good question! Let me check the current rates with the studio and text you back within the hour.' },
      { row: 'pause', value: 0, channel: 'via text', trigger: 'I want to cancel. I’m travelling for a month.', action: 'Offers to pause the membership instead, and lets the studio know.', result: 'Paused for a month · member kept', tone: 'ok', reply: 'Have a great trip! Instead of cancelling, I can pause your membership for the month, so you keep your rate. Want me to?' },
      { row: 'stop', value: 0, channel: 'via text', trigger: 'STOP', action: 'Confirms once and never texts again.', result: 'Opted out · reminders cancelled', tone: 'stop', reply: 'Got it. You won’t hear from us again.' },
      { row: 'flex', value: 0, channel: 'on a call', trigger: 'I’m not flexible enough for Pilates.', action: 'Explains the beginner class and books a first one.', result: 'Intro class booked · Sat 9:00', tone: 'ok', reply: 'You don’t need to be! That’s what Reformer Foundations is for: small, slow and made for first-timers. Saturday at nine?' },
      { row: 'cost', value: 0, channel: 'via web chat', trigger: 'It’s a bit too expensive for me.', action: 'Offers a class pack instead of a membership.', result: 'Class pack details sent', tone: 'ok', reply: 'Totally fair. A 5-class pack lets you come when it suits you, with no monthly fee. Want the details?' },
      { row: 'time', value: 0, channel: 'via text', trigger: 'I don’t have time for an hour-long class.', action: 'Suggests the 30-minute express class at lunch.', result: 'Express class booked · Wed 12:15', tone: 'ok', reply: 'Our 30-minute Express classes start at 12:15, made for a lunch break. Want me to save you a spot on Wednesday?' },
      { row: 'later', value: 0, channel: 'via Instagram', trigger: 'Let me think about it.', action: 'Holds the spot for a day and checks back once.', result: 'Spot held 24 h · one follow-up', tone: 'wait', reply: 'Of course! I’ll hold your spot in Saturday’s 9:00 class until tomorrow evening. Just reply YES to keep it.' },
    ],
    note: 'An example playbook. Rules, names, prices and replies are illustrative.',
  },

  // After the first class: one member's months, in three steps. Chloe went quiet; Aurora calls her back, she returns,
  // and she brings a friend. Illustrative.
  after: {
    eyebrow: 'After the first class',
    titleA: 'The intro class is day one.',
    titleB: 'Aurora keeps members coming back.',
    text: 'Busy weeks pull members away long before they cancel. Here’s how Aurora brought one back, and what came after.',
    lead: { name: 'Chloe Bennett', initials: 'CB', intro: 'Member since January, then three weeks without a class' },
    labels: { team: 'What your team sees', prev: 'Previous step', next: 'Next step', you: 'Aurora', text: 'Text', locked: 'Hear the call first' },
    steps: [
      {
        key: 'call', name: 'Win-back call', date: 'Apr 8', icon: 'phone',
        media: { video: M + 'chloe-desk.mp4', poster: M + 'chloe-desk-poster.webp', focus: '58% 30%' },
        happened: 'Three weeks without a class. One AI call, a time that fits her week, and she’s booked again.',
        call: winCall,
        team: 'Studio · At risk → Active · Sat 9:00 Reformer Flow',
      },
      {
        key: 'back', name: 'Back on the reformer', date: 'Apr 11', icon: 'calendar',
        media: { video: M + 'chloe-class.mp4', poster: M + 'chloe-class-poster.webp', focus: '40% 50%' },
        happened: 'A reminder the evening before, Nina knows she’s returning, and the missed classes rolled over.',
        thread: [
          { who: 'aurora', text: 'See you tomorrow at 9, Chloe! Nina saved you bed 4, your usual.' },
          { who: 'lead', text: 'Can’t wait. I’ve missed this.' },
          { who: 'aurora', text: 'Your 3 unused classes are now on May. Nothing lost.' },
        ],
        team: 'Studio · Attended · 3 classes rolled over',
      },
      {
        key: 'friend', name: 'Brings a friend', date: 'Apr 25', icon: 'crm',
        media: { video: M + 'chloe-friend.mp4', poster: M + 'chloe-friend-poster.webp', focus: '55% 35%' },
        happened: 'Two weeks in a row, then a guest pass for a friend. One quiet member, now two.',
        thread: [
          { who: 'aurora', text: 'Members can bring a friend free this month. Want me to save a bed for someone?' },
          { who: 'lead', text: 'Yes! My friend Maya, Saturday at 9.' },
          { who: 'aurora', text: 'Done. Two beds, side by side. See you both!' },
        ],
        team: 'Studio · Guest booked · New lead: Maya',
      },
    ],
    kpi: {
      badge: 'Patented KPI Agent',
      title: 'Measured against your goals.',
      text: 'You set a goal for each part of the studio. Every week the KPI Agent measures Aurora against it and changes what holds a number back. Bigger changes wait for your approval.',
      goalLabel: 'Goal',
      legend: { goal: 'Your goal', now: 'This year', last: 'Last year' },
      since: 'Beating the goal since week',
      story: { cause: 'Cause found', change: 'Change made', result: 'Result' },
      result: 'Past the goal from week {n}, and well above last year.',
      weekLabel: 'Week',
      slipping: 'Slipping',
      note: 'An example. The goals, weekly figures and changes are illustrative.',
      weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
      goals: [
        {
          key: 'sales', area: 'Sales', name: 'Intro to member', target: '4 in 10 intro clients', goal: 0.66,
          values: [0.48, 0.4, 0.35, 0.5, 0.64, 0.76, 0.86, 0.92],
          last: [0.4, 0.41, 0.38, 0.42, 0.44, 0.41, 0.45, 0.44],
          dip: 'Fewer intro clients join than last year.', cause: 'The membership offer went out a week after the first class.',
          change: { after: 2, text: 'Aurora texts the intro offer the evening after the first class, while it still feels good.' },
        },
        {
          key: 'schedule', area: 'Schedule', name: 'Beds filled', target: '9 in 10 beds', goal: 0.76,
          values: [0.62, 0.55, 0.5, 0.64, 0.75, 0.84, 0.9, 0.95],
          last: [0.58, 0.56, 0.6, 0.57, 0.59, 0.58, 0.61, 0.6],
          dip: 'Early classes run with empty beds.', cause: 'Late cancellations came in while the desk was closed.',
          change: { after: 2, text: 'Every freed bed goes to the waitlist at once, at any hour.' },
        },
        {
          key: 'retention', area: 'Retention', name: 'Members active each week', target: '8 in 10 members', goal: 0.72,
          values: [0.6, 0.52, 0.46, 0.58, 0.7, 0.8, 0.87, 0.92],
          last: [0.55, 0.54, 0.52, 0.55, 0.53, 0.56, 0.54, 0.55],
          dip: 'More members skip whole weeks.', cause: 'No one noticed a member was gone until they cancelled.',
          change: { after: 2, text: 'After ten days without a class, Aurora calls with a time that fits.', who: 'Approved by Nina' },
        },
        {
          key: 'service', area: 'Service', name: 'Member satisfaction', target: '4.7 out of 5', goal: 0.78,
          values: [0.66, 0.6, 0.56, 0.52, 0.68, 0.82, 0.88, 0.94],
          last: [0.6, 0.62, 0.59, 0.61, 0.63, 0.62, 0.64, 0.62],
          dip: 'Ratings dip after a new member’s first week.', cause: 'New members didn’t know what to bring or how the reformer works.',
          change: { after: 3, text: 'A short what-to-expect text goes out the day before every first class.' },
        },
        {
          key: 'ops', area: 'Operations', name: 'Classes attended as booked', target: '19 in 20', goal: 0.8,
          values: [0.68, 0.58, 0.5, 0.64, 0.76, 0.86, 0.91, 0.96],
          last: [0.62, 0.6, 0.63, 0.61, 0.62, 0.6, 0.64, 0.63],
          dip: 'More booked members miss their class.', cause: 'Reminders went out by email the night before.',
          change: { after: 2, text: 'Reminders move to a text two hours before class, with a one-tap cancel that frees the bed.' },
        },
      ],
    },
    note: 'An example. Names, dates, classes and messages are illustrative.',
  },

  closing: {
    titleA: 'Ready to scale with us?',
    titleB: 'Book a demo.',
    text: 'Aurora answers, books, fills the waitlist and brings members back, so your team stays with the people in the room.',
    art: 'studio',
  },

  faqMore: { text: 'Want the full picture?', guide: 'Read our guide to AI receptionists for clinics', link: 'see the platform', join: 'or', href: '/platform' },
};
