import type { ContentBlock } from "@/types";

/**
 * Renders a note-style article body from content blocks
 * (headings, paragraphs and inline images with captions).
 */
export default function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="mx-auto mt-10 max-w-2xl space-y-6">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2
              key={i}
              className="pt-2 text-xl font-extrabold leading-relaxed tracking-tight md:text-2xl"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "image") {
          if (!block.src) return null;
          return (
            <figure key={i} className="space-y-2">
              <div className="overflow-hidden rounded-2xl bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.src}
                  alt={block.caption ?? ""}
                  loading="lazy"
                  className="w-full object-cover"
                />
              </div>
              {block.caption && (
                <figcaption className="text-center text-xs text-black/50">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }
        return (
          <p
            key={i}
            className="whitespace-pre-line text-[15px] leading-[2] text-black/80 md:text-base"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
