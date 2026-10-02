import { chromium, webkit, expect } from '../../../site/node_modules/@playwright/test/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = dirname(fileURLToPath(import.meta.url));
const captures = join(root, 'captures');
await mkdir(captures, { recursive: true });
const report = { failures: [], pageErrors: [], consoleErrors: [], requestFailures: [], httpErrors: [], requestOrigins: new Set(), screenshots: [] };
const viewports = [['390', { width: 390, height: 844 }], ['768', { width: 768, height: 1000 }], ['1440', { width: 1440, height: 1000 }]];
const states = ['Idle', 'Working', 'Approval', 'Done', 'Error'];
const allowedOrigins = new Set(['http://localhost:3946', 'http://localhost:3947', 'http://127.0.0.1:3946', 'http://127.0.0.1:3947']);
const browsers = [];
function watch(page, tag) {
  page.on('pageerror', error => report.pageErrors.push(`${tag}: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(`${tag}: ${message.text()}`); });
  page.on('requestfailed', request => report.requestFailures.push(`${tag}: ${request.url()} ${request.failure()?.errorText}`));
  page.on('request', request => report.requestOrigins.add(new URL(request.url()).origin));
  page.on('response', response => { if (response.status() >= 400) report.httpErrors.push(`${tag}: ${response.status()} ${response.url()}`); });
}
async function open(browser, size, theme, tag) {
  const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  watch(page, tag);
  const response = await page.goto('http://localhost:3946', { waitUntil: 'domcontentloaded' });
  if (response?.status() !== 200) throw new Error(`${tag}: D4 HTTP ${response?.status()}`);
  const rootEl = page.getByTestId('d4-root');
  await rootEl.waitFor({ state: 'visible' });
  // Wait for real host state callbacks to update before injecting text or capturing.
  await page.getByRole('group', { name: 'D4 state fixture' }).getByRole('button', { name: 'Idle', exact: true }).click();
  if (await page.getByTestId('d4-phase').getAttribute('data-phase') !== 'waiting') throw new Error(`${tag}: host state callback did not settle`);
  await page.getByRole('group', { name: 'D4 state fixture' }).getByRole('button', { name: 'Working', exact: true }).click();
  if (await page.getByTestId('d4-phase').getAttribute('data-phase') !== 'acting') throw new Error(`${tag}: working host state did not settle`);
  if (theme === 'dark') await page.getByRole('button', { name: 'Dark', exact: true }).click();
  const frame = page.frameLocator('iframe[title="Current working-tree Agent Chat baseline"]');
  await frame.getByTestId('chat-demo-root').waitFor({ state: 'visible' });
  await expect(frame.getByRole('group', { name: 'Agent state fixture' }).getByRole('button', { name: 'Working', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.waitForFunction(() => document.fonts.ready);
  const actualTheme = await page.locator('.d4-root').getAttribute('class');
  if (!actualTheme?.includes(theme)) throw new Error(`${tag}: expected ${theme}; got ${actualTheme}`);
  const rootWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  if (rootWidth > size.width) throw new Error(`${tag}: horizontal overflow ${rootWidth}/${size.width}`);
  return page;
}
async function chooseState(page, state) {
  await page.getByRole('group', { name: 'D4 state fixture' }).getByRole('button', { name: state, exact: true }).click();
  const phase = await page.getByTestId('d4-phase').getAttribute('data-phase');
  const expected = { Idle: 'waiting', Working: 'acting', Approval: 'approval', Done: 'completed', Error: 'failed' }[state];
  if (phase !== expected) throw new Error(`${state}: expected phase ${expected}, got ${phase}`);
  await page.frameLocator('iframe[title="Current working-tree Agent Chat baseline"]').getByRole('group', { name: 'Agent state fixture' }).getByRole('button', { name: state, exact: true }).waitFor({ state: 'visible' });
  await expect(page.frameLocator('iframe[title="Current working-tree Agent Chat baseline"]').getByRole('group', { name: 'Agent state fixture' }).getByRole('button', { name: state, exact: true })).toHaveAttribute('aria-pressed', 'true');
}
async function capture(page, file) {
  const output = join(captures, file);
  await page.locator('.d4-window').screenshot({ path: output, animations: 'disabled' });
  report.screenshots.push(file);
}
async function captureViewport(page, file) {
  const output = join(captures, file);
  await page.screenshot({ path: output, animations: 'disabled' });
  report.screenshots.push(file);
}
try {
  for (const [engineName, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await engine.launch({ headless: true });
    browsers.push(browser);
    for (const [widthName, viewport] of viewports) {
      for (const theme of ['light', 'dark']) {
        const page = await open(browser, viewport, theme, `${engineName}-${widthName}-${theme}`);
        for (const state of states) {
          await chooseState(page, state);
          if (state === 'Approval') {
            await page.getByRole('button', { name: 'Allow', exact: true }).waitFor({ state: 'visible' });
            await page.getByTestId('d4-question').getByText('Which documentation scope should I use?', { exact: true }).waitFor({ state: 'visible' });
          }
          if (state === 'Working') {
            await page.getByTestId('d4-phase').waitFor({ state: 'visible' });
            await page.getByRole('button', { name: /4 tool calls/ }).waitFor({ state: 'visible' });
          }
          if (state === 'Done') {
            await page.getByRole('button', { name: /Check documentation routes/ }).waitFor({ state: 'visible' });
            await expect.poll(() => page.locator('[data-testid="d4-long-assistant-output"] .shiki-wrapper .line').count()).toBeGreaterThanOrEqual(3);
          }
          if (state === 'Done') await expect.poll(() => page.locator('[data-testid="d4-long-assistant-output"] .shiki-wrapper .line').count()).toBeGreaterThanOrEqual(3);
          if (state === 'Error') await page.getByRole('button', { name: /Run documentation tests/ }).waitFor({ state: 'visible' });
          await capture(page, `${engineName}-${widthName}-${theme}-${state.toLowerCase()}.png`);
        }
        await page.close();
      }
    }

    const page = await open(browser, { width: 1440, height: 1000 }, 'light', `${engineName}-interactions`);
    const composer = page.getByRole('textbox', { name: 'Prompt' });
    await composer.fill('@');
    await page.locator('[data-prompt-menu="at"] button').first().waitFor({ state: 'visible' });
    if (await page.locator('[data-prompt-menu="at"] button').count() !== 13) throw new Error(`${engineName}: source menu does not contain the 13 host fixture choices`);
    await capture(page, `${engineName}-sources-13.png`);
    const hostNoticeBeforeIme = await page.getByTestId('d4-host-event').innerText();
    await composer.evaluate((element) => element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 229, which: 229, isComposing: true, bubbles: true })));
    if (await composer.inputValue() !== '@' || (await page.getByTestId('d4-host-event').innerText()) !== hostNoticeBeforeIme) throw new Error(`${engineName}: IME Enter changed the source menu or sent a host callback`);
    await composer.fill('Check @Web after release.');
    const sourceCaret = 'Check @Web'.length;
    const sourceSuffix = 'Check @Web after release.'.slice(sourceCaret);
    await composer.focus();
    for (let count = 0; count < sourceSuffix.length; count += 1) await composer.press('ArrowLeft');
    await expect.poll(() => composer.evaluate((element) => element.selectionStart)).toBe(sourceCaret);
    await expect(page.locator('[data-prompt-menu="at"]')).toBeVisible();
    await composer.press('ArrowDown'); await composer.press('Enter');
    await expect(composer).toHaveValue('Check @Web search after release.');
    if (!(await page.getByTestId('d4-host-event').innerText()).includes('Host source callback received: web-search.')) throw new Error(`${engineName}: middle-caret source callback missing`);
    await capture(page, `${engineName}-source-middle-caret.png`);

    await composer.fill('Inspect @approval-r after release.');
    const longSourceCaret = 'Inspect @approval-r'.length;
    const longSourceSuffix = 'Inspect @approval-r after release.'.slice(longSourceCaret);
    await composer.focus();
    for (let count = 0; count < longSourceSuffix.length; count += 1) await composer.press('ArrowLeft');
    await expect(page.getByRole('button', { name: /research\/ai-refactor\/prototypes-v4\/captures\/approval-review-image-390\.png/ })).toBeVisible();
    await composer.press('Enter');
    await expect(composer).toHaveValue('Inspect @research/ai-refactor/prototypes-v4/captures/approval-review-image-390.png after release.');
    const composerOverflow = await page.locator('[data-promptbar]').evaluate((element) => element.scrollWidth > element.clientWidth);
    if (composerOverflow) throw new Error(`${engineName}: long source filename overflows PromptBar`);

    await composer.press('Enter');
    await composer.fill('Use /review after this route');
    const commandCaret = 'Use /review'.length;
    const commandSuffix = 'Use /review after this route'.slice(commandCaret);
    await composer.focus();
    for (let count = 0; count < commandSuffix.length; count += 1) await composer.press('ArrowLeft');
    await expect(page.locator('[data-prompt-menu="slash"]')).toBeVisible();
    await composer.press('Enter');
    await expect(composer).toHaveValue('Use /review after this route');
    if (!(await page.getByTestId('d4-host-event').innerText()).includes('Host command callback received: review.')) throw new Error(`${engineName}: command callback missing`);
    await page.getByRole('button', { name: 'Choose model' }).click();
    await page.getByRole('button', { name: 'Fast model' }).click();
    if (!(await page.getByTestId('d4-host-event').innerText()).includes('Host selected model id: host-fast.')) throw new Error(`${engineName}: model callback missing`);
    await capture(page, `${engineName}-menus-selected.png`);

    const modelControls = page.getByRole('group', { name: 'Model availability fixture' });
    await modelControls.getByRole('button', { name: 'Disable model picker' }).click();
    const modelTrigger = page.getByRole('button', { name: 'Choose model' });
    await expect(modelTrigger).toBeDisabled();
    await capture(page, `${engineName}-model-disabled.png`);
    await modelControls.getByRole('button', { name: 'Disable model picker' }).click();
    await modelControls.getByRole('button', { name: 'Clear model list' }).click();
    await expect(modelTrigger).toBeEnabled();
    await modelTrigger.click();
    await expect(page.locator('[data-model-menu] [role="status"]')).toContainText('No models available');
    await capture(page, `${engineName}-model-empty-menu.png`);
    await modelTrigger.click();
    await modelControls.getByRole('button', { name: 'Clear model list' }).click();

    await chooseState(page, 'Working');
    await page.getByRole('button', { name: /Review ChatComposer API/ }).last().click();
    await page.getByText('The host owns source, command, model and send callbacks.', { exact: true }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: /Show diff for src\/chat\/chat-composer\.tsx/ }).hover();
    await page.getByText('setDraft(prefix + insertion + suffix);', { exact: true }).waitFor({ state: 'visible' });
    await captureViewport(page, `${engineName}-tool-diff-hover.png`);
    await page.getByTestId('d4-phase').hover();
    const workingDisclosure = page.getByRole('button', { name: /Checking the Navbar docs/ }).first();
    await workingDisclosure.click();
    await expect(workingDisclosure).toHaveAttribute('aria-expanded', 'false');
    if (!(await page.locator('.activity-details [inert][aria-hidden="true"]').count())) throw new Error(`${engineName}: closed ThinkingState is not inert`);
    const toolDisclosure = page.getByRole('button', { name: /4 tool calls · 2 files/ });
    await toolDisclosure.click();
    await expect(toolDisclosure).toHaveAttribute('aria-expanded', 'false');
    if (!(await page.locator('.activity-details [inert][aria-hidden="true"]').count())) throw new Error(`${engineName}: closed ToolChips is not inert`);
    await capture(page, `${engineName}-working-closed-inert.png`);
    await toolDisclosure.click(); await workingDisclosure.click();
    await page.getByRole('button', { name: /Review CodeBlock output/ }).click();
    await expect(page.getByTestId('d4-tool-code-output')).toBeVisible();
    await expect.poll(() => page.locator('[data-testid="d4-tool-code-output"] .shiki-wrapper .line').count()).toBe(12);
    await expect(page.getByText('site/content/docs/ai/agent-timeline.zh-TW.mdx · code sample', { exact: true })).toBeVisible();
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`${engineName}: tool filename overflows page width`);
    await capture(page, `${engineName}-tool-code-output-12.png`);
    await page.getByRole('button', { name: /Review CodeBlock output/ }).click();
    await expect(page.getByTestId('d4-tool-code-output')).toHaveCount(0);

    await chooseState(page, 'Approval');
    const card = page.getByTestId('d4-question');
    const busyGroup = page.getByRole('group', { name: 'Approval request fixture' });
    await busyGroup.getByRole('button', { name: 'Busy approval' }).click();
    await expect(card.locator('[aria-busy="true"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Allow', exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Deny', exact: true })).toBeDisabled();
    await expect(card.getByRole('button', { name: /English, Simplified Chinese and Traditional Chinese/ })).toBeDisabled();
    await expect(card.getByRole('textbox', { name: 'Custom answer' })).toBeDisabled();
    await expect(card.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
    await capture(page, `${engineName}-approval-busy.png`);
    await busyGroup.getByRole('button', { name: 'Busy approval' }).click();
    await expect(card).toHaveAttribute('data-answer-count', '0');
    await card.getByRole('button', { name: /English, Simplified Chinese and Traditional Chinese/ }).click();
    await expect(card).toHaveAttribute('data-answer-count', '1');
    await card.getByRole('button', { name: 'Next', exact: true }).click();
    await card.getByRole('button', { name: 'Short summary', exact: true }).click();
    await expect(card).toHaveAttribute('data-answer-count', '2');
    await card.getByRole('button', { name: 'Save answers', exact: true }).click();
    if ((await page.getByTestId('d4-phase').getAttribute('data-phase')) !== 'approval') throw new Error(`${engineName}: questionnaire answers decided the tool`);
    if (!(await page.getByTestId('d4-host-event').innerText()).includes('tool approval is still pending')) throw new Error(`${engineName}: questionnaire/tool boundary notice missing`);
    await page.getByRole('button', { name: 'Allow', exact: true }).click();
    if ((await page.getByTestId('d4-phase').getAttribute('data-phase')) !== 'completed') throw new Error(`${engineName}: local Allow callback did not complete`);
    await capture(page, `${engineName}-approval-allow.png`);

    await chooseState(page, 'Approval');
    await expect(page.getByTestId('d4-question')).toHaveAttribute('data-answer-count', '0');
    await page.getByRole('button', { name: 'Deny', exact: true }).click();
    if ((await page.getByTestId('d4-phase').getAttribute('data-phase')) !== 'cancelled') throw new Error(`${engineName}: Deny did not cancel`);
    await page.getByRole('button', { name: /Check documentation routes/ }).waitFor({ state: 'visible' });
    if (await page.getByRole('button', { name: /Run documentation tests/ }).count()) throw new Error(`${engineName}: cancelled state shows a command task row`);
    if (await page.getByText('Typecheck failed', { exact: true }).count()) throw new Error(`${engineName}: cancelled output shows a failed command`);
    await capture(page, `${engineName}-approval-deny.png`);

    await chooseState(page, 'Error');
    await page.getByRole('button', { name: /Run documentation tests/ }).click();
    await page.getByText('Typecheck failed', { exact: true }).waitFor({ state: 'visible' });
    await capture(page, `${engineName}-error-failed-command.png`);

    await chooseState(page, 'Done');
    await expect.poll(() => page.locator('[data-testid="d4-long-assistant-output"] .shiki-wrapper .line').count()).toBeGreaterThanOrEqual(3);
    const foldedOutput = page.getByTestId('d4-long-output');
    await expect(foldedOutput.locator('.shiki-wrapper .line')).toHaveCount(80);
    await expect(foldedOutput.locator('.shiki-wrapper')).not.toBeVisible();
    await foldedOutput.locator('summary').click();
    await expect(foldedOutput.locator('.shiki-wrapper')).toBeVisible();
    await expect.poll(() => foldedOutput.locator('.shiki-wrapper .line').count()).toBe(80);
    await capture(page, `${engineName}-done-code-80-expanded.png`);
    await foldedOutput.locator('summary').click();
    const routes = page.getByRole('button', { name: /Check documentation routes/ });
    const detailsInert = await routes.evaluate(element => element.parentElement?.querySelector('[inert][aria-hidden="true"]')?.hasAttribute('inert') ?? false);
    if (!detailsInert) throw new Error(`${engineName}: collapsed TaskRows details are not inert`);
    await routes.click();
    await expect(routes).toHaveAttribute('aria-expanded', 'true');
    await page.getByText('Navbar route rendered', { exact: true }).waitFor({ state: 'visible' });
    await routes.locator('..').getByText('site/content/docs/ai/agent-timeline.zh-TW.mdx', { exact: true }).waitFor({ state: 'visible' });
    const noteWidth = await page.getByTestId('d4-root').evaluate(element => element.scrollWidth > element.clientWidth);
    if (noteWidth) throw new Error(`${engineName}: long TaskRows metadata causes horizontal overflow`);
    await capture(page, `${engineName}-task-expanded.png`);
    await expect(page.getByRole('link', { name: /Review the three CodeBlock scenarios/ })).toHaveAttribute('href', 'http://localhost:3947/prototype/codeblock-v4');

    await chooseState(page, 'Idle');
    const longUserMessage = `Please compare the localized Navbar release notes, verify every assistant-owned source identifier, and keep the existing result visible. ${"The host owns this message data and the preview does not send it anywhere. ".repeat(8)}`;
    await composer.fill(longUserMessage);
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    if ((await page.getByTestId('d4-phase').getAttribute('data-phase')) !== 'acting') throw new Error(`${engineName}: local send callback did not enter working`);
    await expect(page.getByText(longUserMessage, { exact: true })).toBeVisible();
    const scroll = page.locator('.conversation-scroll');
    for (let index = 0; index < 9; index += 1) {
      await composer.fill(`Scrollback reference ${index + 1}: preserve the route result while appending this host-local follow-up.`);
      await page.getByRole('button', { name: 'Send', exact: true }).click();
    }
    if (await page.locator('.user-turn').count() < 11) throw new Error(`${engineName}: long local history entries were not preserved`);
    if (!(await scroll.evaluate(element => element.scrollHeight > element.clientHeight))) throw new Error(`${engineName}: long conversation did not create scrollback`);
    await scroll.evaluate(element => { element.scrollTop = 0; element.dispatchEvent(new Event('scroll', { bubbles: true })); });
    await composer.fill('Append a short follow-up while reading the beginning of the thread.');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await expect.poll(() => scroll.evaluate(element => element.scrollTop)).toBe(0);
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`${engineName}: long messages or filenames cause horizontal page overflow`);
    await capture(page, `${engineName}-local-send.png`);
    await page.close();
    await browser.close();
    browsers.pop();
  }
} catch (error) {
  report.failures.push(error?.stack ?? String(error));
} finally {
  await Promise.all(browsers.map(browser => browser.close().catch(() => {})));
  report.requestOrigins = [...report.requestOrigins];
  report.unexpectedOrigins = report.requestOrigins.filter(origin => !allowedOrigins.has(origin));
  await writeFile(join(captures, 'capture-log.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}
if (report.failures.length || report.pageErrors.length || report.consoleErrors.length || report.httpErrors.length) process.exitCode = 1;
