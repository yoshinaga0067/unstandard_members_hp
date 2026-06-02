import Carousel from "./Carousel";
import { PRODUCTS } from "@/lib/products";

export default function LineupSection() {
  return (
    <Carousel en="LINE UP" ja="商品ラインナップ" total={PRODUCTS.length}>
      {PRODUCTS.map((p, i) => (
        <a
          key={i}
          href={p.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group block w-80 shrink-0 snap-start sm:w-96"
        >
          <div className="relative">
            {/* 内観（メイン写真） */}
            <div className="aspect-[16/10] overflow-hidden rounded-xl bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image || p.houseImage}
                alt={`${p.title} 内観`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            {/* 外観（透過レンダーを右下にはみ出して重ねる） */}
            {p.houseImage && p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.houseImage}
                alt={`${p.title} 外観`}
                loading="lazy"
                className="pointer-events-none absolute -bottom-5 right-0 w-1/2 object-contain drop-shadow-md"
              />
            )}
          </div>
          <h3 className="mt-7 text-base font-extrabold leading-snug">{p.title}</h3>
          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-black/60">
            {p.desc}
          </p>
        </a>
      ))}
    </Carousel>
  );
}
