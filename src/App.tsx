import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth.tsx";
import GroupList from "./components/GroupList.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth/>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/grouplist" element={<GroupList />} />
            </Routes>
        </Router>
    );
}

export default App;