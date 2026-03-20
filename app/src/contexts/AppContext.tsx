import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'es' | 'en';
export type Theme = 'light' | 'dark';

export const TRANSLATIONS = {
  es: {
    appName: 'Wrike Kanban',
    readOnly: 'Solo lectura',
    myTasks: 'Mis Tareas',
    spaces: 'Espacios',
    calendar: 'Calendario',
    reports: 'Reportes',
    inbox: 'Bandeja',
    settings: 'Ajustes',
    newLocalTask: 'Nueva tarea local',
    syncWrike: 'Sync con Wrike',
    syncing: 'Sincronizando...',
    logout: 'Cerrar sesión',
    notes: 'Notas',
    boardNotes: 'Notas del tablero',
    savedLocally: 'Guardado localmente',
    readOnlyFooter: 'Solo lectura desde Wrike — Los cambios de columna son solo visuales y no se escriben en Wrike.',
    waitingSync: 'Esperando sincronización...',
    successSync: (n: number) => `Éxito. ${n} tarea(s) recibidas de Wrike.`,
    errorSync: (msg: string) => `Error: ${msg}`,
    noTasks: 'Sin tareas',
    columns: {
      PENDING: 'Pendiente',
      IN_PROGRESS: 'En Proceso',
      IN_REVIEW: 'En Revisión',
      DONE: 'Finalizado',
    },
    createTask: {
      title: 'Nueva Tarea Local',
      localInfo: 'Esta tarea es local. Se guardará únicamente en tu dispositivo y no se sincronizará con Wrike.',
      titleLabel: 'Título *',
      titlePlaceholder: 'Nombre de la tarea...',
      descLabel: 'Descripción',
      descPlaceholder: '(Opcional) Describe la tarea...',
      priorityLabel: 'Prioridad',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      cancel: 'Cancelar',
      create: 'Crear Tarea',
    },
    taskDetail: {
      description: 'Descripción',
      comments: 'Comentarios',
      noDescription: 'Sin descripción.',
      noComments: 'No hay comentarios en esta tarea.',
      loadingComments: 'Cargando comentarios...',
      localInfo: 'Esta es una tarea local. No está en Wrike, así que no tiene comentarios ni actividad sincronizada.',
      localBadge: 'LOCAL',
      wrikeUser: 'Usuario de Wrike',
      viewInWrike: 'Ver en Wrike',
      localReadOnly: 'Tarea local — solo lectura aquí',
      wrikeReadOnly: 'Sincronizado desde Wrike — solo lectura',
    },
    settingsPage: {
      title: 'Ajustes',
      subtitle: 'Configuración de la aplicación',
      languageTitle: 'Idioma / Language',
      languageSubtitle: 'Elige el idioma de la interfaz',
      themeTitle: 'Apariencia',
      themeSubtitle: 'Modo claro u oscuro',
      light: 'Claro',
      dark: 'Oscuro',
      accountTitle: 'Cuenta Wrike',
      accountSubtitle: 'Sesión activa',
      logoutBtn: 'Cerrar sesión y limpiar datos',
      version: 'Versión',
    },
    spacesPage: { subtitle: 'Espacios de trabajo disponibles en tu cuenta de Wrike (solo lectura)', noSpaces: 'No se encontraron espacios.' },
    calendarPage: { subtitle: 'Tus tareas con fecha de vencimiento en Wrike (solo lectura)', noTasks: 'Sin tareas para este mes.' },
    reportsPage: {
      subtitle: 'Resumen de tus tareas asignadas en Wrike (solo lectura)',
      totalTasks: 'Total tareas',
      highPriority: 'Alta prioridad',
      normal: 'Normal',
      overdue: 'Vencidas',
      overdueTitle: (n: number) => `Tareas vencidas (${n})`,
      allTasks: 'Todas las tareas asignadas',
    },
    inboxPage: { subtitle: 'Actividad reciente en Wrike (solo lectura)', noActivity: 'No hay actividad reciente registrada.' },
  },
  en: {
    appName: 'Wrike Kanban',
    readOnly: 'Read only',
    myTasks: 'My Tasks',
    spaces: 'Spaces',
    calendar: 'Calendar',
    reports: 'Reports',
    inbox: 'Inbox',
    settings: 'Settings',
    newLocalTask: 'New local task',
    syncWrike: 'Sync with Wrike',
    syncing: 'Syncing...',
    logout: 'Logout',
    notes: 'Notes',
    boardNotes: 'Board Notes',
    savedLocally: 'Saved locally',
    readOnlyFooter: 'Read-only from Wrike — Column changes are visual only and are not written to Wrike.',
    waitingSync: 'Waiting for sync...',
    successSync: (n: number) => `Success. Received ${n} task(s) from Wrike.`,
    errorSync: (msg: string) => `Error: ${msg}`,
    noTasks: 'No tasks',
    columns: {
      PENDING: 'Pending',
      IN_PROGRESS: 'In Progress',
      IN_REVIEW: 'In Review',
      DONE: 'Done',
    },
    createTask: {
      title: 'New Local Task',
      localInfo: 'This task is local. It will be saved only on your device and will not sync with Wrike.',
      titleLabel: 'Title *',
      titlePlaceholder: 'Task name...',
      descLabel: 'Description',
      descPlaceholder: '(Optional) Describe the task...',
      priorityLabel: 'Priority',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      cancel: 'Cancel',
      create: 'Create Task',
    },
    taskDetail: {
      description: 'Description',
      comments: 'Comments',
      noDescription: 'No description.',
      noComments: 'No comments on this task.',
      loadingComments: 'Loading comments...',
      localInfo: 'This is a local task. It is not in Wrike, so it has no comments or synced activity.',
      localBadge: 'LOCAL',
      wrikeUser: 'Wrike User',
      viewInWrike: 'View in Wrike',
      localReadOnly: 'Local task — read only here',
      wrikeReadOnly: 'Synced from Wrike — read only',
    },
    settingsPage: {
      title: 'Settings',
      subtitle: 'Application configuration',
      languageTitle: 'Language / Idioma',
      languageSubtitle: 'Choose the interface language',
      themeTitle: 'Appearance',
      themeSubtitle: 'Light or dark mode',
      light: 'Light',
      dark: 'Dark',
      accountTitle: 'Wrike Account',
      accountSubtitle: 'Active session',
      logoutBtn: 'Logout and clear data',
      version: 'Version',
    },
    spacesPage: { subtitle: 'Workspaces available in your Wrike account (read-only)', noSpaces: 'No spaces found.' },
    calendarPage: { subtitle: 'Your tasks with due dates in Wrike (read-only)', noTasks: 'No tasks this month.' },
    reportsPage: {
      subtitle: 'Summary of your assigned tasks in Wrike (read-only)',
      totalTasks: 'Total tasks',
      highPriority: 'High priority',
      normal: 'Normal',
      overdue: 'Overdue',
      overdueTitle: (n: number) => `Overdue tasks (${n})`,
      allTasks: 'All assigned tasks',
    },
    inboxPage: { subtitle: 'Recent activity in Wrike (read-only)', noActivity: 'No recent activity recorded.' },
  },
} as const;

export type TranslationKey = typeof TRANSLATIONS['es'];

interface AppContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationKey;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('app_lang') as Lang) || 'es');
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('app_theme') as Theme) || 'light');

  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem('app_lang', l); };
  const setTheme = (t: Theme) => { setThemeState(t); localStorage.setItem('app_theme', t); };

  // Apply dark class on root html element
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');
  }, [theme]);

  const t = TRANSLATIONS[lang] as TranslationKey;

  return (
    <AppContext.Provider value={{ lang, setLang, t, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
