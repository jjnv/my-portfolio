import { expect, test, type Page } from '@playwright/test';

const openDocumentOnMobile = async (page: Page) => {
  const portfolioButton = page.getByRole('button', { name: 'Portfolio', exact: true });
  if (
    (await portfolioButton.isVisible()) &&
    (await portfolioButton.getAttribute('aria-pressed')) !== 'true'
  ) {
    await portfolioButton.click();
  }
};

const openTerminalOnMobile = async (page: Page) => {
  const terminalButton = page.getByRole('button', { name: 'Terminal', exact: true });
  if (
    (await terminalButton.isVisible()) &&
    (await terminalButton.getAttribute('aria-pressed')) !== 'true'
  ) {
    await terminalButton.click();
  }
};

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('renders the workstation and keeps all portfolio content available', async ({ page }) => {
  await page.goto('/');
  await openDocumentOnMobile(page);

  await expect(
    page.getByRole('heading', { level: 1, name: /Reliable data\.\s*Useful systems\./i })
  ).toBeVisible();
  await expect(page.locator('.system-bar__identity')).toContainText('juanjo@portfolio');
  await expect(page.locator('[data-view="project-airflow-observer"]')).toContainText(
    'Airflow Observer'
  );
  await expect(page.locator('[data-view="project-llm-eval-lab"]')).toContainText('LLM Eval Lab');
  await expect(page.locator('[data-view="project-boundedscan"]')).toContainText('BoundedScan');
  await expect(page.locator('[data-view="experience"]')).toContainText('Data Engineer');
  await expect(page.locator('[data-view="home"]')).toContainText('−20%');
  await expect(page.locator('[data-view="home"]')).toContainText('−30%');

  const contactView = page.locator('[data-view="contact"]');
  await expect(contactView.locator('a[href^="mailto:"]')).toHaveAttribute(
    'href',
    'mailto:juanjose121@live.com'
  );
  await expect(contactView.locator('a[href*="linkedin.com"]')).toHaveAttribute('target', '_blank');
  await expect(contactView.locator('a[href="https://github.com/jjnv"]')).toHaveAttribute(
    'target',
    '_blank'
  );
});

test('terminal commands navigate the portfolio and update the URL', async ({ page }) => {
  await page.goto('/');
  await openTerminalOnMobile(page);

  const input = page.getByLabel('Portfolio terminal command');
  await input.fill('open airflow-observer');
  await input.press('Enter');

  await expect(page).toHaveURL(/#project-airflow-observer$/);
  await expect(page.getByRole('heading', { name: 'Airflow Observer' })).toBeVisible();
  await expect(page.locator('[data-terminal-output]')).toContainText(
    'Opened ~/projects/airflow-observer/README.md'
  );

  await openTerminalOnMobile(page);

  await input.fill('not-a-command');
  await input.press('Enter');
  await expect(page.locator('[data-terminal-output]')).toContainText(
    "command not found. Type 'help'"
  );
  await expect(page.locator('[data-webster-message]')).toHaveText(
    "That command didn't resolve. Type `help` to list what I understand."
  );
});

test('supports file commands, history and tab completion', async ({ page }) => {
  await page.goto('/');
  await openTerminalOnMobile(page);
  const input = page.getByLabel('Portfolio terminal command');

  await input.fill('cd projects');
  await input.press('Enter');
  await expect(page.locator('[data-prompt]')).toHaveText('juanjo@portfolio:~/projects$');
  await expect(page.locator('[data-terminal-output]')).toContainText('airflow-observer/');

  await openTerminalOnMobile(page);
  await input.fill('who');
  await input.press('Tab');
  await expect(input).toHaveValue('whoami');
  await input.press('Enter');
  await expect(page).toHaveURL(/#about$/);

  await openTerminalOnMobile(page);
  await input.press('ArrowUp');
  await expect(input).toHaveValue('whoami');
});

test('boot can be skipped and is remembered for the session', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const boot = page.locator('[data-boot]');
  await expect(boot).toBeVisible();
  await page.getByRole('button', { name: /Skip/ }).click();
  await expect(boot).toBeHidden();

  await page.reload();
  await expect(page.locator('[data-boot]')).toHaveCount(0);
});

test('has no horizontal overflow and keeps private details out of the page', async ({ page }) => {
  await page.goto('/');

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    text: document.body.innerText
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  expect(dimensions.text).not.toContain('637932858');
  expect(dimensions.text).not.toContain('Download CV');
  expect(dimensions.text).not.toContain('CV_ENG.pdf');
});

test('mobile starts with the portfolio and exposes comfortable touch targets', async ({
  page
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/');

  const portfolioButton = page.getByRole('button', { name: 'Portfolio', exact: true });
  const terminalButton = page.getByRole('button', { name: 'Terminal', exact: true });
  const menuButton = page.getByRole('button', { name: 'Open portfolio menu', exact: true });
  await expect(portfolioButton).toHaveAttribute('aria-pressed', 'true');
  await expect(terminalButton).toHaveAttribute('aria-pressed', 'false');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#portfolio-panel')).toBeVisible();
  await expect(page.locator('#terminal-panel')).toBeHidden();

  const portfolioTargets = await page
    .locator(
      '.mobile-menu-toggle, .mobile-view-switcher button, .system-bar__identity, .document-actions a, .document-actions button'
    )
    .evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      })
    );
  expect(portfolioTargets.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);

  await menuButton.click();
  await expect(page.locator('[data-mobile-menu-toggle]')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#portfolio-menu')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#portfolio-menu [data-path]')).toHaveCount(11);

  await page.keyboard.press('Escape');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toBeFocused();

  await menuButton.click();
  await page.locator('[data-path="~/contact.txt"]').click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#portfolio-menu')).toHaveAttribute('aria-hidden', 'true');

  await terminalButton.click();
  await expect(terminalButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#terminal-panel')).toBeVisible();
  await expect(page.locator('#portfolio-panel')).toBeHidden();
  await expect(page.getByLabel('Portfolio terminal command')).not.toBeFocused();

  const terminalTargets = await page
    .locator('.mobile-view-switcher button, .quick-commands button, .terminal__line button, .terminal__form input')
    .evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      })
    );
  expect(terminalTargets.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);
});

