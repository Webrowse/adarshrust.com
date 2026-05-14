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
  type LucideIcon,
} from 'lucide-react';

export type Portal = {
  num: string;
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
};

export const PORTALS: Portal[] = [
  {
    num: '01',
    title: 'Portfolio',
    desc: 'Identity, work history, and what I want to build next.',
    href: 'https://portfolio.adarshrust.com',
    icon: Briefcase,
  },
  {
    num: '02',
    title: 'Projects',
    desc: 'The engineering archive — every shipped repo, with notes.',
    href: 'https://projects.adarshrust.com',
    icon: Hammer,
  },
  {
    num: '03',
    title: 'Jobs',
    desc: 'A live aggregation of Rust roles across the world.',
    href: 'https://jobs.adarshrust.com',
    icon: FileCode2,
  },
  {
    num: '04',
    title: 'Blog',
    desc: 'Long-form essays on Rust, systems, and craft.',
    href: 'https://blog.adarshrust.com',
    icon: PenLine,
  },
  {
    num: '05',
    title: 'Notes',
    desc: 'Raw technical notebook — half-formed ideas, unedited.',
    href: 'https://notes.adarshrust.com',
    icon: NotebookPen,
  },
  {
    num: '06',
    title: 'Labs',
    desc: 'Small deployable experiments, live on the web.',
    href: 'https://labs.adarshrust.com',
    icon: FlaskConical,
  },
  {
    num: '07',
    title: 'FFS',
    desc: 'Feature flag service — multi-tenant Rust backend.',
    href: 'https://ffs.adarshrust.com',
    icon: ToggleRight,
  },
  {
    num: '08',
    title: 'Bench',
    desc: 'Performance research and benchmarks for Rust crates.',
    href: 'https://bench.adarshrust.com',
    icon: Gauge,
  },
  {
    num: '09',
    title: 'Docs',
    desc: 'Cross-project documentation, all in one place.',
    href: 'https://docs.adarshrust.com',
    icon: BookOpen,
  },
];
