import { Badge } from "@/components/ui/badge";
import { getCourse, getCourses } from "@/data/courses";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Markdown from "react-markdown";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse(params.slug);

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: course.title,
    description: course.description.substring(0, 160),
  };
}

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourse(params.slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="container max-w-3xl py-10">
      <Link
        href="/courses"
        className="group flex items-center text-sm hover:text-foreground mb-8"
      >
        <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Courses
      </Link>

      <div className="relative aspect-video overflow-hidden rounded-lg border mb-10">
        <Image
          src={course.coverImage}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-4 right-4">
          <Badge variant={course.status === "Completed" ? "default" : "secondary"}>
            {course.status}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="size-6 border bg-white">
              <AvatarImage
                src={course.providerLogo}
                alt={course.provider}
                className="object-contain p-0.5"
              />
              <AvatarFallback>{course.provider[0]}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">{course.provider} • {course.dates}</p>
          </div>
        </div>
        <Link
          href={course.href}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          target="_blank"
        >
          View Course
        </Link>
      </div>
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <Markdown>{course.description}</Markdown>
      </div>
    </div>
  );
} 