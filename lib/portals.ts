import {
  Briefcase,
  Hammer,
  FileCode2,
  PenLine,
  NotebookPen,
  FlaskConical,
  ToggleRight,
  Gauge,
  BookOpen,
  NotebookText,
  type LucideIcon,
} from 'lucide-react';

export type Portal = {
  num: string;
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  flagKey: string; // matches the flag key in FFS, e.g. "portal_blog"
};

export const PORTALS: Portal[] = [
  {
    num: '01',
    title: 'Portfolio',
    desc: 'Identity, work history, and what I want to build next.',
    href: 'https://portfolio.adarshrust.com',
    icon: Briefcase,
    flagKey: 'portal_portfolio',
  },
  {
    num: '02',
    title: 'Projects',
    desc: 'The engineering archive — every shipped repo, with notes.',
    href: 'https://projects.adarshrust.com',
    icon: Hammer,
    flagKey: 'portal_projects',
  },
  {
    num: '03',
    title: 'Rust Ecosystem',
    desc: 'A live aggregation of Rust roles across the world.',
    href: 'https://osspath.com',
    icon: FileCode2,
    flagKey: 'portal_jobs',
  },
  {
    num: '04',
    title: 'Blog',
    desc: 'Long-form essays on Rust, systems, and craft.',
    href: 'https://blog.adarshrust.com',
    icon: PenLine,
    flagKey: 'portal_blog',
  },
  {
    num: '05',
    title: 'Notes',
    desc: 'Raw technical notebook — half-formed ideas, unedited.',
    href: 'https://notes.adarshrust.com',
    icon: NotebookPen,
    flagKey: 'portal_notes',
  },
  {
    num: '06',
    title: 'Labs',
    desc: 'Small deployable experiments, live on the web.',
    href: 'https://labs.adarshrust.com',
    icon: FlaskConical,
    flagKey: 'portal_labs',
  },
  {
    num: '07',
    title: 'FFS',
    desc: 'Feature flag service — multi-tenant Rust backend.',
    href: 'https://ffs.adarshrust.com',
    icon: ToggleRight,
    flagKey: 'portal_ffs',
  },
  {
    num: '08',
    title: 'Bench',
    desc: 'Performance research and benchmarks for Rust crates.',
    href: 'https://bench.adarshrust.com',
    icon: Gauge,
    flagKey: 'portal_bench',
  },
  {
    num: '09',
    title: 'Docs',
    desc: 'Cross-project documentation, all in one place.',
    href: 'https://docs.adarshrust.com',
    icon: BookOpen,
    flagKey: 'portal_docs',
  },
  {
    num: '10',
    title: 'Todo',
    desc: 'Personal todo and daily journal — local now, Rust + Postgres soon.',
    href: 'https://todo.adarshrust.com',
    icon: NotebookText,
    flagKey: 'portal_todo',
  },
];
