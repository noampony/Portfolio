import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { CoursesRoadmap } from "@/components/sections/CoursesRoadmap";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { ProjectsPreview } from "@/components/sections/ProjectsPreview";
import { Skills } from "@/components/sections/Skills";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <ProjectsPreview />
      <CoursesRoadmap />
      <Skills />
      <Contact />
    </>
  );
}
