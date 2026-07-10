import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Search, Plus, X, BookOpen } from 'lucide-react'

const CATEGORIES = ['Science', 'Mathematics', 'Literature', 'History', 'Technology', 'Arts', 'Medicine', 'Law', 'Business', 'Other']

const BookModal = ({ book, onClose, onSave }) => {
  const [form, setForm] = useState(book || {
    title: '', author: '', isbn: '', category: 'Technology', publisher: '',
    publishedYear: '', totalCopies: 1, availableCopies: 1, price: '', description: '', tags: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags }
      if (book) {
        await api.put(`/books/${book._id}`, payload)
        toast.success('Book updated!')
      } else {
        await api.post('/books', payload)
        toast.success('Book added!')
      }
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving book')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-cream border-2 border-ink-800 shadow-book-lg w-full max-w-2xl rounded-sm modal-in my-4">
        <div className="flex items-center justify-between p-5 border-b-2 border-ink-200">
          <h2 className="font-display text-xl">{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onClose}><X size={18} className="text-ink-500 hover:text-ink-800" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Title *</label>
            <input required className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Author *</label>
            <input required className="input" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} />
          </div>
          <div>
            <label className="label">ISBN</label>
            <input className="input" value={form.isbn} onChange={e => setForm(p => ({ ...p, isbn: e.target.value }))} />
          </div>
          <div>
            <label className="label">Category *</label>
            <select required className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Publisher</label>
            <input className="input" value={form.publisher} onChange={e => setForm(p => ({ ...p, publisher: e.target.value }))} />
          </div>
          <div>
            <label className="label">Published Year</label>
            <input type="number" className="input" value={form.publishedYear} onChange={e => setForm(p => ({ ...p, publishedYear: e.target.value }))} />
          </div>
          <div>
            <label className="label">Price (₹)</label>
            <input type="number" className="input" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
          </div>
          <div>
            <label className="label">Total Copies *</label>
            <input type="number" required min="1" className="input" value={form.totalCopies} onChange={e => setForm(p => ({ ...p, totalCopies: e.target.value, availableCopies: e.target.value }))} />
          </div>
          <div>
            <label className="label">Available Copies</label>
            <input type="number" className="input" value={form.availableCopies} onChange={e => setForm(p => ({ ...p, availableCopies: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="label">Description</label>
            <textarea className="input h-20 resize-none" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="label">Tags (comma separated)</label>
            <input className="input" placeholder="algorithms, programming, data-structures"
              value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
              onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
          </div>
          <div className="col-span-2 flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Books() {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [modal, setModal] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [page, setPage] = useState(1)

  const canAddBook = ['vendor', 'librarian'].includes(user?.role)
  const canEdit = ['vendor', 'librarian'].includes(user?.role)

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 12 })
      if (search) params.append('search', search)
      if (category) params.append('category', category)
      const res = await api.get(`/books?${params}`)
      setBooks(res.data.books)
      setTotal(res.data.total)
    } catch (err) {
      toast.error('Failed to fetch books')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchBooks() }, [search, category, page])

  const handleDelete = async (id) => {
    if (!confirm('Delete this book?')) return
    try {
      await api.delete(`/books/${id}`)
      toast.success('Book deleted')
      fetchBooks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting book')
    }
  }

  return (
    <div className="fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Library Catalog</h1>
          <p className="text-sm text-ink-500 mt-0.5">{total} books in the collection</p>
        </div>
        {canAddBook && (
          <button onClick={() => { setSelectedBook(null); setModal('book') }} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Book
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search by title, author, ISBN..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <select className="input w-44" value={category} onChange={e => { setCategory(e.target.value); setPage(1) }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Books grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="card h-48 animate-pulse bg-parchment" />)}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={40} className="mx-auto text-ink-300 mb-4" />
          <p className="font-display text-xl text-ink-400">No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map(book => (
            <div key={book._id} className="card hover:shadow-book-lg transition-all group flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <span className="badge bg-parchment text-ink-600 border border-ink-200 text-xs">{book.category}</span>
                <span className={`badge text-xs ${book.availableCopies > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {book.availableCopies}/{book.totalCopies}
                </span>
              </div>
              <h3 className="font-display text-base text-ink-900 leading-snug mb-1 group-hover:text-gold transition-colors line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs text-ink-500 mb-1">{book.author}</p>
              {book.publisher && <p className="text-xs text-ink-400">{book.publisher}{book.publishedYear ? `, ${book.publishedYear}` : ''}</p>}
              {book.price && <p className="text-xs font-mono text-gold mt-1">₹{book.price}</p>}
              <p className="text-xs text-ink-400 mt-2 line-clamp-2 flex-1">{book.description}</p>
              {canEdit && (
                <div className="flex gap-2 mt-4 pt-3 border-t border-ink-100">
                  <button onClick={() => { setSelectedBook(book); setModal('book') }}
                    className="text-xs text-ink-600 hover:text-ink-900 font-medium">Edit</button>
                  {user?.role === 'librarian' && (
                    <button onClick={() => handleDelete(book._id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium ml-auto">Delete</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 12 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-4 py-2 disabled:opacity-40">← Prev</button>
          <span className="flex items-center px-4 text-sm text-ink-600">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * 12 >= total} className="btn-secondary px-4 py-2 disabled:opacity-40">Next →</button>
        </div>
      )}

      {modal === 'book' && (
        <BookModal book={selectedBook} onClose={() => setModal(null)} onSave={() => { setModal(null); fetchBooks() }} />
      )}
    </div>
  )
}
