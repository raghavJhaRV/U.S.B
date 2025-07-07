"use client";
import { useParams } from "next/navigation";
import { products } from "../products";
import { useCart } from "../../components/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();

  if (!product) {
    return <p className="text-white p-10">Product not found</p>;
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-80 object-cover mb-4"
        />
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="mt-2 text-lg">Price: ${product.price.toFixed(2)}</p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Sizes</h2>
          <div className="flex gap-4 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                className="border px-4 py-2 hover:bg-white hover:text-black transition"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-8 bg-white text-black px-6 py-3 font-bold hover:bg-gray-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
