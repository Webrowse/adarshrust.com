import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Profile — identity, shown on home and the profile panel             */
/* ------------------------------------------------------------------ */

export const PROFILE = {
  name: 'Adarsh',
  /** one line, first screen, no adjectives */
  role: 'Rust backend and systems engineer',
  /** what the work actually touches, used as the home sub-line */
  focus: 'DNS internals, backend services, and developer infrastructure.',
  location: 'Remote',
  email: 'hello@adarshrust.com',
  github: 'https://github.com/webrowse',
  githubHandle: 'webrowse',
  crates: 'https://crates.io/users/Webrowse',
  /**
   * Path under /public to a CV file, or an external URL. Leave null and every
   * résumé affordance stays hidden — the site never links to a file that is
   * not there. Drop a PDF in /public and set the path here to light it up.
   */
  resume: null as string | null,
};

/* ------------------------------------------------------------------ */
/* Upstream open source — the ledger                                   */
/*                                                                     */
/* One entry per distinct change. Backports of an entry are listed     */
/* inside it, not as separate entries, because they are the same work  */
/* landed on a release branch.                                         */
/*                                                                     */
/* Every field here is checkable against the linked pull request.      */
/* Diff stats are the pull request's own numbers.                      */
/* ------------------------------------------------------------------ */

export type Upstream = {
  slug: string;
  /** repository the change landed in */
  repo: string;
  repoUrl: string;
  /** what the repository is, in one clause */
  repoWhat: string;
  /** area of the codebase touched */
  area: string;
  /** plain-language title of the change, not the commit subject */
  title: string;
  pr: number;
  prUrl: string;
  state: 'merged' | 'open';
  /** merge date, or the review status for open work */
  when: string;
  diff: { added: number; removed: number; files: number };
  issue?: { number: number; url: string; title: string };
  /** same change, landed on a maintenance branch */
  backport?: { pr: number; url: string; branch: string };
  problem: string;
  change: string;
  why: string;
  /** my own write-up of this contribution, when one exists */
  writeUp?: { label: string; href: string };
  /** honest note about review state — only for work that is not merged */
  reviewNote?: string;
};

