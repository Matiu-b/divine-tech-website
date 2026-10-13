import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Bell, Bot, Check, ChevronDown, Globe, Mail, MessageSquare, Phone, Search, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { platformPage } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';

const C = platformPage.console;
const GAP = 16;

/* ------------------------------------------------------------------ */
/* Stage: each screen is drawn at a fixed size and scaled to its card,  */
/* so the crop looks the same on a phone and on a wide screen.          */
/* ------------------------------------------------------------------ */
const BASE_W = 330;
const BASE_H = 264;

const TONES = {
  cream: 'linear-gradient(160deg,#FFF7EE 0%,#FBEADA 100%)',
  peach: 'linear-gradient(160deg,#FFF1E8 0%,#FADCCB 100%)',
  sand: 'linear-gradient(160deg,#F7F2E9 0%,#ECE2D1 100%)',
  gold: 'linear-gradient(160deg,#FFF8E4 0%,#FBE9BF 100%)',
  blush: 'linear-gradient(160deg,#FDF0EA 0%,#F5DACF 100%)',
  mist: 'linear-gradient(160deg,#F6F4EF 0%,#E8E3D9 100%)',
};

function Stage({ tone, children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / BASE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="relative aspect-[330/264] overflow-hidden rounded-[22px]" style={{ background: TONES[tone] }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

/* Console building blocks, matched to the Aurora app: white panels, warm chips, Unbounded type. */
function Win({ className, style, children }) {
  return (
    <div className={cn('absolute rounded-[14px] bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_18px_40px_-22px_rgba(90,50,20,0.35)]', className)} style={style}>
      {children}
    </div>
  );
}

const TAG = {
  agent: 'bg-[#E3F3EE] text-[#1E7A64]',
  ok: 'bg-[#E4F4E8] text-[#2E7A48]',
  wait: 'bg-[#FFF0D9] text-[#A8640F]',
  open: 'bg-[#FFF4E2] text-[#6B4A16]',
  bad: 'bg-[#FDE6E0] text-[#BF3E28]',
};
function Tag({ t = 'open', children }) {
  return <span className={cn('inline-flex h-[15px] items-center rounded-full px-1.5 text-[7.5px] font-medium', TAG[t])}>{children}</span>;
}

function Avatar({ s, ch: Ch, size = 26 }) {
  return (
    <span className="relative flex shrink-0 items-center justify-center rounded-full bg-[#FBE7D3] text-[8.5px] font-medium text-[#7A4A22]" style={{ width: size, height: size }}>
      {s}
      {Ch ? (
        <span className="absolute -bottom-0.5 left-1/2 flex h-[11px] w-[11px] -translate-x-1/2 items-center justify-center rounded-full bg-white">
          <Ch className="h-[7px] w-[7px] text-[#7A4A22]" strokeWidth={2} />
        </span>
      ) : null}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* The six screens                                                     */
/* ------------------------------------------------------------------ */
function DashboardScreen() {
  const stats = [
    ['Unread conversations', '4', '38 today'],
    ['Waiting for a human', '2', 'open handoffs'],
    ['Handled by AI', '91%', '412 conversations'],
  ];
  const bars = [46, 62, 54, 78, 70, 38, 30];
  return (
    <Win className="left-[22px] top-[24px] w-[360px] p-4" style={{ height: 300 }}>
      <div className="flex items-center justify-between">
        <img src="/brand/aurora-logo-horizontal-color.svg" alt="" className="h-[15px] w-auto" />
        <div className="flex items-center gap-2 text-ink/50">
          <span className="flex h-[18px] items-center gap-1 rounded-full bg-[#F6F2EC] px-2 text-[7.5px]">
            <Search className="h-2.5 w-2.5" strokeWidth={2} /> Search or jump to…
          </span>
          <Bell className="h-3 w-3" strokeWidth={1.8} />
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-ink text-[6.5px] font-medium text-white">DK</span>
        </div>
      </div>
      <p className="mt-4 text-[17px] font-medium tracking-[-0.02em] text-ink">Good afternoon, Dana</p>
      <p className="mt-1 text-[8.5px] text-graphite">
        Here is what is happening in <span className="font-medium text-ink">Maple Realty</span> right now.
      </p>
      <div className="mt-3.5 grid grid-cols-3 gap-2" style={{ width: 296 }}>
        {stats.map(([l, v, s]) => (
          <div key={l} className="rounded-[10px] bg-white p-2.5 shadow-[0_0_0_1px_rgba(10,15,14,0.07)]">
            <p className="text-[7px] text-graphite">{l}</p>
            <p className="mt-1 text-[16px] font-medium leading-none text-ink">{v}</p>
            <p className="mt-1 text-[6.5px] text-slate">{s}</p>
          </div>
        ))}
      </div>
      <div className="mt-2.5 rounded-[10px] p-3 shadow-[0_0_0_1px_rgba(10,15,14,0.07)]" style={{ width: 296 }}>
        <div className="flex items-baseline justify-between">
          <p className="text-[9px] font-medium text-ink">Weekly activity</p>
          <p className="text-[7px] text-slate">Conversations per day</p>
        </div>
        <div className="mt-2.5 flex h-[64px] items-end gap-3 pl-1">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="w-full rounded-t-[4px] bg-[linear-gradient(to_top,#F25C2A,#FF9F45)]" style={{ height: h * 0.72 }} />
              <span className="text-[6px] text-slate">{'MTWTFSS'[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </Win>
  );
}

function InboxScreen() {
  const rows = [
    ['SK', MessageSquare, 'Sarah K.', 'Fee waiver needs a manager', [['open', 'Unresolved'], ['wait', 'Approval · Pending']], true],
    ['MT', Phone, 'Mark T.', 'Water heater leak, technician booked', [['ok', 'Resolved'], ['agent', 'Job · Booked']]],
    ['PN', Globe, 'Priya N.', 'Cleaning moved to Thu 2:10 pm', [['ok', 'Resolved'], ['agent', 'Appointment · Moved']]],
    ['JR', Mail, 'James R.', 'Invoice #1042 paid by link', [['ok', 'Resolved'], ['agent', 'Payment · Paid']]],
    ['LB', Globe, 'Lena B.', 'Asked for a callback after 5 pm', [['open', 'Unresolved'], ['bad', 'Callback · Today']]],
  ];
  return (
    <Win className="left-[22px] top-[24px] w-[286px] px-3 pb-3 pt-3" style={{ height: 300 }}>
      <div className="flex h-[22px] items-center gap-1.5 rounded-full px-2.5 text-[8px] text-ink/45 shadow-[0_0_0_1px_rgba(10,15,14,0.09)]">
        <Search className="h-2.5 w-2.5" strokeWidth={2} /> Search name, phone or email
      </div>
      <div className="mt-2 flex gap-1">
        {[['All', '38', true], ['Urgent'], ['Today'], ['Unread', '4']].map(([l, n, on]) => (
          <span key={l} className={cn('flex h-[18px] items-center gap-1 rounded-full px-2 text-[7.5px] font-medium', on ? 'bg-ink text-white' : 'text-ink/70 shadow-[0_0_0_1px_rgba(10,15,14,0.08)]')}>
            {l}
            {n ? <span className={on ? 'text-white/70' : 'text-slate'}>{n}</span> : null}
          </span>
        ))}
      </div>
      <ul className="mt-2">
        {rows.map(([s, ch, name, line, tags, sel]) => (
          <li key={name + line} className={cn('flex gap-2 rounded-[10px] px-2 py-2', sel && 'bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.07),0_6px_14px_-10px_rgba(10,15,14,0.3)]')}>
            <Avatar s={s} ch={ch} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-[9px] font-medium text-ink">{name}</p>
                <p className="shrink-0 text-[6.5px] text-slate">Oct 11</p>
              </div>
              <p className="mt-0.5 flex items-center gap-1 truncate text-[7.5px] text-graphite">
                <Bot className="h-2.5 w-2.5 shrink-0 text-[#D9481C]" strokeWidth={2} />
                {line}
              </p>
              <div className="mt-1 flex gap-1">
                {tags.map(([t, l]) => (
                  <Tag key={l} t={t}>
                    {l}
                  </Tag>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Win>
  );
}

function ActionScreen() {
  const json = [
    ['lead_id', '"REQ-2048"'],
    ['fee', '"application"'],
    ['original_amount', '50'],
    ['new_amount', '0'],
    ['currency', '"USD"'],
    ['approved_by', '"Dana K."'],
  ];
  return (
    <Win className="left-[22px] top-[24px] w-[290px] p-3" style={{ height: 300 }}>
      <div className="flex items-center justify-between">
        <p className="text-[9.5px] font-medium text-ink">Fee waiver request · REQ-2048</p>
        <Tag t="ok">Approval · Approved</Tag>
      </div>
      <div className="mt-2.5 rounded-[12px] bg-[#FFF6EC] p-2.5">
        <div className="rounded-[10px] bg-white p-3 shadow-[0_0_0_1px_rgba(10,15,14,0.05)]">
          <p className="text-[10.5px] font-medium text-ink">API call to your CRM</p>
          <p className="mt-1 text-[7.5px] text-graphite">Waive the application fee for Sarah K. Manager approval required.</p>
          <p className="mt-2 font-mono text-[7px] text-ink/70">
            <span className="font-semibold text-ink">POST</span> /v2/leads/REQ-2048/fees
          </p>
          <p className="mt-1.5 text-[7.5px] font-medium text-ink">Request</p>
          <pre className="mt-1 rounded-[8px] bg-[#FFF3E2] px-2.5 py-2 font-mono text-[7px] leading-[1.55] text-ink/80">
            {'{\n' + json.map(([k, v], i) => `  "${k}": ${v}${i < json.length - 1 ? ',' : ''}`).join('\n') + '\n}'}
          </pre>
          <p className="mt-2 flex items-center gap-1 text-[8px] font-medium text-[#2E7A48]">
            <Check className="h-2.5 w-2.5" strokeWidth={3} /> Approved by Dana K. · sent to your CRM
          </p>
        </div>
      </div>
    </Win>
  );
}

function HandoffScreen() {
  return (
    <Win className="left-[22px] top-[24px] w-[380px] p-3" style={{ height: 300 }}>
      <div className="flex items-start gap-2">
        <Avatar s="SK" />
        <div>
          <p className="text-[10px] font-medium text-ink">Sarah K.</p>
          <p className="mt-0.5 flex items-center gap-1 text-[7px] text-graphite">
            Text message <span className="h-1 w-1 rounded-full bg-[#2E9E5B]" /> Online · +1 (212) 555-0148
          </p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        <span className="flex h-[17px] items-center gap-1 rounded-full px-2 text-[7px] font-medium text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.08)]">
          <span className="h-1 w-1 rounded-full bg-[#F25C2A]" /> Dana is replying
        </span>
        <span className="flex h-[17px] items-center gap-1 rounded-full px-2 text-[7px] text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.08)]">
          <UserRound className="h-2 w-2" strokeWidth={2} /> Dana K. <ChevronDown className="h-2 w-2" strokeWidth={2} />
        </span>
        <span className="flex h-[17px] items-center gap-1 rounded-full px-2 text-[7px] text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.08)]">
          Unresolved <ChevronDown className="h-2 w-2" strokeWidth={2} />
        </span>
        <span className="flex h-[17px] overflow-hidden rounded-full text-[7px] font-medium shadow-[0_0_0_1px_rgba(10,15,14,0.08)]">
          <span className="flex items-center gap-1 px-2 text-ink/60">
            <Bot className="h-2 w-2" strokeWidth={2} /> Bot
          </span>
          <span className="flex items-center gap-1 rounded-full bg-ink px-2 text-white">
            <UserRound className="h-2 w-2" strokeWidth={2} /> Manager
          </span>
        </span>
      </div>
      <div className="mt-3 grid gap-1.5 rounded-[12px] bg-[#FBF7F1] p-2.5" style={{ width: 286 }}>
        <p className="max-w-[72%] rounded-[10px] rounded-bl-[3px] bg-white px-2.5 py-1.5 text-[8px] text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.05)]">Is there an application fee?</p>
        <div className="ml-auto max-w-[76%]">
          <p className="mb-0.5 text-right text-[6.5px] font-medium text-[#D9481C]">Aurora</p>
          <p className="rounded-[10px] rounded-br-[3px] bg-ink px-2.5 py-1.5 text-[8px] text-white">There is a $50 fee. I have asked Dana about waiving it for you.</p>
        </div>
        <p className="my-1 text-center text-[6.5px] text-slate">Dana K. took over · 12:53 PM</p>
        <div className="ml-auto max-w-[76%]">
          <p className="mb-0.5 text-right text-[6.5px] font-medium text-ink/60">Dana K.</p>
          <p className="rounded-[10px] rounded-br-[3px] bg-[#F25C2A] px-2.5 py-1.5 text-[8px] text-white">Hi Sarah, it is waived. See you Saturday at 11!</p>
        </div>
      </div>
    </Win>
  );
}

function ChannelsScreen() {
  const rows = [
    [Globe, 'Web chat', 184, 41, '#0A0F0E'],
    [Phone, 'Phone', 121, 27, '#F25C2A'],
    [Mail, 'Email', 86, 19, '#F25C2A'],
    [MessageSquare, 'Text message', 58, 13, '#F25C2A'],
  ];
  return (
    <>
      <Win className="left-[22px] top-[24px] w-[250px] p-3" style={{ height: 300 }}>
        <p className="text-[10px] font-medium text-ink">Communication channels</p>
        <p className="mt-0.5 text-[7.5px] text-graphite">Performance per channel · last 7 days</p>
        <div className="mt-2.5 grid gap-1.5">
          {rows.map(([Ic, name, n, pct, color]) => (
            <div key={name} className="rounded-[10px] bg-[#FFF5EA] px-2.5 py-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-white text-ink/60">
                  <Ic className="h-2.5 w-2.5" strokeWidth={1.8} />
                </span>
                <span className="flex-1">
                  <span className="block text-[8.5px] font-medium text-ink">{name}</span>
                  <span className="block text-[6.5px] text-slate">{n} conversations</span>
                </span>
                <span className="text-[10px] font-medium text-ink">{pct}%</span>
              </div>
              <span className="mt-1.5 block h-[3px] rounded-full bg-ink/10">
                <span className="block h-full rounded-full" style={{ width: pct * 2 + '%', background: color }} />
              </span>
            </div>
          ))}
        </div>
      </Win>
      <Win className="left-[200px] top-[44px] w-[120px] p-2.5">
        <p className="text-[7px] text-slate">Handled by AI</p>
        <p className="mt-1 text-[17px] font-medium leading-none text-ink">91%</p>
        <svg viewBox="0 0 100 34" className="mt-2 h-[30px] w-full" aria-hidden="true">
          <defs>
            <linearGradient id="ct-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FF9F45" stopOpacity="0.45" />
              <stop offset="1" stopColor="#FF9F45" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 28 L14 25 L28 26 L42 18 L56 15 L70 16 L84 8 L100 5 L100 34 L0 34 Z" fill="url(#ct-area)" />
          <path d="M0 28 L14 25 L28 26 L42 18 L56 15 L70 16 L84 8 L100 5" fill="none" stroke="#F25C2A" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <p className="mt-1 text-[6.5px] text-graphite">412 conversations this week</p>
      </Win>
    </>
  );
}

function CustomerScreen() {
  const notes = [
    ['Prefers weekend viewings. Looking for a 2BR near Maple St.', 'Dana K. · Oct 9'],
    ['Application fee waived on REQ-2048.', 'Aurora · Oct 11'],
  ];
  return (
    <Win className="left-[22px] top-[24px] w-[214px] p-3" style={{ height: 300 }}>
      <p className="text-[10px] font-medium text-ink">Customer</p>
      <p className="mt-0.5 text-[7px] text-graphite">sarah.k@example.com</p>
      <div className="mt-3 flex items-center gap-2.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FBE2CB] text-[12px] font-medium text-[#7A4A22]">SK</span>
        <div>
          <p className="text-[10px] font-medium text-ink">Sarah K.</p>
          <p className="text-[7px] text-graphite">Lead · 2BR Maple St</p>
        </div>
      </div>
      <div className="mt-2.5 flex gap-1.5">
        {['Send email', 'Merge contact'].map((b) => (
          <span key={b} className="flex h-[18px] items-center rounded-full px-2 text-[7px] font-medium text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.09)]">
            {b}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[7.5px] font-medium text-ink">CRM notes</p>
      <div className="mt-1 grid gap-1.5">
        {notes.map(([t, by]) => (
          <div key={t} className="rounded-[8px] bg-[#FFF6EC] px-2 py-1.5">
            <p className="text-[7.5px] leading-snug text-ink">{t}</p>
            <p className="mt-0.5 text-[6.5px] text-slate">{by}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[7.5px] font-medium text-ink">Details</p>
      <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[7px]">
        {[
          ['Source', 'Web chat'],
          ['Stage', 'Viewing booked'],
          ['Owner', 'Dana K.'],
        ].map(([k, v]) => (
          <React.Fragment key={k}>
            <dt className="text-slate">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </React.Fragment>
        ))}
      </dl>
      <Win className="left-[180px] top-[36px] w-[134px] p-2.5">
        <p className="text-[7px] text-slate">Past requests</p>
        {[
          ['Viewing booked', 'Sat 11:00'],
          ['Fee waived', 'REQ-2048'],
          ['Reminder sent', 'Fri 6 pm'],
        ].map(([a, b]) => (
          <p key={a} className="mt-1.5 flex items-center gap-1.5 text-[7.5px] text-ink">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#E4F4E8] text-[#2E7A48]">
              <Check className="h-2 w-2" strokeWidth={3} />
            </span>
            <span className="flex-1">{a}</span>
            <span className="text-[6.5px] text-slate">{b}</span>
          </p>
        ))}
      </Win>
    </Win>
  );
}

const SCREENS = {
  dashboard: [DashboardScreen, 'peach'],
  inbox: [InboxScreen, 'sand'],
  action: [ActionScreen, 'gold'],
  handoff: [HandoffScreen, 'blush'],
  channels: [ChannelsScreen, 'cream'],
  customer: [CustomerScreen, 'mist'],
};

/* ------------------------------------------------------------------ */
/* Carousel                                                            */
/* ------------------------------------------------------------------ */
export default function ConsoleTour() {
  const track = useRef(null);
  const reduce = useReducedMotion();
  const [edge, setEdge] = useState({ start: true, end: false });
  const [active, setActive] = useState(0);
  const n = C.slides.length;

  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const onScroll = () => {
      const w = el.firstElementChild ? el.firstElementChild.getBoundingClientRect().width : el.clientWidth;
      setActive(Math.max(0, Math.min(n - 1, Math.round(el.scrollLeft / (w + GAP)))));
      setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [n]);

  const step = (dir) => {
    const el = track.current;
    if (!el || !el.firstElementChild) return;
    const w = el.firstElementChild.getBoundingClientRect().width + GAP;
    el.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
  };
  const go = (i) => {
    const el = track.current;
    if (!el || !el.firstElementChild) return;
    const w = el.firstElementChild.getBoundingClientRect().width + GAP;
    el.scrollTo({ left: i * w, behavior: reduce ? 'auto' : 'smooth' });
  };

  const arrow = 'flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.08)] transition hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-35';

  return (
    <section id="console" data-nav-theme="light" aria-labelledby="console-title" className="section relative overflow-hidden">
      <div className="shell">
        <SectionHeader id="console-title" eyebrow={C.eyebrow} titleA={C.titleA} titleB={C.titleB} text={C.text} layout="split" />
        <div className="mt-8 hidden justify-end gap-2 md:flex">
          <button type="button" className={arrow} onClick={() => step(-1)} disabled={edge.start} aria-label="Previous screen">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <button type="button" className={arrow} onClick={() => step(1)} disabled={edge.end} aria-label="Next screen">
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* the track starts on the page grid and runs off the right edge, so the next screen always peeks in */}
      <div
        ref={track}
        aria-roledescription="carousel"
        aria-label="Aurora console screens"
        className="no-scrollbar mt-8 flex snap-x snap-mandatory overflow-x-auto md:mt-5"
        style={{
          gap: GAP,
          paddingLeft: 'max(var(--gutter), calc((100% - var(--maxw)) / 2))',
          paddingRight: 'var(--gutter)',
          scrollPaddingLeft: 'max(var(--gutter), calc((100% - var(--maxw)) / 2))',
        }}
      >
        {C.slides.map((s, i) => {
          const [Screen, tone] = SCREENS[s.key];
          return (
            <Reveal
              key={s.key}
              as="article"
              delay={Math.min(i, 3) * 0.08}
              y={28}
              className="w-[84%] shrink-0 snap-start sm:w-[56%] md:w-[42%] lg:w-[31%] xl:w-[29%] 2xl:w-[400px]"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${s.title}`}
            >
              <Stage tone={tone}>
                <Screen />
              </Stage>
              <h3 className="mt-5 text-[17px] font-medium tracking-[-0.01em] text-ink md:mt-6 md:text-[18px]">{s.title}</h3>
              <p className="mt-2 max-w-[38ch] text-[14px] leading-relaxed text-graphite md:text-[15px]">{s.text}</p>
            </Reveal>
          );
        })}
      </div>

      <div className="shell">
        <div className="mt-7 flex gap-2 md:hidden">
          {C.slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${s.title}`}
              aria-current={i === active ? 'true' : undefined}
              className="relative h-1 flex-1 overflow-hidden rounded-full bg-ink/10"
            >
              <span className={cn('absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-300', i <= active ? 'w-full' : 'w-0')} />
            </button>
          ))}
        </div>
        <p className="mt-6 text-[12px] text-slate md:mt-8">{C.note}</p>
      </div>
    </section>
  );
}
