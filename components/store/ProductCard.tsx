import type { Product } from "@/types";

// LINE UP card: interior photo with the exterior render breaking out bottom-right.
export default function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block transition duration-200 hover:-translate-y-1"
    >
      <div className="relative">
        <div className="aspect-[16/10] overflow-hidden rounded-lg border border-black bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image || product.houseImage}
            alt={`${product.title} 内観`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        {product.houseImage && product.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.houseImage}
            alt={`${product.title} 外観`}
            loading="lazy"
            className="pointer-events-none absolute bottom-0 right-0 z-10 w-[48%] translate-y-[60%] object-contain object-bottom"
          />
        )}
      </div>
      <div className="mt-4 w-[54%]">
        <h3 className="text-base font-extrabold leading-snug transition-colors group-hover:text-black/55">
          {product.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-black/60">
          {product.desc}
        </p>
      </div>
    </a>
  );
}
