// src/services/wrikeApi.ts

export const fetchWrikeTasks = async () => {
    // Check for token first
    const token = localStorage.getItem('wrike_access_token') || import.meta.env.VITE_WRIKE_PERMANENT_TOKEN;
    
    if (!token) {
        throw new Error("No authentication token available");
    }

    const host = localStorage.getItem('wrike_host') || 'www.wrike.com';

    try {
        // Step 1: Get the current user's real Contact ID
        const meRes = await fetch(`https://${host}/api/v4/contacts?me=true`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!meRes.ok) {
            const errBody = await meRes.text();
            throw new Error(`Error obteniendo usuario: ${meRes.status}: ${errBody}`);
        }
        const meData = await meRes.json();
        const myId: string = meData.data[0].id;

        // Step 2: Fetch tasks assigned to this specific Contact ID
        const query = new URLSearchParams({
            responsibles: `["${myId}"]`,
        });
        const baseUrl = `https://${host}/api/v4/tasks?${query.toString()}`;
        
        const response = await fetch(baseUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error(`Status: ${response.status}`, errBody);
            throw new Error(`Error ${response.status}: ${errBody}`);
        }

        const data = await response.json();
        return data.data; // Wrike returns tasks inside an array in the 'data' field
    } catch (error) {
        console.error("Error fetching tasks from Wrike API", error);
        throw error;
    }
};

// Also we should get user data just to show the avatar
export const fetchWrikeUser = async () => {
    const token = localStorage.getItem('wrike_access_token') || import.meta.env.VITE_WRIKE_PERMANENT_TOKEN;
    if (!token) return null;
    const host = localStorage.getItem('wrike_host') || 'www.wrike.com';

    try {
        // We get info for the current user
        const response = await fetch(`https://${host}/api/v4/contacts?me=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.data[0]; 
    } catch (e) {
        console.error(e);
        return null;
    }
}
