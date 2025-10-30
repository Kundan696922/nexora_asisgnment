import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Toaster, toast } from "react-hot-toast";
import ProductGrid from "./components/ProductGrid";
import CheckoutModal from "./components/CheckoutModal";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function App() {
  const [cartId] = useState(() => {
    let id = localStorage.getItem("cartId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("cartId", id);
    }
    return id;
  });

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load products. Please refresh.");
        toast.error("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/cart/${cartId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [cartId]);

  const addToCart = async (productId, qty = 1) => {
    try {
      const res = await axios.post(`${API_URL}/cart/${cartId}`, {
        productId,
        qty,
      });
      setCart(res.data);
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setError("Failed to add item to cart");
      toast.error("Failed to add item to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(`${API_URL}/cart/${cartId}/${productId}`);
      setCart(res.data);
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      setError("Failed to remove item");
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, qty) => {
    try {
      const res = await axios.put(`${API_URL}/cart/${cartId}/${productId}`, {
        qty,
      });
      setCart(res.data);
      toast.success("Quantity updated");
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setError("Failed to update quantity");
      toast.error("Failed to update quantity");
    }
  };

  const handleCheckout = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/checkout`, {
        cartItems: cart.items,
        cartId,
        ...formData,
      });
      setReceipt(res.data);
      setCart({ items: [], total: 0 });
      toast.success("Order placed successfully! 🎉");
    } catch (err) {
      console.error("Checkout failed:", err);
      setError("Checkout failed. Please try again.");
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#363636",
          },
        }}
      />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ✨ Vibe Commerce
          </h1>
          <button
            onClick={() => setShowCheckout(true)}
            className="relative px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            🛒 Cart ({cart.items.length})
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        ) : (
          <ProductGrid products={products} onAddToCart={addToCart} />
        )}
      </main>

      {/* Modals */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onCheckout={handleCheckout}
          onRemoveItem={removeFromCart}
          onUpdateQty={updateQuantity}
          receipt={receipt}
          onCloseReceipt={() => setReceipt(null)}
        />
      )}
    </div>
  );
}

export default App;
