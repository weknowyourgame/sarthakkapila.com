import { getBook, getBooks } from "@/data/blog";
import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata | undefined> {
  let book = await getBook(params.slug);

  let {
    title,
    author,
    publishedAt,
    summary: description,
    image,
  } = book.metadata;
  
  let ogImage = image ? `${DATA.url}${image}` : `${DATA.url}/og?title=${title}`;

  return {
    title: `${title} by ${author}`,
    description,
    openGraph: {
      title: `${title} by ${author}`,
      description,
      type: "article",
      publishedTime: publishedAt,
      url: `${DATA.url}/books/${book.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} by ${author}`,
      description,
      images: [ogImage],
    },
  };
}

function RatingStars({ rating }: { rating: number }) {
  // Normalize the rating to a 5-star scale for display purposes
  const normalizedRating = Math.min(rating, 5);
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative w-4 h-4">
          <StarIcon className="absolute w-4 h-4 text-yellow-400" />
          <div className="absolute w-2 h-4 overflow-hidden">
            <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-yellow-400" />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

export default async function BookPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  let book = await getBook(params.slug);

  if (!book) {
    notFound();
  }

  return (
    <section id="book" className="pt-6">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            name: book.metadata.title,
            author: {
              "@type": "Person",
              name: book.metadata.author,
            },
            datePublished: book.metadata.publishedAt,
            description: book.metadata.summary,
            image: book.metadata.image
              ? `${DATA.url}${book.metadata.image}`
              : `${DATA.url}/og?title=${book.metadata.title}`,
            url: `${DATA.url}/books/${book.slug}`,
            publisher: {
              "@type": "Person",
              name: DATA.name,
            },
          }),
        }}
      />
      
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-lg">
            <Image 
              src={book.metadata.image}
              alt={`Cover of ${book.metadata.title}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {book.metadata.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            by {book.metadata.author}
          </p>
          
          <RatingStars rating={book.metadata.rating} />
          
          <div className="flex flex-wrap gap-2 my-4">
            {book.metadata.genre?.map((genre: string) => (
              <span key={genre} className="px-3 py-1 text-sm bg-muted rounded-full">
                {genre}
              </span>
            ))}
          </div>
          
          <Suspense fallback={<p className="h-5" />}>
            <p className="text-sm text-muted-foreground mb-6">
              Published: {formatDate(book.metadata.publishedAt)}
            </p>
          </Suspense>
          
          <div className="prose dark:prose-invert mb-4">
            <p className="text-lg">{book.metadata.summary}</p>
          </div>
        </div>
      </div>
      
      <article
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: book.source }}
      ></article>
    </section>
  );
}
