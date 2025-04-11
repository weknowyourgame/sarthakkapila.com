"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Animation variants for the book cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.1,
      duration: 0.5,
      ease: [0.48, 0.15, 0.25, 0.96],
    },
  }),
  hover: {
    y: -8,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  },
};

interface BookCardProps {
  book: {
    slug: string;
    metadata: {
      title: string;
      author: string;
      image: string;
      rating: number;
      summary: string;
      genre?: string[];
      [key: string]: any;
    };
    source: string;
  };
  index: number;
}

export default function BookCard({ book, index }: BookCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      custom={index}
      layoutId={book.slug}
    >
      <Link
        className="flex flex-col h-full rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
        href={`/books/${book.slug}`}
      >
        <div className="relative h-64 w-full">
          <Image
            src={book.metadata.image}
            alt={`Cover of ${book.metadata.title}`}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 z-10 bg-background/70 backdrop-blur-sm text-foreground rounded-full px-2 py-1 text-xs font-medium">
            {book.metadata.rating} ★
          </div>
        </div>
        <div className="flex flex-col p-4 flex-grow">
          <h2 className="text-xl font-medium tracking-tight mb-1">{book.metadata.title}</h2>
          <p className="text-sm text-muted-foreground mb-2">by {book.metadata.author}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {book.metadata.genre?.map((g: string) => (
              <span key={g} className="px-2 py-1 text-xs bg-muted rounded-full">
                {g}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{book.metadata.summary}</p>
        </div>
      </Link>
    </motion.div>
  );
} 