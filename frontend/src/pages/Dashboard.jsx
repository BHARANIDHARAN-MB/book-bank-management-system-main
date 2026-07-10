import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { BookOpen, ShoppingCart, BookMarked, RotateCcw, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

const StatCard = ({ icon, label, value, sub, color = 'border-ink-800' }) => (
  <div className={`card border-2 ${color} fade-in`}>
    <div className="flex items-start justify-between mb-3">
      <div className="text-ink-600">{icon}</div>
      <span className="text-3xl font-display font-bold text-ink-900">{value ?? '—'}</span>
    </div>
    <p className="text-sm font-semibold text-ink-700">{label}</p>
    {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
  </div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({})
  const [recentBooks, setRecentBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, ordersRes, issuesRes, returnsRes] = await Promise.allSettled([
          api.get('/books?limit=6'),
          api.get('/orders'),
          api.get('/issues'),
          api.get('/returns'),
        ])

        const books = booksRes.status === 'fulfilled' ? booksRes.value.data : { books: [], total: 0 }
        const orders = ordersRes.status === 'fulfilled' ? ordersRes.value.data : []
        const issues = issuesRes.status === 'fulfilled' ? issuesRes.value.data : []
        const returns = returnsRes.status === 'fulfilled' ? returnsRes.value.data : []

        setRecentBooks(books.books?.slice(0, 6) || [])
        setStats({
          totalBooks: books.total,
          pendingOrders: orders.filter ? orders.filter(o => o.status === 'pending').length : 0,
          activeIssues: issues.filter ? issues.filter(i => i.status === 'issued' || i.status === 'overdue').length : 0,
          overdueIssues: issues.filter ? issues.filter(i => i.status === 'overdue').length : 0,
          totalReturns: returns.length,
          totalOrders: orders.length,
        })
      } catch (err) {
        console.error(err)
      } finally { setLoading(false) }
    }
    fetchStats()
  }, [])

  const roleStats = {
    student: [
      { icon: <BookOpen size={20} />, label: 'Books Available', value: stats.totalBooks, sub: 'In the library catalog', color: 'border-forest' },
      { icon: <ShoppingCart size={20} />, label: 'My Orders', value: stats.totalOrders, sub: `${stats.pendingOrders} pending`, color: 'border-ink-500' },
      { icon: <BookMarked size={20} />, label: 'Books Issued', value: stats.activeIssues, sub: stats.overdueIssues > 0 ? `⚠ ${stats.overdueIssues} overdue` : 'All on time', color: stats.overdueIssues > 0 ? 'border-red-500' : 'border-gold' },
      { icon: <RotateCcw size={20} />, label: 'Total Returns', value: stats.totalReturns, sub: 'Returned to library', color: 'border-ink-400' },
    ],
    librarian: [
      { icon: <BookOpen size={20} />, label: 'Total Books', value: stats.totalBooks, sub: 'Catalog entries', color: 'border-forest' },
      { icon: <ShoppingCart size={20} />, label: 'Pending Orders', value: stats.pendingOrders, sub: 'Awaiting approval', color: 'border-gold' },
      { icon: <BookMarked size={20} />, label: 'Active Issues', value: stats.activeIssues, sub: 'Currently issued', color: 'border-ink-500' },
      { icon: <AlertCircle size={20} />, label: 'Overdue Books', value: stats.overdueIssues, sub: 'Need follow-up', color: stats.overdueIssues > 0 ? 'border-red-500' : 'border-ink-300' },
    ],
    vendor: [
      { icon: <BookOpen size={20} />, label: 'Total Books', value: stats.totalBooks, sub: 'In catalog', color: 'border-forest' },
      { icon: <TrendingUp size={20} />, label: 'Active Issues', value: stats.activeIssues, sub: 'Books in circulation', color: 'border-gold' },
      { icon: <CheckCircle size={20} />, label: 'Total Returns', value: stats.totalReturns, sub: 'Processed returns', color: 'border-ink-500' },
    ]
  }

  const cards = roleStats[user?.role] || roleStats.student

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink-900 mb-1">
          Good day, <span className="italic text-gold">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-ink-500 text-sm">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {' · '}
          <span className="capitalize font-medium text-ink-600">{user?.role}</span> Dashboard
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1,2,3,4].map(i => <div key={i} className="card h-28 animate-pulse bg-parchment" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      )}

      {/* Recent Books */}
      <div>
        <h2 className="font-display text-xl text-ink-800 mb-4">Recent Books in Library</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="card h-36 animate-pulse bg-parchment" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentBooks.map(book => (
              <div key={book._id} className="card hover:shadow-book-lg transition-all group slide-in">
                <div className="flex items-start justify-between mb-2">
                  <span className="badge bg-parchment text-ink-600 border border-ink-200">{book.category}</span>
                  <span className={`badge ${book.availableCopies > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {book.availableCopies > 0 ? `${book.availableCopies} avail.` : 'Unavailable'}
                  </span>
                </div>
                <h3 className="font-display text-base text-ink-900 group-hover:text-gold transition-colors leading-snug mb-1">
                  {book.title}
                </h3>
                <p className="text-xs text-ink-500">{book.author}</p>
                {book.price && (
                  <p className="text-xs font-mono text-ink-400 mt-2">₹{book.price}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
