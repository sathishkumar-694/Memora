import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ProtectedRoute from './pages/protectedRoute';
import Note from './components/Note';
import Notes from './pages/Notes';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <div className="App">
       <Routes>
        
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path="/notes" element={<ProtectedRoute><Notes/></ProtectedRoute>}/>
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/admin-login" element={<AdminLogin/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>} />
       </Routes>
      
     
    </div>
  );
}

export default App;
