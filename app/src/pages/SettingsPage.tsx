import Sidebar from '../components/Sidebar';
import { useApp } from '../contexts/AppContext';
import { logoutWrikeSession } from '../services/wrikeSession';

export default function SettingsPage() {
  const { t, lang, setLang, theme, setTheme } = useApp();
  const s = t.settingsPage;
  const appVersion = __APP_VERSION__;

  const handleLogout = async () => {
    await logoutWrikeSession();
  };

  return (
    <div className="bg-surface text-on-surface flex h-screen overflow-hidden font-body">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-8 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/20">
          <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
          <div>
            <h1 className="text-xl font-headline font-bold text-on-surface">{s.title}</h1>
            <p className="text-xs text-on-surface-variant">{s.subtitle}</p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-lg mx-auto flex flex-col gap-6">

            {/* Language */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>language</span>
                <div>
                  <h2 className="font-bold text-on-surface">{s.languageTitle}</h2>
                  <p className="text-xs text-on-surface-variant">{s.languageSubtitle}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setLang('es')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border ${lang === 'es' ? 'bg-primary text-on-primary border-primary shadow-md' : 'bg-surface-variant text-on-surface-variant border-transparent hover:bg-surface-container'}`}
                >
                  <span className="text-lg">🇪🇸</span> Español
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border ${lang === 'en' ? 'bg-primary text-on-primary border-primary shadow-md' : 'bg-surface-variant text-on-surface-variant border-transparent hover:bg-surface-container'}`}
                >
                  <span className="text-lg">🇺🇸</span> English
                </button>
              </div>
            </section>

            {/* Theme */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>contrast</span>
                <div>
                  <h2 className="font-bold text-on-surface">{s.themeTitle}</h2>
                  <p className="text-xs text-on-surface-variant">{s.themeSubtitle}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border ${theme === 'light' ? 'bg-primary text-on-primary border-primary shadow-md' : 'bg-surface-variant text-on-surface-variant border-transparent hover:bg-surface-container'}`}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: theme === 'light' ? "'FILL' 1" : '' }}>light_mode</span>
                  {s.light}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border ${theme === 'dark' ? 'bg-primary text-on-primary border-primary shadow-md' : 'bg-surface-variant text-on-surface-variant border-transparent hover:bg-surface-container'}`}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: theme === 'dark' ? "'FILL' 1" : '' }}>dark_mode</span>
                  {s.dark}
                </button>
              </div>
            </section>

            {/* Account */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
                <div>
                  <h2 className="font-bold text-on-surface">{s.accountTitle}</h2>
                  <p className="text-xs text-on-surface-variant">{s.accountSubtitle}</p>
                </div>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 mb-4 text-xs font-mono text-on-surface-variant break-all">
                {localStorage.getItem('wrike_access_token')
                  ? `Token: ${localStorage.getItem('wrike_access_token')?.substring(0, 20)}...`
                  : 'No token stored'}
                {localStorage.getItem('wrike_host') && (
                  <div className="mt-1">Host: {localStorage.getItem('wrike_host')}</div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-error-container text-on-error-container font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                {s.logoutBtn}
              </button>
            </section>

            {/* Version */}
            <p className="text-center text-xs text-on-surface-variant/50">
              {s.version} {appVersion} — Wrike Kanban
            </p>
          </div>
        </main>

        <div className="bg-blue-600/10 border-t border-blue-600/20 py-1.5 px-6 flex items-center justify-center gap-2 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          {t.readOnlyFooter}
        </div>
      </div>
    </div>
  );
}
