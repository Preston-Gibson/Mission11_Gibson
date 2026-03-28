import './App.css'
import { Routes, Route } from 'react-router-dom'
import Heading from './components/Heading'
import BookTable from './components/BookTable'
import CartPage from './components/CartPage'

function App() {
  return (
    <>
      <Heading />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<BookTable />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
