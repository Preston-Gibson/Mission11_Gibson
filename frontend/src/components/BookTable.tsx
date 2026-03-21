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

  useEffect(() => {
    fetch(
      `http://localhost:5011/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}`
    )
      .then((res) => res.json())
      .then((data: BooksResponse) => {
        setBooks(data.books)
        setTotalBooks(data.totalBooks)
      })
  }, [pageNum, pageSize, sortOrder])

  const totalPages = Math.ceil(totalBooks / pageSize)

  return (
    <>
      <table className="table table-hover table-bordered">
        <thead>
          <tr>
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
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
    </>
  )
}

export default BookTable
