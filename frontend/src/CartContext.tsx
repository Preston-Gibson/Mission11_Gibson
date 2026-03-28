import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export type CartItem = {
  bookID: number
  title: string
  price: number
  quantity: number
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (book: { bookID: number; title: string; price: number }) => void
  updateQuantity: (bookID: number, quantity: number) => void
  removeFromCart: (bookID: number) => void
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | null>(null)

const SESSION_KEY = 'bookstore_cart'

function loadCartFromSession(): CartItem[] {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromSession)

  // Persist cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  function addToCart(book: { bookID: number; title: string; price: number }) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.bookID === book.bookID)
      if (existing) {
        return prev.map((item) =>
          item.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...book, quantity: 1 }]
    })
  }

  function updateQuantity(bookID: number, quantity: number) {
    if (quantity < 1) {
      removeFromCart(bookID)
      return
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.bookID === bookID ? { ...item, quantity } : item
      )
    )
  }

  function removeFromCart(bookID: number) {
    setCartItems((prev) => prev.filter((item) => item.bookID !== bookID))
  }

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
