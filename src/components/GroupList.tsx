import { useState, useEffect } from 'react';
import axios from 'axios';

interface Group {
  id: string;
  number: string;
  name: string;
  
}

export default function GroupList() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    
    const getGroups = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/groups`);
            setGroups(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching groups:', err);
            setError('Failed to fetch groups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getGroups();
    }, []);

    return (
        <div className={"main-container"}>
            <h1>Group list</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && (
                <ul>
                    {groups.map(group => (
                        <li key={group.id}>{group.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
