import { useState } from "react";
import CartItem from "./CartItem";

export default function CheckoutModal({
  cart,
  onClose,
  onCheckout,
  onRemoveItem,
  onUpdateQty,
  receipt,
  onCloseReceipt,
}) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !formData.email.includes("@"))
      newErrors.email = "Invalid email";
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
      await onCheckout(formData);
      setFormData({ name: "", email: "" });
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    if (onCloseReceipt) onCloseReceipt();
    if (onClose) onClose();
    window.location.href = "/";
  };

  if (receipt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6 animate-fadeIn">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold">Order Confirmed!</h2>
          </div>
          <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded">
            <p>
              <strong>Order ID:</strong> {receipt.id}
            </p>
            <p>
              <strong>Name:</strong> {receipt.name}
            </p>
            <p>
              <strong>Email:</strong> {receipt.email}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              <span className="text-purple-600 font-bold">
                ${receipt.total.toFixed(2)}
              </span>
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(receipt.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Items:</strong> {receipt.items.length} product(s)
            </p>
          </div>
          <button
            onClick={goHome}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  //When cart is empty
  if (cart.items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty 🛒</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven’t added anything yet.
          </p>
          <button
            onClick={goHome}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  //Regular checkout form (cart not empty)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {cart.items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onRemove={onRemoveItem}
              onUpdateQty={onUpdateQty}
            />
          ))}
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span className="text-purple-600">${cart.total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-600"
                  : "focus:ring-purple-600"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-600"
                  : "focus:ring-purple-600"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-bold disabled:opacity-50"
          >
            {loading ? "Processing..." : "Complete Purchase"}
          </button>
        </form>
      </div>
    </div>
  );
}
