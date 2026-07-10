import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Users as UsersIcon } from 'lucide-react'
import { format } from 'date-fns'

const ROLE_BADGE = {
  student: 'bg-ink-100 text-ink-700',
  librarian: 'bg-green-50 text-green-700',
  vendor: 'bg-yellow-50 text-yellow-700',
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = roleFilter ? `?role=${roleFilter}` : ''
      const res = await api.get(`/users${params}`)
      setUsers(res.data)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [roleFilter])

  const toggleStatus = async (id) => {
    try {
      const res = await api.put(`/users/${id}/toggle`)
      toast.success(`User ${res.data.isActive ? 'activated' : 'deactivated'}`)
      fetchUsers()
    } catch (err) { toast.error('Error updating user') }
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Users</h1>
          <p className="text-sm text-ink-500 mt-0.5">{users.length} registered users</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['', 'student', 'librarian', 'vendor'].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-4 py-1.5 text-sm font-medium rounded-sm border-2 border-ink-800 capitalize transition-all
              ${roleFilter === r ? 'bg-ink-800 text-cream shadow-none' : 'bg-cream text-ink-700 shadow-book hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5'}`}>
            {r || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="card h-16 animate-pulse bg-parchment" />)}</div>
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <UsersIcon size={36} className="mx-auto text-ink-300 mb-3" />
          <p className="font-display text-xl text-ink-400">No users found</p>
        </div>
      ) : (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-parchment">
              <tr>
                <th className="table-head">Name</th>
                <th className="table-head">Email</th>
                <th className="table-head">Phone</th>
                <th className="table-head">Role</th>
                <th className="table-head">Department</th>
                <th className="table-head">Joined</th>
                <th className="table-head">Status</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="hover:bg-parchment/50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-sm flex items-center justify-center text-white text-xs font-bold
                        ${u.role === 'librarian' ? 'bg-forest' : u.role === 'vendor' ? 'bg-gold' : 'bg-ink-600'}`}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-ink-800">{u.name}</p>
                        {u.studentId && <p className="text-xs text-ink-400">{u.studentId}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-xs">{u.email}</td>
                  <td className="table-cell text-xs font-mono">{u.phone}</td>
                  <td className="table-cell">
                    <span className={`badge capitalize ${ROLE_BADGE[u.role] || 'bg-gray-100'}`}>{u.role}</span>
                  </td>
                  <td className="table-cell text-xs text-ink-500">{u.department || '—'}</td>
                  <td className="table-cell text-xs">{format(new Date(u.createdAt), 'dd MMM yyyy')}</td>
                  <td className="table-cell">
                    <span className={`badge ${u.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button onClick={() => toggleStatus(u._id)}
                      className={`text-xs font-medium hover:underline ${u.isActive ? 'text-red-500' : 'text-green-600'}`}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
