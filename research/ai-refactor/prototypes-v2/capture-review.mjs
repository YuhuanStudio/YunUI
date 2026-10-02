import { chromium, webkit } from '../../../site/node_modules/@playwright/test/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const captures = join(root, 'captures');
await mkdir(captures, { recursive: true });
const report = { pageErrors: [], consoleErrors: [], requestFailures: [], httpErrors: [], requestOrigins: new Set() };
const viewports = [
  ['390', { width: 390, height: 844 }],
  ['768', { width: 768, height: 1000 }],
  ['1440', { width: 1440, height: 1000 }],
];
const states = [['idle','等待'],['working','執行中'],['approval','待確認'],['done','完成'],['error','失敗']];
const activeBrowsers = [];
function observe(page, tag) {
  page.on('pageerror', error => report.pageErrors.push(`${tag}: ${error.message}`));
  page.on('console', msg => { if (msg.type() === 'error') report.consoleErrors.push(`${tag}: ${msg.text()}`); });
  page.on('requestfailed', request => report.requestFailures.push(`${tag}: ${request.url()} ${request.failure()?.errorText}`));
  page.on('request', request => report.requestOrigins.add(new URL(request.url()).origin));
  page.on('response', response => { if (response.status() >= 400) report.httpErrors.push(`${tag}: ${response.status()} ${response.url()}`); });
}
async function openPage(browser, viewport, theme, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(7000);
  observe(page, label);
  const response = await page.goto('http://localhost:3943', { waitUntil: 'networkidle' });
  if (response?.status() !== 200) throw new Error(`${label}: HTTP ${response?.status()}`);
  if (theme === 'dark') await page.getByRole('button', { name: '深色' }).click();
  await page.waitForTimeout(350);
  const appClass = await page.locator('.app').getAttribute('class');
  if (!appClass?.includes(theme)) throw new Error(`${label}: expected ${theme} theme; got ${appClass}`);
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`${label}: horizontal overflow`);
  return page;
}
async function chooseState(page, name) {
  await page.getByRole('group', { name: '示範狀態' }).getByRole('button', { name, exact: true }).click();
  await page.waitForTimeout(180);
}
async function save(page, file) { await page.screenshot({ path: join(captures, file), fullPage: true }); }
try {
  for (const [engineName, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await engine.launch({ headless: true });
    activeBrowsers.push(browser);
    // 3 widths × 2 themes × 2 engines. The default active-run state is captured first.
    for (const [width, viewport] of viewports) {
      for (const theme of ['light', 'dark']) {
        const label = `${engineName}-${width}-${theme}`;
        const page = await openPage(browser, viewport, theme, label);
        await save(page, `${label}-working.png`);
        await page.close();
      }
    }
    // Every state at mobile and desktop sizes, in both themes and engines.
    for (const [width, viewport] of viewports) {
      for (const theme of ['light', 'dark']) {
        const page = await openPage(browser, viewport, theme, `${engineName}-${width}-${theme}-states`);
        for (const [key, label] of states) {
          await chooseState(page, label);
          await save(page, `${engineName}-${width}-${theme}-${key}.png`);
        }
        await page.close();
      }
    }
    // Keyboard behavior and process disclosure: verify selected values and visible details.
    const page = await openPage(browser, { width: 1440, height: 1000 }, 'light', `${engineName}-interaction`);
    const prompt = page.getByRole('textbox', { name: 'Prompt' });
    await prompt.fill('@');
    await page.waitForTimeout(250);
    await save(page, `${engineName}-source-menu.png`);
    await prompt.evaluate(element => element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 229, which: 229, isComposing: true, bubbles: true })));
    if (await prompt.inputValue() !== '@') throw new Error(`${engineName}: composition Enter changed the source draft`);
    if (!(await page.getByRole('button', { name: /YunUI export catalogue/ }).isVisible())) throw new Error(`${engineName}: composition Enter dismissed the source menu`);
    await prompt.press('ArrowDown');
    await prompt.press('Enter');
    const sourceValue = await prompt.inputValue();
    if (sourceValue !== '@YunUI export catalogue ') throw new Error(`${engineName}: @ keyboard selection produced ${JSON.stringify(sourceValue)}`);
    await save(page, `${engineName}-source-selected.png`);

    await prompt.fill('/');
    await page.waitForTimeout(250);
    await save(page, `${engineName}-command-menu.png`);
    await prompt.press('ArrowDown');
    await prompt.press('Enter');
    const commandValue = await prompt.inputValue();
    if (commandValue !== '/summarize ') throw new Error(`${engineName}: / keyboard selection produced ${JSON.stringify(commandValue)}`);

    await page.getByRole('button', { name: 'Choose model' }).click();
    await page.waitForTimeout(250);
    await save(page, `${engineName}-model-menu.png`);
    await page.getByRole('button', { name: 'Reasoning 02' }).click();
    const selectedModel = await page.locator('[data-promptbar] button[aria-label="Choose model"]').innerText();
    if (!selectedModel.includes('Reasoning 02')) throw new Error(`${engineName}: model selection was not retained`);

    await page.getByRole('button', { name: /^讀取匯出目錄/ }).click();
    await page.waitForTimeout(250);
    const toolDetail = page.getByText('找到 ChatComposer、AgentTimeline 與 AgentRunStatus。', { exact: true });
    if (!(await toolDetail.isVisible())) throw new Error(`${engineName}: expanded ToolChips detail is not visible`);
    await save(page, `${engineName}-tool-expanded.png`);

    await chooseState(page, '待確認');
    const approval = page.locator('.upstreamApproval');
    await approval.getByRole('button', { name: 'Composer 工具列' }).click();
    await page.waitForTimeout(600);
    if (!(await approval.getByRole('button', { name: 'Previous question' }).isDisabled())) throw new Error(`${engineName}: approval advanced without explicit action`);
    await save(page, `${engineName}-approval-selected.png`);
    await approval.getByRole('button', { name: '下一步' }).click();
    await approval.getByRole('button', { name: '可展開的工具列' }).click();
    await approval.getByRole('button', { name: '完成示範' }).click();
    const donePressed = await page.getByRole('group', { name: '示範狀態' }).getByRole('button', { name: '完成', exact: true }).getAttribute('aria-pressed');
    if (donePressed !== 'true') throw new Error(`${engineName}: local approval did not transition to the done state`);
    await save(page, `${engineName}-approval-local-complete.png`);

    await chooseState(page, '失敗');
    const task = page.locator('.portedTasks').getByRole('button', { name: /讀取匯出/ });
    await task.click();
    if (!(await page.locator('.portedTasks').getByText('ChatComposer', { exact: true }).isVisible())) throw new Error(`${engineName}: TaskRows detail did not expand`);
    await save(page, `${engineName}-taskrow-expanded.png`);
    await prompt.fill('Run local sample');
    await prompt.press('Enter');
    const workingPressed = await page.getByRole('group', { name: '示範狀態' }).getByRole('button', { name: '執行中', exact: true }).getAttribute('aria-pressed');
    if (workingPressed !== 'true' || await prompt.inputValue() !== '') throw new Error(`${engineName}: local PromptBar send callback did not reset input and enter working state`);
    await save(page, `${engineName}-local-send.png`);
    await page.close();
    await browser.close();
    activeBrowsers.pop();
  }
} catch (error) {
  report.pageErrors.push(`capture: ${error.stack ?? error}`);
} finally {
  await Promise.all(activeBrowsers.map(browser => browser.close().catch(() => {})));
  const result = { ...report, requestOrigins: [...report.requestOrigins] };
  await writeFile(join(captures, 'capture-log.json'), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
}
if (report.pageErrors.length || report.consoleErrors.length || report.requestFailures.length || report.httpErrors.length) process.exitCode = 1;
