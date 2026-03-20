import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import localforage from 'localforage';
import Sidebar from '../components/Sidebar';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskDetailPanel from '../components/TaskDetailPanel';
import { fetchWrikeTasks, fetchWrikeUser } from '../services/wrikeApi';
import { useApp } from '../contexts/AppContext';


// Types
type TaskPriority = "High" | "Medium" | "Low";

interface TaskType {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  date?: string;
  completed?: boolean;
  isLocal?: boolean; // marks tasks created inside this app
}

interface ColumnData {
  id: string;
  title: string;
  styleClass: string;
  badgeClass: string;
}

// Column IDs — must match state keys exactly

const EMPTY_TASKS: Record<string, TaskType[]> = {
  PENDING: [], IN_PROGRESS: [], IN_REVIEW: [], DONE: []
};

// ─── Sortable Task Card ─────────────────────────────────────────────────────
const SortableTask = ({ task, onTaskClick }: { task: TaskType; onTaskClick: (t: TaskType) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const priorityColors: Record<TaskPriority, string> = {
    High:   "text-error bg-error-container/20",
    Medium: "text-on-secondary-container bg-secondary-container/50",
    Low:    "text-primary bg-primary-container/20"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      onClick={() => onTaskClick(task)}
      className={`bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group border border-transparent hover:border-primary/10 cursor-pointer ${task.completed ? 'opacity-70' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-1">
          {task.isLocal && (
            <span className="text-[9px] font-bold uppercase bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded-md" title="Esta tarea es local y no se sincroniza con Wrike">
              LOCAL
            </span>
          )}
          <span className="material-symbols-outlined text-outline-variant group-hover:text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">drag_indicator</span>
        </div>
      </div>
      <h4 className={`font-body font-bold text-on-surface text-sm mb-2 leading-tight ${task.completed ? 'line-through decoration-on-surface-variant/30' : ''}`}>
        {task.title}
      </h4>
      {task.description && <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">{task.description}</p>}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1 text-[10px] font-medium text-on-surface-variant">
          <span className="material-symbols-outlined text-xs">calendar_today</span>
          {task.date || 'Sin fecha'}
        </div>
      </div>
    </div>
  );
};

// ─── Column ──────────────────────────────────────────────────────────────────
const Column = ({ col, tasks, onTaskClick }: { col: ColumnData, tasks: TaskType[], onTaskClick: (t: TaskType) => void }) => {
  const { setNodeRef } = useDroppable({ id: col.id });
  return (
    <div className="flex flex-col w-80 shrink-0 gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <h3 className="font-headline font-bold text-lg text-on-surface">{col.title}</h3>
          <span className={`${col.styleClass} px-2 py-0.5 rounded-full text-xs font-bold ${col.badgeClass}`}>{tasks.length}</span>
        </div>
      </div>
      <div ref={setNodeRef} className="flex-1 overflow-y-auto space-y-4 rounded-xl bg-surface-container-low p-3 scrollbar-hide min-h-[150px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => <SortableTask key={task.id} task={task} onTaskClick={onTaskClick} />)}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-on-surface-variant/40 gap-1">
            <span className="material-symbols-outlined text-2xl">inbox</span>
            <span className="text-xs">Sin tareas</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { t } = useApp();
  const COLUMNS: ColumnData[] = [
    { id: 'PENDING',     title: t.columns.PENDING,     styleClass: 'bg-surface-variant',           badgeClass: 'text-on-surface-variant' },
    { id: 'IN_PROGRESS', title: t.columns.IN_PROGRESS, styleClass: 'bg-primary-container',          badgeClass: 'text-on-primary-container' },
    { id: 'IN_REVIEW',   title: t.columns.IN_REVIEW,   styleClass: 'bg-tertiary-container',         badgeClass: 'text-on-tertiary-container' },
    { id: 'DONE',        title: t.columns.DONE,        styleClass: 'bg-surface-container-highest',  badgeClass: 'text-on-surface-variant' },
  ];

  const [tasks, setTasks] = useState<Record<string, TaskType[]>>(EMPTY_TASKS);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');
  const [syncStatus, setSyncStatus] = useState<string>(() => t.waitingSync);

  useEffect(() => {
    localforage.getItem<Record<string, TaskType[]>>('wrike_board_state').then(saved => {
      if (saved && Object.keys(saved).length > 0) {
        // Migrate old keys if needed
        const migrated: Record<string, TaskType[]> = { PENDING: [], IN_PROGRESS: [], IN_REVIEW: [], DONE: [] };
        migrated.PENDING     = saved['PENDING']     || [];
        migrated.IN_PROGRESS = saved['IN_PROGRESS'] || [];
        migrated.IN_REVIEW   = saved['IN_REVIEW']   || saved['REVIEW'] || [];
        migrated.DONE        = saved['DONE']         || saved['COMPLETED'] || [];
        setTasks(migrated);
      }
      handleSyncWrike();
    });
    localforage.getItem<string>('wrike_kanban_notes').then(n => { if (n) setNotes(n); });
    fetchWrikeUser().then(user => { if (user?.avatarUrl) setUserAvatar(user.avatarUrl); }).catch(() => {});
  }, []);

  const handleSyncWrike = async (isManual = false) => {
    setIsSyncing(true);
    if (isManual) setSyncStatus(t.syncing);
    try {
      const wrikeTasks = await fetchWrikeTasks();
      if (isManual) setSyncStatus(t.successSync(wrikeTasks.length));

      setTasks(prev => {
        const next = {
          PENDING:     [...(prev.PENDING || [])],
          IN_PROGRESS: [...(prev.IN_PROGRESS || [])],
          IN_REVIEW:   [...(prev.IN_REVIEW || [])],
          DONE:        [...(prev.DONE || [])],
        };
        const allLocalIds = new Set(Object.values(next).flat().map(t => t.id));

        wrikeTasks.forEach((wt: any) => {
          const mapped: TaskType = {
            id: wt.id,
            title: wt.title,
            description: 'Sincronizado desde Wrike',
            priority: wt.importance === 'High' ? 'High' : wt.importance === 'Low' ? 'Low' : 'Medium',
            date: wt.dates?.due ? wt.dates.due.substring(5, 10).replace('-', '/') : '',
            isLocal: false,
          };
          if (!allLocalIds.has(mapped.id)) {
            next.PENDING.push(mapped);
          } else {
            for (const col of Object.keys(next) as Array<keyof typeof next>) {
              const idx = next[col].findIndex(t => t.id === mapped.id);
              if (idx !== -1) {
                next[col][idx] = { ...next[col][idx], title: mapped.title, date: mapped.date };
                break;
              }
            }
          }
        });
        return next;
      });
    } catch (e: any) {
      setSyncStatus(`Error: ${e.message || String(e)}`);
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  // Polling every 30s
  useEffect(() => {
    const id = setInterval(() => { if (!isSyncing) handleSyncWrike(false); }, 30000);
    return () => clearInterval(id);
  }, [isSyncing]);

  // Persist state
  useEffect(() => { localforage.setItem('wrike_board_state', tasks); }, [tasks]);
  useEffect(() => { localforage.setItem('wrike_kanban_notes', notes); }, [notes]);

  // Local task creation
  const handleCreateTask = (task: TaskType) => {
    setTasks(prev => ({ ...prev, PENDING: [task, ...prev.PENDING] }));
  };

  // DnD
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
    let found: TaskType | null = null;
    for (const col of Object.values(tasks)) {
      found = col.find(t => t.id === event.active.id) || null;
      if (found) break;
    }
    setActiveTask(found);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    let srcCol = '';
    let dstCol = '';
    for (const col of Object.keys(tasks)) {
      if (tasks[col].some(t => t.id === active.id)) srcCol = col;
      if (col === over.id || tasks[col].some(t => t.id === over.id)) dstCol = col;
    }
    if (!srcCol || !dstCol) return;

    setTasks(prev => {
      const next = { ...prev };
      const src = [...next[srcCol]];
      const dst = srcCol === dstCol ? src : [...next[dstCol]];

      const srcIdx = src.findIndex(t => t.id === active.id);
      const [moved] = src.splice(srcIdx, 1);

      if (dstCol === 'DONE') moved.completed = true;
      if (srcCol === 'DONE' && dstCol !== 'DONE') moved.completed = false;

      const overIdx = dst.findIndex(t => t.id === over.id);
      dst.splice(overIdx >= 0 ? overIdx : dst.length, 0, moved);

      next[srcCol] = src;
      next[dstCol] = dst;
      return next;
    });
  };

  const handleLogout = async () => {
    localStorage.removeItem('wrike_access_token');
    localStorage.removeItem('wrike_host');
    await localforage.clear();
    window.dispatchEvent(new Event('storage'));
    window.location.reload();
  };

  return (
    <div className="bg-surface text-on-surface flex h-screen overflow-hidden font-body">
      <Sidebar onCreateTask={() => setCreateOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-3 w-full bg-slate-50 dark:bg-slate-900 border-b border-slate-200/20 z-10">
          <div className="flex items-center gap-8">
            <span className="text-xl font-headline font-bold text-blue-700 dark:text-blue-400 tracking-tight">Wrike Kanban</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setNotesOpen(!notesOpen)} title="Notas"
              className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
              <span className="material-symbols-outlined">sticky_note_2</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
              {userAvatar
                ? <img src={userAvatar} className="w-full h-full object-cover" />
                : <span className="material-symbols-outlined p-1 text-slate-500">person</span>}
            </div>
            <button onClick={handleLogout} title="Cerrar sesión"
              className="p-2 text-red-400 hover:bg-red-100 rounded-full transition-colors">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-x-auto overflow-y-hidden p-8 flex flex-col gap-6 relative">
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-1">My Task Board</h1>
              <span className="flex items-center gap-1 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">update</span>
                {syncStatus}
              </span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCreateOpen(true)}
                className="bg-surface-container text-on-surface hover:bg-surface-variant px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm border border-outline-variant">
                <span className="material-symbols-outlined text-lg">add_task</span> Nueva tarea local
              </button>
              <button onClick={() => !isSyncing && handleSyncWrike(true)} disabled={isSyncing}
                className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50">
                <span className={`material-symbols-outlined text-lg ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
                {isSyncing ? 'Syncing...' : 'Sync con Wrike'}
              </button>
            </div>
          </div>

          {/* Kanban Board */}
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex-1 flex gap-8 pb-4 min-h-0 items-stretch">
              {COLUMNS.map(col => (
                <Column key={col.id} col={col} tasks={tasks[col.id] || []} onTaskClick={setSelectedTask} />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? <SortableTask task={activeTask} onTaskClick={() => {}} /> : null}
            </DragOverlay>
          </DndContext>
        </main>

        {/* Notes Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 bg-surface-container-lowest border-l border-slate-200/20 z-[60] shadow-2xl transition-transform duration-300 flex flex-col ${notesOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-slate-200/20 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
            <h3 className="font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">sticky_note_2</span> Board Notes
            </h3>
            <button onClick={() => setNotesOpen(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 p-4">
            <textarea className="w-full h-full bg-transparent border-none focus:ring-0 text-sm text-on-surface resize-none leading-relaxed"
              placeholder="Escribe notas persistentes aquí..." value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/20 text-[10px] text-on-surface-variant flex justify-between">
            <span>Guardado localmente</span><span>{notes.length} chars</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-blue-600/10 border-t border-blue-600/20 py-1.5 px-6 flex items-center justify-center gap-2 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          Solo lectura desde Wrike <span className="mx-2 text-slate-300">|</span>
          <span className="font-normal opacity-80">Los cambios de columna son solo visuales y no se escriben en Wrike.</span>
        </div>
      </div>

      {/* Create Task Modal */}
      {createOpen && (
        <CreateTaskModal
          onClose={() => setCreateOpen(false)}
          onSave={handleCreateTask}
        />
      )}

      {/* Task Detail Drawer */}
      <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
