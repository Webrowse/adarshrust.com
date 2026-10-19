'use client';

import { useState } from 'react';
import {
  PROFILE,
  PROJECTS,
  POSTS,
  LOCAL_POSTS,
  UPSTREAM,
  SMALLER,
  ELSEWHERE,
  WRITING_ELSEWHERE,
  upstreamByRepo,
  count,
  type Project,
  type Post,
  type Upstream,
  type Link as OutLink,
} from '@/lib/content';

/* Shared bits ------------------------------------------------------- */

/** An anchor that leaves the site. The marker is the signal, not decoration. */
function Out({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
      <span className="ext" aria-hidden>
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function Masthead({ title, lede }: { title: string; lede?: React.ReactNode }) {
  return (
    <header className="head">
      <h1 className="head-title">{title}</h1>
      {lede && <p className="head-lede">{lede}</p>}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Home — (0,0)                                                        */
/* ------------------------------------------------------------------ */

export function HomePanel() {
  const merged = UPSTREAM.filter((u) => u.state === 'merged').length;
  const open = UPSTREAM.filter((u) => u.state === 'open').length;
  const repos = upstreamByRepo();
  const featured = POSTS.find((p) => p.featured);

  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero-title">
          I build Rust services, and fix the ones other people depend on.
        </h1>
        <p className="hero-lede">
          {PROFILE.focus}{' '}
          <span className="cap">{count(merged)}</span> change{merged === 1 ? '' : 's'} merged into{' '}
          {repos.map((r, i) => (
            <span key={r.repo}>
              {i > 0 && (i === repos.length - 1 ? ' and ' : ', ')}
              <Out href={r.repoUrl} className="hero-repo">
                {r.repo.split('/')[1]}
              </Out>
            </span>
          ))}
          {open > 0 && `, ${count(open)} more in review`}.
        </p>
      </header>

      {/* Where the evidence is. A table, because each row carries the same
          three facts and a recruiter is scanning them against each other. */}
      <nav className="routes" aria-label="Main sections">
        <a data-plane href="#/open-source" className="route">
          <span className="route-name">Open source</span>
          <span className="route-what">
            Changes merged into Hickory DNS and oxish — privilege handling,
            config diagnostics, protocol correctness.
          </span>
          <span className="route-meta">
            {merged} merged · {open} in review
          </span>
        </a>
        <a data-plane href="#/work" className="route">
          <span className="route-name">Work</span>
          <span className="route-what">
            Services I built and run, with the engineering decisions behind
            each one.
          </span>
          <span className="route-meta">
            {PROJECTS.length} project{PROJECTS.length === 1 ? '' : 's'}
          </span>
        </a>
        <a data-plane href="#/writing" className="route">
          <span className="route-name">Writing</span>
          <span className="route-what">
            {featured ? featured.title : 'Engineering notes and debugging stories.'}
          </span>
          <span className="route-meta">
            {POSTS.length} piece{POSTS.length === 1 ? '' : 's'}
          </span>
        </a>
        <a data-plane href="#/profile" className="route">
          <span className="route-name">Profile</span>
          <span className="route-what">
            What I work on, how to reach me, and where the rest of the code
            lives.
          </span>
          <span className="route-meta">{PROFILE.location}</span>
        </a>
      </nav>

      <Colophon />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Open source — (0,1)                                                 */
/* ------------------------------------------------------------------ */

export function OpenSourcePanel() {
  // Group consecutive entries by repository; the array order is the order
  // entries were added, so adding one means appending to UPSTREAM and
  // nothing else.
  const groups: { repo: string; repoUrl: string; repoWhat: string; items: Upstream[] }[] = [];
  for (const u of UPSTREAM) {
    const last = groups[groups.length - 1];
    if (last && last.repo === u.repo) last.items.push(u);
    else groups.push({ repo: u.repo, repoUrl: u.repoUrl, repoWhat: u.repoWhat, items: [u] });
  }

  return (
    <div className="page">
      <Masthead
        title="Open source"
        lede="Changes I made to Rust projects I do not own. Every entry links to the pull request it describes. Where the same change was also landed on a release branch, that backport is listed inside the entry rather than counted as separate work."
      />

      {groups.map((g) => (
        <section key={g.repo} className="ledger-group">
          <h2 className="ledger-repo">
            <Out href={g.repoUrl}>{g.repo}</Out>
            <span className="ledger-repo-what">{g.repoWhat}</span>
          </h2>
          <ol className="ledger">
            {g.items.map((u) => (
              <LedgerEntry key={u.slug} u={u} />
            ))}
          </ol>
        </section>
      ))}

      <p className="aside">
        Hickory DNS and oxish are maintained projects with their own designs and
        their own reviewers. What is mine in the list above is each individual
        change and the reasoning for it — not the projects themselves.
      </p>

      <FootNav />
    </div>
  );
}

function LedgerEntry({ u }: { u: Upstream }) {
  return (
    <li className="entry">
      <div className="entry-head">
        <h3 className="entry-title">{u.title}</h3>
        <p className={`state state--${u.state}`}>
          {u.state === 'merged' ? 'Merged' : 'In review'}
        </p>
      </div>

      <p className="entry-meta">
        <span>{u.area}</span>
        <span>{u.when}</span>
        <Diff {...u.diff} />
      </p>

      <dl className="entry-body">
        <dt>Problem</dt>
        <dd>{u.problem}</dd>
        <dt>Change</dt>
        <dd>{u.change}</dd>
        <dt>Why it matters</dt>
        <dd>{u.why}</dd>
      </dl>

      {u.reviewNote && <p className="entry-note">{u.reviewNote}</p>}

      <p className="entry-links">
        <Out href={u.prUrl} className="pill">
          #{u.pr}
        </Out>
        {u.issue && (
          <Out href={u.issue.url} className="pill pill--quiet">
            Issue #{u.issue.number}
          </Out>
        )}
        {u.backport && (
          <Out href={u.backport.url} className="pill pill--quiet">
            Same change on {u.backport.branch} (#{u.backport.pr})
          </Out>
        )}
      </p>

      {u.writeUp && (
        <p className="entry-write">
          <Out href={u.writeUp.href}>{u.writeUp.label}</Out>
        </p>
      )}
    </li>
  );
}

function Diff({ added, removed, files }: { added: number; removed: number; files: number }) {
  const total = Math.max(added + removed, 1);
  return (
    <span className="diff">
      <span className="diff-add">+{added}</span>
      <span className="diff-del">−{removed}</span>
      <span className="diff-bar" aria-hidden>
        <span style={{ width: `${(added / total) * 100}%` }} />
      </span>
      <span className="diff-files">
        {files} file{files === 1 ? '' : 's'}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Work index — (0,2)                                                  */
/* ------------------------------------------------------------------ */

export function WorkPanel() {
  return (
    <div className="page">
      <Masthead
        title="Work"
        lede={
          <>
            <span className="cap">{count(PROJECTS.length)}</span> things I
            designed, built and keep running. Ordered by how much backend and
            systems engineering they actually evidence, which is not the same
            as how new they are.
          </>
        }
      />

      <ul className="cards">
        {PROJECTS.map((p) => (
          <li key={p.slug}>
            <a data-plane href={`#/work/${p.slug}`} className="card">
              <h2 className="card-name">{p.name}</h2>
              <p className="card-what">{p.tagline}</p>
              <p className="card-meta">
                <span className="card-status">{p.status}</span>
                <span className="card-stack">{p.stack.join(' · ')}</span>
              </p>
            </a>
          </li>
        ))}
      </ul>

      <section className="home-section">
        <h2 className="sub">Smaller published things</h2>
        <ul className="minor">
          {SMALLER.map((s) => (
            <li key={s.name}>
              <Out href={s.href} className="minor-name">
                {s.name}
              </Out>
              <span className="minor-tag">{s.tag}</span>
              <span className="minor-what">{s.what}</span>
            </li>
          ))}
        </ul>
      </section>

      <FootNav />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Project detail — (i+1, 2)                                           */
/* ------------------------------------------------------------------ */

export function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const next = PROJECTS[index + 1];
  return (
    <div className="page">
      <header className="head">
        <h1 className="head-title">{project.name}</h1>
        <p className="head-lede">{project.tagline}</p>
        <p className="head-meta">
          <span className="card-status">{project.status}</span>
          <span className="card-stack">{project.stack.join(' · ')}</span>
        </p>
      </header>

      <Shot src={project.shot} name={project.name} url={project.urlLabel} />

      <div className="prose">
        {project.body.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </div>

      {project.stats && (
        <dl className="stats">
          {project.stats.map((s) => (
            <div key={s.label}>
              <dd>{s.value}</dd>
              <dt>
                {s.label}
                {s.note && <span className="stats-note">{s.note}</span>}
              </dt>
            </div>
          ))}
        </dl>
      )}

      <section className="block">
        <h2 className="sub">What I built</h2>
        <ul className="bullets">
          {project.built.map((b) => (
            <li key={b.slice(0, 24)}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="block">
        <h2 className="sub">Decisions worth defending</h2>
        <dl className="decisions">
          {project.decisions.map((d) => (
            <div key={d.head}>
              <dt>{d.head}</dt>
              <dd>{d.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="cta-row">
        {project.url && (
          <Out href={project.url} className="btn">
            Open {project.urlLabel}
          </Out>
        )}
        {project.repo && (
          <Out href={project.repo} className="btn btn--quiet">
            Read the source
          </Out>
        )}
      </p>

      <footer className="panel-foot">
        <a data-plane href="#/work" className="foot-link">
          <span className="arrow">←</span> All work
        </a>
        {next && (
          <a data-plane href={`#/work/${next.slug}`} className="foot-link">
            {next.name} <span className="arrow">→</span>
          </a>
        )}
      </footer>
    </div>
  );
}

/* Screenshot in a minimal browser frame. Add captures under /public/screens
   and reference them via the project's `shot` field — without one, a
   typographic cover keeps the frame honest instead of broken. */
function Shot({ src, name, url }: { src?: string; name: string; url?: string }) {
  const [missing, setMissing] = useState(false);
  // A missing image usually errors before hydration, so onError alone never
  // fires — also probe the already-settled state on mount.
  const probe = (img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth === 0) setMissing(true);
  };
  return (
    <figure className="shot">
      <figcaption className="shot-bar">
        <span className="shot-dot" />
        <span className="shot-dot" />
        <span className="shot-dot" />
        <span className="shot-url">{url ?? 'local build'}</span>
      </figcaption>
      {!src || missing ? (
        <div className="shot-cover">
          <span>{name}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={probe}
          src={src}
          alt={`${name} as it appears in a browser`}
          onError={() => setMissing(true)}
        />
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Writing index — (0,3)                                               */
/* ------------------------------------------------------------------ */

export function WritingPanel() {
  const featured = POSTS.filter((p) => p.featured);
  const rest = POSTS.filter((p) => !p.featured);

  return (
    <div className="page">
      <Masthead
        title="Writing"
        lede="Write-ups of things that took longer than they should have. Longer pieces are on the blog; the ones worth pointing at directly are listed here."
      />

      <ul className="posts">
        {featured.map((p) => (
          <PostRow key={p.slug} post={p} featured={POSTS.length > 1} />
        ))}
        {rest.map((p) => (
          <PostRow key={p.slug} post={p} />
        ))}
      </ul>

      <section className="home-section">
        <h2 className="sub">The rest of it</h2>
        <ul className="minor">
          {WRITING_ELSEWHERE.map((l) => (
            <li key={l.label}>
              <Out href={l.href} className="minor-name">
                {l.label}
              </Out>
              <span className="minor-tag">{l.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <FootNav />
    </div>
  );
}

function PostRow({ post, featured }: { post: Post; featured?: boolean }) {
  const inner = (
    <>
      <span className="post-date">{post.date}</span>
      <span className="post-body">
        <span className="post-title">{post.title}</span>
        <span className="post-teaser">{post.teaser}</span>
      </span>
      <span className="post-go" aria-hidden>
        {post.href ? '↗' : '→'}
      </span>
    </>
  );
  return (
    <li className={featured ? 'post post--featured' : 'post'}>
      {post.href ? (
        <a href={post.href} target="_blank" rel="noreferrer" className="post-link">
          {inner}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <a data-plane href={`#/writing/${post.slug}`} className="post-link">
          {inner}
        </a>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Single post — (i+1, 3)                                              */
/* ------------------------------------------------------------------ */

export function PostPanel({ post }: { post: Post }) {
  const index = LOCAL_POSTS.findIndex((p) => p.slug === post.slug);
  const next = LOCAL_POSTS[index + 1];
  return (
    <div className="page page--narrow">
      <header className="head">
        <p className="head-date">{post.date}</p>
        <h1 className="head-title head-title--post">{post.title}</h1>
      </header>

      <div className="prose prose--post">{post.body}</div>

      <footer className="panel-foot">
        <a data-plane href="#/writing" className="foot-link">
          <span className="arrow">←</span> All writing
        </a>
        {next && (
          <a data-plane href={`#/writing/${next.slug}`} className="foot-link">
            {next.title} <span className="arrow">→</span>
          </a>
        )}
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile — (0,4)                                                     */
/* ------------------------------------------------------------------ */

export function ProfilePanel() {
  const merged = UPSTREAM.filter((u) => u.state === 'merged').length;

  return (
    <div className="page">
      <Masthead
        title="Profile"
        lede={`${PROFILE.role}, working remotely. Everything on this site links to the code or the pull request behind it, so none of it has to be taken on trust.`}
      />

      <section className="block">
        <h2 className="sub">What I work on</h2>
        <div className="prose">
          <p>
            Backend services in Rust — Axum and Postgres, auth, rate limiting,
            and the parts that have to stay correct when they are called
            concurrently. Alongside that, the layer underneath: DNS server
            internals, Unix process startup and privilege handling, protocol
            record types, Cargo feature boundaries, and the test and fuzz
            infrastructure that keeps those honest.
          </p>
          <p>
            The upstream work is where that is easiest to check.{' '}
            <span className="cap">{count(merged)}</span> changes of mine are
            merged into{' '}
            <Out href="https://github.com/hickory-dns/hickory-dns">Hickory DNS</Out> and{' '}
            <Out href="https://github.com/djc/oxish">oxish</Out>, each one reviewed
            by maintainers who did not have to accept it.
          </p>
        </div>
        <p className="cta-row">
          <a data-plane href="#/open-source" className="btn">
            Read the contributions
          </a>
        </p>
      </section>

      <section className="block">
        <h2 className="sub">Contact</h2>
        <ul className="minor">
          <li>
            <a href={`mailto:${PROFILE.email}`} className="minor-name">
              {PROFILE.email}
            </a>
            <span className="minor-tag">Email</span>
          </li>
          {ELSEWHERE.map((l) => (
            <ElsewhereRow key={l.label} link={l} />
          ))}
        </ul>
        {PROFILE.resume && (
          <p className="cta-row">
            <a href={PROFILE.resume} className="btn btn--quiet">
              Download CV
            </a>
          </p>
        )}
      </section>

      <Colophon />
      <FootNav />
    </div>
  );
}

function ElsewhereRow({ link }: { link: OutLink }) {
  return (
    <li>
      <Out href={link.href} className="minor-name">
        {link.label}
      </Out>
      <span className="minor-tag">{link.note}</span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Shared footers                                                      */
/* ------------------------------------------------------------------ */

function FootNav() {
  return (
    <footer className="panel-foot">
      <a data-plane href="#/" className="foot-link">
        <span className="arrow">←</span> Home
      </a>
      <a href={`mailto:${PROFILE.email}`} className="foot-link">
        {PROFILE.email}
      </a>
    </footer>
  );
}

function Colophon() {
  return (
    <p className="colophon">
      {new Date().getFullYear()} — built with Next.js, served as static files.
    </p>
  );
}
