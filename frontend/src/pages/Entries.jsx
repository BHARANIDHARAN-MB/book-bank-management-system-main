import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Plus, X, ClipboardList } from 'lucide-react'
import { format } from 'date-fns'

const ENTRY_TYPE_BADGE = {
  new_arrival: 'bg-green-50 text-green-700',
  restock: 'bg-blue-50 text-blue-700',
  correction: 'bg-yellow-50 text-yellow-700',
  withdrawal: 'bg-red-50 text-red-700',
}

const EntryModal = ({ onClose, onSave }) => {
  const [books, setBooks] = useState([])
  const [vendors, setVendors] = useState([])
  const [form, setForm] = useState({ book: '', entryType: 'new_arrival', quantityAdded: 0, quantityRemoved: 0, reason: '', vendorRef: '', invoiceNumber: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([api.get('/books?limit=200'), api.get('/users?role=vendor')]).then(([b, v]) => {
      setBooks(b.data.books || [])
      setVendors(v.data || [])
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/entries', form)
      toast.success('Entry recorded!')
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-cream border-2 border-ink-800 shadow-book-lg w-full max-w-lg rounded-sm modal-in">
        <div className="flex items-center justify-between p-5 border-b-2 border-ink-200">
          <h2 className="font-display text-xl">New Book Entry</h2>
          <button onClick={onClose}><X size={18} className="text-ink-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Book *</label>
            <select required className="input" value={form.book} onChange={e => setForm(p => ({ ...p, book: e.target.value }))}>
              <option value="">Select book...</option>
              {books.map(b => <option key={b._id} value={b._id}>{b.title} — {b.author}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Entry Type *</label>
              <select className="input" value={form.entryType} onChange={e => setForm(p => ({ ...p, entryType: e.target.value }))}>
                {['new_arrival', 'restock', 'correction', 'withdrawal'].map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Invoice No.</label>
              <input className="input" placeholder="INV-001" value={form.invoiceNumber}
                onChange={e => setForm(p => ({ ...p, invoiceNumber: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Qty Added</label>
              <input type="number" min="0" className="input" value={form.quantityAdded}
                onChange={e => setForm(p => ({ ...p, quantityAdded: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="label">Qty Removed</label>
              <input type="number" min="0" className="input" value={form.quantityRemoved}
                onChange={e => setForm(p => ({ ...p, quantityRemoved: Number(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label className="label">Vendor</label>
            <select className="input" value={form.vendorRef} onChange={e => setForm(p => ({ ...p, vendorRef: e.target.value }))}>
              <option value="">None / Internal</option>
              {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Reason / Notes</label>
            <textarea className="input h-16 resize-none" value={form.reason}
              onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Saving...' : 'Record Entry'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Entries() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const res = await api.get('/entries')
      setEntries(res.data)
    } catch { toast.error('Failed to load entries') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchEntries() }, [])

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Book Entries</h1>
          <p className="text-sm text-ink-500 mt-0.5">{entries.length} catalog entries</p>
        </div>
        {user?.role === 'librarian' && (
          <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Entry
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-20 animate-pulse bg-parchment" />)}</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <ClipboardList size={36} className="mx-auto text-ink-300 mb-3" />
          <p className="font-display text-xl text-ink-400">No entries recorded</p>
        </div>
      ) : (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-parchment">
              <tr>
                <th className="table-head">Book</th>
                <th className="table-head">Type</th>
                <th className="table-head">Added</th>
                <th className="table-head">Removed</th>
                <th className="table-head">Vendor</th>
                <th className="table-head">By</th>
                <th className="table-head">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e._id} className="hover:bg-parchment/50 transition-colors">
                  <td className="table-cell">
                    <p className="font-medium text-ink-800">{e.book?.title}</p>
                    <p className="text-xs text-ink-400">{e.invoiceNumber && `INV: ${e.invoiceNumber}`}</p>
                  </td>
                  <td className="table-cell">
                    <span className={`badge capitalize ${ENTRY_TYPE_BADGE[e.entryType] || 'bg-gray-100'}`}>
                      {e.entryType?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="table-cell font-mono text-sm text-green-700">+{e.quantityAdded}</td>
                  <td className="table-cell font-mono text-sm text-red-600">-{e.quantityRemoved}</td>
                  <td className="table-cell text-xs text-ink-500">{e.vendorRef?.name || '—'}</td>
                  <td className="table-cell text-xs">{e.enteredBy?.name}</td>
                  <td className="table-cell text-xs">{format(new Date(e.createdAt), 'dd MMM yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <EntryModal onClose={() => setModal(false)} onSave={() => { setModal(false); fetchEntries() }} />}
    </div>
  )
}
