import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import { useReducedMotion } from "./use-reduced-motion";

export function usePageIntro(): RefObject<HTMLDivElement | null> {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect((): void => {
    const element = elementRef.current;
    if (element === null) {
      return;
    }
    if (reducedMotion) {
      gsap.set(element, { clearProps: "opacity,transform" });
      return;
    }

    gsap.fromTo(
      element,
      { opacity: 0, y: 20 },
      { duration: 0.55, ease: "power3.out", opacity: 1, y: 0 },
    );
  }, [reducedMotion]);

  return elementRef;
}
