import BlurFade from "@/components/magicui/blur-fade";
import { getBooks } from "@/data/blog";
import BookCard from "./book-card";

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
        <h1 className="font-medium text-3xl mb-8 tracking-tighter">My Bookshelf</h1>
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
            <BookCard key={book.slug} book={book} index={id} />
          ))}
      </div>
    </section>
  );
}
