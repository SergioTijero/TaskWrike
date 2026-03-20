import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CreateTaskModal from '../components/CreateTaskModal';
import { PageHeader, Spinner, ErrorBanner, ReadOnlyFooter } from './SpacesPage';

interface WrikeTask { id: string; title: string; dates?: { due?: string; start?: string }; importance?: string; status?: string; }

const WEEKDAYS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function CalendarPage() {
  const [tasks, setTasks] = useState<WrikeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  useEffect(() => {
    const token = localStorage.getItem('wrike_access_token');
    const host   = localStorage.getItem('wrike_host') || 'www.wrike.com';
    if (!token) { navigate('/login'); return; }

    // Fetch contacts then tasks
    fetch(`https://${host}/api/v4/contacts?me=true`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        const myId = d.data[0]?.id;
        return fetch(`https://${host}/api/v4/tasks?${new URLSearchParams({ responsibles: `["${myId}"]` })}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then(r => r.json())
      .then(d => setTasks(d.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Build calendar days for current view month
  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay  = new Date(viewYear, viewMonth + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday-first
  const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7;

  // Map date string (YYYY-MM-DD) → tasks
  const tasksByDate = new Map<string, WrikeTask[]>();
  tasks.forEach(t => {
    const due = t.dates?.due?.substring(0, 10);
    if (due) {
      if (!tasksByDate.has(due)) tasksByDate.set(due, []);
      tasksByDate.get(due)!.push(t);
    }
  });

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  return (
    <div className="bg-surface text-on-surface flex h-screen overflow-hidden font-body">
      <Sidebar onCreateTask={() => setCreateOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Calendar" icon="calendar_today" subtitle="Tus tareas con fecha de vencimiento en Wrike (solo lectura)" />
        <main className="flex-1 overflow-auto p-6">
          {loading && <Spinner />}
          {error && <ErrorBanner msg={error} />}
          {!loading && !error && (
            <div className="max-w-4xl mx-auto">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-surface-variant rounded-lg transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h2 className="font-headline font-bold text-xl text-on-surface">{MONTHS[viewMonth]} {viewYear}</h2>
                <button onClick={nextMonth} className="p-2 hover:bg-surface-variant rounded-lg transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-bold uppercase text-on-surface-variant py-2">{d}</div>
                ))}
                {Array.from({ length: totalCells }).map((_, idx) => {
                  const dayNum = idx - startDow + 1;
                  const isValid = dayNum >= 1 && dayNum <= lastDay.getDate();
                  const dateStr = isValid ? `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}` : '';
                  const dayTasks = tasksByDate.get(dateStr) || [];
                  const isToday = isValid && viewYear === today.getFullYear() && viewMonth === today.getMonth() && dayNum === today.getDate();

                  return (
                    <div key={idx} className={`min-h-[80px] rounded-lg p-1.5 ${isValid ? 'bg-surface-container-low' : 'opacity-0 pointer-events-none'} ${isToday ? 'ring-2 ring-primary' : ''}`}>
                      {isValid && (
                        <>
                          <div className={`text-xs font-bold mb-1 w-5 h-5 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>
                            {dayNum}
                          </div>
                          {dayTasks.slice(0,3).map(t => (
                            <div key={t.id} className="text-[9px] bg-primary-container text-on-primary-container rounded px-1 py-0.5 mb-0.5 font-medium truncate">
                              {t.title}
                            </div>
                          ))}
                          {dayTasks.length > 3 && <div className="text-[9px] text-on-surface-variant font-bold">+{dayTasks.length - 3} más</div>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
        <ReadOnlyFooter />
      </div>
      {createOpen && <CreateTaskModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
}
