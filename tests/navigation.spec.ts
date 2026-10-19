import { test, expect, type Page } from '@playwright/test';

/** The panel the camera is currently parked on. It is its own scroller. */
function active(page: Page) {
  return page.locator('.panel:not([inert])');
}

/**
 * Wait for hydration. `plane--live` is added two frames after mount, which
 * is also when the key and click handlers are attached — pressing a key
 * before that races the bundle rather than testing the behaviour.
 */
async function ready(page: Page) {
  await page.locator('.plane--live').waitFor();
}

test.describe('navigation', () => {
  test('the rail reaches every section, and marks where you are', async ({ page }) => {
    await page.goto('/');
    await expect(active(page).getByRole('heading', { level: 1 })).toContainText('I build Rust');

    for (const [label, heading] of [
      ['Open source', 'Open source'],
      ['Work', 'Work'],
      ['Writing', 'Writing'],
      ['Profile', 'Profile'],
    ]) {
      await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: label, exact: true }).click();
      await expect(active(page).getByRole('heading', { level: 1 })).toHaveText(heading);
      await expect(
        page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: label, exact: true }),
      ).toHaveAttribute('aria-current', 'page');
    }
  });

  test('the hash tracks the destination and back/forward replay it', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Work', exact: true }).click();
    await expect(page).toHaveURL(/#\/work$/);

    await active(page).getByRole('link', { name: /Feature Flag Service/ }).click();
    await expect(page).toHaveURL(/#\/work\/feature-flag-service$/);
    await expect(active(page).getByRole('heading', { level: 1 })).toHaveText('Feature Flag Service');

    await page.goBack();
    await expect(page).toHaveURL(/#\/work$/);
    await expect(active(page).getByRole('heading', { level: 1 })).toHaveText('Work');

    await page.goForward();
    await expect(active(page).getByRole('heading', { level: 1 })).toHaveText('Feature Flag Service');
  });

  test('a pasted deep link lands on its panel', async ({ page }) => {
    await page.goto('/#/work/osspath');
    await expect(active(page).getByRole('heading', { level: 1 })).toHaveText('OSSPath');

    await page.goto('/#/work/romyq');
    await expect(active(page).getByRole('heading', { level: 1 })).toHaveText('Romyq');
  });

  test('every in-site link points at a panel that exists', async ({ page }) => {
    await page.goto('/');
    await ready(page);

    // links on inert panels count too — they go live once you get there
    const hrefs: string[] = await page
      .locator('a[data-plane]')
      .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('href') || ''))]);
    expect(hrefs.length).toBeGreaterThan(5);

    for (const href of hrefs) {
      if (href === '#/') continue;
      await page.goto('/' + href);
      await expect(
        active(page),
        `${href} falls back to home — it has no panel`,
      ).not.toHaveAttribute('aria-label', 'Adarsh');
    }
  });

  test('an unknown hash falls back to home instead of a blank plane', async ({ page }) => {
    await page.goto('/#/does-not-exist');
    await expect(active(page).getByRole('heading', { level: 1 })).toContainText('I build Rust');
  });

  test('Escape climbs to the parent section, and stops at home', async ({ page }) => {
    await page.goto('/#/work/romyq');
    await ready(page);
    await page.keyboard.press('Escape');
    await expect(active(page).getByRole('heading', { level: 1 })).toHaveText('Work');
    await page.keyboard.press('Escape');
    await expect(active(page).getByRole('heading', { level: 1 })).toContainText('I build Rust');
    await page.keyboard.press('Escape');
    await expect(active(page).getByRole('heading', { level: 1 })).toContainText('I build Rust');
  });

  test('arrow keys scroll the panel rather than moving the camera', async ({ page }) => {
    await page.goto('/#/open-source');
    await ready(page);
    const scroller = active(page);
    await scroller.click({ position: { x: 10, y: 300 } });
    const before = await scroller.evaluate((el) => el.scrollTop);
    for (let i = 0; i < 12; i++) await page.keyboard.press('ArrowDown');
    await expect
      .poll(() => scroller.evaluate((el) => el.scrollTop))
      .toBeGreaterThan(before);
    // still on the same panel — the camera did not move
    await expect(active(page).getByRole('heading', { level: 1 })).toHaveText('Open source');
  });

  test('arriving at a panel starts it at the top', async ({ page }) => {
    await page.goto('/#/open-source');
    await ready(page);
    const scroller = active(page);
    await scroller.evaluate((el) => (el.scrollTop = 600));
    await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Work', exact: true }).click();
    await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Open source', exact: true }).click();
    await expect.poll(() => active(page).evaluate((el) => el.scrollTop)).toBe(0);
  });
});

