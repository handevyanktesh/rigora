import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["CPU", "GPU", "RAM", "Motherboard", "PSU", "Storage", "Case", "Cooler"];

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Local input value for search (separate from URL, so typing feels instant)
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  // Debounce: only update the URL's `search` param 500ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchInput) {
        params.set("search", searchInput);
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // reset to page 1 on a new search
      setSearchParams(params);
    }, 500);

    return () => clearTimeout(timer); // cancel the previous timer if user keeps typing
  }, [searchInput]);

  // Fetch products whenever the URL's query params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products?${searchParams.toString()}`);
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const handleCategoryChange = (e) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("category", e.target.value);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    setSearchParams(params);
  };

  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Browse Products</h1>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />
        <select
          value={searchParams.get("category") || ""}
          onChange={handleCategoryChange}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-center text-gray-500 mt-8">No products found.</p>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;