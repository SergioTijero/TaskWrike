import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CreateTaskModal from '../components/CreateTaskModal';
import { PageHeader, Spinner, ErrorBanner, ReadOnlyFooter } from './SpacesPage';

interface WrikeTask { id: string; title: string; importance?: string; status?: string; dates?: { due?: string }; }

export default function ReportsPage() {
  const [tasks, setTasks] = useState<WrikeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('wrike_access_token') || import.meta.env.VITE_WRIKE_PERMANENT_TOKEN;
    const host   = localStorage.getItem('wrike_host') || 'www.wrike.com';
    if (!token) { navigate('/login'); return; }

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

  const byPriority = { High: 0, Normal: 0, Low: 0 };
  const overdue: WrikeTask[] = [];
  const today = new Date().toISOString().substring(0, 10);

  tasks.forEach(t => {
    const imp = t.importance || 'Normal';
    if (imp === 'High') byPriority.High++;
    else if (imp === 'Low') byPriority.Low++;
    else byPriority.Normal++;
    if (t.dates?.due && t.dates.due.substring(0, 10) < today) overdue.push(t);
  });

  const StatCard = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) => (
    <div className={`${color} rounded-2xl p-5 flex items-center gap-4 shadow-sm`}>
      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <div>
        <div className="text-3xl font-headline font-extrabold">{value}</div>
        <div className="text-xs font-semibold opacity-80 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-surface text-on-surface flex h-screen overflow-hidden font-body">
      <Sidebar onCreateTask={() => setCreateOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Reports" icon="bar_chart" subtitle="Resumen de tus tareas asignadas en Wrike (solo lectura)" />
        <main className="flex-1 overflow-auto p-8">
          {loading && <Spinner />}
          {error && <ErrorBanner msg={error} />}
          {!loading && !error && (
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total tareas" value={tasks.length} color="bg-primary-container text-on-primary-container" icon="assignment" />
                <StatCard label="Alta prioridad" value={byPriority.High} color="bg-error-container text-on-error-container" icon="priority_high" />
                <StatCard label="Normal"         value={byPriority.Normal} color="bg-secondary-container text-on-secondary-container" icon="remove" />
                <StatCard label="Vencidas"       value={overdue.length} color="bg-tertiary-container text-on-tertiary-container" icon="schedule" />
              </div>

              {overdue.length > 0 && (
                <div className="bg-error-container/20 border border-error/20 rounded-2xl p-5">
                  <h2 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-error">warning</span>
                    Tareas vencidas ({overdue.length})
                  </h2>
                  <div className="flex flex-col gap-2">
                    {overdue.map(t => (
                      <div key={t.id} className="bg-surface-container-lowest rounded-lg px-4 py-2.5 flex justify-between items-center text-sm">
                        <span className="font-medium text-on-surface">{t.title}</span>
                        <span className="text-error text-xs font-bold">{t.dates?.due?.substring(0, 10)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-surface-container-low rounded-2xl p-5">
                <h2 className="font-bold text-on-surface mb-3">Todas las tareas asignadas</h2>
                <div className="flex flex-col gap-2 max-h-80 overflow-auto">
                  {tasks.map(t => (
                    <div key={t.id} className="bg-surface-container-lowest rounded-lg px-4 py-2.5 flex justify-between items-center text-sm">
                      <span className="font-medium text-on-surface line-clamp-1">{t.title}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${t.importance === 'High' ? 'bg-error-container text-on-error-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                        {t.importance || 'Normal'}
                      </span>
                    </div>
                  ))}
                </div>
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
