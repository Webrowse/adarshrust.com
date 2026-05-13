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
    desc: 'Hiring-facing identity',
    href: 'https://portfolio.adarshrust.com',
    icon: Briefcase,
  },
  {
    num: '02',
    title: 'Projects',
    desc: 'Engineering archive',
    href: 'https://projects.adarshrust.com',
    icon: Hammer,
  },
  {
    num: '03',
    title: 'Jobs',
    desc: 'Rust roles aggregation',
    href: 'https://jobs.adarshrust.com',
    icon: FileCode2,
  },
  {
    num: '04',
    title: 'Blog',
    desc: 'Personal essays',
    href: 'https://blog.adarshrust.com',
    icon: PenLine,
  },
  {
    num: '05',
    title: 'Notes',
    desc: 'Raw technical notebook',
    href: 'https://notes.adarshrust.com',
    icon: NotebookPen,
  },
  {
    num: '06',
    title: 'Labs',
    desc: 'Deployable experiments',
    href: 'https://labs.adarshrust.com',
    icon: FlaskConical,
  },
  {
    num: '07',
    title: 'FFS',
    desc: 'Feature flag service',
    href: 'https://ffs.adarshrust.com',
    icon: ToggleRight,
  },
  {
    num: '08',
    title: 'Bench',
    desc: 'Benchmark research',
    href: 'https://bench.adarshrust.com',
    icon: Gauge,
  },
  {
    num: '09',
    title: 'Docs',
    desc: 'Centralized docs',
    href: 'https://docs.adarshrust.com',
    icon: BookOpen,
  },
];
