import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";

export default function Dashboard() {
    const { checkAuth, logout } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!checkAuth()) {
            navigate("/");
        }
    }, [checkAuth, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div>
            <h1>Welcome to Dashboard!</h1>
            <p>This is a protected page visible only after successful login.</p>
            <button onClick={handleLogout}>Logout</button>
            <br />
            <Link to="/" >← Back to Login</Link>
        </div>
    );
}