export const UPSTREAM: Upstream[] = [
  {
    slug: 'hickory-3762',
    repo: 'hickory-dns/hickory-dns',
    repoUrl: 'https://github.com/hickory-dns/hickory-dns',
    repoWhat: 'a DNS client, server, and resolver written in Rust',
    area: 'bin · server startup',
    title: 'Let the server skip privilege dropping inside a namespace',
    pr: 3762,
    prUrl: 'https://github.com/hickory-dns/hickory-dns/pull/3762',
    state: 'merged',
    when: 'Merged 30 June 2026',
    diff: { added: 17, removed: 5, files: 2 },
    issue: {
      number: 3094,
      url: 'https://github.com/hickory-dns/hickory-dns/issues/3094',
      title: 'Make dropping privileges optional',
    },
    backport: {
      pr: 3763,
      url: 'https://github.com/hickory-dns/hickory-dns/pull/3763',
      branch: 'release/0.26',
    },
    problem:
      'The server follows the usual Unix pattern: start as root, bind the privileged port, then call setuid/setgid down to an unprivileged user. Inside a Linux user namespace the process looks like root, so the uid check passes — but the host /etc/passwd is not mounted, so the getpwnam("nobody") lookup that follows returns NULL and startup aborts.',
    change:
      'Added a drop_privileges config field defaulting to true, and threaded it through to the Unix startup path so the privilege-dropping step can be skipped. Existing deployments are unaffected; the flag has to be set deliberately.',
    why:
      'Deckard, the project\'s own DNS conformance test suite, runs the server inside exactly such a namespace. Before this, there was no supported way to run Hickory there — the only options were patching the binary or not testing it at all.',
    writeUp: {
      label: 'My write-up of this change',
      href: 'https://blog.adarshrust.com/2026/07/Hickory-3762/',
    },
  },
  {
    slug: 'hickory-3808',
    repo: 'hickory-dns/hickory-dns',
    repoUrl: 'https://github.com/hickory-dns/hickory-dns',
    repoWhat: 'a DNS client, server, and resolver written in Rust',
    area: 'bin · config parsing',
    title: 'Say which Cargo feature a zone store needs, instead of calling it unknown',
    pr: 3808,
    prUrl: 'https://github.com/hickory-dns/hickory-dns/pull/3808',
    state: 'merged',
    when: 'Merged 31 July 2026',
    diff: { added: 50, removed: 1, files: 1 },
    issue: {
      number: 3775,
      url: 'https://github.com/hickory-dns/hickory-dns/issues/3775',
      title: 'Better error messages when configuration file incompatible with enabled Cargo features',
    },
    backport: {
      pr: 3810,
      url: 'https://github.com/hickory-dns/hickory-dns/pull/3810',
      branch: 'release/0.26',
    },
    problem:
      'Store types in the config enum are behind Cargo features. Writing type = "recursor" in a binary built without --features recursor made serde fail at the enum tag: unknown variant `recursor`, expected `forward` or `default`. The store is not unknown — it was compiled out, and the message sent people looking for a typo.',
    change:
      'Paired each feature-gated variant with a fallback variant holding serde\'s IgnoredAny, compiled in when the feature is off. The config now parses, and the failure surfaces later from the store loader as: store type `recursor` requires the `recursor` Cargo feature, which was not enabled when this binary was built. Same treatment for forward, blocklist and sqlite.',
    why:
      'It moves the error from the parser, which only knows about tags, to the place that knows why the variant is missing. The wording now names the fix.',
  },
  {
    slug: 'hickory-3823',
    repo: 'hickory-dns/hickory-dns',
    repoUrl: 'https://github.com/hickory-dns/hickory-dns',
    repoWhat: 'a DNS client, server, and resolver written in Rust',
    area: 'bin · config tests',
    title: 'Stop a config test from panicking in builds without DNSSEC',
    pr: 3823,
    prUrl: 'https://github.com/hickory-dns/hickory-dns/pull/3823',
    state: 'merged',
    when: 'Merged 10 August 2026',
    diff: { added: 7, removed: 0, files: 1 },
    issue: {
      number: 3811,
      url: 'https://github.com/hickory-dns/hickory-dns/issues/3811',
      title: '`test_reject_unknown_fields` panics on `example_recursor_dnssec.toml` without `__dnssec`',
    },
    problem:
      'test_reject_unknown_fields walks the example configs and skips the ones a build cannot parse. The skip logic only looked at store types, so example_recursor_dnssec.toml slipped through on builds without __dnssec and the test panicked on the ValidateWithStaticKey policy.',
    change:
      'Extended the skip check to the dnssec_policy field, matching the shape of the existing store-type checks.',
    why:
      'Seven lines, but it is the difference between a feature combination being testable and the suite failing for a reason unrelated to what it is testing.',
  },
  {
    slug: 'hickory-3914',
    repo: 'hickory-dns/hickory-dns',
    repoUrl: 'https://github.com/hickory-dns/hickory-dns',
    repoWhat: 'a DNS client, server, and resolver written in Rust',
    area: 'proto · EDNS record data',
    title: 'Make OPT record equality agree with its own hash',
    pr: 3914,
    prUrl: 'https://github.com/hickory-dns/hickory-dns/pull/3914',
    state: 'open',
    when: 'Opened 12 September 2026',
    diff: { added: 93, removed: 34, files: 1 },
    problem:
      'PartialEq for OPT counted how many of its options the other record contained. contains() ignores multiplicity, so [A, A] compared equal to [A, B] — and swapping the operands gave the opposite answer. Hash, meanwhile, had sorted the options since commit 27109e3. Two records could therefore be equal and hash differently, which breaks the Hash/Eq contract that HashMap and HashSet rely on — and RData derives both, so anything keyed on record data inherits it.',
    change:
      'Made the options vector private and kept it in canonical order at the two places that can change it, so the derived PartialEq, Hash and Ord all agree. Order still does not matter; repeated options now do. Added a test for the duplicate case and an options() accessor so callers keep read access.',
    why:
      'RFC 6891 §6.1.2 gives an option\'s position no significance, so order-independent comparison is correct — but it has to be implemented in a way that equality and hashing cannot disagree.',
    reviewNote:
      'Approved by the maintainer. Still open: a reviewer raised that re-ordering options would change the bytes re-encoded for TSIG MAC verification, so the canonical-order approach is under discussion.',
  },
  {
    slug: 'oxish-274',
    repo: 'djc/oxish',
    repoUrl: 'https://github.com/djc/oxish',
    repoWhat: 'an SSH server written in Rust',
    area: 'fuzz · CI',
    title: 'Repair the fuzz target and make CI build it',
    pr: 274,
    prUrl: 'https://github.com/djc/oxish/pull/274',
    state: 'merged',
    when: 'Merged 23 August 2026',
    diff: { added: 31, removed: 4, files: 4 },
    issue: {
      number: 273,
      url: 'https://github.com/djc/oxish/issues/273',
      title: 'Fuzz silently broke down due to stale imports, stale lock file and no CI catches it',
    },
    problem:
      'The fuzz crate had stopped compiling after the protocol message types moved into submodules. Nothing noticed, because fuzz/ declares its own workspace — so cargo check --all-targets and cargo clippy --all-targets never reach it.',
    change:
      'Fixed the decode target\'s imports against the new module paths, added the two dependencies that oxish-proto had picked up to the fuzz lockfile, moved the crate to edition 2024 to match the workspace, and added a nightly CI job running cargo fuzz build.',
    why:
      'The broken target was the visible bug; the missing CI job was the reason it stayed broken. Fixing only the first would have let it rot again.',
  },
];

