import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [statusText, setStatusText] = useState("Conectando con Wrike...");
    const [statusDesc, setStatusDesc] = useState("Validando tus credenciales");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const handleCallback = async () => {
            const searchParams = new URLSearchParams(location.search);
            const code = searchParams.get('code');
            const error = searchParams.get('error');

            console.log("OAuth Callback Triggered", { hasCode: !!code, hasError: !!error, url: window.location.href });

            if (error) {
                console.error("Autenticación cancelada o fallida", error);
                setStatusText("Autenticación cancelada");
                setStatusDesc("Has cancelado el proceso o hubo un error por parte de Wrike.");
                setIsError(true);
                return;
            }

            if (code) {
                try {
                    const clientId = import.meta.env.VITE_WRIKE_CLIENT_ID;
                    const clientSecret = import.meta.env.VITE_WRIKE_CLIENT_SECRET;
                    
                    if (!clientId || !clientSecret) {
                        const msg = "Error: Faltan variables de entorno (Client ID/Secret) en el build.";
                        console.error(msg);
                        alert(msg);
                        setStatusText("Falta Configuración");
                        setStatusDesc("Por favor agrega tu Client ID y Secret en el archivo .env");
                        setIsError(true);
                        return;
                    }

                    console.log("Intercambiando código por token...");
                    const response = await fetch('https://login.wrike.com/oauth2/token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            client_id: clientId,
                            client_secret: clientSecret,
                            grant_type: 'authorization_code',
                            code: code,
                            redirect_uri: import.meta.env.VITE_WRIKE_REDIRECT_URI || "http://localhost:5173/oauth/callback"
                        }).toString(),
                    });

                    const data = await response.json();
                    
                    if (data.access_token) {
                        console.log("Login Exitoso!", { has_token: !!data.access_token });
                        localStorage.setItem('wrike_access_token', data.access_token);
                        localStorage.setItem('wrike_refresh_token', data.refresh_token);
                        if (data.host) {
                            localStorage.setItem('wrike_host', data.host);
                        }
                        window.dispatchEvent(new Event('storage'));
                        window.dispatchEvent(new Event('auth-change'));
                        
                        setTimeout(() => {
                           navigate('/dashboard');
                        }, 500); 
                    } else {
                        const errorMsg = "Wrike dice: " + (data.error_description || data.error || "Error desconocido");
                        console.error("Token no recibido", data);
                        alert(errorMsg);
                        setStatusText("Error validando token");
                        setStatusDesc(errorMsg);
                        setIsError(true);
                    }
                } catch (err: any) {
                    console.error("Error validando el código OAuth", err);
                    alert("Error de conexión: " + err.message);
                    setStatusText("Error de red o conexión");
                    setStatusDesc(String(err) || "Fallo en la conexión.");
                    setIsError(true);
                }
            } else {
                console.log("No se encontró código en la URL, redirigiendo a login...");
                navigate('/login');
            }
        };

        handleCallback();
    }, [location, navigate]);

    return (
        <div className="flex h-screen items-center justify-center bg-surface">
            <div className="text-center">
                {!isError ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                ) : (
                    <div className="mx-auto mb-4 w-12 h-12 text-error">
                         <span className="material-symbols-outlined text-5xl">error</span>
                    </div>
                )}
                <h2 className="text-xl font-bold text-on-surface">{statusText}</h2>
                <p className="text-on-surface-variant max-w-sm mt-2 font-medium">{statusDesc}</p>
                {isError && (
                    <button onClick={() => navigate('/login')} className="mt-6 font-bold bg-surface-container-highest px-6 py-2 rounded-lg hover:bg-surface-variant transition-colors">Volver y Reintentar</button>
                )}
            </div>
        </div>
    );
};

export default OAuthCallback;
