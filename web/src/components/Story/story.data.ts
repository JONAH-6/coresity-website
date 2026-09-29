// Copy lists the design keeps in its renderVals(), verbatim.
// Source: docs/Coresity Story v3.dc.html, script lines 505–527, plus the
// "Who we work with" panels (lines 154–195).

export const DEVELOP = [
  'What customers actually buy',
  'Which problems are most valuable',
  'Which parts of the expertise are repeatable',
  'What customers repeatedly ask for',
  'Where automation is possible',
  'Where AI can replace manual delivery',
  'Where additional products can be created',
].map((t, i) => ({ n: String(i + 1).padStart(2, '0'), t }))

export type Work = {
  id: string
  n: string
  kind: string
  t: string
  d: string
  image: string
  alt: string
  /** Stagger and frame height, as the design lays the three out. */
  offsetClass: string
  frameClass: string
}

export const WORK: Work[] = [
  {
    id: 'work-1',
    n: 'Work 01',
    kind: 'Product',
    t: 'Investor-Ready Deck System',
    d: "A fundraising specialist's expertise became a repeatable system for founders building investor-ready pitch decks.",
    image: '/CORESITY-IMAGE/investor-deck.jpeg',
    alt: 'Investor-Ready Deck System workbook and pitch deck on a desk',
    offsetClass: 'mt-0',
    frameClass: 'h-[440px]',
  },
  {
    id: 'work-2',
    n: 'Work 02',
    kind: 'Program',
    t: 'HR Boolean Search',
    d: "A talent sourcer's search methodology became a focused training program for finding hard-to-reach candidates.",
    image: '/CORESITY-IMAGE/boolean-search.jpeg',
    alt: 'HR Boolean Search training session with sourcing team reviewing candidates',
    offsetClass: 'mt-[120px]',
    frameClass: 'h-[340px]',
  },
  {
    id: 'work-3',
    n: 'Work 03',
    kind: 'Business solution',
    t: 'ISO 45001 Certification Readiness',
    d: "An ISO 45001 specialist's implementation expertise became a structured solution for organizations preparing for certification.",
    image: '/CORESITY-IMAGE/iso45001.jpeg',
    alt: 'ISO 45001 Certification Readiness review meeting inside an industrial facility',
    offsetClass: 'mt-12',
    frameClass: 'h-[400px]',
  },
]

export const PARTNER = [
  {
    n: '01',
    dotClass: 'bg-[var(--accent)]',
    t: 'Tell us what you’re great at',
    d: 'A conversation about your expertise, results, and who benefits.',
  },
  {
    n: '02',
    dotClass: 'bg-[var(--c-ink)]',
    t: 'We map the commercial form',
    d: 'Outcome, customer, problem — and the offer that fits.',
  },
  {
    n: '03',
    dotClass: 'bg-[var(--c-ink)]',
    t: 'We build and launch it',
    d: 'Product, program, or solution, taken to market together.',
  },
  {
    n: '04',
    dotClass: 'bg-[var(--c-vio)]',
    t: 'We grow it with you',
    d: 'Learn from customers and build what comes next.',
  },
]

export const NOTES = [
  {
    no: '001',
    tag: 'Expertise',
    t: 'Why exceptional expertise stays under-commercialized',
    frag: '“Trapped in one person’s head. Limited to one-to-one work.”',
  },
  {
    no: '002',
    tag: 'Design',
    t: 'Choosing the right commercial form for a capability',
    frag: '“The shape of the expertise decides the shape of the offer.”',
  },
  {
    no: '003',
    tag: 'Markets',
    t: 'Building a demand engine around one person',
    frag: '“Build the offer. Build the demand engine.”',
  },
]

export const PEOPLE = [
  {
    title: 'THE OPERATOR',
    desc: 'Runs complex things well — and knows what actually works.',
  },
  {
    title: 'THE BUILDER',
    desc: 'Makes things from nothing — and has done it more than once.',
  },
  {
    title: 'THE STRATEGIST',
    desc: 'Sees the pattern before others see the problem.',
  },
  { title: 'THE TEACHER', desc: 'Can transfer a skill so it actually sticks.' },
  {
    title: 'THE SPECIALIST',
    desc: 'Knows one thing deeper than almost anyone.',
  },
  {
    title: 'THE FOUNDER',
    desc: 'Has built and scaled — and learned it the hard way.',
  },
  {
    title: 'THE EXPERT',
    desc: 'Carries knowledge organizations can’t find anywhere else.',
  },
]

export const MODEL_STEPS = [
  {
    name: 'Discover',
    eyebrow: 'Under-commercialized talent',
    line: 'We find under-commercialized talent.',
  },
  {
    name: 'Define',
    eyebrow: 'Pin down outcome, customer, problem',
    line: 'Person → capability → outcome → customer → problem.',
  },
  {
    name: 'Design',
    eyebrow: 'Choose the commercial form',
    line: 'Capability → product, program, solution, AI, or software.',
  },
  {
    name: 'Deploy',
    eyebrow: 'Build and launch the offer',
    line: 'Build the offer.',
  },
  {
    name: 'Distribute',
    eyebrow: 'Build the demand engine',
    line: 'We build the demand engine around the expertise.',
  },
  {
    name: 'Develop',
    eyebrow: 'Grow from what sells',
    line: 'Learn from the market and build what comes next.',
  },
]

export const BRANCHES = [
  { name: 'Information', becomes: 'Book / guide' },
  { name: 'Methodology', becomes: 'Playbook / toolkit' },
  { name: 'Skill transfer', becomes: 'Course / program' },
  { name: 'Transformation', becomes: 'Consulting / implementation' },
  { name: 'Repeated interaction', becomes: 'Subscription / membership' },
  { name: 'Repeatable AI workflow', becomes: 'Agent / AI product' },
  { name: 'Large market + scalable system', becomes: 'Software / venture' },
]

export const CHANNELS = [
  'AUDIENCE',
  'CONTENT',
  'COMMUNITY',
  'PARTNERSHIPS',
  'OUTBOUND',
  'INBOUND',
  'ENTERPRISE',
  'EVENTS',
  'AI DISCOVERY',
  'REFERRALS',
  'LICENSING',
  'MARKETPLACES',
]

export const MARKET_ROUTES = [
  'Partnerships',
  'Sales',
  'Enterprise outreach',
  'Audience building',
  'Community',
  'Content',
  'Events',
  'Direct sales',
  'AI distribution',
  'Marketplaces',
  'Licensing',
]

export const FLYWHEEL = [
  {
    label: 'Expertise',
    desc: 'Exceptional capability, discovered and defined.',
  },
  {
    label: 'Commercialization',
    desc: 'Shaped into products, programs, and solutions.',
  },
  { label: 'Customers', desc: 'Delivered to the people who need it.' },
  { label: 'Learning', desc: 'What customers buy shows what’s most valuable.' },
  {
    label: 'New opportunities',
    desc: 'Which becomes the next thing we build.',
  },
]
