import { useState, useEffect } from 'react';
import styles from "../styles/grouplist.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';

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
    const [search, setSearch] = useState<string>(''); 
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    
    useEffect(() => {
        if (!checkAuth()) {
            navigate("/");
        }
    }, [checkAuth, navigate]);

    const getGroups = async () => {
        try {
            setLoading(true);
            const response = await axios.get<GroupResponse>(`${API_URL}/groups`);
            setGroups(response.data.items);
            setError(null);
        } catch (err) {
            console.error('Error fetching groups:', err);
            setError('Failed to fetch groups');
            setGroups([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getGroups();
    }, []);

    const filteredGroups = groups.filter((group) => {
        const searchStr = search.toLowerCase();
        return group.number.toLowerCase().includes(searchStr) || 
               group.name.toLowerCase().includes(searchStr);
    });

    const handleClick = (id: string) => { 
        navigate(`/dashboard/grouplist/schedule/${id}`); 
    };

    return (
        <div> 
            <h1>Group List</h1>
            
            {loading && <p>Loading groups...</p>}
            
            {error && <p>{error}</p>}
            
            {!loading && !error && groups.length === 0 && (
                <p className={styles.empty}>No groups found</p>
            )}
            
            <input 
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <ul className={styles.groupsGrid}>
                {filteredGroups.map((group) => (
                    <li 
                        key={group.id} 
                        className={styles.groupCard} 
                        onClick={() => handleClick(group.number)}
                    >
                        <div className={styles.title}>Group #{group.number}</div>
                        <div>{group.name}</div>
                    </li>
                ))}
            </ul>
        </div>        
    );
}
