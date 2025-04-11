import BlurFade from "@/components/magicui/blur-fade";
import { getBooks } from "@/data/blog";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Books",
  description: "A collection of books I've read, loved, and recommend.",
};

const BLUR_FADE_DELAY = 0.04;

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <section className="pt-6">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-extrabold text-3xl mb-8 tracking-tighter">My Bookshelf</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          These are books that have influenced my thinking, sparked my curiosity, 
          or simply provided an enjoyable escape. I hope you find something new to read!
        </p>
      </BlurFade>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {books
          .sort((a, b) => {
            if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
              return -1;
            }
            return 1;
          })
          .map((book, id) => (
            <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={book.slug}>
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
            </BlurFade>
          ))}
      </div>
    </section>
  );
}
