import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth, { AuthProvider, ProtectedRoute } from "./components/Auth";
import Dashboard from "./components/Dashboard";
import GroupList from "./components/GroupList";
import Schedule from "./components/GroupList";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>         
          <Route path="/" element={<Auth />} />
          
         
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/grouplist" element={<GroupList />} />
            <Route path="/dashboard/grouplist/schedule/:id" element={<Schedule />} />
            
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
