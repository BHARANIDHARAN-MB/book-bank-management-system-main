import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Plus, X, BookMarked } from 'lucide-react'
import { format, addDays } from 'date-fns'

const STATUS_BADGE = {
  issued: 'bg-blue-50 text-blue-700',
  returned: 'bg-green-50 text-green-700',
  overdue: 'bg-red-50 text-red-700',
  lost: 'bg-gray-200 text-gray-600',
}

const IssueModal = ({ onClose, onSave }) => {
  const [students, setStudents] = useState([])
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({ student: '', book: '', dueDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'), remarks: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/users?role=student'),
      api.get('/books?limit=100')
    ]).then(([u, b]) => {
      setStudents(u.data)
      setBooks(b.data.books?.filter(bk => bk.availableCopies > 0) || [])
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/issues', form)
      toast.success('Book issued successfully!')
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error issuing book')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-cream border-2 border-ink-800 shadow-book-lg w-full max-w-md rounded-sm modal-in">
        <div className="flex items-center justify-between p-5 border-b-2 border-ink-200">
          <h2 className="font-display text-xl">Issue a Book</h2>
          <button onClick={onClose}><X size={18} className="text-ink-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Student *</label>
            <select required className="input" value={form.student} onChange={e => setForm(p => ({ ...p, student: e.target.value }))}>
              <option value="">Select student...</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.name} — {s.studentId || s.email}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Book *</label>
            <select required className="input" value={form.book} onChange={e => setForm(p => ({ ...p, book: e.target.value }))}>
              <option value="">Select book...</option>
              {books.map(b => <option key={b._id} value={b._id}>{b.title} ({b.availableCopies} avail.)</option>)}
            </select>
          </div>
          <div>
            <label className="label">Due Date *</label>
            <input type="date" required className="input" min={new Date().toISOString().split('T')[0]}
              value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
          </div>
          <div>
            <label className="label">Remarks</label>
            <textarea className="input h-16 resize-none" value={form.remarks}
              onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Issuing...' : 'Issue Book'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Issues() {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [filter, setFilter] = useState('')

  const fetchIssues = async () => {
    setLoading(true)
    try {
      const params = filter ? `?status=${filter}` : ''
      const res = await api.get(`/issues${params}`)
      setIssues(res.data)
    } catch { toast.error('Failed to fetch issues') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchIssues() }, [filter])

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Book Issues</h1>
          <p className="text-sm text-ink-500 mt-0.5">{issues.length} records</p>
        </div>
        {user?.role === 'librarian' && (
          <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Issue Book
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'issued', 'overdue', 'returned'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-sm font-medium rounded-sm border-2 border-ink-800 transition-all
              ${filter === s ? 'bg-ink-800 text-cream shadow-none' : 'bg-cream text-ink-700 shadow-book hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-20 animate-pulse bg-parchment" />)}</div>
      ) : issues.length === 0 ? (
        <div className="text-center py-16">
          <BookMarked size={36} className="mx-auto text-ink-300 mb-3" />
          <p className="font-display text-xl text-ink-400">No issue records found</p>
        </div>
      ) : (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-parchment">
              <tr>
                <th className="table-head">Book</th>
                {user?.role === 'librarian' && <th className="table-head">Student</th>}
                <th className="table-head">Issue Date</th>
                <th className="table-head">Due Date</th>
                <th className="table-head">Status</th>
                <th className="table-head">Fine</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(i => (
                <tr key={i._id} className="hover:bg-parchment/50 transition-colors">
                  <td className="table-cell">
                    <p className="font-medium text-ink-800">{i.book?.title}</p>
                    <p className="text-xs text-ink-400">{i.book?.author}</p>
                  </td>
                  {user?.role === 'librarian' && (
                    <td className="table-cell">
                      <p className="font-medium">{i.student?.name}</p>
                      <p className="text-xs text-ink-400">{i.student?.phone}</p>
                    </td>
                  )}
                  <td className="table-cell text-xs">{format(new Date(i.issueDate), 'dd MMM yyyy')}</td>
                  <td className={`table-cell text-xs font-medium ${i.status === 'overdue' ? 'text-red-600' : ''}`}>
                    {format(new Date(i.dueDate), 'dd MMM yyyy')}
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${STATUS_BADGE[i.status] || 'bg-gray-100'}`}>{i.status}</span>
                  </td>
                  <td className="table-cell font-mono text-sm">
                    {i.fineAmount > 0 ? <span className="text-red-600">₹{i.fineAmount}</span> : <span className="text-ink-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <IssueModal onClose={() => setModal(false)} onSave={() => { setModal(false); fetchIssues() }} />}
    </div>
  )
}
