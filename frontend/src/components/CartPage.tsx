import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext'

type LocationState = {
  returnPage?: number
  returnCategory?: string
}

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LocationState) ?? {}

  function handleContinueShopping() {
    // Navigate back to book list, restoring the page and category the user was on
    navigate('/', {
      state: {
        restorePage: state.returnPage ?? 1,
        restoreCategory: state.returnCategory ?? '',
      },
    })
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <h2 className="mb-4">Your Cart</h2>

        {cartItems.length === 0 ? (
          <div className="alert alert-info">
            Your cart is empty.{' '}
            <button className="btn btn-link p-0" onClick={handleContinueShopping}>
              Browse books
            </button>
          </div>
        ) : (
          <>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.bookID}>
                    <td>{item.title}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ width: '70px' }}
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.bookID, Number(e.target.value))
                        }
                      />
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromCart(item.bookID)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end fw-bold">
                    Total:
                  </td>
                  <td colSpan={2} className="fw-bold">
                    ${cartTotal.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <button className="btn btn-primary" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage
