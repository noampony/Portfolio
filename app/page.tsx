import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import dynamic from "next/dynamic";

// The hero and experience are needed immediately. The remaining interactive sections
// are below the fold, so each gets its own client chunk without changing SSR output.
const MyImpact = dynamic(() =>
  import("@/components/sections/MyImpact").then((module) => module.MyImpact),
);
const ProjectsPreview = dynamic(() =>
  import("@/components/sections/ProjectsPreview").then((module) => module.ProjectsPreview),
);
const CoursesRoadmap = dynamic(() =>
  import("@/components/sections/CoursesRoadmap").then((module) => module.CoursesRoadmap),
);
const Skills = dynamic(() =>
  import("@/components/sections/Skills").then((module) => module.Skills),
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((module) => module.Contact),
);

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <MyImpact />
      <ProjectsPreview />
      <CoursesRoadmap />
      <Skills />
      <Contact />
    </>
  );
}
