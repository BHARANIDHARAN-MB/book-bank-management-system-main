import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BookOpen, X, Eye, EyeOff, Library, Users, Package } from 'lucide-react'

const DEMO_CREDS = [
  { role: 'Librarian', email: 'librarian@bookbank.com', password: 'password123', color: 'bg-forest text-white' },
  { role: 'Student', email: 'student@bookbank.com', password: 'password123', color: 'bg-ink-700 text-cream' },
  { role: 'Vendor', email: 'vendor@bookbank.com', password: 'password123', color: 'bg-gold text-white' },
]

export default function LandingPage() {
  const [modal, setModal] = useState(null) // 'login' | 'register'
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', phone: '', role: 'student', studentId: '', department: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(loginForm.email, loginForm.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(regForm)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const fillDemo = (cred) => {
    setLoginForm({ email: cred.email, password: cred.password })
    setModal('login')
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(0deg, #1e150e 0px, #1e150e 1px, transparent 1px, transparent 40px),
                          repeating-linear-gradient(90deg, #1e150e 0px, #1e150e 1px, transparent 1px, transparent 40px)`
      }} />

      {/* Header */}
      <header className="relative z-10 border-b-2 border-ink-800 bg-ink-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={28} className="text-gold" />
            <span className="font-display text-2xl text-cream tracking-tight">BookBank</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setModal('login')} className="btn-secondary text-cream border-cream hover:bg-ink-700">Sign In</button>
            <button onClick={() => setModal('register')} className="btn-gold">Register</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-parchment border-2 border-ink-300 px-3 py-1 rounded-full text-xs font-medium text-ink-600 mb-6">
            <span className="w-2 h-2 rounded-full bg-forest animate-pulse"></span>
            Library Management System
          </div>
          <h1 className="font-display text-6xl text-ink-900 leading-tight mb-6">
            Your College<br />
            <span className="italic text-gold">Book Bank</span><br />
            — Digitized.
          </h1>
          <p className="text-ink-600 text-lg leading-relaxed mb-10 max-w-xl">
            Order, issue, and return books seamlessly. Manage library inventory with a system built for students, librarians, and vendors.
          </p>
          <div className="flex gap-4">
            <button onClick={() => setModal('register')} className="btn-primary text-base px-8 py-3">Get Started</button>
            <button onClick={() => setModal('login')} className="btn-secondary text-base px-8 py-3">Sign In</button>
          </div>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-3 gap-5 mt-20">
          {[
            { icon: <Users size={24} />, title: 'Students', desc: 'Order books, track issues, submit returns, view your library history.', color: 'border-ink-400' },
            { icon: <Library size={24} />, title: 'Librarians', desc: 'Issue books, manage returns, catalog entries, oversee all operations.', color: 'border-forest' },
            { icon: <Package size={24} />, title: 'Vendors', desc: 'Add books to the system, manage inventory, and track supply entries.', color: 'border-gold' },
          ].map(c => (
            <div key={c.title} className={`card border-2 ${c.color} hover:shadow-book-lg transition-all`}>
              <div className="text-ink-700 mb-3">{c.icon}</div>
              <h3 className="font-display text-xl text-ink-800 mb-2">{c.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Demo credentials */}
        <div className="mt-16">
          <p className="text-xs uppercase tracking-widest text-ink-400 font-medium mb-4">Quick Demo Login</p>
          <div className="flex gap-3">
            {DEMO_CREDS.map(c => (
              <button key={c.role} onClick={() => fillDemo(c)}
                className={`${c.color} border-2 border-ink-800 shadow-book hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all px-4 py-2 text-sm font-medium rounded-sm`}>
                {c.role} →
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* LOGIN MODAL */}
      {modal === 'login' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-cream border-2 border-ink-800 shadow-book-lg w-full max-w-md rounded-sm modal-in">
            <div className="flex items-center justify-between p-6 border-b-2 border-ink-200">
              <div>
                <h2 className="font-display text-2xl text-ink-900">Welcome Back</h2>
                <p className="text-sm text-ink-500 mt-0.5">Sign in to your BookBank account</p>
              </div>
              <button onClick={() => setModal(null)} className="text-ink-400 hover:text-ink-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input type="email" required className="input" placeholder="you@example.com"
                  value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required className="input pr-10" placeholder="••••••••"
                    value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-center text-sm text-ink-500">
                No account?{' '}
                <button type="button" onClick={() => setModal('register')} className="text-ink-800 font-medium underline underline-offset-2">
                  Register here
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {modal === 'register' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-cream border-2 border-ink-800 shadow-book-lg w-full max-w-lg rounded-sm modal-in my-4">
            <div className="flex items-center justify-between p-6 border-b-2 border-ink-200">
              <div>
                <h2 className="font-display text-2xl text-ink-900">Create Account</h2>
                <p className="text-sm text-ink-500 mt-0.5">Join the BookBank system</p>
              </div>
              <button onClick={() => setModal(null)} className="text-ink-400 hover:text-ink-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Full Name</label>
                  <input type="text" required className="input" placeholder="Your full name"
                    value={regForm.name} onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="label">Email Address</label>
                  <input type="email" required className="input" placeholder="you@example.com"
                    value={regForm.email} onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input type="password" required minLength={6} className="input" placeholder="Min 6 chars"
                    value={regForm.password} onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input type="tel" required className="input" placeholder="10-digit number"
                    pattern="[0-9]{10}" title="Enter 10-digit phone number"
                    value={regForm.phone} onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="label">Role</label>
                  <select className="input" value={regForm.role} onChange={e => setRegForm(p => ({ ...p, role: e.target.value }))}>
                    <option value="student">Student</option>
                    <option value="librarian">Librarian</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
                {regForm.role === 'student' && (
                  <>
                    <div>
                      <label className="label">Student ID</label>
                      <input type="text" className="input" placeholder="e.g. STU001"
                        value={regForm.studentId} onChange={e => setRegForm(p => ({ ...p, studentId: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label">Department</label>
                      <input type="text" className="input" placeholder="e.g. Computer Science"
                        value={regForm.department} onChange={e => setRegForm(p => ({ ...p, department: e.target.value }))} />
                    </div>
                  </>
                )}
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full py-3 text-base mt-2">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              <p className="text-center text-sm text-ink-500">
                Already have an account?{' '}
                <button type="button" onClick={() => setModal('login')} className="text-ink-800 font-medium underline underline-offset-2">
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
