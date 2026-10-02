import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, AlignLeft, ArrowDown, ArrowUp, Bot, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, FileCode2, FileText, Layers, ListChecks, MessageSquare, MoreHorizontal, Paperclip, Search, Settings2, Shield, Sparkles, SquarePen } from 'lucide-react';
import { Badge } from '@yuhuanowo/yunui';
import PromptBar from './upstream/PromptBar';
import ThinkingState from './upstream/ThinkingState';
import ToolChips from './upstream/ToolChips';
import TaskRows from './upstream/TaskRows';
import ApprovalCard from './upstream/ApprovalCard';

type Mode = 'idle'|'working'|'approval'|'done'|'error';
const stateLabels: Record<Mode,string> = { idle:'等待', working:'執行中', approval:'待確認', done:'完成', error:'失敗' };
const processSteps = [
  {icon:'think',label:'檢查公開 API',chip:'ChatComposer',mono:true,detailMono:true,detail:[{text:'確認受控輸入、toolbar 與 attachments 插槽。'}]},
  {icon:'read',label:'讀取匯出目錄',chip:'catalog.generated.json',mono:true,detailMono:true,detail:[{text:'找到 ChatComposer、AgentTimeline 與 AgentRunStatus。'}]},
  {icon:'write',label:'比對互動來源',chip:'PromptBar.tsx',mono:true,detailMono:true,detail:[{text:'@ 來源與 / 指令可由 composer 內建選單呈現。'}]},
];
const diffs = [{file:'ChatComposer.tsx',add:18,del:4},{file:'AgentTimeline.tsx',add:12,del:2}];
const diffLines = {'ChatComposer.tsx':[{text:'toolbar: @ sources and / commands',tone:'add' as const},{text:'caret callback: unavailable',tone:'del' as const}],'AgentTimeline.tsx':[{text:'run status summary',tone:'add' as const},{text:'expandable tool trace',tone:'add' as const}]};
function App() {
 const [mode,setMode]=useState<Mode>('working');
 const [theme,setTheme]=useState<'light'|'dark'>('light');
 const [sources,setSources]=useState(['PromptBar.tsx','YunUI export catalogue']);
 const fixedTick = mode==='error'?3:mode==='done'?4:mode==='working'?2:1;
 const taskRows = [
  {key:'exports',label:'讀取匯出',amount:'12',status:'done' as const,details:[{label:'ChatComposer',meta:'found'},{label:'AgentTimeline',meta:'found'}]},
  {key:'patterns',label:'來源模式',amount:'2',status:mode==='working'?'running' as const:'done' as const,step:2,details:[{label:'@ sources',meta:'toolbar'},{label:'/ commands',meta:'toolbar'}]},
  {key:'review',label:'API 邊界',amount:'1',status:'sequence' as const,step:3,details:[{label:'Caret callback',meta:'unavailable'},{label:'Owner review',meta:'pending'}]},
 ];
 return <div className={`app ${theme}`}>
  <header className="topbar"><div className="brand"><span className="brandMark"><Sparkles size={15}/></span><b>Beautiful UI</b><span className="crumb">/ Agent Chat</span></div><div className="topActions"><button className="iconBtn" aria-label="搜尋"><Search size={16}/></button><button className="iconBtn" aria-label="設定"><Settings2 size={16}/></button><button className="themeBtn" onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?'深色':'淺色'}</button><div className="avatar">Y</div></div></header>
  <aside className="sidebar"><button className="newChat"><SquarePen size={15}/> 新對話</button><div className="navLabel">工作區</div><button className="navItem active"><Bot size={16}/> Agent Chat</button><button className="navItem"><Layers size={16}/> 元件目錄</button><button className="navItem"><ListChecks size={16}/> 工作流程</button><div className="navLabel historyLabel">最近對話</div><button className="historyItem active"><MessageSquare size={14}/> Agent Chat 互動草案</button><button className="historyItem"><MessageSquare size={14}/> 元件 API 核對</button><button className="historyItem"><MessageSquare size={14}/> 工具狀態設計</button><div className="sideBottom"><div className="userCard"><div className="avatar small">Y</div><div><b>Yuhuan</b><small>Workspace</small></div><MoreHorizontal size={16}/></div></div></aside>
  <main className="main">
   <section className="reviewChrome"><div className="reviewTitle"><span className="pendingDot"></span><div><b>D3 · Agent Chat 整頁草案</b><small>草案待審核；頁面互動只使用靜態本機資料。</small></div><Badge variant="warning" className="d3-yunui-badge">PENDING</Badge></div><div className="stateBar" role="group" aria-label="示範狀態">{(['idle','working','approval','done','error'] as Mode[]).map(s=><button key={s} className={mode===s?'selected':''} aria-pressed={mode===s} onClick={()=>setMode(s)}>{stateLabels[s]}</button>)}</div></section>
   <div className="chatScroll">
    <div className="threadHead"><div className="threadAvatar"><Bot size={17}/></div><div><b>Agent Chat</b><span>YunUI workspace · local demo</span></div><button className="iconBtn"><MoreHorizontal size={18}/></button></div>
    <article className="message userMessage"><div className="userAvatar">Y</div><div className="messageBody"><div className="messageMeta"><b>你</b><span>剛才</span></div><p>請比較 Agent Chat 的 composer 與 agent process 呈現方式，整理互動入口和失敗狀態。</p><div className="userSources">{sources.map(s=><span className="contextChip" key={s}><FileText size={12}/>{s}</span>)}</div></div></article>
    <article className="assistantMessage"><div className="assistantAvatar"><Sparkles size={15}/></div><div className="messageBody"><div className="messageMeta"><b>Assistant</b><span className={`runPill ${mode}`}>{mode==='working'?<><i className="spinner"/>正在整理</>:mode==='approval'?'等待確認':mode==='done'?'已完成':mode==='error'?'部分失敗 · 保留結果':'等待新工作'}</span></div>
      {mode==='idle'&&<p className="answerCopy">可以開始檢視來源、互動入口與 agent 執行流程。</p>}
      {mode==='working'&&<>
       <div className="portedThinking"><ThinkingState variant="Coding" staticStage={2} active="檢查公開元件 API" done="已整理執行步驟" rows={[{primary:'核對 ChatComposer callback',secondary:'公開 API',mono:false},{primary:'比對來源選單互動',secondary:'PromptBar.tsx',mono:true},{primary:'整理執行流程分層',secondary:'AgentTimeline.tsx',mono:true}]} /></div>
       <div className="portedTools"><ToolChips staticStep={3} labels={{header:'3 tool calls · 1 message',more:'更多'}} steps={processSteps} diffs={diffs} diffLines={diffLines}/></div>
      </>}
      {mode==='approval'&&<div className="upstreamApproval"><ApprovalCard manualAdvance labels={{skip:'略過',continue:'下一步',send:'完成示範',customPlaceholder:'補充選項…',sentMessage:'已記錄本機選擇'}} questions={[{q:'來源與指令入口先放在哪裡？',type:'radio',options:['Composer 工具列','輸入位置選單','兩種方式都保留']},{q:'執行步驟要如何呈現？',type:'radio',options:['可展開的工具列','只顯示狀態摘要','摘要加工具列']}]} onSubmitted={()=>setMode('done')}/></div>}
      {mode==='done'&&<><div className="answerCopy"><p>在這個互動草案中，輸入 `@` 可選來源，輸入 `/` 可選指令；模型選單沿用 PromptBar 的位置與樣式。</p><p>這是本機靜態資料示範，尚未接上宿主的已授權來源、模型設定與送出處理。</p></div><div className="answerSources"><button><FileText size={13}/>PromptBar.tsx <span>1</span></button><button><FileText size={13}/>AgentTimeline.tsx <span>2</span></button></div><div className="messageActions"><button><AlignLeft size={14}/>複製</button><button>Good</button><button>Bad</button><button><MoreHorizontal size={15}/></button></div></>}
      {mode==='error'&&<div className="errorCard"><div className="errorTitle"><CircleHelp size={16}/>部分流程失敗，已保留完成結果</div><p>讀取元件說明時遇到錯誤；下方保留已完成步驟與失敗位置。</p><div className="errorTrace"><span className="okMark"><Check size={12}/></span>核對公開匯出目錄 <code>completed</code></div><div className="errorTrace failed"><span className="failMark">×</span>讀取元件說明 <code>request failed</code></div><button onClick={()=>setMode('working')}>重試失敗步驟 <ArrowDown size={13}/></button></div>}
      {mode==='idle'&&<div className="messageActions"><button><AlignLeft size={14}/>複製</button><button>Good</button><button>Bad</button></div>}
    </div></article>
    {mode==='done'&&<div className="followups"><span>接著可以檢視</span><button onClick={()=>setMode('approval')}>核准狀態細節 <ArrowUp size={13}/></button><button onClick={()=>setMode('error')}>失敗與部分結果 <ArrowUp size={13}/></button></div>}
   </div>
   <div className="composerDock"><div className="portedPrompt"><PromptBar demo={false} tall placeholder="Message Agent Chat…" onSend={()=>setMode('working')}/></div><div className="composerFoot">AI 回覆可能有誤。核對重要資訊。<span><Paperclip size={12}/>附件入口為靜態示範</span></div></div>
  </main>
  <aside className="rightRail"><div className="railHead"><span>CONTEXT</span><button className="iconBtn"><MoreHorizontal size={15}/></button></div><div className="railCard"><div className="railCardTitle"><Layers size={14}/><b>來源</b><span>{sources.length}</span></div>{sources.map(s=><div key={s} className="railSource"><FileText size={13}/><span>{s}</span><Check size={12}/></div>)}</div><div className="railCard"><div className="railCardTitle"><Clock3 size={14}/><b>Run 摘要</b></div><div className="runSummary"><span className="summaryDot"/>{mode==='working'?'正在整理 3 個步驟':mode==='approval'?'等待人工確認':mode==='error'?'部分結果可用':mode==='done'?'已整理完成':'尚未開始'}</div><div className="summaryMeta"><span>Agent Chat</span><span>·</span><span>本機示範</span></div>{(mode==='approval'||mode==='error')&&<div className="portedTasks"><TaskRows variant="List" staticTick={fixedTick} labels={{completed:'完成',failed:'失敗'}} rows={taskRows}/></div>}</div><div className="railCard"><div className="railCardTitle"><Shield size={14}/><b>執行流程</b></div><p className="railText">狀態摘要與工具列可分開檢視；核准和重試由宿主處理。</p><button className="railLink" onClick={()=>setMode('approval')}>查看確認狀態 <ChevronRight size={13}/></button></div><div className="railBottom"><button className="railLink"><CircleHelp size={14}/>說明</button><button className="railLink"><Settings2 size={14}/>設定</button></div></aside>
 </div>
}
createRoot(document.getElementById('root')!).render(<App/>);
