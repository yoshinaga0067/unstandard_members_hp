import Carousel from "./Carousel";
import ProductCard from "./ProductCard";
import { PRODUCTS } from "@/lib/products";

export default function LineupSection({ slug }: { slug: string }) {
  return (
    <Carousel
      en="LINE UP"
      ja="商品ラインナップ"
      total={PRODUCTS.length}
      panel
      autoScroll="step"
      id="lineup"
      moreHref={`/stores/${slug}/products`}
    >
      {PRODUCTS.map((p, i) => (
        <div
          key={i}
          className="w-80 shrink-0 sm:w-96 md:w-[28rem]"
        >
          <ProductCard product={p} />
        </div>
      ))}
    </Carousel>
  );
}
