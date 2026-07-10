import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { User, Mail, Phone, BookOpen, Shield } from 'lucide-react'

export default function Profile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', department: user?.department || '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/auth/profile', form)
      localStorage.setItem('user', JSON.stringify(res.data))
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile')
    } finally { setLoading(false) }
  }

  const ROLE_COLOR = { student: 'bg-ink-700', librarian: 'bg-forest', vendor: 'bg-gold' }

  return (
    <div className="fade-in max-w-2xl">
      <h1 className="font-display text-3xl text-ink-900 mb-6">My Profile</h1>

      {/* Profile card */}
      <div className="card mb-6">
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-sm ${ROLE_COLOR[user?.role] || 'bg-ink-600'} flex items-center justify-center text-white font-display text-2xl border-2 border-ink-800 shadow-book`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink-900">{user?.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className={`badge text-white ${ROLE_COLOR[user?.role]} capitalize`}>{user?.role}</span>
              {user?.studentId && <span className="text-xs text-ink-500 font-mono">{user.studentId}</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t-2 border-ink-100">
          <div className="flex items-center gap-2 text-sm text-ink-600">
            <Mail size={15} className="text-ink-400" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-600">
            <Phone size={15} className="text-ink-400" />
            <span>{user?.phone}</span>
          </div>
          {user?.department && (
            <div className="flex items-center gap-2 text-sm text-ink-600">
              <BookOpen size={15} className="text-ink-400" />
              <span>{user.department}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-ink-600">
            <Shield size={15} className="text-ink-400" />
            <span className="capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="card">
        <h3 className="font-display text-lg text-ink-800 mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input type="tel" className="input" pattern="[0-9]{10}" value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
          {user?.role === 'student' && (
            <div>
              <label className="label">Department</label>
              <input className="input" placeholder="e.g. Computer Science" value={form.department}
                onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
            </div>
          )}
          <div className="bg-parchment border border-ink-200 rounded-sm p-3 text-xs text-ink-400">
            Email and role cannot be changed. Contact administrator if needed.
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
