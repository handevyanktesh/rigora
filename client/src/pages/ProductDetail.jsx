import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await API.post("/cart/add", { productId: id, quantity });
      setCartMessage("Added to cart!");
      setTimeout(() => setCartMessage(""), 2000);
    } catch (err) {
      setCartMessage("Failed to add to cart");
    }
  };

  if (loading) return <p className="p-8 text-center">Loading product...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;
  if (!product) return null;

  const specsObject = product.specs || {};

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 h-80 rounded flex items-center justify-center text-gray-400">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full object-contain" />
          ) : (
            "No Image"
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-500">{product.brand} • {product.category}</p>
          <p className="text-3xl font-bold text-blue-600 mt-4">
            ₹{product.price.toLocaleString()}
          </p>
          <p className={`mt-2 text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          {product.description && (
            <p className="text-gray-700 mt-4">{product.description}</p>
          )}

          {/* Specs table */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Specifications</h3>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(specsObject).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="py-1 text-gray-500 capitalize">{key}</td>
                    <td className="py-1 font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add to cart */}
          <div className="flex items-center gap-3 mt-6">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="border p-2 rounded w-20"
            />
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-40"
            >
              Add to Cart
            </button>
          </div>
          {cartMessage && <p className="text-green-600 mt-2">{cartMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;