/** Small counts read as words in prose; anything larger stays a numeral. */
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
export function count(n: number) {
  return WORDS[n] ?? String(n);
}

/** Grouped by repository, for the summary line on home. */
export function upstreamByRepo() {
  const map = new Map<string, { repo: string; repoUrl: string; merged: number; open: number }>();
  for (const u of UPSTREAM) {
    const row = map.get(u.repo) ?? { repo: u.repo, repoUrl: u.repoUrl, merged: 0, open: 0 };
    if (u.state === 'merged') row.merged += 1;
    else row.open += 1;
    map.set(u.repo, row);
  }
  return [...map.values()];
}

/* ------------------------------------------------------------------ */
/* Projects — things I built and run                                   */
/*                                                                     */
/* Ordered by how much they evidence Rust / backend / infrastructure   */
/* work, not by recency and not by subject matter popularity.          */
/* ------------------------------------------------------------------ */

export type Project = {
  slug: string;
  name: string;
  /** what it does, in the user's words */
  tagline: string;
  /** deployed / open source / in development — shown verbatim */
  status: string;
  stack: string[];
  url?: string;
  urlLabel?: string;
  repo?: string;
  repoLabel?: string;
  /** path under /public to a screenshot; omit to show the typographic cover */
  shot?: string;
  /** optional, only where the number is published and checkable */
  stats?: { value: string; label: string; note?: string }[];
  /** the problem, in prose */
  body: string[];
  /** what I built, specifically */
  built: string[];
  /** engineering decisions worth defending in an interview */
  decisions: { head: string; text: string }[];
};

