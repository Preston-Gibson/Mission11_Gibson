function BookTableHead() {
  return (
    <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th>Publisher</th>
        <th>ISBN</th>
        <th>Category</th>
        <th>Pages</th>
        <th>Price</th>
      </tr>
    </thead>
  )
}

function BookTableBody() {
  return (
    <tbody>
      <tr>
        <td>Something</td>
        <td>Something</td>
        <td>Something</td>
        <td>Something</td>
        <td>Something</td>
        <td>Something</td>
        <td>Something</td>
      </tr>
    </tbody>
  )
}

function BookTable() {

  return (
    <table className="table table-hover table-bordered">
      <BookTableHead />
      <BookTableBody />
    </table>
  )
}
export default BookTable