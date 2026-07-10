import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Plus, X, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'

const ReturnModal = ({ onClose, onSave }) => {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [form, setForm] = useState({ issueId: '', condition: 'good', remarks: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/issues?status=issued').then(r => {
      const filtered = user?.role === 'student'
        ? r.data.filter(i => i.student?._id === user._id || i.student === user._id)
        : r.data
      setIssues(filtered)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/returns', { issueId: form.issueId, condition: form.condition, remarks: form.remarks })
      if (res.data.fine > 0) {
        toast.success(`Book returned! Fine collected: ₹${res.data.fine}`)
      } else {
        toast.success('Book returned successfully!')
      }
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing return')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-cream border-2 border-ink-800 shadow-book-lg w-full max-w-md rounded-sm modal-in">
        <div className="flex items-center justify-between p-5 border-b-2 border-ink-200">
          <h2 className="font-display text-xl">Return a Book</h2>
          <button onClick={onClose}><X size={18} className="text-ink-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Select Issued Book *</label>
            <select required className="input" value={form.issueId} onChange={e => setForm(p => ({ ...p, issueId: e.target.value }))}>
              <option value="">Choose an issued book...</option>
              {issues.map(i => (
                <option key={i._id} value={i._id}>
                  {i.book?.title} — {i.student?.name} (Due: {format(new Date(i.dueDate), 'dd MMM')})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Book Condition</label>
            <select className="input" value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}>
              {['excellent', 'good', 'fair', 'poor', 'damaged'].map(c => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Remarks</label>
            <textarea className="input h-16 resize-none" placeholder="Notes about condition..."
              value={form.remarks} onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))} />
          </div>
          <div className="bg-parchment border border-ink-200 rounded-sm p-3 text-xs text-ink-500">
            ⚠ Fine of ₹2/day is applied for overdue books
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Processing...' : 'Process Return'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Returns() {
  const { user } = useAuth()
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)

  const fetchReturns = async () => {
    setLoading(true)
    try {
      const res = await api.get('/returns')
      setReturns(res.data)
    } catch { toast.error('Failed to fetch returns') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchReturns() }, [])

  const CONDITION_COLOR = {
    excellent: 'bg-green-50 text-green-700',
    good: 'bg-blue-50 text-blue-700',
    fair: 'bg-yellow-50 text-yellow-700',
    poor: 'bg-orange-50 text-orange-700',
    damaged: 'bg-red-50 text-red-700',
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Book Returns</h1>
          <p className="text-sm text-ink-500 mt-0.5">{returns.length} returns processed</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Return Book
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-20 animate-pulse bg-parchment" />)}</div>
      ) : returns.length === 0 ? (
        <div className="text-center py-16">
          <RotateCcw size={36} className="mx-auto text-ink-300 mb-3" />
          <p className="font-display text-xl text-ink-400">No returns yet</p>
        </div>
      ) : (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-parchment">
              <tr>
                <th className="table-head">Book</th>
                {user?.role === 'librarian' && <th className="table-head">Student</th>}
                <th className="table-head">Return Date</th>
                <th className="table-head">Condition</th>
                <th className="table-head">Fine Collected</th>
                <th className="table-head">Returned To</th>
              </tr>
            </thead>
            <tbody>
              {returns.map(r => (
                <tr key={r._id} className="hover:bg-parchment/50 transition-colors">
                  <td className="table-cell">
                    <p className="font-medium text-ink-800">{r.book?.title}</p>
                    <p className="text-xs text-ink-400">{r.book?.author}</p>
                  </td>
                  {user?.role === 'librarian' && (
                    <td className="table-cell">
                      <p className="font-medium">{r.student?.name}</p>
                      <p className="text-xs text-ink-400">{r.student?.email}</p>
                    </td>
                  )}
                  <td className="table-cell text-xs">{format(new Date(r.returnDate), 'dd MMM yyyy, hh:mm a')}</td>
                  <td className="table-cell">
                    <span className={`badge capitalize ${CONDITION_COLOR[r.condition] || 'bg-gray-100'}`}>{r.condition}</span>
                  </td>
                  <td className="table-cell font-mono text-sm">
                    {r.fineCollected > 0 ? <span className="text-red-600 font-semibold">₹{r.fineCollected}</span> : <span className="text-green-600">₹0</span>}
                  </td>
                  <td className="table-cell text-xs text-ink-500">{r.returnedTo?.name || 'Self'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <ReturnModal onClose={() => setModal(false)} onSave={() => { setModal(false); fetchReturns() }} />}
    </div>
  )
}
