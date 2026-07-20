import { expect, test, type Page } from '@playwright/test';

const openDocumentOnMobile = async (page: Page) => {
  if (await page.getByRole('button', { name: 'VIEW' }).isVisible()) {
    await page.getByRole('button', { name: 'VIEW' }).click();
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

  const input = page.getByLabel('Portfolio terminal command');
  await input.fill('open airflow-observer');
  await input.press('Enter');

  await expect(page).toHaveURL(/#project-airflow-observer$/);
  await expect(page.getByRole('heading', { name: 'Airflow Observer' })).toBeVisible();
  await expect(page.locator('[data-terminal-output]')).toContainText(
    'Opened ~/projects/airflow-observer/README.md'
  );

  if (await page.getByRole('button', { name: 'TERM' }).isVisible()) {
    await page.getByRole('button', { name: 'TERM' }).click();
  }

  await input.fill('not-a-command');
  await input.press('Enter');
  await expect(page.locator('[data-terminal-output]')).toContainText(
    "command not found. Type 'help'"
  );
});

test('supports file commands, history and tab completion', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('Portfolio terminal command');

  await input.fill('cd projects');
  await input.press('Enter');
  await expect(page.locator('[data-prompt]')).toHaveText('juanjo@portfolio:~/projects$');
  await expect(page.locator('[data-terminal-output]')).toContainText('airflow-observer/');

  if (await page.getByRole('button', { name: 'TERM' }).isVisible()) {
    await page.getByRole('button', { name: 'TERM' }).click();
  }
  await input.fill('who');
  await input.press('Tab');
  await expect(input).toHaveValue('whoami');
  await input.press('Enter');
  await expect(page).toHaveURL(/#about$/);

  if (await page.getByRole('button', { name: 'TERM' }).isVisible()) {
    await page.getByRole('button', { name: 'TERM' }).click();
  }
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
});
