import { Link } from 'react-router-dom'

function Heading() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>BORNEO</h1>
        <Link to="/adminbooks" className="btn btn-outline-secondary btn-sm">
          Admin
        </Link>
      </div>
      <p>
        Borneo is named after a rainforest. Taking inspiration from a similar company named after a rainforest, we've decided to enter the book market. Let us know if you think we did it better.
      </p>
    </>
  )
}
export default Heading
