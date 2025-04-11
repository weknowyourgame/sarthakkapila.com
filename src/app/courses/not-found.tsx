import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
      <p className="text-muted-foreground mb-6">
        Sorry, the course you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/courses"
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Return to Courses
      </Link>
    </div>
  );
} 