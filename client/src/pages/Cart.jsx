import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await API.get("/cart");
      setCartItems(res.data);
    } catch (err) {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await API.put("/cart/update", { productId, quantity });
      setCartItems(res.data);
    } catch (err) {
      setError("Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await API.delete(`/cart/remove/${productId}`);
      setCartItems(res.data);
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) return <p className="p-8 text-center">Loading cart...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">
          Your cart is empty. <Link to="/products" className="text-blue-600">Browse products</Link>
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex items-center justify-between border rounded p-4">
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-gray-500 text-sm">₹{item.product.price.toLocaleString()} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
                    className="border p-1 rounded w-16 text-center"
                  />
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <span className="text-xl font-bold">Total: ₹{total.toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;