test.describe('open source evidence', () => {
  test('every contribution links to its pull request and states whether it merged', async ({
    page,
  }) => {
    await page.goto('/#/open-source');
    const entries = active(page).locator('.entry');
    await expect(entries).toHaveCount(5);

    for (const pr of [3762, 3808, 3823, 3914, 274]) {
      await expect(active(page).locator(`a[href*="/pull/${pr}"]`).first()).toBeVisible();
    }

    // merged and unmerged work must be told apart
    await expect(active(page).locator('.state--merged')).toHaveCount(4);
    await expect(active(page).locator('.state--open')).toHaveCount(1);

    // the backport is attached to its parent entry, not counted separately
    const firstEntry = entries.first();
    await expect(firstEntry.getByRole('link', { name: /release\/0\.26/ })).toBeVisible();
  });

  test('the Hickory write-up is reachable without going through a blog index', async ({ page }) => {
    const article = 'https://blog.adarshrust.com/2026/07/Hickory-3762/';

    await page.goto('/#/open-source');
    await expect(active(page).locator(`a[href="${article}"]`)).toBeVisible();

    await page.goto('/#/writing');
    await expect(active(page).locator(`a[href="${article}"]`)).toBeVisible();
  });

  test('the writing index lists only the pieces that exist', async ({ page }) => {
    await page.goto('/#/writing');
    const posts = active(page).locator('.post');
    await expect(posts).toHaveCount(1);
    await expect(posts.first().getByRole('link')).toHaveAttribute(
      'href',
      'https://blog.adarshrust.com/2026/07/Hickory-3762/',
    );
    // nothing on this site claims to host a post of its own
    await expect(page.locator('.panel[aria-label*="canvas"], .panel[aria-label*="gears"]')).toHaveCount(0);
  });
});

test.describe('contact', () => {
  test('the site offers hello@adarshrust.com and no personal address', async ({ page }) => {
    await page.goto('/#/profile');
    await expect(active(page).locator('a[href="mailto:hello@adarshrust.com"]').first()).toBeVisible();

    const html = await page.content();
    expect(html).not.toContain('great.adarsh@gmail.com');
  });
});

test.describe('accessibility', () => {
  test('inactive panels are inert and hidden from assistive tech', async ({ page }) => {
    await page.goto('/#/work');
    await expect(page.locator('.panel[inert]')).toHaveCount(await page.locator('.panel').count() - 1);
    await expect(page.locator('.panel[inert][aria-hidden="true"]').first()).toBeAttached();
  });

  test('each panel has exactly one h1', async ({ page }) => {
    for (const hash of ['', '#/open-source', '#/work', '#/writing', '#/profile', '#/work/osspath']) {
      await page.goto('/' + hash);
      await expect(active(page).getByRole('heading', { level: 1 })).toHaveCount(1);
    }
  });

  test('Tab order starts at the skip link, then the rail', async ({ page }) => {
    await page.goto('/');
    await ready(page);
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveClass(/skip/);
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveClass(/rail-name/);
  });

  test('the skip link hands the keyboard the scrollable panel', async ({ page }) => {
    await page.goto('/#/open-source');
    await ready(page);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect
      .poll(() => page.evaluate(() => document.activeElement?.getAttribute('aria-label')))
      .toBe('Open source');

    for (let i = 0; i < 12; i++) await page.keyboard.press('ArrowDown');
    await expect.poll(() => active(page).evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  });

  test('navigating moves focus into the destination panel', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Profile', exact: true }).click();
    await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute('aria-label'))).toBe(
      'Profile',
    );
  });

  test('every link has an accessible name', async ({ page }) => {
    for (const hash of ['', '#/open-source', '#/work', '#/writing', '#/profile']) {
      await page.goto('/' + hash);
      const names = await active(page)
        .locator('a')
        .evaluateAll((els) => els.map((e) => (e.textContent || '').trim() || e.getAttribute('aria-label') || ''));
      expect(names.filter((n) => n === '')).toEqual([]);
    }
  });

  test('external links open safely', async ({ page }) => {
    await page.goto('/#/open-source');
    const bad = await active(page)
      .locator('a[target="_blank"]')
      .evaluateAll((els) => els.filter((e) => !(e.getAttribute('rel') || '').includes('noreferrer')).length);
    expect(bad).toBe(0);
  });
});

test.describe('reduced motion', () => {
  test('the camera cuts, and every destination is still reachable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await ready(page);
    // the reduced-motion reset leaves a nominal duration rather than none
    const seconds = await page
      .locator('.plane')
      .evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration));
    expect(seconds).toBeLessThan(0.05);

    await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Open source', exact: true }).click();
    await expect(active(page).getByRole('heading', { level: 1 })).toHaveText('Open source');
  });
});

test.describe('layout', () => {
  test('nothing overflows the viewport horizontally', async ({ page }) => {
    for (const hash of ['', '#/open-source', '#/work', '#/writing', '#/profile', '#/work/loopupward']) {
      await page.goto('/' + hash);
      const overflow = await page.evaluate(() => {
        const el = document.querySelector('.panel:not([inert])') as HTMLElement;
        return el.scrollWidth - el.clientWidth;
      });
      expect(overflow, `horizontal overflow at ${hash || '/'}`).toBeLessThanOrEqual(1);
    }
  });

  test('the sections rail is reachable on every screen size', async ({ page }) => {
    await page.goto('/#/work');
    const rail = page.getByRole('navigation', { name: 'Sections' });
    for (const label of ['Open source', 'Work', 'Writing', 'Profile']) {
      await expect(rail.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
  });

  test('project screenshots load rather than falling back', async ({ page }) => {
    for (const slug of ['feature-flag-service', 'osspath', 'loopupward', 'romyq']) {
      await page.goto(`/#/work/${slug}`);
      const img = active(page).locator('.shot img');
      await expect(img).toBeVisible();
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth), {
          message: `screenshot missing for ${slug}`,
        })
        .toBeGreaterThan(0);
    }
  });
});
