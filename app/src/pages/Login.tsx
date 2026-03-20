import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { t, lang, setLang } = useApp();



    return (
        <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden bg-surface min-h-screen">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-container/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-tertiary-container/30 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[30%] bg-secondary-container/20 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWNPrazCK92S1_r8XnjC5SixnYurZe-WzHTHvBA-80W7NYJnMm209ynXghSEUWg52_uET92TDTMADGYS9vP99gKtP3uG7KHe0qmdhbJU8L6xmFKp9PomNEzkU2PyhI8S1MsvFE1ssf4Ygwav17hl_6RScnvo_aHF9JjjOhXJjnngH0FC7OGJ9reyS43HU_mIGTNbKnGjRRZFEAAFVEmEQqzjZ7xcm27V1G8fDVsdb8UQeHnN_PMnoFDUAKNPPr6_8Z83Jrer4O99sG')" }}></div>
            </div>
            {/* Language Switcher Top Right */}
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
                        {lang === 'es' ? 'Inicia sesión en tu Workspace' : 'Sign In to Your Workspace'}
                    </h1>
                    <p className="text-on-surface-variant font-medium">TaskWrike — Kanban Viewer</p>
                </div>
                <div className="surface-container-highest glass-panel p-8 rounded-xl shadow-2xl shadow-on-surface/5 border border-white/20">
                    <div className="space-y-4">
                        <button type="button" onClick={() => {
                            const clientId = import.meta.env.VITE_WRIKE_CLIENT_ID;
                            const redirectUri = import.meta.env.VITE_WRIKE_REDIRECT_URI || "http://localhost:5173/oauth/callback";
                            if (!clientId || clientId === "TU_CLIENT_ID_DE_WRIKE_AQUI") {
                                navigate('/dashboard'); return;
                            }
                            window.location.href = `https://login.wrike.com/oauth2/authorize/v4?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
                        }} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-semibold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                            <span className="material-symbols-outlined">login</span>
                            <span>{lang === 'es' ? 'Entrar con Wrike' : 'Log in with Wrike'}</span>
                        </button>
                        <button type="button" disabled className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest text-on-surface/40 font-semibold py-3.5 px-6 rounded-lg border border-outline-variant/10 cursor-not-allowed grayscale transition-all">
                            <img alt="Google G logo for authentication" className="w-5 h-5 opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSDFh-U9jZT52AvTOMP5W7wR6HhXK1UEbkYSHB9qvWz7Dqa35u7hjinwOzKIYQF92mZ9FFJFqeP2AsUu3T__yUEOxVcGwxARQj6TpZXuORF3uykvGkWBd_ct8lLLXianayNuLSWkRavC6KRLYpMIjozKffdRu1-L_nDN9T0U6Q8m-Eg9qC5J7eASiL4x4FUM_d3BMYieZ8by7tJbwYw-9UYAD4PfNOcOWrrl8Ql8dWWtvv7rGC65Sqax1f0DmvLoxQ5oucp4lqao-A" />
                            <span>Log in with Google (Soon)</span>
                        </button>
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
