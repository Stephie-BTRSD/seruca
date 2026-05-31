import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Users from './pages/Users';
import Taxonomy from './pages/Taxonomy';
import Search from './pages/Search';
import Assistant from './pages/Assistant';
import Navbar from './components/Navbar';
import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.role === 'ADMIN' ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute>
              <Navbar />
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute><Navbar /><Dashboard /></PrivateRoute>
          } />
          <Route path="/courses" element={
            <PrivateRoute><Navbar /><Courses /></PrivateRoute>
          } />
          <Route path="/search" element={
            <PrivateRoute><Navbar /><Search /></PrivateRoute>
          } />
          <Route path="/assistant" element={
            <PrivateRoute><Navbar /><Assistant /></PrivateRoute>
          } />
          <Route path="/taxonomy" element={
            <AdminRoute><Navbar /><Taxonomy /></AdminRoute>
          } />
          <Route path="/users" element={
            <AdminRoute><Navbar /><Users /></AdminRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
