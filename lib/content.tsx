import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Projects — the BUILT row, laid out to the right of home             */
/* ------------------------------------------------------------------ */

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  /** short mono status shown when there is no public URL yet */
  status?: string;
  url?: string;
  urlLabel?: string;
  /** path under /public to a screenshot; omit to show the typographic cover */
  shot?: string;
  stats?: { value: string; label: string }[];
  body: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: 'osspath',
    name: 'OSSPath',
    tagline: 'Understand the Rust ecosystem through real-world usage.',
    url: 'https://osspath.com',
    urlLabel: 'osspath.com',
    shot: '/screens/osspath.jpg',
    stats: [
      { value: '4,600+', label: 'repositories mapped' },
      { value: 'weekly', label: 'corpus rescans' },
    ],
    body: [
      'Documentation tells you what a crate claims to do. OSSPath starts from the other end: what real projects actually depend on, and how those dependencies connect.',
      'The corpus is alive — every Rust repository that crosses twenty stars gets pulled in on the weekly scan, 4,600+ of them today and growing. Together they form a dependency graph that shows which crates carry the ecosystem, what they are used with, and where a new project should look first.',
    ],
  },
  {
    slug: 'romyq',
    name: 'Romyq',
    tagline: 'A manager for AI coding agents.',
    url: 'https://romyq.com',
    urlLabel: 'romyq.com',
    shot: '/screens/romyq.png',
    body: [
      'Coding agents are good at minutes of work and unreliable over hours. Left alone on a long task, they drift — losing the plan, skipping validation, declaring victory early.',
      'Romyq turns software ideas into structured lifecycles — phases, governance, readiness tracking, and project memory — so a session that runs all afternoon still lands where it was aimed. Open source and local-first: no cloud, no telemetry.',
    ],
  },
  {
    slug: 'loopupward',
    name: 'LoopUpward',
    tagline: 'A personal operating system.',
    url: 'https://loopupward.com',
    urlLabel: 'loopupward.com',
    shot: '/screens/loopupward.png',
    body: [
      'The videos you watch, the books you save, the quotes that stop you — those thoughts usually disappear. LoopUpward gives them a permanent home, and a path into daily action.',
      'Thoughts, goals, habits, and reflections live in one place and one loop: capture what happened, reflect on it, adjust the goals, repeat. Less a productivity tool, more a flywheel with a text box.',
    ],
  },
  {
    slug: 'ffs',
    name: 'Feature Flag Service',
    tagline: 'Ship faster. Break nothing.',
    url: 'https://ffs.adarshrust.com',
    urlLabel: 'ffs.adarshrust.com',
    shot: '/screens/ffs.jpg',
    body: [
      'Feature flags decouple deploying code from releasing it — toggle features in production without touching code or redeploying.',
      'FFS is a multi-tenant flag service on a Rust backend: targeting rules that roll out to specific user IDs, emails, or entire domains; environment-aware flags for production, staging, or anything custom; all behind SDK keys and a REST API. Open source and self-hostable.',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Writing — the row below home                                        */
/* ------------------------------------------------------------------ */

export type Post = {
  slug: string;
  title: string;
  date: string;
  teaser: string;
  body: ReactNode;
};

export const POSTS: Post[] = [
  {
    slug: 'one-big-canvas',
    title: 'This site is one big canvas',
    date: 'July 2026',
    teaser: 'Pages are places. Navigation should feel like moving, not replacing.',
    body: (
      <>
        <p>
          Every page of this site exists at the same time, on one plane. The
          projects sit to the right of the front page; these notes sit below
          it; the note you are reading sits to the right of the notes index.
          Clicking a link doesn&rsquo;t swap the page — it moves the camera.
        </p>
        <p>
          The mechanics are almost embarrassingly small. Each panel is
          absolutely positioned at a grid coordinate, the plane carries a
          single <code>translate3d</code>, and one long weighted easing curve
          does all of the acting. The URL hash tracks the coordinate, so the
          browser&rsquo;s back button plays the same move in reverse.
        </p>
        <p>
          The previous version of this site rendered spinning WebGL gears with
          physically matched rim velocities. It was fun to build and heavy to
          load. This version ships no 3D, no scroll library, no runtime
          service calls — just a sheet of paper and a camera. It turns out
          restraint is the harder trick.
        </p>
      </>
    ),
  },
  {
    slug: 'gears-flying-everywhere',
    title: 'The gears were flying everywhere',
    date: 'May 2026',
    teaser: 'A debugging story about Blender exports and hidden pivot points.',
    body: (
      <>
        <p>
          The old version of this site had columns of 3D gears that spun as
          you scrolled. The first time I wired up the rotation, the gears
          didn&rsquo;t spin — they <em>orbited</em>, sweeping huge circles
          across the viewport like they&rsquo;d been thrown.
        </p>
        <p>
          The rotation code was three lines and obviously correct, which is
          how you know the bug is somewhere else. It was in the assets: the
          GLB files exported from Blender carried residual transforms on their
          root nodes — a translation and rotation baked into the scene graph.
          Rotating the group rotated the mesh around <em>that</em> offset
          pivot, not its own axis.
        </p>
        <p>
          The fix was to walk the cloned scene graph and zero out every
          node&rsquo;s position, rotation, and scale before use — safe because
          the mesh vertices were already centered on the origin. Three lines
          of traversal, half a day of staring. The lesson generalizes: when
          trivially correct code misbehaves, stop rereading the code and start
          interrogating the data it was handed.
        </p>
      </>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Elsewhere                                                           */
/* ------------------------------------------------------------------ */

export type ElsewhereLink = { label: string; href: string; note: string };

export const ELSEWHERE: ElsewhereLink[] = [
  { label: 'GitHub', href: 'https://github.com/webrowse', note: 'code' },
  { label: 'crates.io', href: 'https://crates.io/users/Webrowse', note: 'published crates' },
  { label: 'Email', href: 'mailto:great.adarsh@gmail.com', note: 'say hello' },
];

/** longer-form writing living on its own subdomains */
export const WRITING_ELSEWHERE: ElsewhereLink[] = [
  { label: 'Blog', href: 'https://blog.adarshrust.com', note: 'long-form essays' },
  { label: 'Notes', href: 'https://notes.adarshrust.com', note: 'raw technical notebook' },
];
