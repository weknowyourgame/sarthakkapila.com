import { getBook, getBooks } from "@/data/blog";
import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

export default async function BookPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  let book = await getBook(params.slug);
  const allBooks = await getBooks();
  
  // Find related books based on genres
  const relatedBooks = allBooks
    .filter(
      (b) => 
        b.slug !== book.slug && 
        b.metadata.genre?.some((genre: string) => 
          book.metadata.genre?.includes(genre)
        )
    )
    .slice(0, 3);

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
          
          <div className="flex items-center mb-3">
            <span className="text-yellow-400 font-bold">★</span>
            <span className="ml-2 text-sm">{book.metadata.rating.toFixed(1)} / 5</span>
          </div>
          
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
        className="prose dark:prose-invert max-w-none mb-16"
        dangerouslySetInnerHTML={{ __html: book.source }}
      ></article>
      
      {relatedBooks.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-medium mb-6">You might also enjoy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBooks.map((relatedBook) => (
              <Link 
                href={`/books/${relatedBook.slug}`}
                key={relatedBook.slug}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="relative h-20 w-16 flex-shrink-0">
                  <Image
                    src={relatedBook.metadata.image}
                    alt={relatedBook.metadata.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{relatedBook.metadata.title}</h3>
                  <p className="text-sm text-muted-foreground">by {relatedBook.metadata.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
