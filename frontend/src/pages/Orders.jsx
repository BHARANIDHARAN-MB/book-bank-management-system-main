import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Plus, X, ShoppingCart } from 'lucide-react'
import { format } from 'date-fns'

const STATUS_BADGE = {
  pending: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-blue-50 text-blue-700',
  rejected: 'bg-red-50 text-red-700',
  fulfilled: 'bg-green-50 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

const OrderModal = ({ onClose, onSave }) => {
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({ book: '', requiredDate: '', purpose: 'study', remarks: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/books?status=available&limit=100').then(r => setBooks(r.data.books?.filter(b => b.availableCopies > 0) || []))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/orders', form)
      toast.success('Order placed!')
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error placing order')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-cream border-2 border-ink-800 shadow-book-lg w-full max-w-md rounded-sm modal-in">
        <div className="flex items-center justify-between p-5 border-b-2 border-ink-200">
          <h2 className="font-display text-xl">Place Book Order</h2>
          <button onClick={onClose}><X size={18} className="text-ink-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Select Book *</label>
            <select required className="input" value={form.book} onChange={e => setForm(p => ({ ...p, book: e.target.value }))}>
              <option value="">Choose a book...</option>
              {books.map(b => <option key={b._id} value={b._id}>{b.title} — {b.author} ({b.availableCopies} avail.)</option>)}
            </select>
          </div>
          <div>
            <label className="label">Required By *</label>
            <input type="date" required className="input" min={new Date().toISOString().split('T')[0]}
              value={form.requiredDate} onChange={e => setForm(p => ({ ...p, requiredDate: e.target.value }))} />
          </div>
          <div>
            <label className="label">Purpose</label>
            <select className="input" value={form.purpose} onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))}>
              {['study', 'reference', 'assignment', 'project', 'other'].map(p => <option key={p} className="capitalize">{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Remarks</label>
            <textarea className="input h-20 resize-none" placeholder="Any special requirements..."
              value={form.remarks} onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Placing...' : 'Place Order'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [filter, setFilter] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = filter ? `?status=${filter}` : ''
      const res = await api.get(`/orders${params}`)
      setOrders(res.data)
    } catch { toast.error('Failed to fetch orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [filter])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status })
      toast.success(`Order ${status}`)
      fetchOrders()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  const cancelOrder = async (id) => {
    if (!confirm('Cancel this order?')) return
    try {
      await api.put(`/orders/${id}/cancel`)
      toast.success('Order cancelled')
      fetchOrders()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Book Orders</h1>
          <p className="text-sm text-ink-500 mt-0.5">{orders.length} orders total</p>
        </div>
        {user?.role === 'student' && (
          <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Order
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'pending', 'approved', 'fulfilled', 'rejected', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-sm font-medium rounded-sm border-2 border-ink-800 transition-all
              ${filter === s ? 'bg-ink-800 text-cream shadow-none' : 'bg-cream text-ink-700 shadow-book hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-20 animate-pulse bg-parchment" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={36} className="mx-auto text-ink-300 mb-3" />
          <p className="font-display text-xl text-ink-400">No orders found</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-parchment">
              <tr>
                <th className="table-head">Book</th>
                {user?.role === 'librarian' && <th className="table-head">Student</th>}
                <th className="table-head">Required By</th>
                <th className="table-head">Purpose</th>
                <th className="table-head">Status</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="hover:bg-parchment/50 transition-colors">
                  <td className="table-cell">
                    <p className="font-medium text-ink-800">{o.book?.title}</p>
                    <p className="text-xs text-ink-400">{o.book?.author}</p>
                  </td>
                  {user?.role === 'librarian' && (
                    <td className="table-cell">
                      <p className="font-medium">{o.student?.name}</p>
                      <p className="text-xs text-ink-400">{o.student?.studentId}</p>
                    </td>
                  )}
                  <td className="table-cell text-xs">{o.requiredDate ? format(new Date(o.requiredDate), 'dd MMM yyyy') : '—'}</td>
                  <td className="table-cell capitalize text-xs">{o.purpose}</td>
                  <td className="table-cell">
                    <span className={`badge ${STATUS_BADGE[o.status] || 'bg-gray-100'}`}>{o.status}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      {user?.role === 'librarian' && o.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(o._id, 'approved')} className="text-xs text-green-700 font-medium hover:underline">Approve</button>
                          <button onClick={() => updateStatus(o._id, 'rejected')} className="text-xs text-red-600 font-medium hover:underline">Reject</button>
                        </>
                      )}
                      {user?.role === 'student' && o.status === 'pending' && (
                        <button onClick={() => cancelOrder(o._id)} className="text-xs text-red-600 font-medium hover:underline">Cancel</button>
                      )}
                      {!['pending'].includes(o.status) && <span className="text-xs text-ink-300">—</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <OrderModal onClose={() => setModal(false)} onSave={() => { setModal(false); fetchOrders() }} />}
    </div>
  )
}
