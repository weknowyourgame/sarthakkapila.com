import { DATA } from "./resume";

type CourseData = {
  title: string;
  provider: string;
  providerLogo: string;
  coverImage: string;
  href: string;
  description: string;
  dates: string;
  tags: readonly string[];
  status: string;
  slug?: string;
  content?: string;
};

/**
 * Gets all courses from the resume data
 */
export async function getCourses(): Promise<CourseData[]> {
  // Take courses from the DATA object and add slugs
  return DATA.courses.map((course) => ({
    ...course,
    slug: generateSlug(course.title),
  }));
}

/**
 * Gets a course by slug
 */
export async function getCourse(slug: string): Promise<CourseData | null> {
  const courses = await getCourses();
  return courses.find((course) => course.slug === slug) || null;
}

/**
 * Generates a slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
} 