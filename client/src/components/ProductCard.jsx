import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="border rounded-lg p-4 hover:shadow-md transition-shadow block"
    >
      <div className="bg-gray-100 h-40 rounded mb-3 flex items-center justify-center text-gray-400">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full object-contain" />
        ) : (
          "No Image"
        )}
      </div>
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-500 text-sm">{product.brand} • {product.category}</p>
      <p className="text-blue-600 font-bold mt-2">₹{product.price.toLocaleString()}</p>
    </Link>
  );
};

export default ProductCard;