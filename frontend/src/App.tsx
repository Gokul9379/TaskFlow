import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <-- 1. Import Toaster
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        
        {/* 2. Add the Toaster here so it's available globally! */}
        <Toaster 
          position="bottom-right" 
          toastOptions={{ 
            style: { 
              borderRadius: '12px', 
              background: '#333', 
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600'
            } 
          }} 
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/edit-task/:id" element={<EditTask />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}