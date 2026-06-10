import { About } from "@/components/sections/About";
import { CoursesPreview } from "@/components/sections/CoursesPreview";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { ProjectsPreview } from "@/components/sections/ProjectsPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <ProjectsPreview />
      <CoursesPreview />
    </>
  );
}
