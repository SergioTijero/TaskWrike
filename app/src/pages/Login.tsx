import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { getWrikeAuthorizeUrl } from '../utils/wrikeAuth';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { lang, setLang } = useApp();
    const [manualToken, setManualToken] = React.useState('');
    const [manualHost, setManualHost] = React.useState('www.wrike.com');
    const [manualError, setManualError] = React.useState('');
    const [isSavingToken, setIsSavingToken] = React.useState(false);
    const clientId = import.meta.env.VITE_WRIKE_CLIENT_ID;
    const hasOAuthConfig = !!clientId && clientId !== 'TU_CLIENT_ID_DE_WRIKE_AQUI';
    const wrikeAuthUrl = hasOAuthConfig ? getWrikeAuthorizeUrl(clientId) : '';

    const copy = {
        oauthMissingConfig: lang === 'es'
            ? 'Falta configurar el Client ID de Wrike en esta build.'
            : 'This build is missing the Wrike Client ID configuration.',
        tokenTitle: lang === 'es' ? 'Entrar con Permanent Token' : 'Sign in with Permanent Token',
        tokenSubtitle: lang === 'es'
            ? 'Usalo como alternativa si OAuth falla en esta maquina.'
            : 'Use this as a fallback if OAuth fails on this machine.',
        tokenLabel: lang === 'es' ? 'Permanent Token' : 'Permanent Token',
        tokenPlaceholder: lang === 'es' ? 'Pega tu token de Wrike...' : 'Paste your Wrike token...',
        hostLabel: lang === 'es' ? 'Host de Wrike' : 'Wrike host',
        hostPlaceholder: 'www.wrike.com',
        saveToken: lang === 'es' ? 'Guardar y entrar' : 'Save and continue',
        savingToken: lang === 'es' ? 'Validando token...' : 'Validating token...',
        tokenRequired: lang === 'es'
            ? 'Necesito un Permanent Token para continuar.'
            : 'A Permanent Token is required to continue.',
        tokenInvalid: lang === 'es'
            ? 'Wrike rechazo el token o el host configurado.'
            : 'Wrike rejected the token or configured host.',
    };

    const handleManualLogin = async () => {
        const token = manualToken.trim();
        const host = manualHost.trim() || 'www.wrike.com';

        if (!token) {
            setManualError(copy.tokenRequired);
            return;
        }

        setIsSavingToken(true);
        setManualError('');

        try {
            const response = await fetch(`https://${host}/api/v4/contacts?me=true`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(copy.tokenInvalid);
            }

            localStorage.setItem('wrike_access_token', token);
            localStorage.setItem('wrike_host', host);
            localStorage.removeItem('wrike_refresh_token');
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('auth-change'));
            navigate('/dashboard');
        } catch (error) {
            setManualError(error instanceof Error ? error.message : copy.tokenInvalid);
        } finally {
            setIsSavingToken(false);
        }
    };

    return (
        <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden bg-surface min-h-screen">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-container/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-tertiary-container/30 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[30%] bg-secondary-container/20 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWNPrazCK92S1_r8XnjC5SixnYurZe-WzHTHvBA-80W7NYJnMm209ynXghSEUWg52_uET92TDTMADGYS9vP99gKtP3uG7KHe0qmdhbJU8L6xmFKp9PomNEzkU2PyhI8S1MsvFE1ssf4Ygwav17hl_6RScnvo_aHF9JjjOhXJjnngH0FC7OGJ9reyS43HU_mIGTNbKnGjRRZFEAAFVEmEQqzjZ7xcm27V1G8fDVsdb8UQeHnN_PMnoFDUAKNPPr6_8Z83Jrer4O99sG')" }}></div>
            </div>
            <div className="absolute top-6 right-8 z-20 flex gap-2">
                <button
                  onClick={() => setLang('es')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'es' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                >
                  EN
                </button>
            </div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10">
                    <img src="/taskwrike_macos_icon_v3.svg" className="w-20 h-20 mx-auto mb-6 drop-shadow-2xl active:scale-95 transition-transform cursor-pointer" alt="TaskWrike" />
                    <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-2">
                        {lang === 'es' ? 'Inicia sesion en tu Workspace' : 'Sign In to Your Workspace'}
                    </h1>
                    <p className="text-on-surface-variant font-medium">TaskWrike - Kanban Viewer</p>
                </div>
                <div className="surface-container-highest glass-panel p-8 rounded-xl shadow-2xl shadow-on-surface/5 border border-white/20">
                    <div className="space-y-4">
                        {hasOAuthConfig ? (
                            <a
                                href={wrikeAuthUrl}
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-semibold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined">login</span>
                                <span>{lang === 'es' ? 'Entrar con Wrike' : 'Log in with Wrike'}</span>
                            </a>
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="w-full flex items-center justify-center gap-3 bg-surface-container-low text-on-surface/40 font-semibold py-3.5 px-6 rounded-lg border border-outline-variant/10 cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">login</span>
                                <span>{lang === 'es' ? 'Entrar con Wrike' : 'Log in with Wrike'}</span>
                            </button>
                        )}
                        {!hasOAuthConfig && (
                            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs font-medium text-amber-900">
                                {copy.oauthMissingConfig}
                            </div>
                        )}
                        <button type="button" disabled className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest text-on-surface/40 font-semibold py-3.5 px-6 rounded-lg border border-outline-variant/10 cursor-not-allowed grayscale transition-all">
                            <img alt="Google G logo for authentication" className="w-5 h-5 opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSDFh-U9jZT52AvTOMP5W7wR6HhXK1UEbkYSHB9qvWz7Dqa35u7hjinwOzKIYQF92mZ9FFJFqeP2AsUu3T__yUEOxVcGwxARQj6TpZXuORF3uykvGkWBd_ct8lLLXianayNuLSWkRavC6KRLYpMIjozKffdRu1-L_nDN9T0U6Q8m-Eg9qC5J7eASiL4x4FUM_d3BMYieZ8by7tJbwYw-9UYAD4PfNOcOWrrl8Ql8dWWtvv7rGC65Sqax1f0DmvLoxQ5oucp4lqao-A" />
                            <span>Log in with Google (Soon)</span>
                        </button>
                        <div className="my-2 h-px bg-outline-variant/20" />
                        <div className="space-y-3">
                            <div>
                                <h2 className="text-sm font-bold text-on-surface">{copy.tokenTitle}</h2>
                                <p className="mt-1 text-xs text-on-surface-variant">{copy.tokenSubtitle}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">
                                    {copy.tokenLabel}
                                </label>
                                <input
                                    type="password"
                                    value={manualToken}
                                    onChange={(event) => setManualToken(event.target.value)}
                                    placeholder={copy.tokenPlaceholder}
                                    className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">
                                    {copy.hostLabel}
                                </label>
                                <input
                                    type="text"
                                    value={manualHost}
                                    onChange={(event) => setManualHost(event.target.value)}
                                    placeholder={copy.hostPlaceholder}
                                    className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary"
                                />
                            </div>
                            {manualError && (
                                <div className="rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-xs font-medium text-error">
                                    {manualError}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleManualLogin}
                                disabled={isSavingToken}
                                className="w-full rounded-lg bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container disabled:cursor-wait disabled:opacity-60"
                            >
                                {isSavingToken ? copy.savingToken : copy.saveToken}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-on-surface-variant/60">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                        <span className="text-[10px] font-medium">Enterprise-grade 256-bit SSL Encryption</span>
                    </div>
                </div>
            </div>

            <footer className="absolute bottom-6 p-6 text-center text-[10px] font-bold text-outline-variant uppercase tracking-widest w-full pointer-events-none">
                © 2026 TaskWrike. Made by Sergio Tijero.
            </footer>
        </main>
    );
};

export default Login;
