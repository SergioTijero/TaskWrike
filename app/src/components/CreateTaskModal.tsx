import { useState } from 'react';

type TaskPriority = 'High' | 'Medium' | 'Low';

interface LocalTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  date?: string;
  isLocal: true;
}

interface Props {
  onClose: () => void;
  onSave?: (task: LocalTask) => void;
}

const CreateTaskModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const task: LocalTask = {
      id: `local-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      isLocal: true,
    };
    onSave?.(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()}
        className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-xl text-on-surface">Nueva Tarea Local</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-surface-variant rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="bg-secondary-container/30 border border-secondary-container rounded-lg p-3 flex items-start gap-2 text-sm text-on-secondary-container">
          <span className="material-symbols-outlined text-base mt-0.5 shrink-0">info</span>
          <span>Esta tarea es <strong>local</strong>. Se guardará únicamente en tu dispositivo y <strong>no se sincronizará con Wrike</strong>.</span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Título *</label>
          <input autoFocus required value={title} onChange={e => setTitle(e.target.value)}
            className="bg-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
            placeholder="Nombre de la tarea..." />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Descripción</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="bg-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="(Opcional) Describe la tarea..." />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Prioridad</label>
          <div className="flex gap-2">
            {(['High', 'Medium', 'Low'] as TaskPriority[]).map(p => (
              <button key={p} type="button" onClick={() => setPriority(p)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-colors ${priority === p ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant hover:bg-surface-container'}`}>
                {p === 'High' ? 'Alta' : p === 'Medium' ? 'Media' : 'Baja'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-variant transition-colors">
            Cancelar
          </button>
          <button type="submit"
            className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors">
            Crear Tarea
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskModal;
