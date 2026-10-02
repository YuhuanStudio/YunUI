import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PromptBar from './upstream/PromptBar';
import ApprovalCard from './upstream/ApprovalCard';

const undefinedPromptLabels = {
  addAttachments: undefined,
  prompt: undefined,
  chooseModel: undefined,
  send: undefined,
  removeAttachment: undefined,
} as never;
const undefinedApprovalLabels = {
  dismiss: undefined,
  customAnswer: undefined,
  previousQuestion: undefined,
  nextQuestion: undefined,
} as never;

function LabelFixture() {
  const [sentText, setSentText] = useState('');
  return <main className="labelFixture">
    <section>
      <h1>Accessibility label override fixture</h1>
      <PromptBar
        demo={false}
        tall
        placeholder="Fixture prompt placeholder"
        onSend={setSentText}
        labels={{
          addAttachments:'Demo attachments menu',
          prompt:'Demo prompt input',
          chooseModel:'Demo model picker',
          send:'Demo send message',
          removeAttachment:(file)=>`Demo remove ${file}`,
        }}
      />
      <p data-testid="sent-text">{sentText}</p>
    </section>
    <section>
      <ApprovalCard
        manualAdvance
        labels={{
          skip:'Demo skip',
          continue:'Demo continue',
          send:'Demo finish',
          customPlaceholder:'Fixture custom response',
          sentMessage:'Demo answers recorded',
          dismiss:'Demo dismiss approval',
          customAnswer:'Demo custom answer',
          previousQuestion:'Demo previous step',
          nextQuestion:'Demo next step',
        }}
        questions={[
          {q:'Fixture approval first question',type:'radio',options:['First fixture choice','Second fixture choice']},
          {q:'Fixture approval second question',type:'radio',options:['Accept fixture','Request changes']},
        ]}
      />
    </section>
    <section data-testid="undefined-label-fallbacks">
      <h2>Explicit undefined values retain English defaults</h2>
      <PromptBar demo={false} tall labels={undefinedPromptLabels} />
      <ApprovalCard manualAdvance labels={undefinedApprovalLabels} />
    </section>
  </main>;
}
createRoot(document.getElementById('root')!).render(<LabelFixture/>);