export const PROJECTS: Project[] = [
  {
    slug: 'feature-flag-service',
    name: 'Feature Flag Service',
    tagline: 'Self-hosted feature flags with targeting, rollouts and an SDK endpoint.',
    status: 'Deployed · open source',
    stack: ['Rust', 'Axum', 'PostgreSQL', 'SQLx', 'React'],
    url: 'https://ffs.adarshrust.com',
    urlLabel: 'ffs.adarshrust.com',
    repo: 'https://github.com/Webrowse/feature-flag-service-backend',
    repoLabel: 'feature-flag-service-backend',
    shot: '/screens/ffs.jpg',
    body: [
      'Feature flags separate deploying code from releasing it. The hosted services that do this are priced per seat and want your evaluation traffic; the self-hosted options are mostly heavy. This is a small one you can run yourself.',
      'Two APIs sit on the same Postgres schema: a management API behind JWT auth for creating projects, environments, flags and targeting rules, and an SDK endpoint behind a project key that evaluates every flag for one user in a single request.',
    ],
    built: [
      'The whole backend: Axum handlers, the Postgres schema and migrations, the evaluation engine, and the auth layer.',
      'The React dashboard that drives the management API, and the service\'s own deployment.',
    ],
    decisions: [
      {
        head: 'Rollouts hash instead of sampling',
        text: 'A percentage rollout decides per user with an FNV-1a hash of the user key, so the same user keeps the same answer across calls and across processes. Sampling at random would flicker the feature on and off for the same person.',
      },
      {
        head: 'Evaluation is one request, not one per flag',
        text: 'The SDK endpoint returns every flag for a user in one response. Flags are checked in a fixed order — global kill switch, then targeting rules by priority, then the rollout bucket — so the result is explainable.',
      },
      {
        head: 'Logging the evaluation does not block the answer',
        text: 'Every evaluation is recorded for the analytics view, but the write is detached from the response path. The flag answer is on the hot path; the audit trail is not.',
      },
      {
        head: 'Auth that assumes the service is exposed',
        text: 'Argon2 password hashing, JWTs for the dashboard, separate SDK keys for clients, IP rate limiting on the auth and SDK routes, and user-scoped queries so a project is only reachable by its owner.',
      },
    ],
  },
  {
    slug: 'osspath',
    name: 'OSSPath',
    tagline: 'A map of the Rust ecosystem, built from what real projects actually depend on.',
    status: 'Deployed · open source',
    stack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'Cloudflare'],
    url: 'https://osspath.com',
    urlLabel: 'osspath.com',
    repo: 'https://github.com/Webrowse/osspath',
    repoLabel: 'Webrowse/osspath',
    shot: '/screens/osspath.jpg',
    stats: [
      { value: '5,607', label: 'Rust repositories indexed', note: 'as published on the site' },
      { value: '0', label: 'database queries per page view' },
    ],
    body: [
      'Crate documentation tells you what a library claims to do. OSSPath starts from the other end: it reads the Cargo manifests of thousands of production Rust repositories and reports what people actually depend on, what those crates get used alongside, and which companies ship them.',
      'That turns into a route for someone trying to get hired in Rust — pick backend, systems, infrastructure or embedded, and the site names the crates that matter for it and the real repositories where you can read them in use.',
    ],
    built: [
      'The ingestion pipeline that collects repositories and resolves their dependency graphs into Postgres.',
      'The publishing step, the prerendered public site, and the admin panel that reviews content before it goes live.',
    ],
    decisions: [
      {
        head: 'The public site has no database',
        text: 'Publishing exports the whole corpus to JSON, commits it, and triggers a build that prerenders every page. Visitors hit static files on a CDN. Nothing public can be slowed down or taken out by the database, and a bad snapshot is a git revert.',
      },
      {
        head: 'Numbers carry the date they were computed',
        text: 'Every figure on the site is rendered from the published snapshot and shown with the date it was verified, because a stale number presented as live is worse than no number.',
      },
      {
        head: 'Nothing appears unreviewed',
        text: 'The pipeline proposes; the admin panel approves. Repositories, jobs and resources are reviewed before they can be published.',
      },
    ],
  },
  {
    slug: 'loopupward',
    name: 'LoopUpward',
    tagline: 'A personal planning system where progress on small things rolls up into the large ones.',
    status: 'Deployed · open source',
    stack: ['Rust', 'TypeScript', 'PostgreSQL', 'Docker'],
    url: 'https://loopupward.com',
    urlLabel: 'loopupward.com',
    repo: 'https://github.com/Webrowse/loopupward',
    repoLabel: 'Webrowse/loopupward',
    shot: '/screens/loopupward.png',
    body: [
      'Most planning tools start at the task. People do not — they start at "I want to learn this" and never get to the task. LoopUpward keeps goals, habits, routines and notes as one kind of object that can nest inside another, so a chapter read today can sit under a book, under a course, under a year.',
      'The interesting part is the arithmetic. An item with its own tracker reports its own progress; one without averages its children. Completing something nested inside a metered parent ticks that parent, and the tick climbs the whole chain, with every move written to history.',
    ],
    built: [
      'The data model where every item is the same object with a kind, and any item can parent any other.',
      'The rollup rules — progress averaging upward, completion cascading upward, and both recorded as history entries rather than recomputed.',
      'The Rust service behind it and the scheduling that places repeating items on their days.',
    ],
    decisions: [
      {
        head: 'One object, many kinds',
        text: 'A goal, habit, routine, book and note are the same row with a different kind, so an item can change what it is without migrating anything, and nesting works between any two kinds.',
      },
      {
        head: 'Progress is written, not derived',
        text: 'Each rollup writes a history entry instead of being recomputed from children on read. The number you saw last week stays the number you saw last week.',
      },
      {
        head: 'Days have edges that match the user, not UTC',
        text: 'A routine finished at 12:30am is attributed to the evening it started, up to a 4am cutoff, because otherwise a night routine breaks its streak by being finished.',
      },
    ],
  },
  {
    slug: 'romyq',
    name: 'Romyq',
    tagline: 'A terminal tool that keeps a long AI-assisted coding session pointed at the original goal.',
    status: 'Released · open source · Python, not Rust',
    stack: ['Python', 'Local-first'],
    url: 'https://romyq.com',
    urlLabel: 'romyq.com',
    repo: 'https://github.com/Webrowse/romyq',
    repoLabel: 'Webrowse/romyq',
    shot: '/screens/romyq.png',
    body: [
      'Coding agents hold a plan for minutes and lose it over hours. Left running on a long task they drift — skipping validation, forgetting constraints, and reporting success early.',
      'Romyq puts a lifecycle around the session: a written mission, ordered phases, governance rules every task is checked against, and readiness tracking that has to be satisfied before a phase closes. All state is files in .romyq/ in the project. No cloud, no telemetry.',
    ],
    built: [
      'The lifecycle engine — phases, governance rules, readiness gates and the project memory that survives between sessions.',
      'The terminal interface, and distribution through PyPI and a Homebrew tap.',
    ],
    decisions: [
      {
        head: 'State is files in the repository',
        text: 'Everything lives in .romyq/ next to the code it describes, so it diffs, reviews and branches like the rest of the project. There is no server to be the source of truth.',
      },
      {
        head: 'Planning and execution are separate providers',
        text: 'The thing that decides what to do next and the thing that writes code are different, swappable roles, so a cheaper or local model can do one of them.',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Smaller published work                                              */
/* ------------------------------------------------------------------ */

export type SmallThing = { name: string; href: string; what: string; tag: string };

export const SMALLER: SmallThing[] = [
  {
    name: 'rust-kv-store',
    href: 'https://github.com/Webrowse/rust-kv-store',
    what: 'A key-value store on an append-only log — replay on startup, compaction, no dependencies. Written to work through the durability trade-offs rather than to be used.',
    tag: 'Rust',
  },
  {
    name: 'axum-api-template',
    href: 'https://github.com/Webrowse/axum-api-template',
    what: 'A REST API starting point with Axum, Postgres, JWT auth and migrations wired together.',
    tag: 'Rust',
  },
  {
    name: 'solaudit',
    href: 'https://crates.io/crates/solaudit',
    what: 'Retry-safety analyser for Solana transactions, using state diffing to find what a replayed transaction would change.',
    tag: 'Published crate',
  },
  {
    name: 'notez · smart_tasker',
    href: 'https://crates.io/users/Webrowse',
    what: 'Two small command-line tools on crates.io, both standard-library-only exercises in doing without dependencies.',
    tag: 'Published crates',
  },
];

/* ------------------------------------------------------------------ */
/* Writing                                                             */
/*                                                                     */
/* Posts with a `body` live on this site. Posts with an `href` live    */
/* elsewhere and are linked straight out — the reader never has to go  */
/* through a blog index to reach one.                                  */
/* ------------------------------------------------------------------ */

export type Post = {
  slug: string;
  title: string;
  date: string;
  teaser: string;
  /** set for posts hosted on the blog; the index links straight to it */
  href?: string;
  /** set for posts that live on this site */
  body?: ReactNode;
  /** pulled to the top of the index */
  featured?: boolean;
};

export const POSTS: Post[] = [
  {
    slug: 'hickory-3762',
    title: 'First OSS contribution in Hickory-DNS',
    date: 'July 2026',
    featured: true,
    href: 'https://blog.adarshrust.com/2026/07/Hickory-3762/',
    teaser:
      'Why a DNS server that starts fine on a host dies instantly inside a Linux user namespace, and what it took to get the fix accepted upstream.',
  },
];

/**
 * Posts that live on this site, in grid order — each gets its own panel to
 * the right of the writing index.
 *
 * Currently empty: everything written so far lives on the blog, so every
 * entry above carries an `href` instead of a `body`. Give a post a `body`
 * and it appears here, on the grid, with no component work.
 */
export const LOCAL_POSTS = POSTS.filter((p) => p.body);

/* ------------------------------------------------------------------ */
/* Links out                                                           */
/* ------------------------------------------------------------------ */

export type Link = { label: string; href: string; note: string };

export const ELSEWHERE: Link[] = [
  { label: 'GitHub', href: PROFILE.github, note: 'source for everything here' },
  { label: 'crates.io', href: PROFILE.crates, note: 'published crates' },
  { label: 'Blog', href: 'https://blog.adarshrust.com', note: 'longer write-ups' },
  { label: 'Notes', href: 'https://notes.adarshrust.com', note: 'working notebook' },
];

/** longer-form writing living on its own subdomains */
export const WRITING_ELSEWHERE: Link[] = [
  { label: 'blog.adarshrust.com', href: 'https://blog.adarshrust.com', note: 'longer write-ups' },
  { label: 'notes.adarshrust.com', href: 'https://notes.adarshrust.com', note: 'working notebook' },
];
