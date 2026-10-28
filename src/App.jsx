import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, MoreVertical, Calendar, CheckSquare, Clock, 
  Tag, AlertCircle, Sun, Moon, Trash2, Edit3, ArrowRight, 
  CheckCircle2, Layers, BarChart2, ShieldCheck, User, RefreshCw
} from 'lucide-react';

const INITIAL_COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-amber-500/50 bg-amber-500/5' },
  { id: 'inprogress', title: 'In Progress', color: 'border-indigo-500/50 bg-indigo-500/5' },
  { id: 'review', title: 'Code Review', color: 'border-violet-500/50 bg-violet-500/5' },
  { id: 'done', title: 'Completed', color: 'border-emerald-500/50 bg-emerald-500/5' }
];

const INITIAL_TASKS = [
  { id: 'task-1', columnId: 'todo', title: 'Implement JWT Refresh Token Rotation', description: 'Ensure secure cookie transmission and handle expiration timeouts on frontend interceptors.', priority: 'High', tags: ['Backend', 'Security'], dueDate: '2026-06-15', subtasks: [{ text: 'Setup HttpOnly cookie middleware', done: true }, { text: 'Configure Axios interceptor', done: false }], assignee: 'Alex R.' },
  { id: 'task-2', columnId: 'inprogress', title: 'Design Glassmorphism Dashboard UI', description: 'Build responsive widgets with dark/light mode toggle and Tailwind backdrop filters.', priority: 'Urgent', tags: ['Frontend', 'UI/UX'], dueDate: '2026-06-10', subtasks: [{ text: 'Create color palette', done: true }, { text: 'Test flexbox alignment', done: true }], assignee: 'Sarah K.' },
  { id: 'task-3', columnId: 'review', title: 'Optimize PostgreSQL Indexing', description: 'Analyze slow query logs and add composite indexes for product search tables.', priority: 'Medium', tags: ['Database', 'Perf'], dueDate: '2026-06-18', subtasks: [{ text: 'Run EXPLAIN ANALYZE', done: true }], assignee: 'David M.' },
  { id: 'task-4', columnId: 'done', title: 'Initialize Git Repository & CI/CD', description: 'Configure GitHub Actions workflow for automated build checks and Vercel preview deployments.', priority: 'Low', tags: ['DevOps'], dueDate: '2026-06-01', subtasks: [{ text: 'Create workflow YAML', done: true }, { text: 'Verify build scripts', done: true }], assignee: 'Alex R.' }
];

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [columns] = useState(INITIAL_COLUMNS);
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('nexus_kanban_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  // Form states for creating/editing tasks
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColumn, setFormColumn] = useState('todo');
  const [formPriority, setFormPriority] = useState('Medium');
  const [formAssignee, setFormAssignee] = useState('Alex R.');
  const [formDueDate, setFormDueDate] = useState('');

  useEffect(() => {
    localStorage.setItem('nexus_kanban_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const moveTask = (taskId, targetColumnId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, columnId: targetColumnId } : t));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const saveTask = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (activeTask) {
      setTasks(prev => prev.map(t => t.id === activeTask.id ? {
        ...t,
        title: formTitle,
        description: formDesc,
        columnId: formColumn,
        priority: formPriority,
        assignee: formAssignee,
        dueDate: formDueDate || t.dueDate
      } : t));
    } else {
      const newTask = {
        id: `task-${Date.now()}`,
        columnId: formColumn,
        title: formTitle,
        description: formDesc,
        priority: formPriority,
        tags: ['General'],
        dueDate: formDueDate || new Date().toISOString().split('T')[0],
        subtasks: [{ text: 'Initial setup verification', done: false }],
        assignee: formAssignee
      };
      setTasks(prev => [newTask, ...prev]);
    }
    closeModal();
  };

  const openCreateModal = () => {
    setActiveTask(null);
    setFormTitle('');
    setFormDesc('');
    setFormColumn('todo');
    setFormPriority('Medium');
    setFormAssignee('Alex R.');
    setFormDueDate('');
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setActiveTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description);
    setFormColumn(task.columnId);
    setFormPriority(task.priority);
    setFormAssignee(task.assignee);
    setFormDueDate(task.dueDate);
    setIsTaskModalOpen(true);
  };

  const closeModal = () => {
    setIsTaskModalOpen(false);
    setActiveTask(null);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const completedCount = tasks.filter(t => t.columnId === 'done').length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER NAVBAR */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">N</div>
            <div>
              <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">NEXUS</span>
              <span className={`block text-xs font-semibold tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>FLOW KANBAN</span>
            </div>
          </div>

          <div className="hidden md:flex items-center relative w-80">
            <Search className={`absolute left-3.5 h-4 w-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <input 
              type="text"
              placeholder="Search issues, tags, tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-full text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-800/60 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-slate-100 border-slate-200 text-slate-800'}`}
            />
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsAnalyticsOpen(true)}
              className={`hidden sm:flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'}`}
            >
              <BarChart2 size={16} className="text-indigo-400" />
              <span>Velocity: {completionRate}%</span>
            </button>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={openCreateModal}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus size={18} />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </header>

      {/* SUB-HEADER CONTROLS */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Filter Priority:</span>
            {['All', 'Urgent', 'High', 'Medium', 'Low'].map(p => (
              <button 
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${selectedPriority === p ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button 
            onClick={() => { setTasks(INITIAL_TASKS); localStorage.removeItem('nexus_kanban_tasks'); }}
            className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${darkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
          >
            <RefreshCw size={13} />
            <span>Reset Demo Tasks</span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD COLUMNS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.columnId === col.id);
            return (
              <div 
                key={col.id} 
                className={`rounded-3xl border p-5 flex flex-col min-h-[600px] ${col.color} ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100/60 border-slate-200'}`}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm tracking-wide">{col.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
                      {colTasks.length}
                    </span>
                  </div>
                  <button onClick={openCreateModal} className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-colors">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border border-dashed border-slate-800/60 rounded-2xl">
                      <p className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>No tasks in column</p>
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <div 
                        key={task.id}
                        className={`group rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${darkMode ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-400'}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            task.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            task.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}>
                            {task.priority}
                          </span>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal(task)} className="p-1 text-slate-400 hover:text-indigo-400"><Edit3 size={14} /></button>
                            <button onClick={() => deleteTask(task.id)} className="p-1 text-slate-400 hover:text-rose-400"><Trash2 size={14} /></button>
                          </div>
                        </div>

                        <h4 className="font-bold text-sm mb-1.5 leading-snug">{task.title}</h4>
                        <p className={`text-xs mb-4 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{task.description}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {task.tags.map(tag => (
                            <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
                          <div className="flex items-center space-x-1.5 text-slate-400">
                            <Calendar size={12} />
                            <span>{task.dueDate}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {col.id !== 'todo' && (
                              <button 
                                onClick={() => {
                                  const order = ['todo', 'inprogress', 'review', 'done'];
                                  const nextIdx = order.indexOf(col.id) - 1;
                                  if (nextIdx >= 0) moveTask(task.id, order[nextIdx]);
                                }}
                                title="Move Left"
                                className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                              >
                                ←
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button 
                                onClick={() => {
                                  const order = ['todo', 'inprogress', 'review', 'done'];
                                  const nextIdx = order.indexOf(col.id) + 1;
                                  if (nextIdx < order.length) moveTask(task.id, order[nextIdx]);
                                }}
                                title="Move Right"
                                className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                              >
                                →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* TASK MODAL (CREATE / EDIT) */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={closeModal} />
          <div className={`relative max-w-lg w-full p-8 rounded-3xl border shadow-2xl z-10 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h2 className="text-xl font-black mb-6">{activeTask ? 'Edit Task Item' : 'Create New Task'}</h2>
            
            <form onSubmit={saveTask} className="space-y-4 text-sm">
              <div>
                <label className={`block font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Task Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Implement OAuth2 Google Login" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200'}`} 
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Description</label>
                <textarea 
                  rows="3"
                  placeholder="Detailed project requirements..." 
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200'}`} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Column Stage</label>
                  <select 
                    value={formColumn}
                    onChange={(e) => setFormColumn(e.target.value)}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200'}`}
                  >
                    {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Priority</label>
                  <select 
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200'}`}
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Assignee</label>
                  <input 
                    type="text" 
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200'}`} 
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Due Date</label>
                  <input 
                    type="date" 
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200'}`} 
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={closeModal} className={`flex-1 py-3 rounded-xl font-bold border ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}>Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/30">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANALYTICS MODAL */}
      {isAnalyticsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAnalyticsOpen(false)} />
          <div className={`relative max-w-md w-full p-8 rounded-3xl border shadow-2xl z-10 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h2 className="text-xl font-black mb-4">Board Velocity & Metrics</h2>
            <div className="space-y-4 my-6">
              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`block text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Tasks Created</span>
                <span className="text-2xl font-black text-indigo-400">{totalCount}</span>
              </div>
              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`block text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Completed Tasks</span>
                <span className="text-2xl font-black text-emerald-400">{completedCount}</span>
              </div>
              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`block text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sprint Completion Rate</span>
                <span className="text-2xl font-black text-violet-400">{completionRate}%</span>
              </div>
            </div>
            <button onClick={() => setIsAnalyticsOpen(false)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/30">Close Analytics</button>
          </div>
        </div>
      )}
    </div>
  );
}