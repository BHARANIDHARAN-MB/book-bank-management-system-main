import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Orders from './pages/Orders'
import Issues from './pages/Issues'
import Returns from './pages/Returns'
import Entries from './pages/Entries'
import Users from './pages/Users'
import Profile from './pages/Profile'

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="text-4xl mb-4">📚</div>
        <p className="font-display text-ink-600">Loading BookBank...</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

const AppRoutes = () => {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="books" element={<Books />} />
        <Route path="orders" element={<ProtectedRoute roles={['student', 'librarian']}><Orders /></ProtectedRoute>} />
        <Route path="issues" element={<ProtectedRoute roles={['student', 'librarian']}><Issues /></ProtectedRoute>} />
        <Route path="returns" element={<ProtectedRoute roles={['student', 'librarian']}><Returns /></ProtectedRoute>} />
        <Route path="entries" element={<ProtectedRoute roles={['librarian', 'vendor']}><Entries /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute roles={['librarian']}><Users /></ProtectedRoute>} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'DM Sans', fontSize: '14px', border: '2px solid #1e150e', borderRadius: '2px', boxShadow: '4px 4px 0px #1e150e' },
          success: { iconTheme: { primary: '#2d5016', secondary: '#faf7f2' } }
        }}
      />
      <AppRoutes />
    </AuthProvider>
  )
}
