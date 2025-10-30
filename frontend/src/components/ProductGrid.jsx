export default function ProductGrid({ products, onAddToCart }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
          >
            <div className="text-6xl text-center py-8 bg-gradient-to-r from-purple-100 to-blue-100">
              {product.image}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">
                {product.description}
              </p>
              <p className="text-purple-600 font-bold text-lg mb-4">
                ${product.price}
              </p>
              <button
                onClick={() => onAddToCart(product._id, 1)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
