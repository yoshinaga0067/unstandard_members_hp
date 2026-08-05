"use client";

import Carousel from "./Carousel";
import ProductCard from "./ProductCard";
import { PRODUCTS } from "@/lib/products";
import { usePublicItems } from "@/lib/usePublicItems";

export default function LineupSection({ slug }: { slug: string }) {
  const products = usePublicItems("products", null, PRODUCTS);
  if (products.length === 0) return null;

  return (
    <Carousel
      en="LINE UP"
      ja="商品ラインナップ"
      total={products.length}
      panel
      autoScroll="step"
      id="lineup"
      moreHref={`/stores/${slug}/products`}
      moreLabel="商品一覧を見る"
    >
      {products.map((p, i) => (
        <div key={p._id ?? i} className="w-80 shrink-0 sm:w-96 md:w-[28rem]">
          <ProductCard product={p} />
        </div>
      ))}
    </Carousel>
  );
}
