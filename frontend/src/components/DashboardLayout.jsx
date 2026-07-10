import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  BookOpen, LayoutDashboard, ShoppingCart, BookMarked,
  RotateCcw, ClipboardList, Users, User, LogOut, Menu, X, ChevronRight
} from 'lucide-react'

const ROLE_COLOR = { student: 'bg-ink-700', librarian: 'bg-forest', vendor: 'bg-gold' }

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard', roles: ['student', 'librarian', 'vendor'] },
  { to: '/books', icon: <BookOpen size={18} />, label: 'Books', roles: ['student', 'librarian', 'vendor'] },
  { to: '/orders', icon: <ShoppingCart size={18} />, label: 'Book Orders', roles: ['student', 'librarian'] },
  { to: '/issues', icon: <BookMarked size={18} />, label: 'Book Issues', roles: ['student', 'librarian'] },
  { to: '/returns', icon: <RotateCcw size={18} />, label: 'Book Returns', roles: ['student', 'librarian'] },
  { to: '/entries', icon: <ClipboardList size={18} />, label: 'Book Entries', roles: ['librarian', 'vendor'] },
  { to: '/users', icon: <Users size={18} />, label: 'Users', roles: ['librarian'] },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const filteredNav = navItems.filter(n => n.roles.includes(user?.role))

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'flex' : 'hidden md:flex'} flex-col w-64 bg-ink-900 border-r-2 border-ink-700 min-h-screen`}>
      {/* Logo */}
      <div className="p-5 border-b-2 border-ink-700">
        <div className="flex items-center gap-2.5">
          <BookOpen size={22} className="text-gold" />
          <span className="font-display text-xl text-cream">BookBank</span>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b-2 border-ink-700">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-sm ${ROLE_COLOR[user?.role] || 'bg-ink-600'} flex items-center justify-center text-white font-semibold text-sm border border-ink-500`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cream truncate">{user?.name}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded ${ROLE_COLOR[user?.role]} text-white capitalize`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {filteredNav.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}>
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t-2 border-ink-700 space-y-0.5">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}>
          <User size={18} />
          My Profile
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-950/30">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-ink-900/70" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-64">
            <Sidebar mobile />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-cream">
            <X size={24} />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b-2 border-ink-200 bg-cream">
          <button onClick={() => setSidebarOpen(true)} className="text-ink-700">
            <Menu size={22} />
          </button>
          <span className="font-display text-lg text-ink-900">BookBank</span>
          <div className="w-6" />
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