test('supports keyboard navigation and reduced motion', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-boot]')).toHaveCount(0);

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);

  const animationDurations = await page.locator('.terminal__cursor').evaluate((element) => {
    const styles = window.getComputedStyle(element);
    return styles.animationDuration;
  });
  expect(['0.01ms', '1e-05s']).toContain(animationDurations);

  await expect(page.locator('[data-webster-sprite]')).toHaveAttribute('data-state', 'idle');
  const websterAnimation = await page.locator('[data-webster-pet]').evaluate((element) =>
    window.getComputedStyle(element).animationName
  );
  expect(websterAnimation).toBe('none');
});

test('Webster provides contextual, persistent and accessible guidance', async ({ page }) => {
  await page.goto('/');

  const webster = page.locator('[data-webster]');
  const bubble = page.locator('[data-webster-bubble]');
  const message = page.locator('[data-webster-message]');
  const pet = page.getByRole('button', { name: 'Ask Webster for a hint' });
  const mute = page.locator('[data-webster-mute]');

  await expect(webster).toBeVisible();
  await expect(message).toContainText('webster.service online');

  await pet.click();
  await expect(message).toHaveText('Start with Selected Work, or type `help` in the terminal.');
  await page.locator('[data-webster-action]').click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(message).toHaveText(
    'Three open-source systems. Open any README for the problem, design and impact.'
  );

  await mute.click();
  await expect(mute).toHaveAttribute('aria-pressed', 'true');
  await expect(mute).toHaveAttribute('aria-label', 'Enable automatic tips from Webster');
  await page.reload();
  await expect(mute).toHaveAttribute('aria-pressed', 'true');
  await expect(mute).toHaveAttribute('aria-label', 'Enable automatic tips from Webster');

  await pet.click();
  await expect(bubble).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(bubble).toBeHidden();

  await pet.click();
  await page.getByRole('button', { name: 'Minimize Webster' }).click();
  await expect(webster).toBeHidden();
  const restore = page.getByRole('button', { name: 'Restore Webster' });
  await expect(restore).toBeVisible();

  const restoreSize = await restore.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  expect(restoreSize.width).toBeGreaterThanOrEqual(44);
  expect(restoreSize.height).toBeGreaterThanOrEqual(44);

  await page.reload();
  await expect(page.getByRole('button', { name: 'Restore Webster' })).toBeVisible();
  await page.getByRole('button', { name: 'Restore Webster' }).click();
  await expect(webster).toBeVisible();
});

test('Webster keeps the latest hint during fast navigation and revisits sections', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    sessionStorage.setItem('jn-os-booted', 'true');
    sessionStorage.setItem(
      'jn-os-webster-session',
      JSON.stringify({ greeted: true, terminalSeen: false })
    );
  });
  await page.goto('/');

  const webster = page.locator('[data-webster]');
  const message = page.locator('[data-webster-message]');
  const firstRoamIndex = await webster.getAttribute('data-roam-index');

  await page.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent('portfolio:view-change', { detail: { view: 'about' } })
    );
    window.setTimeout(
      () =>
        window.dispatchEvent(
          new CustomEvent('portfolio:view-change', { detail: { view: 'contact' } })
        ),
      80
    );
  });

  await expect(message).toHaveText(
    'You reached the clean exit: email, GitHub and LinkedIn are all here.'
  );
  await expect.poll(() => webster.getAttribute('data-roam-index')).not.toBe(firstRoamIndex);

  await page.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent('portfolio:view-change', { detail: { view: 'about' } })
    );
  });
  await expect(message).toHaveText(
    'This is the human behind the system: role, focus and operating principles.'
  );
});
