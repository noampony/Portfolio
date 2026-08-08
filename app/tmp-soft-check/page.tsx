import { Skills } from "@/components/sections/Skills";

export default function TmpSoftCheck() {
  return (
    <>
      {/* Kill the scroll-reveal animations (rAF is paused in a background tab)
          and collapse all but the last technical card row, so the Interpersonal
          band sits near the top of the viewport for a screenshot. */}
      <style>{`
        #skills, #skills * { opacity: 1 !important; transform: none !important; }
        #skills .items-start > div > div.group:not(:last-child) { display: none; }
      `}</style>
      <Skills />
    </>
  );
}
