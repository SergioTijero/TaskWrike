import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleWrikeLogin = () => {
        const clientId = import.meta.env.VITE_WRIKE_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_WRIKE_REDIRECT_URI || "http://localhost:5173/oauth/callback";
        
        if (!clientId || clientId === "TU_CLIENT_ID_DE_WRIKE_AQUI") {
            // Fallback for demo mode if no OAuth key provided
            alert("No hay Client ID configurado. Entrando en modo DEMO.");
            navigate('/dashboard');
            return;
        }

        const authUrl = `https://login.wrike.com/oauth2/authorize/v4?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
        
        // Retornamos a window.location.href en lugar de window.open. 
        // Tauri bloquea automáticamente los popups externos y la redirección completa 
        // asegura que localStorage se guarde en el contexto correcto de la app de escritorio.
        window.location.href = authUrl;
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Fallback for simple demo login
        navigate('/dashboard');
    };

    return (
        <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden bg-surface min-h-screen">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-container/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-tertiary-container/30 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[30%] bg-secondary-container/20 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWNPrazCK92S1_r8XnjC5SixnYurZe-WzHTHvBA-80W7NYJnMm209ynXghSEUWg52_uET92TDTMADGYS9vP99gKtP3uG7KHe0qmdhbJU8L6xmFKp9PomNEzkU2PyhI8S1MsvFE1ssf4Ygwav17hl_6RScnvo_aHF9JjjOhXJjnngH0FC7OGJ9reyS43HU_mIGTNbKnGjRRZFEAAFVEmEQqzjZ7xcm27V1G8fDVsdb8UQeHnN_PMnoFDUAKNPPr6_8Z83Jrer4O99sG')" }}></div>
            </div>
            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-6 shadow-xl shadow-primary/20">
                        <span className="material-symbols-outlined text-on-primary text-4xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>grid_view</span>
                    </div>
                    <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-2">Sign In to Your Workspace</h1>
                    <p className="text-on-surface-variant font-medium">Wrike Kanban Viewer</p>
                </div>
                <div className="surface-container-highest glass-panel p-8 rounded-xl shadow-2xl shadow-on-surface/5 border border-white/20">
                    <div className="space-y-4">
                        <button type="button" onClick={handleWrikeLogin} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-semibold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                            <span className="material-symbols-outlined">login</span>
                            <span>Log in with Wrike</span>
                        </button>
                        <button type="button" className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest text-on-surface font-semibold py-3.5 px-6 rounded-lg shadow-sm border border-outline-variant/20 hover:bg-surface-container-low transition-all active:scale-[0.98]">
                            <img alt="Google G logo for authentication" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSDFh-U9jZT52AvTOMP5W7wR6HhXK1UEbkYSHB9qvWz7Dqa35u7hjinwOzKIYQF92mZ9FFJFqeP2AsUu3T__yUEOxVcGwxARQj6TpZXuORF3uykvGkWBd_ct8lLLXianayNuLSWkRavC6KRLYpMIjozKffdRu1-L_nDN9T0U6Q8m-Eg9qC5J7eASiL4x4FUM_d3BMYieZ8by7tJbwYw-9UYAD4PfNOcOWrrl8Ql8dWWtvv7rGC65Sqax1f0DmvLoxQ5oucp4lqao-A" />
                            <span>Log in with Google</span>
                        </button>
                    </div>
                    <div className="relative my-8 text-center">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-outline-variant/30"></div>
                        </div>
                        <span className="relative px-4 bg-transparent text-on-surface-variant text-xs font-bold uppercase tracking-widest">or secure sign in</span>
                    </div>
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-semibold text-on-surface mb-1.5 ml-1" htmlFor="email">Work Email</label>
                            <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg placeholder:text-outline-variant/60" id="email" name="email" placeholder="name@company.com" type="email" />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-sm font-semibold text-on-surface" htmlFor="password">Password</label>
                                <a className="text-xs font-bold text-primary hover:text-primary-dim transition-colors" href="#">Forgot?</a>
                            </div>
                            <input className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg placeholder:text-outline-variant/60" id="password" name="password" placeholder="••••••••" type="password" />
                        </div>
                        <div className="flex items-center gap-2 ml-1">
                            <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" id="remember" type="checkbox" />
                            <label className="text-xs font-medium text-on-surface-variant" htmlFor="remember">Remember this device for 30 days</label>
                        </div>
                        <button className="w-full bg-secondary-container text-on-secondary-container font-bold py-3 px-6 rounded-lg hover:bg-secondary-fixed transition-colors" type="submit">
                            Continue to Dashboard
                        </button>
                    </form>
                </div>
                <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-6 text-xs font-bold text-outline uppercase tracking-widest">
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                        <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                        <a className="hover:text-primary transition-colors" href="#">Security</a>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant/60">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                        <span className="text-[10px] font-medium">Enterprise-grade 256-bit SSL Encryption</span>
                    </div>
                </div>
            </div>
            
            <footer className="absolute bottom-6 p-6 text-center text-[10px] font-bold text-outline-variant uppercase tracking-widest w-full pointer-events-none">
                © 2024 Wrike Kanban Viewer. Azure Horizon Design System.
            </footer>
        </main>
    );
};

export default Login;
