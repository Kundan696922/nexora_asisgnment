import { useState } from "react";
import CartItem from "../components/CartItem";

export default function CartPage({
  cart,
  onClose,
  onRemoveItem,
  onUpdateQty,
  onCheckout,
}) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [receipt, setReceipt] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !formData.email.includes("@"))
      newErrors.email = "Invalid email format";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const orderData = await onCheckout(formData);
      setReceipt(orderData);
      setFormData({ name: "", email: "" });
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  if (receipt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6 animate-fadeIn shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h2 className="text-3xl font-bold text-gray-800">
              Order Confirmed!
            </h2>
            <p className="text-gray-600 mt-2">Thank you for your purchase</p>
          </div>

          <div className="space-y-4 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-lg border border-purple-100">
            <div className="flex justify-between">
              <span className="text-gray-700">
                <strong>Order ID:</strong>
              </span>
              <span className="text-purple-600 font-mono">{receipt.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">
                <strong>Name:</strong>
              </span>
              <span>{receipt.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">
                <strong>Email:</strong>
              </span>
              <span className="text-sm">{receipt.email}</span>
            </div>
            <div className="border-t border-purple-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  <strong>Total:</strong>
                </span>
                <span className="text-2xl text-purple-600 font-bold">
                  ${receipt.total.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">
                <strong>Items:</strong>
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {receipt.items.length} product(s)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">
                <strong>Date:</strong>
              </span>
              <span className="text-sm">
                {new Date(receipt.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setReceipt(null);
              onClose();
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-bold text-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl my-8 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex justify-between items-center sticky top-0">
          <div>
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <p className="text-purple-100 text-sm mt-1">
              {cart.items.length} item(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl hover:text-purple-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onRemove={onRemoveItem}
                    onUpdateQty={onUpdateQty}
                  />
                ))}
              </div>

              {/* Summary */}
              <div className="border-t-2 border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2 text-gray-700">
                  <span>Subtotal:</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2 text-gray-700">
                  <span>Shipping:</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg">
                  <span>Total:</span>
                  <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                    ${cart.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.name
                        ? "border-red-500 focus:ring-red-600"
                        : "border-gray-300 focus:ring-purple-600"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.email
                        ? "border-red-500 focus:ring-red-600"
                        : "border-gray-300 focus:ring-purple-600"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span> {errors.email}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>{" "}
                      Processing...
                    </>
                  ) : (
                    <>💳 Complete Purchase</>
                  )}
                </button>
              </form>

              <p className="text-center text-gray-500 text-xs mt-4">
                🔒 Your information is secure. No real payment processing.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
