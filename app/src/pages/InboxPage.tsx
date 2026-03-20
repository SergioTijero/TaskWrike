import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CreateTaskModal from '../components/CreateTaskModal';
import { PageHeader, Spinner, ErrorBanner, EmptyState, ReadOnlyFooter } from './SpacesPage';

interface WrikeActivity { id: string; subject: string; createdDate?: string; type?: string; }

export default function InboxPage() {
  const [activities, setActivities] = useState<WrikeActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('wrike_access_token');
    const host   = localStorage.getItem('wrike_host') || 'www.wrike.com';
    if (!token) { navigate('/login'); return; }

    // /inbox is not available in the API; use stream of activity instead
    fetch(`https://${host}/api/v4/contacts?me=true`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        const myId = d.data[0]?.id;
        // Activity log for the current user
        return fetch(`https://${host}/api/v4/contacts/${myId}/timelogs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then(r => r.json())
      .then(d => setActivities(d.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface text-on-surface flex h-screen overflow-hidden font-body">
      <Sidebar onCreateTask={() => setCreateOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Inbox" icon="inbox" subtitle="Actividad reciente y notificaciones de Wrike (solo lectura)" />
        <main className="flex-1 overflow-auto p-8">
          {loading && <Spinner />}
          {error && <ErrorBanner msg={error} />}
          {!loading && !error && (
            <div className="max-w-2xl mx-auto flex flex-col gap-3">
              {activities.length === 0
                ? <EmptyState label="No hay actividad reciente registrada." />
                : activities.map((a, i) => (
                  <div key={a.id || i} className="bg-surface-container-lowest rounded-xl px-5 py-4 flex items-start gap-3 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-on-surface">{a.subject || 'Actividad'}</p>
                      {a.createdDate && <p className="text-[10px] text-on-surface-variant mt-0.5">{new Date(a.createdDate).toLocaleString('es-ES')}</p>}
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </main>
        <ReadOnlyFooter />
      </div>
      {createOpen && <CreateTaskModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
}
