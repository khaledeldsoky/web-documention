import { getCourse, getAllCourseSlugs } from "@/content";
import { notFound } from "next/navigation";
import CoursePageClient from "./CoursePageClient";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  const slugs = getAllCourseSlugs();
  return slugs.flatMap((slug) => [
    { slug, locale: "en" },
    { slug, locale: "ar" },
  ]);
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);

  if (!course) {
    notFound();
  }

  return (
    <CoursePageClient
      course={slug}
      title={course.title}
      eyebrow={course.eyebrow}
      footer={course.footer}
      sidebarGroups={course.sidebarGroups}
    >
      <course.Content />
    </CoursePageClient>
  );
}
