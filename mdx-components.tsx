import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { Kbd, KbdGroup } from "./components/ui/kbd";

export function useMDXComponents(): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-medium mt-6 mb-3" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="text-lg font-medium mt-4 mb-2" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5 className="text-base font-medium mt-3 mb-1" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6 className="text-sm font-medium mt-2 mb-1" {...props}>
        {children}
      </h6>
    ),

    p: ({ children, ...props }) => (
      <p className="mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    ),

    ul: ({ children, ...props }) => (
      <ul className="mb-4 pl-6 list-disc space-y-1" {...props}>
        {children}
      </ul>
    ),

    ol: ({ children, ...props }) => (
      <ol className="mb-4 pl-6 list-decimal space-y-1" {...props}>
        {children}
      </ol>
    ),

    li: ({ children, ...props }) => (
      <li className="mb-1" {...props}>
        {children}
      </li>
    ),

    pre: ({ children, ...props }) => (
      <pre
        className="mb-4 rounded-lg bg-[oklch(0.141 0.005 285.823)] overflow-x-auto text-sm"
        {...props}
      >
        {children}
      </pre>
    ),

    code: ({ children, ...props }) => {
      const isInline =
        !props.className || !props.className.includes("language-");
      if (isInline) {
        return (
          <code
            className="p-4 rounded-lg bg-[oklch(0.141 0.005 285.823)] text-sm font-mono border border-accent"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <code className="text-sm" {...props}>
          {children}
        </code>
      );
    },

    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-primary/50 pl-4 py-2 my-4 italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Horizontal rule
    hr: ({ ...props }) => <hr className="my-8 border-white/10" {...props} />,

    // Images
    img: ({ src, alt, width, height, ...props }) => {
      // If we have width and height, use Next.js Image component
      if (width && height) {
        return (
          <div className="my-4 rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={alt}
              width={parseInt(width)}
              height={parseInt(height)}
              className="object-cover w-full h-auto"
              {...props}
            />
          </div>
        );
      }

      // Fallback to regular img tag if dimensions are not provided
      return (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="rounded-lg my-4"
          {...props}
        />
      );
    },

    // Bold text (used for list group titles)
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-lg mt-6 mb-3 block" {...props}>
        {children}
      </strong>
    ),

    // Links
    a: ({ children, ...props }) => (
      <a className="text-blue-500 hover:underline" {...props}>
        {children}
      </a>
    ),

    kbd: ({ children, ...props }) => (
      <Kbd className="text-muted-foreground" {...props}>
        {children}
      </Kbd>
    ),
  };
}
