import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, ArrowUpRight, Bell, CalendarDays, Check, CheckCircle2, ChevronDown, Clock3, CloudSun, Command, Home, Lightbulb, ListTodo, Mic, MicOff, MoreHorizontal, Plus, Search, Send, Settings2, ShieldCheck, Sparkles, Sun, Volume2, WandSparkles, X } from 'lucide-react';
import './style.css';

const starterTasks = [
  { id: 1, title: 'Review project requirements', time: '10:30 AM', done: false, tag: 'Work' },
  { id: 2, title: 'Prepare hackathon demo', time: '12:00 PM', done: false, tag: 'Priority' },
  { id: 3, title: 'Take a short break', time: '1:15 PM', done: true, tag: 'Personal' },
];
const suggestions = ['Plan my afternoon', 'Add a task to my list', 'Summarize my priorities', 'What can you help me with?'];

function App() {
  const [tasks, setTasks] = useState(starterTasks);
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi! I’m Nova, a simulated Alexa+ style assistant. I can help organize your day, manage tasks, and turn requests into useful actions. What would you like to do?' }]);
  const [input, setInput] = useState('');
  const [active, setActive] = useState('Home');
  const [listName, setListName] = useState('Today');
  const [showSettings, setShowSettings] = useState(false);
  const [notice, setNotice] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const completed = tasks.filter(t => t.done).length;
  const pending = tasks.filter(t => !t.done).length;

  const addTask = (title) => {
    const clean = title.trim();
    if (!clean) return;
    setTasks(prev => [{ id: Date.now(), title: clean.replace(/^to-do:?\s*/i, ''), time: 'Just added', done: false, tag: 'New' }, ...prev]);
    setNotice('Task added to your list');
    setTimeout(() => setNotice(''), 2400);
  };
  const replyTo = (raw) => {
    const q = raw.trim();
    if (!q) return;
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    const lower = q.toLowerCase();
    let answer = '';
    if (/(add|create|remind me|remember|task|todo|to-do)/i.test(lower) && !/(summar|what can|help)/i.test(lower)) {
      let title = q.replace(/^(please\s+)?(add|create|make|remember|remind me to|put)\s*/i, '').replace(/^(a task to|task to|to my list|to the list)\s*/i, '').replace(/\s+(to my list|to the list|in my tasks)$/i, '').trim();
      if (!title || title.toLowerCase() === q.toLowerCase()) title = q;
      addTask(title);
      answer = `Done in this prototype. I added “${title}” to your task list. You can mark it complete from the dashboard.`;
    } else if (/(plan|afternoon|schedule|priorit)/i.test(lower)) {
      answer = `Here’s a practical plan based on your current list:\n\n1. Finish “${tasks.find(t=>!t.done)?.title || 'your top priority'}” first.\n2. Spend 30 minutes on the next unfinished task.\n3. Take a short break, then review what remains.\n\nYou have ${pending} open task${pending===1?'':'s'} and ${completed} completed. This plan uses only the tasks in this demo, not your real calendar.`;
    } else if (/(weather|temperature|forecast)/i.test(lower)) {
      answer = `I don’t have a live weather connection configured in this demo, so I won’t invent a forecast. The weather card is a sample UI. Connect a weather API to enable current conditions.`;
    } else if (/(summar|status|how many|progress)/i.test(lower)) {
      answer = `Your current list has ${tasks.length} tasks: ${completed} completed and ${pending} still open. ${pending ? `Your next action could be “${tasks.find(t=>!t.done).title}”.` : 'Everything is complete. Nicely done.'}`;
    } else if (/(help|what can you|capabilities|features)/i.test(lower)) {
      answer = `I can manage a demo task list, summarize your priorities, suggest a schedule, and demonstrate conversational follow-ups. Try “Add prepare slides to my list” or “Plan my afternoon”. Voice input and external services are simulated or optional in this prototype.`;
    } else {
      answer = `I can help with planning and task actions. For this demo, try “Add finish my assignment to my list”, “Plan my afternoon”, or “Summarize my priorities”. I’ll be transparent when a request needs a service that isn’t connected.`;
    }
    setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
  };
  const toggleTask = id => setTasks(prev => prev.map(t => t.id === id ? {...t, done: !t.done} : t));
  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setNotice('Voice input is not supported by this browser. Try Chrome or type a request.'); setTimeout(()=>setNotice(''),3500); return; }
    const rec = new SR(); rec.lang = 'en-US'; rec.interimResults = false;
    setListening(true);
    rec.onresult = e => { const phrase = e.results[0][0].transcript; setListening(false); replyTo(phrase); };
    rec.onerror = () => { setListening(false); setNotice('Could not capture speech. Please try again or type.'); setTimeout(()=>setNotice(''),2500); };
    rec.onend = () => setListening(false); rec.start();
  };
  const speak = text => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text); utter.rate = 1; window.speechSynthesis.speak(utter);
  };
  const latest = messages[messages.length - 1];
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sparkles size={20}/></div><div><b>nova</b><small>PERSONAL AI</small></div></div>
      <button className={`nav-item ${active==='Home'?'selected':''}`} onClick={()=>setActive('Home')}><Home size={18}/> Home</button>
      <button className={`nav-item ${active==='Tasks'?'selected':''}`} onClick={()=>setActive('Tasks')}><ListTodo size={18}/> My tasks <span className="nav-count">{pending}</span></button>
      <button className={`nav-item ${active==='Planner'?'selected':''}`} onClick={()=>setActive('Planner')}><CalendarDays size={18}/> Planner</button>
      <div className="sidebar-bottom">
        <div className="privacy-card"><ShieldCheck size={18}/><div><b>Prototype mode</b><p>Actions stay in this browser session.</p></div></div>
        <button className="nav-item" onClick={()=>setShowSettings(true)}><Settings2 size={18}/> Settings</button>
        <div className="profile"><div className="avatar">N</div><div><b>Nova Assistant</b><small>Demo workspace</small></div><MoreHorizontal size={18}/></div>
      </div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">Workspace <span>/</span> {active}</div><div className="top-actions"><span className="status-dot"></span><span className="live-label">All systems ready</span><button className="icon-btn" onClick={()=>setNotice('You’re all caught up.')} aria-label="Notifications"><Bell size={18}/></button><button className="avatar mini" onClick={()=>setShowSettings(true)}>N</button></div></header>
      <div className="content">
        <section className="welcome-row"><div><div className="eyebrow"><Sun size={14}/> SATURDAY, YOUR WAY</div><h1>{active==='Tasks'?'Your tasks':active==='Planner'?'Your daily plan':'Make room for what matters.'}</h1><p className="subhead">{active==='Tasks'?'A simple place to capture, prioritize, and finish things.':active==='Planner'?'A flexible plan built around your priorities.':'Your day, your priorities, one helpful conversation at a time.'}</p></div><button className="primary-btn" onClick={()=>{setActive('Tasks');document.getElementById('new-task')?.focus()}}><Plus size={17}/> Add a task</button></section>
        <section className="hero">
          <div className="hero-copy"><div className="hero-pill"><Sparkles size={14}/> YOUR AI COMPANION</div><h2>Good ideas deserve<br/><span>a little follow-through.</span></h2><p>Ask naturally. Get a plan. Turn the next step into action.</p><div className="hero-actions"><button className="white-btn" onClick={()=>replyTo('Plan my afternoon')}>Plan my day <ArrowUpRight size={16}/></button><button className="ghost-btn" onClick={()=>{document.getElementById('chat-input')?.focus()}}>Talk to Nova <Mic size={16}/></button></div></div>
          <div className="orb-scene"><div className="orb-ring ring-one"></div><div className="orb-ring ring-two"></div><div className="orb"><div className="orb-core"></div></div><div className="floating-chip chip-top"><Sparkles size={14}/> Context-aware</div><div className="floating-chip chip-bottom"><CheckCircle2 size={14}/> Ready to help</div></div>
        </section>
        <section className="stats-grid">
          <div className="stat-card"><div className="stat-top"><span>Open tasks</span><div className="stat-icon purple"><ListTodo size={17}/></div></div><div className="stat-number">{pending.toString().padStart(2,'0')}</div><div className="stat-foot">Waiting for your next step</div></div>
          <div className="stat-card"><div className="stat-top"><span>Completed</span><div className="stat-icon green"><Check size={17}/></div></div><div className="stat-number">{completed.toString().padStart(2,'0')}</div><div className="stat-foot">Small wins add up</div></div>
          <div className="stat-card"><div className="stat-top"><span>Focus time</span><div className="stat-icon orange"><Clock3 size={17}/></div></div><div className="stat-number">45<span>m</span></div><div className="stat-foot">Suggested deep-work block</div></div>
          <div className="stat-card"><div className="stat-top"><span>Daily momentum</span><div className="stat-icon blue"><Activity size={17}/></div></div><div className="stat-number">{tasks.length?Math.round(completed/tasks.length*100):100}<span>%</span></div><div className="progress"><i style={{width:`${tasks.length?completed/tasks.length*100:100}%`}}></i></div><div className="stat-foot">Based on demo task completion</div></div>
        </section>
        <section className="dashboard-grid">
          <div className="panel task-panel">
            <div className="panel-heading"><div><div className="eyebrow">STAY ON TRACK</div><h3>Task overview</h3></div><button className="text-btn" onClick={()=>setActive('Tasks')}>View all <ArrowUpRight size={15}/></button></div>
            <form className="task-add" onSubmit={e=>{e.preventDefault();const el=document.getElementById('new-task');addTask(el.value);el.value=''}}><Plus size={17}/><input id="new-task" placeholder="Add a task to your day..." aria-label="New task"/><button type="submit" aria-label="Add task"><ArrowUpRight size={17}/></button></form>
            <div className="task-list">{tasks.slice(0,5).map(t=><div className={`task-row ${t.done?'task-done':''}`} key={t.id}><button className={`task-check ${t.done?'checked':''}`} onClick={()=>toggleTask(t.id)} aria-label={t.done?'Mark incomplete':'Mark complete'}>{t.done&&<Check size={13}/>}</button><div className="task-main"><b>{t.title}</b><small><Clock3 size={12}/> {t.time}</small></div><span className={`tag ${t.tag==='Priority'?'priority':''}`}>{t.tag}</span></div>)}</div>
            <div className="panel-foot"><span>{completed} of {tasks.length} completed</span><span className="mini-progress"><i style={{width:`${tasks.length?completed/tasks.length*100:0}%`}}></i></span></div>
          </div>
          <div className="panel assistant-panel">
            <div className="panel-heading"><div><div className="eyebrow">CONVERSATIONAL AI</div><h3>Ask Nova</h3></div><div className="online-badge"><span></span> Ready</div></div>
            <div className="chat-window" aria-live="polite">{messages.slice(-4).map((m,i)=><div className={`message ${m.role}`} key={i}><div className="message-avatar">{m.role==='assistant'?<Sparkles size={14}/>:<span>Y</span>}</div><div className="message-body"><div className="message-label">{m.role==='assistant'?'NOVA':'YOU'}</div><p>{m.text}</p>{m.role==='assistant'&&<button className="speak-btn" onClick={()=>speak(m.text)}><Volume2 size={13}/> Read aloud</button>}</div></div>)}</div>
            <div className="suggestion-row">{suggestions.slice(0,2).map(s=><button key={s} onClick={()=>replyTo(s)}>{s}</button>)}</div>
            <form className="chat-compose" onSubmit={e=>{e.preventDefault();replyTo(input)}}><button type="button" className={`mic-btn ${listening?'listening':''}`} onClick={startVoice} aria-label="Voice input">{listening?<MicOff size={17}/>:<Mic size={17}/>}</button><input id="chat-input" value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask anything, or give a command..." aria-label="Message Nova"/><button className="send-btn" type="submit" aria-label="Send message"><Send size={17}/></button></form>
            <div className="disclaimer">Demo assistant · External services are not connected</div>
          </div>
        </section>
        <section className="bottom-grid">
          <div className="panel quick-panel"><div className="panel-heading"><div><div className="eyebrow">ONE-TAP ACTIONS</div><h3>Make it happen</h3></div><WandSparkles size={19} className="muted"/></div><div className="quick-actions"><button onClick={()=>replyTo('Summarize my priorities')}><div className="quick-icon violet"><ListTodo size={18}/></div><span><b>Summarize priorities</b><small>See what needs attention</small></span><ArrowUpRight size={16}/></button><button onClick={()=>replyTo('Plan my afternoon')}><div className="quick-icon peach"><CalendarDays size={18}/></div><span><b>Build a plan</b><small>Structure your next few hours</small></span><ArrowUpRight size={16}/></button><button onClick={()=>{setVoiceEnabled(v=>!v);setNotice(`Read-aloud ${voiceEnabled?'disabled':'enabled'}`);setTimeout(()=>setNotice(''),2000)}}><div className="quick-icon blue"><Volume2 size={18}/></div><span><b>Read-aloud {voiceEnabled?'on':'off'}</b><small>Listen to assistant responses</small></span><ArrowUpRight size={16}/></button></div></div>
          <div className="panel weather-panel"><div className="panel-heading"><div><div className="eyebrow">AT A GLANCE</div><h3>Daily snapshot</h3></div><CloudSun size={20} className="muted"/></div><div className="snapshot"><div className="weather-icon"><CloudSun size={28}/></div><div><b>Make time for a reset</b><p>Sample suggestion · no live weather data</p></div></div><div className="snapshot-line"><span>Focus suggestion</span><b>45-minute block</b></div><div className="snapshot-line"><span>Next step</span><b>{tasks.find(t=>!t.done)?.title || 'All tasks complete'}</b></div></div>
        </section>
        <footer><span>Nova · Alexa+ style experience prototype</span><span>Built for exploration, designed for clarity.</span></footer>
      </div>
    </main>
    {notice&&<div className="toast"><CheckCircle2 size={17}/>{notice}<button onClick={()=>setNotice('')}><X size={14}/></button></div>}
    {showSettings&&<div className="modal-backdrop" onClick={()=>setShowSettings(false)}><div className="settings-modal" onClick={e=>e.stopPropagation()}><div className="panel-heading"><div><div className="eyebrow">PREFERENCES</div><h3>Prototype settings</h3></div><button className="icon-btn" onClick={()=>setShowSettings(false)}><X size={18}/></button></div><p>This is a standalone simulation, not an official Amazon Alexa+ product. Tasks are stored in React state and reset when the page reloads.</p><div className="setting-line"><span>Read assistant replies aloud</span><button className={`toggle ${voiceEnabled?'on':''}`} onClick={()=>setVoiceEnabled(v=>!v)}><i/></button></div><div className="setting-line"><span>Voice input support</span><span className="tag">Browser-dependent</span></div><button className="primary-btn full" onClick={()=>setShowSettings(false)}>Done</button></div></div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);