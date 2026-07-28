import { useEffect, useRef } from "react";

// running in the background
function useWobble(ref: React.RefObject<HTMLElement | null>, animClass: string) {
  useEffect(() => {
    const id = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      el.classList.remove(animClass);
      el.classList.remove("anim-wobble");
      void el.offsetWidth; // force reflow
      el.classList.add("anim-wobble");
    }, 6000);

    return () => clearInterval(id);
  }, [ref, animClass]);
}

export default function BgDecor() {
  const bananaRef = useRef<HTMLImageElement>(null);
  const leafR1Ref = useRef<HTMLImageElement>(null);
  const leafR2Ref = useRef<HTMLImageElement>(null);
  const leafL1Ref = useRef<HTMLImageElement>(null);
  const leafL2Ref = useRef<HTMLImageElement>(null);

  useWobble(bananaRef, "anim-rotate");
  useWobble(leafR1Ref, "anim-rotate-r");
  useWobble(leafR2Ref, "anim-rotate-r");
  useWobble(leafL1Ref, "anim-rotate");
  useWobble(leafL2Ref, "anim-rotate");

  return (
    <>
      <div
        className="bttm_bar"
        style={{ position: "absolute", width: 1440, height: 80, background: "#1d1d1b", top: 820 }}
      />
      <div
        className="top_bar"
        style={{
          position: "absolute",
          width: 1340,
          height: 44,
          background: "#1d1d1b",
          borderRadius: 30,
          top: 20,
          left: 25,
        }}
      >

        <img src="assets_home/credit.svg" style={{ position: "absolute", height: 32, left: 20, top: 6 }} />
        <a href="https://edwardywang.wixsite.com/portfolio" target="_blank" rel="noopener noreferrer">
          <img src="assets_home/cre1.svg" style={{ position: "absolute", height: 30, left: 90, top: 7, zIndex: 10 }} />
        </a>
        <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">
          <img src="assets_home/cre2.svg" style={{ position: "absolute", height: 30, left: 130, top: 7, zIndex: 10 }} />
        </a>
        <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">
          <img src="assets_home/cre3.svg" style={{ position: "absolute", height: 30, left: 170, top: 7, zIndex: 10 }} />
        </a>
        <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">
          <img src="assets_home/cre4.svg" style={{ position: "absolute", height: 30, left: 210, top: 7, zIndex: 10 }} />
        </a>
        <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">
          <img src="assets_home/cre5.svg" style={{ position: "absolute", height: 30, left: 250, top: 7, zIndex: 10 }} />
        </a>
      </div>

      <img ref={bananaRef} src="assets_home/banana.svg" className="banana anim-rotate" style={{ animationDelay: "0.18s", zIndex: 10 }} />
      <img ref={leafL1Ref} src="assets_home/leaf_l1.svg" className="leaf_l1 anim-rotate" style={{ animationDelay: "0.24s" }} />
      <img ref={leafL2Ref} src="assets_home/leaf_l2.svg" className="leaf_l2 anim-rotate" style={{ animationDelay: "0.54s" }} />
      <img ref={leafR1Ref} src="assets_home/leaf_r1.svg" className="leaf_r1 anim-rotate-r" style={{ animationDelay: "0.06s" }} />
      <img ref={leafR2Ref} src="assets_home/leaf_r2.svg" className="leaf_r2 anim-rotate-r" style={{ animationDelay: "0.42s" }} />
      <img src="assets_home/left.svg" className="bg_l anim-fadeinLeft" style={{ animationDelay: "0.80s" }} />
      <img src="assets_home/right.svg" className="bg_r anim-fadeinRight" style={{ animationDelay: "0.80s" }} />
    </>
  );
}
