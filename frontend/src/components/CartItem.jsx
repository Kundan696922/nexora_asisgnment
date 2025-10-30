export default function CartItem({ item, onRemove, onUpdateQty }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-4xl">{item.image}</div>
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-600">${item.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
          className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          −
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
          className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          +
        </button>
      </div>
      <div className="text-right min-w-24">
        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <button
        onClick={() => onRemove(item.productId)}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Remove
      </button>
    </div>
  );
}
