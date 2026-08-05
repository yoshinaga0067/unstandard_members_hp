"use client";

import ProductCard from "./ProductCard";
import { PRODUCTS } from "@/lib/products";
import { usePublicItems } from "@/lib/usePublicItems";

// Product grid that reflects the demo CMS data (published items) for this browser.
export default function ProductsListClient() {
  const products = usePublicItems("products", null, PRODUCTS);
  if (products.length === 0)
    return <p className="text-black/50">商品はまだありません。</p>;
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <ProductCard key={p._id ?? i} product={p} />
      ))}
    </div>
  );
}
