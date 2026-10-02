import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AgentTimeline, type AgentTimelineBlock, ModelSelect, type ModelSelectOption } from '@yuhuanowo/yunui/ai';
import { ChatComposer } from '@yuhuanowo/yunui/chat';

const modelOptions: ModelSelectOption[] = [
  { id: 'disabled-model', label: 'Disabled fixture model', group: 'Fixture provider', disabled: true, detail: <span className="text-xs">Not available</span> },
  { id: 'active-model', label: 'Selectable fixture model', group: 'Fixture provider', detail: <span className="text-xs">Ready</span> },
  { id: 'other-model', label: 'Second selectable model', group: 'Other provider', detail: <span className="text-xs">Ready</span> },
];
const outputBlock: AgentTimelineBlock[] = [
  { kind: 'tool', id: 'fixture-output', verb: 'Read fixture', summary: 'example.ts', status: 'done', command: 'read example.ts', output: 'Fixture output contains keyboard-focusable sample text.' },
];
const noCallbackBlock: AgentTimelineBlock[] = [
  { kind: 'approval', id: 'no-callback', title: 'Review this fixture', verb: 'Host approval', message: 'No callbacks are provided for this instance.', allowLabel: 'Approve without callback', denyLabel: 'Reject without callback' },
];
const callbackBlock: AgentTimelineBlock[] = [
  { kind: 'approval', id: 'with-callback', title: 'Review this fixture', verb: 'Host approval', message: 'Callbacks update only the local counters below.', allowLabel: 'Approve with callback', denyLabel: 'Reject with callback' },
];
function App() {
  const [dark, setDark] = useState(false);
  const [model, setModel] = useState('active-model');
  const [modelChanges, setModelChanges] = useState<string[]>([]);
  const [approveCalls, setApproveCalls] = useState<string[]>([]);
  const [rejectCalls, setRejectCalls] = useState<string[]>([]);
  const [stopCalls, setStopCalls] = useState(0);
  const [sendCalls, setSendCalls] = useState(0);
  const [draft, setDraft] = useState('');
  const [imeDraft, setImeDraft] = useState('');
  const selected = modelOptions.find(option => option.id === model)!;
  return <div>
    <main className="fixture">
      <header><h1>AI runtime regression fixture</h1><button className="themeToggle" onClick={() => setDark(value => { const next=!value; document.documentElement.classList.toggle('dark',next); return next; })}>{dark ? 'Light' : 'Dark'}</button></header>
      <section aria-labelledby="model-heading"><h2 id="model-heading">ModelSelect disabled option, selection, and Escape focus restore</h2>
        <div className="fixtureRow"><div data-testid="model-picker"><ModelSelect options={modelOptions} value={model} onChange={id => { setModel(id); setModelChanges(values => [...values, id]); }} labels={{placeholder:'Fixture model picker',search:'Search fixture models…'}} /></div>
          <output data-testid="model-value">{selected.label}</output><output data-testid="model-changes">{modelChanges.join(',')}</output>
        </div>
      </section>
      <section aria-labelledby="timeline-heading"><h2 id="timeline-heading">AgentTimeline closed output and keyboard focus</h2>
        <div data-testid="output-timeline"><AgentTimeline blocks={outputBlock}/></div>
      </section>
      <div className="fixtureGrid">
        <section data-testid="approval-no-callback" aria-labelledby="approval-no-callback-heading"><h2 id="approval-no-callback-heading">Approval with no callbacks</h2><AgentTimeline blocks={noCallbackBlock}/></section>
        <section data-testid="approval-with-callback" aria-labelledby="approval-callback-heading"><h2 id="approval-callback-heading">Approval with host callbacks</h2><AgentTimeline blocks={callbackBlock} onApprove={id => setApproveCalls(values => [...values,id])} onReject={id => setRejectCalls(values => [...values,id])}/><div className="fixtureOutput"><span data-testid="approve-count">approve:{approveCalls.join(',')}</span> · <span data-testid="reject-count">reject:{rejectCalls.join(',')}</span></div></section>
      </div>
      <div className="fixtureGrid">
        <section data-testid="stop-no-callback" aria-labelledby="stop-no-callback-heading"><h2 id="stop-no-callback-heading">Stop without callback</h2><ChatComposer value="Pending fixture request" onChange={() => {}} onSend={() => {}} loading/></section>
        <section data-testid="stop-callback" aria-labelledby="stop-callback-heading"><h2 id="stop-callback-heading">Stop with host callback</h2><ChatComposer value="Pending fixture request" onChange={() => {}} onSend={() => {}} onStop={() => setStopCalls(value => value+1)} loading labels={{stop:'Stop fixture'}}/><output data-testid="stop-count">{stopCalls}</output></section>
      </div>
      <section aria-labelledby="ime-heading"><h2 id="ime-heading">ChatComposer IME Enter and normal Enter</h2><ChatComposer value={imeDraft} onChange={setImeDraft} onSend={() => setSendCalls(value => value+1)} placeholder="IME fixture prompt"/><output data-testid="send-count">{sendCalls}</output><output data-testid="ime-value">{imeDraft}</output></section>
    </main>
  </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
