import { useState, useEffect } from 'react';
import axios from 'axios';

interface Group {
  id: string;
  number: string;
  name: string;  
}

interface GroupResponse {
  items: Group[];
  limit: number;
  offset: number;
  total: number;
}

export default function GroupList() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const getGroups = async () => {
        try {
            setLoading(true);
            const response = await axios.get<GroupResponse>(`${API_URL}/groups`);
            setGroups(response.data.items);
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
        <div className="group-list-container">
            <h1 className="group-list-title">Group List</h1>
            
            {loading && <p className="loading-message">Loading groups...</p>}
            
            {error && <p className="error-message">{error}</p>}
            
            {!loading && !error && groups.length === 0 && (
                <p className="no-groups-message">No groups found</p>
            )}
            
            <div className="groups-grid">
                {groups.map((group) => (
                    <div key={group.id} className="group-card">
                        <div className="group-number">Group #{group.number}</div>
                        <div className="group-name">{group.name}</div>
                    </div>
                ))}
            </div>
        </div>        
    );
}
