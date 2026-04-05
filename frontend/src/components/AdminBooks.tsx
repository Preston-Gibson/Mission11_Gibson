import { useEffect, useState } from 'react'

type Book = {
  bookID: number
  title: string
  author: string
  publisher: string
  isbn: string
  classification: string
  category: string
  pageCount: number
  price: number
}

const emptyBook: Omit<Book, 'bookID'> = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
}

const API = 'http://localhost:5011/api/books'

function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [newBook, setNewBook] = useState<Omit<Book, 'bookID'>>(emptyBook)
  const [showAddForm, setShowAddForm] = useState(false)

  function loadBooks() {
    fetch(`${API}?pageNum=1&pageSize=1000`)
      .then((res) => res.json())
      .then((data) => setBooks(data.books))
  }

  useEffect(() => {
    loadBooks()
  }, [])

  function handleDelete(id: number) {
    if (!confirm('Delete this book?')) return
    fetch(`${API}/${id}`, { method: 'DELETE' }).then(() => loadBooks())
  }

  function handleEditSave() {
    if (!editingBook) return
    fetch(`${API}/${editingBook.bookID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingBook),
    }).then(() => {
      setEditingBook(null)
      loadBooks()
    })
  }

  function handleAdd() {
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    }).then(() => {
      setNewBook(emptyBook)
      setShowAddForm(false)
      loadBooks()
    })
  }

  function updateEditing(field: keyof Book, value: string | number) {
    if (!editingBook) return
    setEditingBook({ ...editingBook, [field]: value })
  }

  function updateNew(field: keyof Omit<Book, 'bookID'>, value: string | number) {
    setNewBook({ ...newBook, [field]: value })
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin — Manage Books</h2>
        <button
          className="btn btn-success"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Book'}
        </button>
      </div>

      {/* Add Book Form */}
      {showAddForm && (
        <div className="card mb-4 p-3">
          <h5>New Book</h5>
          <BookForm book={newBook} onChange={updateNew} />
          <button className="btn btn-primary mt-2" onClick={handleAdd}>
            Save
          </button>
        </div>
      )}

      <table className="table table-hover table-bordered table-sm">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Class</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) =>
            editingBook?.bookID === book.bookID ? (
              <tr key={book.bookID} className="table-warning">
                <td><input className="form-control form-control-sm" value={editingBook.title} onChange={(e) => updateEditing('title', e.target.value)} /></td>
                <td><input className="form-control form-control-sm" value={editingBook.author} onChange={(e) => updateEditing('author', e.target.value)} /></td>
                <td><input className="form-control form-control-sm" value={editingBook.publisher} onChange={(e) => updateEditing('publisher', e.target.value)} /></td>
                <td><input className="form-control form-control-sm" value={editingBook.isbn} onChange={(e) => updateEditing('isbn', e.target.value)} /></td>
                <td><input className="form-control form-control-sm" value={editingBook.classification} onChange={(e) => updateEditing('classification', e.target.value)} /></td>
                <td><input className="form-control form-control-sm" value={editingBook.category} onChange={(e) => updateEditing('category', e.target.value)} /></td>
                <td><input className="form-control form-control-sm" type="number" value={editingBook.pageCount} onChange={(e) => updateEditing('pageCount', Number(e.target.value))} /></td>
                <td><input className="form-control form-control-sm" type="number" step="0.01" value={editingBook.price} onChange={(e) => updateEditing('price', Number(e.target.value))} /></td>
                <td>
                  <button className="btn btn-sm btn-primary me-1" onClick={handleEditSave}>Save</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => setEditingBook(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.classification}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => setEditingBook(book)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.bookID)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}

type BookFormProps = {
  book: Omit<Book, 'bookID'>
  onChange: (field: keyof Omit<Book, 'bookID'>, value: string | number) => void
}

function BookForm({ book, onChange }: BookFormProps) {
  return (
    <div className="row g-2">
      {(['title', 'author', 'publisher', 'isbn', 'classification', 'category'] as const).map((field) => (
        <div className="col-md-4" key={field}>
          <label className="form-label text-capitalize">{field}</label>
          <input
            className="form-control"
            value={book[field] as string}
            onChange={(e) => onChange(field, e.target.value)}
          />
        </div>
      ))}
      <div className="col-md-2">
        <label className="form-label">Page Count</label>
        <input
          className="form-control"
          type="number"
          value={book.pageCount}
          onChange={(e) => onChange('pageCount', Number(e.target.value))}
        />
      </div>
      <div className="col-md-2">
        <label className="form-label">Price</label>
        <input
          className="form-control"
          type="number"
          step="0.01"
          value={book.price}
          onChange={(e) => onChange('price', Number(e.target.value))}
        />
      </div>
    </div>
  )
}

export default AdminBooks
