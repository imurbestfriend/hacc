import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/grouplist.module.css";
import { Link } from "react-router-dom";

import Box from '@mui/material/Box';
// import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
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
    
    const filteredGroups = groups.filter((group) => {
        const searchStr = search.toLowerCase();
        return group.number.toLowerCase().includes(searchStr) || 
               group.name.toLowerCase().includes(searchStr);
    });

    const handleClick = (id: string, number: string) => { 
        Cookies.set("group_id",id)
        Cookies.set("group_name", number)
        navigate(`/dashboard/schedule`); 
    };
    return (
        <div> 
            <h1>Group List</h1>
            <Link to="/dashboard">Dashboard</Link>
            {/* {loading && <p>Loading groups...</p>} */}
            {loading && 
            <Box sx={{ width: '50%' }}>
                <CircularProgress color="inherit" />
            </Box>}

            {error && <p>{error}</p>}
            
            {!loading && !error && groups.length === 0 && (
                <p className={styles.empty}>No groups found</p>
            )}
            
            {!loading && 
                <input 
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            
            }
            
            <ul className={styles.groupsGrid}>
                {filteredGroups.map((group) => (
                    <li 
                        key={group.id} 
                        className={styles.groupCard} 
                        onClick={() => handleClick(group.id, group.number)}
                    >
                        <div className={styles.title}>Group #{group.number}</div>
                        <div>{group.name}</div>
                    </li>
                ))}
            </ul>
        </div>        
    );
    
}
