// Wellness & Healthcare page: one boutique studio's story told across the page, in its own design (only the hero call
// is shared with the real estate page).
// Linen & Light, Chloe, Nina and every name, time, price and rule here are illustrative, and each section says so.

const M = '/media/wellness/';
const sizes = (name) => [900, 1400, 2000].map((w) => `${M}${name}-${w}.webp ${w}w`).join(', ');



// Recorded in ElevenLabs v4 (Una as Aurora, Sloane as Chloe); `at` / `end` in ms, `words` from the start of each caption.
const heroCaps = [
  { who: 'aurora', at: 0, end: 6140, text: 'Hi, thanks for calling Linen and Light. This is Aurora, the studio’s AI assistant. How can I help?', words: [0, 740, 1020, 1200, 1480, 1780, 1920, 2640, 2740, 2920, 3600, 3640, 4220, 4460, 5520, 5660, 5800, 5920] },
  { who: 'lead', at: 6780, end: 13360, text: 'Hi! Um, I saw you on Instagram… I’ve never done Pilates. Is that okay?', words: [0, 960, 1660, 1840, 2100, 2280, 2460, 3840, 4100, 4360, 4660, 5760, 6000, 6180] },
  { who: 'aurora', at: 14410, end: 20450, text: 'Totally okay. Most of our members started as complete beginners. Can I ask what got you interested?', words: [0, 160, 1320, 1460, 1640, 1800, 2100, 2500, 2780, 3260, 4400, 4520, 4680, 4960, 5200, 5400, 5620] },
  { who: 'lead', at: 20970, end: 25910, text: 'Honestly? I sit at a desk all day, and my lower back is always stiff.', words: [0, 880, 1180, 1400, 1540, 1720, 1980, 2240, 2560, 2960, 3140, 3420, 3720, 3920, 4480] },
  { who: 'aurora', at: 25910, end: 32230, text: 'That’s really common. I can’t give medical advice, but our instructors adapt every class to you.', words: [0, 820, 1140, 2160, 2300, 2620, 2760, 3140, 3820, 4000, 4280, 4680, 5100, 5600, 5860, 6120] },
  { who: 'aurora', at: 32510, end: 36010, text: 'And if it’s real pain, it’s worth checking with your doctor first.', words: [0, 340, 600, 800, 1060, 1740, 2000, 2200, 2460, 2720, 2860, 3080] },
  { who: 'aurora', at: 36590, end: 42630, text: 'For a first class, I’d suggest Reformer Foundations. It’s small, slow, and made for beginners.', words: [0, 200, 340, 580, 1180, 1420, 1840, 2380, 3680, 3860, 4540, 5160, 5360, 5520, 5700] },
  { who: 'lead', at: 43150, end: 45570, text: 'That sounds perfect. When is it?', words: [0, 160, 460, 1820, 1980, 2160] },
  { who: 'aurora', at: 45950, end: 50490, text: 'Saturday at nine, or Monday at seven in the evening. Which works better?', words: [0, 260, 580, 1240, 1660, 2080, 2380, 2660, 2820, 2940, 3700, 3880, 4140] },
  { who: 'lead', at: 51010, end: 52090, text: 'Saturday at nine.', words: [0, 200, 680] },
  { who: 'aurora', at: 52090, end: 55450, text: 'Done! You’re booked with Nina, Saturday at nine.', words: [0, 1280, 1500, 1620, 1880, 2640, 2720, 3120] },
  { who: 'aurora', at: 55930, end: 61030, text: 'I’ll text you a short waiver and what to bring. Grip socks help, but we keep some at the desk.', words: [0, 200, 380, 560, 700, 900, 1200, 1620, 1800, 1960, 2840, 3140, 3140, 3900, 3980, 4220, 4380, 4580, 4700, 4820] },
  { who: 'lead', at: 61510, end: 63550, text: 'Amazing. Thank you, Aurora!', words: [0, 1200, 1440, 1960] },
];
const heroCall = {
  audio: M + 'call-chloe-1.mp3',
  duration: 64200,
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

const winCaps = [
  { who: 'aurora', at: 0, end: 5740, text: 'Hi, Chloe. It’s Aurora, the AI assistant at Linen and Light. Is now an okay time?', words: [0, 400, 1240, 1420, 2220, 2260, 2580, 2900, 3280, 3520, 3680, 4420, 4700, 5040, 5200, 5380] },
  { who: 'lead', at: 6160, end: 8700, text: 'Oh, hi! Yeah, I have a minute.', words: [0, 400, 1180, 1780, 2060, 2220, 2360] },
  { who: 'aurora', at: 9200, end: 13500, text: 'We’ve missed you on the reformer. It’s been about three weeks since your last class.', words: [0, 220, 420, 660, 800, 920, 1840, 2140, 2280, 2540, 2880, 3240, 3500, 3660, 3920] },
  { who: 'lead', at: 14200, end: 20160, text: 'I know… work got crazy, and the early classes just stopped working for me.', words: [0, 640, 1820, 1900, 2140, 3160, 3340, 3440, 3720, 4160, 4500, 5020, 5360, 5720] },
  { who: 'aurora', at: 20460, end: 23560, text: 'That makes total sense. Would weekends be easier?', words: [0, 140, 420, 800, 1880, 2040, 2380, 2680] },
  { who: 'lead', at: 24060, end: 27220, text: 'Weekends, yeah. Saturday mornings, maybe.', words: [0, 820, 2060, 2060, 3000] },
  { who: 'aurora', at: 27220, end: 31780, text: 'Then you’ll like this. Nina has Reformer Flow on Saturdays at nine.', words: [0, 660, 940, 1100, 2140, 2140, 2460, 3080, 3280, 3560, 3920, 4300] },
  { who: 'lead', at: 32200, end: 33920, text: 'Oh, that actually works.', words: [0, 540, 880, 1280] },
  { who: 'aurora', at: 34620, end: 39540, text: 'And Nina said the classes you missed can roll over to next month, so nothing’s lost.', words: [0, 140, 320, 700, 1200, 1500, 1740, 2100, 2380, 2620, 2880, 3040, 3220, 3740, 4120, 4640] },
  { who: 'lead', at: 40160, end: 41900, text: 'Really? That’s so nice.', words: [0, 720, 1120, 1360] },
  { who: 'aurora', at: 42640, end: 45180, text: 'Want me to save you a reformer this Saturday at nine?', words: [0, 140, 320, 480, 660, 840, 980, 1520, 1640, 1980, 2280] },
  { who: 'lead', at: 45540, end: 47420, text: 'Yes, please. Book it.', words: [0, 460, 1500, 1560] },
  { who: 'aurora', at: 47800, end: 51560, text: 'Done! Saturday at nine, with Nina. I’ll text you the details.', words: [0, 1080, 1080, 1320, 1920, 2040, 2820, 2940, 3080, 3260, 3400] },
  { who: 'lead', at: 52160, end: 54840, text: 'Thanks, Aurora. I really needed this.', words: [0, 440, 1360, 1540, 1940, 2360] },
];
const winCall = {
  audio: M + 'call-chloe-2.mp3',
  duration: 55280,
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
  // the recording's loudness in 96 slices, for the waveform
  wave: [0.42, 0.56, 0.7, 0.55, 0.75, 0.61, 0.67, 0.15, 0.61, 0.61, 0.14, 0.67, 0.29, 0.66, 0.8, 0.2, 0.66, 0.69, 0.71, 0.17, 0.58, 0.64, 0.51, 0.4, 0.34, 1.0, 0.83, 0.45, 0.33, 0.49, 0.76, 0.59, 0.19, 0.56, 0.65, 0.5, 0.42, 0.46, 0.14, 0.67, 0.6, 0.5, 0.5, 0.45, 0.15, 0.83, 0.35, 0.44, 0.53, 0.43, 0.14, 0.62, 0.59, 0.49, 0.47, 0.39, 0.58, 0.48, 0.75, 0.14, 0.72, 0.38, 0.56, 0.69, 0.69, 0.52, 0.16, 0.65, 0.74, 0.66, 0.55, 0.33, 0.87, 0.14, 0.55, 0.67, 0.61, 0.56, 0.56, 0.48, 0.51, 0.34, 0.17, 0.44, 0.29, 0.61, 0.43, 0.18, 0.51, 0.42, 0.19, 0.78, 0.33, 0.7, 0.78, 0.24],
  captions: winCaps,
  notes: [
    { at: 0, text: 'Studio · At risk · Calling now' },
    { at: winCaps[3].at, text: 'Studio · Reason: early classes don’t fit' },
    { at: winCaps[6].at, text: 'Studio · Offered Sat 9:00 Reformer Flow' },
    { at: winCaps[12].at, text: 'Calendar · Sat 9:00 · Bed saved' },
  ],
};

export const wellness = {
  hero: {
    eyebrow: 'Aurora for wellness',
    titleA: 'The AI front desk for',
    titleB: 'wellness studios.',
    text: 'Aurora answers every call and message, books intro classes and appointments, fills late cancellations from the waitlist and brings quiet members back. For Pilates, yoga and fitness studios, spas and wellness clinics.',
    textShort: 'Aurora answers every call, books the intro class and keeps every class full.',
    more: { label: 'See it at work', href: '#desk' },
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

  // While you teach: one 50-minute class, and what Aurora handles at the desk meanwhile. Names and times are illustrative.
  desk: {
    eyebrow: 'While you teach',
    titleA: 'Teach.',
    titleB: 'Aurora has the desk.',
    text: 'The phone rings and the DMs pile up while you’re in the middle of a class. Aurora answers every one, so nothing waits until you’re free.',
    film: { video: M + 'chloe-class.mp4', poster: M + 'chloe-class-poster.webp', alt: 'Nina guides a member through footwork on a reformer in a sunlit Pilates class' },
    klass: { name: 'Reformer Flow', with: 'with Nina', minutes: 50, left: 'min left' },
    // `at` is the minute of the class when it comes in
    items: [
      { at: 3, channel: 'instagram', who: 'New lead', said: 'Do you have classes for total beginners?', done: 'Intro class booked · Sat 9:00' },
      { at: 9, channel: 'call', who: 'Priya, member', said: 'Can I move Thursday to the morning?', done: 'Moved to Fri 7:00 am' },
      { at: 16, channel: 'text', who: 'Sam, new member', said: 'Where do I fill in the waiver?', done: 'Waiver sent and signed' },
      { at: 24, channel: 'email', who: 'Billing', said: 'Monthly payment declined for Dana R.', done: 'New card on file · paid' },
      { at: 33, channel: 'chat', who: 'Website visitor', said: 'Do you sell gift cards?', done: 'Gift card sent · $120' },
      { at: 41, channel: 'call', who: 'Leah, member', said: 'My knee was sore after Tuesday’s class.', done: 'No advice given · Nina calls her after class', tone: 'care' },
    ],
    tally: '{n} conversations handled · 0 interruptions',
    note: 'An example class. Names, times and messages are illustrative.',
  },

  // The week's schedule: late cancellations, each refilled from the waitlist. Every class, name and time is illustrative.
  week: {
    eyebrow: 'Waitlist',
    titleA: 'Every empty spot',
    titleB: 'is gone for good.',
    text: 'A class happens once. When someone cancels late, Aurora offers the spot to the waitlist at once, day or night, and books whoever says yes first.',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    times: ['7:00', '9:30', '12:15', '18:00', '19:15'],
    // the timetable: [day, time, class, capacity]; a missing slot has no class
    classes: [
      [0, 0, 'Reformer Flow', 12], [0, 2, 'Express', 10], [0, 3, 'Reformer Flow', 12], [0, 4, 'Yoga Flow', 16],
      [1, 0, 'Barre', 14], [1, 1, 'Foundations', 8], [1, 3, 'Reformer Flow', 12], [1, 4, 'Restore', 16],
      [2, 0, 'Reformer Flow', 12], [2, 2, 'Express', 10], [2, 3, 'Barre', 14], [2, 4, 'Yoga Flow', 16],
      [3, 0, 'Barre', 14], [3, 1, 'Foundations', 8], [3, 3, 'Reformer Flow', 12], [3, 4, 'Restore', 16],
      [4, 0, 'Reformer Flow', 12], [4, 2, 'Express', 10], [4, 3, 'Yoga Flow', 16],
      [5, 1, 'Reformer Flow', 12], [5, 2, 'Foundations', 8],
    ],
    // the late cancellations, in order: which class, who cancelled, who took the spot, how fast
    events: [
      { day: 0, time: 0, out: 'Jess', in: 'Chloe', at: '6:12 am', took: '2 min', how: 'by text, before sunrise' },
      { day: 1, time: 3, out: 'Marco', in: 'Aisha', at: '4:40 pm', took: '6 min', how: 'by text, during a class' },
      { day: 2, time: 2, out: 'Kim', in: 'Tom', at: '11:58 am', took: '3 min', how: 'on a call' },
      { day: 3, time: 0, out: 'Ruth', in: 'Ella', at: '5:51 am', took: '4 min', how: 'by text, before sunrise' },
      { day: 4, time: 3, out: 'Ben', in: 'Noor', at: '3:20 pm', took: '9 min', how: 'second on the waitlist' },
      { day: 5, time: 1, out: 'Ivy', in: 'Grace', at: '8:47 am', took: '2 min', how: 'by text' },
    ],
    labels: { cancel: 'cancelled', filled: 'took the spot', in: 'in', refilled: 'spots refilled this week', full: 'Full', open: '1 open' },
    film: { video: M + 'chloe-dawn.mp4', poster: M + 'chloe-dawn-poster.webp' },
    note: 'An example week. Classes, names and times are illustrative.',
  },

  // A member's year as a circle: intro class, habit, a quiet spell, back again. Chloe's story; illustrative.
  cycle: {
    eyebrow: 'Retention',
    titleA: 'From intro class',
    titleB: 'to habit.',
    text: 'Members rarely quit on purpose. They drift. Aurora keeps each one moving around the circle, and calls when someone goes quiet.',
    member: 'Chloe',
    did: 'What Aurora did',
    stages: [
      {
        key: 'intro', name: 'Intro class', when: 'Week 1',
        media: { video: M + 'chloe-class.mp4', poster: M + 'chloe-class-poster.webp' },
        line: 'Her first reformer class, booked on a call the night she found the studio.',
        did: ['Booked the intro class and sent the waiver', 'Texted the membership offer that evening'],
      },
      {
        key: 'habit', name: 'Habit', when: 'Months 1–2',
        media: { video: M + 'chloe-dawn.mp4', poster: M + 'chloe-dawn-poster.webp' },
        line: 'Three classes a week, and the first one off the waitlist when a spot opens.',
        did: ['Reminders two hours before class', 'Waitlist spots offered the minute they open'],
      },
      {
        key: 'quiet', name: 'Gone quiet', when: 'Month 3',
        media: { video: M + 'chloe-desk.mp4', poster: M + 'chloe-desk-poster.webp' },
        line: 'Work got busy and three weeks went by without a class. Aurora called.',
        did: ['Noticed after ten days without a class', 'Called with a time that fits her week'],
        call: true,
      },
      {
        key: 'back', name: 'Back, with a friend', when: 'Month 4',
        media: { video: M + 'chloe-friend.mp4', poster: M + 'chloe-friend-poster.webp' },
        line: 'Saturdays at nine now, and this week she brought Maya.',
        did: ['Rolled her missed classes over, as Nina allowed', 'Booked Maya’s guest pass beside her'],
      },
    ],
    call: winCall,
    note: 'An example member. Names, times and messages are illustrative.',
  },

  // Clinics: the same front desk, with the clinical line drawn clearly.
  clinics: {
    eyebrow: 'Wellness clinics',
    titleA: 'Clinics too.',
    titleB: 'The clinical line stays with you.',
    text: 'Physiotherapy, massage and aesthetics practices run on the same calendar pressure. Aurora handles the desk; anything clinical goes to your team.',
    kinds: [
      { key: 'physio', name: 'Physiotherapy & chiropractic', icon: 'activity', does: ['Books first visits and follow-up series', 'Sends intake forms before the first visit', 'Reminds patients of their next session'] },
      { key: 'spa', name: 'Massage & spa', icon: 'flower', does: ['Books by therapist, room and length', 'Sells and redeems gift cards and packages', 'Fills late cancellations from the waitlist'] },
      { key: 'aesthetics', name: 'Aesthetics & med spa', icon: 'sparkles', does: ['Books consultations before treatments', 'Sends before-and-after care notes you wrote', 'Rebooks the next treatment on time'] },
    ],
    line: { never: 'Never', neverText: 'diagnoses, gives medical advice or discusses treatment results.', always: 'Always', alwaysText: 'hands clinical questions and urgent cases to your staff, with the conversation attached.' },
  },

  // The owner's Monday letter: the week in a few lines, and one goal the KPI Agent moved. Every figure is illustrative.
  journal: {
    eyebrow: 'Every Monday',
    titleA: 'Your week at the studio,',
    titleB: 'in one letter.',
    text: 'Every Monday morning Aurora writes to you: what it handled, who joined, who came back, and the one goal the KPI Agent is working on.',
    letter: {
      date: 'Monday, 8:00 am',
      from: 'From Aurora',
      hello: 'Good morning, Nina.',
      intro: 'Here’s last week at Linen & Light.',
      lines: [
        { icon: 'refill', n: '9', text: 'late spots refilled from the waitlist' },
        { icon: 'join', n: '4 of 9', text: 'intro clients joined as members' },
        { icon: 'back', n: '3', text: 'quiet members came back' },
        { icon: 'answer', n: '71', text: 'calls and messages answered, 18 after hours' },
      ],
      goal: {
        badge: 'KPI Agent',
        name: 'Beds filled',
        target: 'Your goal: 9 in 10',
        weeks: [0.78, 0.81, 0.84, 0.88, 0.91, 0.93],
        goal: 0.9,
        change: 'Reminders now go out two hours before class, with a one-tap cancel that frees the bed for the waitlist.',
        result: '93% last week, past your goal for the second week running.',
      },
      sign: 'Have a lovely week,',
      name: 'Aurora',
    },
    photo: { src: M + 'chloe-friend-900.webp', alt: 'Two friends laughing at the studio’s front desk after class, mats under their arms' },
    note: 'An example letter. The figures are illustrative.',
  },

  closing: {
    titleA: 'Ready to scale with us?',
    titleB: 'Book a demo.',
    text: 'Aurora answers, books, fills the waitlist and brings members back, so your team stays with the people in the room.',
    art: 'studio',
  },

  faqMore: { text: 'Want the full picture?', guide: 'Read our guide to AI receptionists for clinics', link: 'see the platform', join: 'or', href: '/platform' },
};
