import { chromium, webkit } from '../../../site/node_modules/@playwright/test/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root=dirname(fileURLToPath(import.meta.url));const captures=join(root,'captures');await mkdir(captures,{recursive:true});
const report={pageErrors:[],consoleErrors:[],requestFailures:[],httpErrors:[],requestOrigins:new Set(),assertions:[]};
const viewports=[['390',{width:390,height:844}],['768',{width:768,height:1000}],['1440',{width:1440,height:1000}]];
const browsers=[['chromium',chromium],['webkit',webkit]];
const active=[];
function watch(page,label){page.on('pageerror',e=>report.pageErrors.push(`${label}: ${e.message}`));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(`${label}: ${m.text()}`)});page.on('requestfailed',r=>report.requestFailures.push(`${label}: ${r.url()} ${r.failure()?.errorText}`));page.on('request',r=>report.requestOrigins.add(new URL(r.url()).origin));page.on('response',r=>{if(r.status()>=400)report.httpErrors.push(`${label}: ${r.status()} ${r.url()}`)})}
async function newPage(browser,viewport,label){const page=await browser.newPage({viewport,deviceScaleFactor:1});page.setDefaultTimeout(7000);watch(page,label);const response=await page.goto('http://localhost:3945',{waitUntil:'networkidle'});if(response?.status()!==200)throw Error(`${label}: fixture HTTP ${response?.status()}`);const style=await page.locator('[data-testid="model-picker"] button').first().evaluate(el=>({radius:getComputedStyle(el).borderTopLeftRadius,padding:getComputedStyle(el).paddingTop}));if(style.radius==='0px'||style.padding==='0px')throw Error(`${label}: compiled YunUI CSS did not load (${JSON.stringify(style)})`);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(overflow)throw Error(`${label}: horizontal overflow`);return page}
async function capture(page,name){await page.screenshot({path:join(captures,`${name}.png`),fullPage:true})}
try{
 for(const [browserName,engine] of browsers){const browser=await engine.launch({headless:true});active.push(browser);
  for(const [width,viewport] of viewports)for(const theme of ['light','dark']){const label=`${browserName}-${width}-${theme}`;const page=await newPage(browser,viewport,label);if(theme==='dark'){await page.getByRole('button',{name:'Dark'}).click();await page.waitForTimeout(200)}await capture(page,`${label}-runtime`);await page.close()}
  const page=await newPage(browser,{width:1440,height:1200},`${browserName}-assertions`);
  // Disabled ModelSelect option must remain inert even when a pointer event is forced;
  // an enabled choice must still call the host-owned onChange handler.
  const picker=page.getByTestId('model-picker');const trigger=picker.getByRole('button').first();
  await trigger.click();await page.waitForTimeout(220);
  const disabled=page.getByRole('option',{name:/Disabled fixture model/});
  if(await disabled.getAttribute('aria-disabled')!=='true')throw Error(`${browserName}: disabled model option lacks aria-disabled=true`);
  await disabled.click({force:true});
  if(await page.getByTestId('model-changes').innerText()!=='')throw Error(`${browserName}: disabled model option called onChange`);
  if(await page.getByTestId('model-value').innerText()!=='Selectable fixture model')throw Error(`${browserName}: disabled model option changed the selected value`);
  await page.getByRole('combobox',{name:'Search fixture models…'}).fill('Selectable fixture model');
  await page.getByRole('option',{name:/Selectable fixture model/}).click();
  if(await page.getByTestId('model-value').innerText()!=='Selectable fixture model'||await page.getByTestId('model-changes').innerText()!=='active-model')throw Error(`${browserName}: enabled model option did not call onChange`);
  await trigger.click();await page.waitForTimeout(180);const search=page.getByRole('combobox',{name:'Search fixture models…'});await search.fill('');
  await search.press('ArrowDown');await search.press('ArrowDown');await search.press('Enter');
  if(await page.getByTestId('model-value').innerText()!=='Second selectable model'||await page.getByTestId('model-changes').innerText()!=='active-model,other-model')throw Error(`${browserName}: two ArrowDowns from the disabled first row did not select the following enabled model`);
  await trigger.click();await page.waitForTimeout(180);await page.getByRole('combobox',{name:'Search fixture models…'}).fill('Selectable');await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.activeElement===document.querySelector('[data-testid="model-picker"] button'));
  if(!(await trigger.evaluate(el=>el===document.activeElement)))throw Error(`${browserName}: Escape did not restore focus to ModelSelect trigger`);
  report.assertions.push(`${browserName}: ModelSelect disabled/active/Escape`);
  await capture(page,`${browserName}-model-disabled-and-escape`);

  // A closed tool output must neither receive Tab nor expose an active focus target.
  const timeline=page.getByTestId('output-timeline');const toolToggle=timeline.getByRole('button',{name:/Read fixture/});const output=timeline.getByRole('region',{name:'Read fixture output'});
  const outputCount=await output.count();
  if(outputCount){const protectedFromFocus=await output.evaluate(el=>{let n=el;while(n){if(n.inert||n.getAttribute('aria-hidden')==='true')return true;if(n===document.body)break;n=n.parentElement}return el.tabIndex<0});if(!protectedFromFocus)throw Error(`${browserName}: collapsed AgentTimeline output is neither inert, aria-hidden, nor removed from tab order`)}
  await toolToggle.focus();await page.keyboard.press('Tab');
  if(outputCount&&await output.evaluate(el=>el===document.activeElement))throw Error(`${browserName}: Tab focused closed AgentTimeline output`);
  await toolToggle.click();if(!(await output.isVisible()))throw Error(`${browserName}: opening AgentTimeline did not reveal tool output`);
  await toolToggle.focus();await page.keyboard.press('Tab');if(!(await output.evaluate(el=>el===document.activeElement)))throw Error(`${browserName}: open AgentTimeline output is not keyboard-focusable`);
  await capture(page,`${browserName}-timeline-open-focus`);report.assertions.push(`${browserName}: AgentTimeline closed/open Tab order`);

  // Approval controls are disabled without host callbacks and active when callbacks exist.
  const approvals=page.getByTestId('approval-no-callback');
  for(const name of ['Approve without callback','Reject without callback'])if(!(await approvals.getByRole('button',{name}).isDisabled()))throw Error(`${browserName}: ${name} should be disabled with no callback`);
  const wired=page.getByTestId('approval-with-callback');
  const approve=wired.getByRole('button',{name:'Approve with callback'});const reject=wired.getByRole('button',{name:'Reject with callback'});
  if(await approve.isDisabled()||await reject.isDisabled())throw Error(`${browserName}: callback-backed approval controls are disabled`);
  await approve.click();await reject.click();
  if(await page.getByTestId('approve-count').innerText()!=='approve:with-callback'||await page.getByTestId('reject-count').innerText()!=='reject:with-callback')throw Error(`${browserName}: approval callbacks did not receive the host fixture id`);
  report.assertions.push(`${browserName}: approval disabled/enabled callbacks`);await capture(page,`${browserName}-approval-callbacks`);

  // Stop has no action without onStop, but remains available and invokes the host callback when wired.
  const stopDisabled=page.getByTestId('stop-no-callback').getByRole('button',{name:'Stop'});
  if(!(await stopDisabled.isDisabled()))throw Error(`${browserName}: Stop without callback is not disabled`);
  const stopActive=page.getByTestId('stop-callback').getByRole('button',{name:'Stop fixture'});
  if(await stopActive.isDisabled())throw Error(`${browserName}: callback-backed Stop is disabled`);
  await stopActive.click();if(await page.getByTestId('stop-count').innerText()!=='1')throw Error(`${browserName}: onStop callback count did not advance`);
  report.assertions.push(`${browserName}: Stop disabled/enabled callback`);

  // Composition Enter must preserve text and not send; ordinary Enter may send once.
  const textarea=page.getByPlaceholder('IME fixture prompt');await textarea.fill('composition draft');
  await textarea.evaluate(el=>el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:229,which:229,isComposing:true,bubbles:true})));
  if(await page.getByTestId('send-count').innerText()!=='0'||await page.getByTestId('ime-value').innerText()!=='composition draft')throw Error(`${browserName}: composition Enter sent or changed the draft`);
  await textarea.press('Enter');if(await page.getByTestId('send-count').innerText()!=='1')throw Error(`${browserName}: ordinary Enter did not send`);
  report.assertions.push(`${browserName}: ChatComposer IME Enter/ordinary Enter`);await capture(page,`${browserName}-ime-and-send`);
  await page.close();await browser.close();active.pop();
 }
}catch(error){report.pageErrors.push(`fixture: ${error.stack??error}`)}finally{await Promise.all(active.map(browser=>browser.close().catch(()=>{})));const result={...report,requestOrigins:[...report.requestOrigins]};await writeFile(join(captures,'runtime-test-log.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2))}
const allowed=new Set(['http://localhost:3945']);
if(report.pageErrors.length||report.consoleErrors.length||report.requestFailures.length||report.httpErrors.length||[...report.requestOrigins].some(origin=>!allowed.has(origin)))process.exitCode=1;
