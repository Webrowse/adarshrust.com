'use client';

import { useState } from 'react';
import { PROJECTS, POSTS, ELSEWHERE, type Project, type Post } from '@/lib/content';

/* ------------------------------------------------------------------ */
/* Home — (0,0)                                                        */
/* ------------------------------------------------------------------ */

export function HomePanel() {
  return (
    <div className="page">
      <header className="home-masthead">
        <p className="kicker">Adarsh</p>
        <h1 className="home-title">
          I build software <em>tools</em>.
        </h1>
        <p className="home-lede">
          Rust systems, developer infrastructure, and products that turn messy
          workflows into something usable.
        </p>
        <nav className="home-compass">
          <a data-plane href="#/osspath" className="compass-link">
            View work <span className="arrow">→</span>
          </a>
          <a data-plane href="#/writing" className="compass-link">
            Read notes <span className="arrow">↓</span>
          </a>
        </nav>
      </header>

      <section className="home-section">
        <h2 className="kicker rule">Built</h2>
        <ul className="index-list">
          {PROJECTS.map((p, i) => (
            <li key={p.slug}>
              <a data-plane href={`#/${p.slug}`} className="index-row">
                <span className="index-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="index-body">
                  <span className="index-title">{p.name}</span>
                  <span className="index-desc">{p.tagline}</span>
                </span>
                <span className="index-go arrow">→</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section">
        <h2 className="kicker rule">Writing</h2>
        <a data-plane href="#/writing" className="index-row">
          <span className="index-num">↓</span>
          <span className="index-body">
            <span className="index-desc">
              Engineering notes, debugging stories, and things learned while
              building.
            </span>
          </span>
          <span className="index-go arrow">→</span>
        </a>
      </section>

      <section className="home-section">
        <h2 className="kicker rule">Elsewhere</h2>
        <ul className="elsewhere">
          {ELSEWHERE.map((l) => (
            <li key={l.label}>
              <a href={l.href} target={l.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">
                {l.label}
              </a>
              <span className="elsewhere-note">{l.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="colophon">© {new Date().getFullYear()} · adarshrust.com</footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Project — (i+1, 0)                                                  */
/* ------------------------------------------------------------------ */

export function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const next = PROJECTS[index + 1];
  return (
    <div className="page">
      <header className="detail-head">
        <p className="kicker">Built · {String(index + 1).padStart(2, '0')}</p>
        <h1 className="detail-title">{project.name}</h1>
        <p className="detail-tagline">{project.tagline}</p>
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
              <dt>{s.label}</dt>
            </div>
          ))}
        </dl>
      )}

      <p className="detail-cta">
        {project.url ? (
          <a href={project.url} target="_blank" rel="noreferrer" className="visit">
            {project.urlLabel} <span className="arrow">↗</span>
          </a>
        ) : (
          <span className="status-tag">{project.status}</span>
        )}
      </p>

      <footer className="panel-foot">
        <a data-plane href="#/" className="foot-link">
          <span className="arrow">←</span> index
        </a>
        {next && (
          <a data-plane href={`#/${next.slug}`} className="foot-link">
            next · {next.name} <span className="arrow">→</span>
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
        <img ref={probe} src={src} alt={`Screenshot of ${name}`} onError={() => setMissing(true)} />
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Writing index — (0,1)                                               */
/* ------------------------------------------------------------------ */

export function WritingPanel() {
  return (
    <div className="page">
      <header className="detail-head">
        <p className="kicker">Writing</p>
        <h1 className="detail-title">Notes</h1>
        <p className="detail-tagline">
          Engineering notes, debugging stories, and things learned while
          building.
        </p>
      </header>

      <ul className="index-list">
        {POSTS.map((post) => (
          <li key={post.slug}>
            <a data-plane href={`#/writing/${post.slug}`} className="index-row">
              <span className="index-num">{post.date}</span>
              <span className="index-body">
                <span className="index-title">{post.title}</span>
                <span className="index-desc">{post.teaser}</span>
              </span>
              <span className="index-go arrow">→</span>
            </a>
          </li>
        ))}
      </ul>

      <footer className="panel-foot">
        <a data-plane href="#/" className="foot-link">
          <span className="arrow">↑</span> index
        </a>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Single post — (i+1, 1)                                              */
/* ------------------------------------------------------------------ */

export function PostPanel({ post }: { post: Post }) {
  return (
    <div className="page page--narrow">
      <header className="detail-head">
        <p className="kicker">{post.date}</p>
        <h1 className="detail-title detail-title--post">{post.title}</h1>
      </header>

      <div className="prose prose--post">{post.body}</div>

      <footer className="panel-foot">
        <a data-plane href="#/writing" className="foot-link">
          <span className="arrow">←</span> all notes
        </a>
      </footer>
    </div>
  );
}
