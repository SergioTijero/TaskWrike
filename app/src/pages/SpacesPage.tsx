import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CreateTaskModal from '../components/CreateTaskModal';

interface Space { id: string; title: string; accessType: string; }

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('wrike_access_token');
    const host   = localStorage.getItem('wrike_host') || 'www.wrike.com';
    if (!token) { navigate('/login'); return; }

    fetch(`https://${host}/api/v4/spaces`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setSpaces(d.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface text-on-surface flex h-screen overflow-hidden font-body">
      <Sidebar onCreateTask={() => setCreateOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Spaces" icon="workspaces" subtitle="Espacios de trabajo disponibles en tu cuenta de Wrike (solo lectura)" />
        <main className="flex-1 overflow-auto p-8">
          {loading && <Spinner />}
          {error && <ErrorBanner msg={error} />}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {spaces.map(s => (
                <div key={s.id} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>workspaces</span>
                  </div>
                  <h3 className="font-bold text-on-surface text-sm mb-1 line-clamp-2">{s.title}</h3>
                  <span className="text-[10px] uppercase tracking-wider bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full font-bold">{s.accessType || 'Public'}</span>
                </div>
              ))}
              {spaces.length === 0 && <EmptyState label="No se encontraron espacios." />}
            </div>
          )}
        </main>
        <ReadOnlyFooter />
      </div>
      {createOpen && <CreateTaskModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
}

// ── Shared helper components ─────────────────────────────────────────────────
export function PageHeader({ title, icon, subtitle }: { title: string; icon: string; subtitle?: string }) {
  return (
    <header className="flex items-center gap-4 px-8 py-4 bg-surface-container-low/95 backdrop-blur-xl border-b border-outline-variant/25">
      <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <div>
        <h1 className="text-xl font-headline font-bold text-on-surface">{title}</h1>
        {subtitle && <p className="text-xs text-on-surface-variant">{subtitle}</p>}
      </div>
    </header>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  );
}

export function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="bg-error-container text-on-error-container rounded-xl p-4 flex items-center gap-3 max-w-lg">
      <span className="material-symbols-outlined">error</span>
      <span className="text-sm font-medium">{msg}</span>
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-on-surface-variant/40 gap-2">
      <span className="material-symbols-outlined text-4xl">inbox</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ReadOnlyFooter() {
  return (
    <div className="bg-primary-container/18 border-t border-primary/15 py-1.5 px-6 flex items-center justify-center gap-2 text-[11px] font-semibold text-primary">
      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
      Solo lectura desde Wrike — Esta vista no escribe datos en la API.
    </div>
  );
}
