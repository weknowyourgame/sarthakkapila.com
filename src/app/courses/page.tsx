import BlurFade from "@/components/magicui/blur-fade";
import { CourseCard } from "@/components/course-card";
import { getCourses } from "@/data/courses";
import MotionDiv from "@/components/motion-div";

export const metadata = {
  title: "Courses",
  description: "A collection of courses I'm taking or have completed.",
};

const BLUR_FADE_DELAY = 0.04;

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <section className="pt-6">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-3xl mb-8 tracking-tighter">My Learning Journey</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          These are courses that have helped me develop new skills, deepen my knowledge, 
          or explore new areas of technology. I'm constantly learning and adding to this list!
        </p>
      </BlurFade>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <MotionDiv
            key={course.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  delay: 0.1 + index * 0.1,
                  duration: 0.5,
                  ease: [0.48, 0.15, 0.25, 0.96],
                }
              }}
              whileHover={{ 
                y: -8,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }
              }}
            >
              <CourseCard
                title={course.title}
                provider={course.provider}
                providerLogo={course.providerLogo}
                coverImage={course.coverImage}
                href={course.href}
                description={course.description}
                status={course.status}
                slug={course.slug}
              />
            </MotionDiv>
          ))}
      </div>
    </section>
  );
} 