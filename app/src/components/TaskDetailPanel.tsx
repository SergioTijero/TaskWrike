import { useEffect, useState } from 'react';

interface Comment { id: string; text: string; authorId?: string; createdDate?: string; }
interface TaskDetail { id: string; title: string; description?: string; priority?: string; date?: string; isLocal?: boolean; }

interface Props {
  task: TaskDetail | null;
  onClose: () => void;
}

export default function TaskDetailPanel({ task, onClose }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [fullDescription, setFullDescription] = useState('');

  useEffect(() => {
    if (!task) { setComments([]); setFullDescription(''); return; }
    if (task.isLocal) { setFullDescription(task.description || ''); return; }

    const token = localStorage.getItem('wrike_access_token') || import.meta.env.VITE_WRIKE_PERMANENT_TOKEN;
    const host  = localStorage.getItem('wrike_host') || 'www.wrike.com';
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch full task details (description)
    fetch(`https://${host}/api/v4/tasks/${task.id}?fields=["description"]`, { headers })
      .then(r => r.json())
      .then(d => setFullDescription(d.data?.[0]?.description || ''))
      .catch(() => {});

    // Fetch comments
    setLoadingComments(true);
    fetch(`https://${host}/api/v4/tasks/${task.id}/comments`, { headers })
      .then(r => r.json())
      .then(d => setComments(d.data || []))
      .catch(() => setComments([]))
      .finally(() => setLoadingComments(false));
  }, [task?.id]);

  const priorityColors: Record<string, string> = {
    High:   'bg-error-container text-on-error-container',
    Medium: 'bg-secondary-container text-on-secondary-container',
    Low:    'bg-primary-container text-on-primary-container',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/20 transition-opacity duration-300 ${task ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[420px] max-w-full z-[80] bg-surface-container-lowest shadow-2xl border-l border-outline-variant/20 flex flex-col transition-transform duration-300 ease-in-out ${task ? 'translate-x-0' : 'translate-x-full'}`}>
        {task && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-outline-variant/20 bg-surface-container-low">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {task.priority && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${priorityColors[task.priority] || 'bg-surface-variant text-on-surface-variant'}`}>
                      {task.priority}
                    </span>
                  )}
                  {task.isLocal && (
                    <span className="text-[9px] font-bold uppercase bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-md">
                      LOCAL
                    </span>
                  )}
                  {!task.isLocal && (
                    <span className="text-[9px] font-bold uppercase bg-primary-container/60 text-primary px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[11px]">sync</span> Wrike
                    </span>
                  )}
                </div>
                <h2 className="font-headline font-bold text-lg text-on-surface leading-tight">{task.title}</h2>
                {task.date && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                    {task.date}
                  </div>
                )}
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant shrink-0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
              {/* Description */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">description</span> Descripción
                </h3>
                {fullDescription
                  ? <div className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap rounded-lg bg-surface-container-low p-3"
                      dangerouslySetInnerHTML={{ __html: fullDescription }} />
                  : <p className="text-sm text-on-surface-variant/60 italic">Sin descripción.</p>
                }
              </section>

              {/* Comments */}
              {!task.isLocal && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                    Comentarios
                    {comments.length > 0 && (
                      <span className="ml-1 bg-primary-container text-on-primary-container text-[10px] font-bold px-1.5 py-0.5 rounded-full">{comments.length}</span>
                    )}
                  </h3>
                  {loadingComments && (
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Cargando comentarios...
                    </div>
                  )}
                  {!loadingComments && comments.length === 0 && (
                    <p className="text-sm text-on-surface-variant/60 italic">No hay comentarios en esta tarea.</p>
                  )}
                  {!loadingComments && comments.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {comments.map(c => (
                        <div key={c.id} className="bg-surface-container-low rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-[12px] text-primary">person</span>
                              </div>
                              <span className="text-xs font-bold text-on-surface">Usuario de Wrike</span>
                            </div>
                            {c.createdDate && (
                              <span className="text-[10px] text-on-surface-variant">
                                {new Date(c.createdDate).toLocaleDateString('es-ES', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-on-surface leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: c.text || '' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {task.isLocal && (
                <div className="bg-secondary-container/30 border border-secondary-container rounded-xl p-4 flex items-start gap-3 text-sm text-on-secondary-container">
                  <span className="material-symbols-outlined text-base mt-0.5 shrink-0">info</span>
                  <span>Esta es una tarea <strong>local</strong>. No está en Wrike, así que no tiene comentarios ni actividad sincronizada.</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
              <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">lock</span>
                {task.isLocal ? 'Tarea local — solo lectura aquí' : 'Sincronizado desde Wrike — solo lectura'}
              </span>
              {!task.isLocal && (
                <a
                  href={`https://www.wrike.com/open.htm?id=${task.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"
                >
                  Ver en Wrike
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
