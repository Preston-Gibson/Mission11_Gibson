import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../CartContext'

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

type BooksResponse = {
  books: Book[]
  totalBooks: number
}

function BookTable() {
  const [books, setBooks] = useState<Book[]>([])
  const [totalBooks, setTotalBooks] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sortOrder, setSortOrder] = useState('title')
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')

  const { addToCart, cartCount, cartTotal } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // Restore page and category when returning from the cart page
  useEffect(() => {
    const state = location.state as { restorePage?: number; restoreCategory?: string } | null
    if (state?.restorePage) setPageNum(state.restorePage)
    if (state?.restoreCategory !== undefined) setSelectedCategory(state.restoreCategory)
  }, [])

  // Fetch the category list once on mount
  useEffect(() => {
    fetch('http://localhost:5011/api/books/categories')
      .then((res) => res.json())
      .then((data: string[]) => setCategories(data))
  }, [])

  // Re-fetch books whenever page, size, sort, or category changes
  useEffect(() => {
    const categoryParam = selectedCategory
      ? `&category=${encodeURIComponent(selectedCategory)}`
      : ''
    fetch(
      `http://localhost:5011/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}${categoryParam}`
    )
      .then((res) => res.json())
      .then((data: BooksResponse) => {
        setBooks(data.books)
        setTotalBooks(data.totalBooks)
      })
  }, [pageNum, pageSize, sortOrder, selectedCategory])

  const totalPages = Math.ceil(totalBooks / pageSize)

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat)
    setPageNum(1) // Reset to page 1 when filter changes
  }

  function handleAddToCart(book: Book) {
    addToCart({ bookID: book.bookID, title: book.title, price: book.price })
    // Navigate to cart, passing current page/category so we can return here
    navigate('/cart', { state: { returnPage: pageNum, returnCategory: selectedCategory } })
  }

  return (
    <div className="row">
      {/* Sidebar: category filter */}
      <div className="col-md-3 col-lg-2 mb-3">
        <h6 className="fw-bold">Filter by Category</h6>
        <ul className="list-group">
          <li
            className={`list-group-item list-group-item-action ${selectedCategory === '' ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => handleCategoryChange('')}
          >
            All
          </li>
          {categories.map((cat) => (
            <li
              key={cat}
              className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="col-md-9 col-lg-10">
        {/* Cart summary banner */}
        {cartCount > 0 && (
          <div className="alert alert-success d-flex justify-content-between align-items-center mb-3">
            <span>
              <strong>Cart:</strong> {cartCount} item{cartCount !== 1 ? 's' : ''} &mdash; ${cartTotal.toFixed(2)}
            </span>
            <button
              className="btn btn-sm btn-success"
              onClick={() => navigate('/cart', { state: { returnPage: pageNum, returnCategory: selectedCategory } })}
            >
              View Cart
            </button>
          </div>
        )}

        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              {/* Clicking the Title header toggles between ascending and descending sort */}
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSortOrder(sortOrder === 'title' ? 'title_desc' : 'title')
                  setPageNum(1)
                }}
              >
                Title {sortOrder === 'title' ? '▲' : sortOrder === 'title_desc' ? '▼' : ''}
              </th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Pages</th>
              <th>Price</th>
              <th>Add to Cart</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddToCart(book)}
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-secondary"
            disabled={pageNum === 1}
            onClick={() => setPageNum(pageNum - 1)}
          >
            Previous
          </button>

          <span>
            Page {pageNum} of {totalPages}
          </span>

          <button
            className="btn btn-secondary"
            disabled={pageNum === totalPages}
            onClick={() => setPageNum(pageNum + 1)}
          >
            Next
          </button>

          {/* Reset to page 1 when page size changes so we don't land on a now-nonexistent page */}
          <label>
            Results per page:{' '}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPageNum(1)
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}

export default BookTable
