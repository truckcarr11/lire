import { useEffect, useState } from "react";
import { SHOW_INDICATOR_THRESHOLD, TRIGGER_THRESHOLD } from "./constants";

export function useIsVisible(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}

export function usePullToRefresh(ref, onTrigger) {
  const MAX = 128;
  const k = 0.4;
  function appr(x) {
    return MAX * (1 - Math.exp((-k * x) / MAX));
  }

  function addPullIndicator(el) {
    const indicator = el.querySelector(".refresh-arrow");
    if (indicator.classList.contains("flip")) {
      indicator.classList.remove("flip");
    }
    indicator.classList.remove("invisible");
    indicator.classList.add("visible");
  }

  function removePullIndicator(el) {
    const pullIndicator = el.querySelector(".refresh-arrow");
    pullIndicator.classList.add("invisible");
    pullIndicator.classList.remove("visible");
  }

  function flipArrow(el) {
    const pullIndicator = el.querySelector(".refresh-arrow");
    if (pullIndicator && !pullIndicator.classList.contains("flip")) {
      pullIndicator.classList.add("flip");
    }
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // attach the event listener
    el.addEventListener("touchstart", handleTouchStart);

    function handleTouchStart(startEvent) {
      const el = ref.current;
      if (!el) return;

      // get the initial Y position
      const initialY = startEvent.touches[0].clientY;

      el.addEventListener("touchmove", handleTouchMove);
      el.addEventListener("touchend", handleTouchEnd);

      function handleTouchMove(moveEvent) {
        const el = ref.current;
        if (!el) return;

        // get the current Y position
        const currentY = moveEvent.touches[0].clientY;

        // get the difference
        const dy = currentY - initialY;

        const parentEl = el.parentNode;
        if (dy > TRIGGER_THRESHOLD) {
          flipArrow(parentEl);
        } else if (dy > SHOW_INDICATOR_THRESHOLD) {
          addPullIndicator(parentEl);
        } else {
          removePullIndicator(parentEl);
        }

        if (dy < 0) return;

        // now we are using the `appr` function
        el.style.transform = `translateY(${appr(dy)}px)`;
      }

      function handleTouchEnd(endEvent) {
        const el = ref.current;
        if (!el) return;

        // return the element to its initial position
        el.style.transform = "translateY(0)";
        removePullIndicator(el.parentNode);

        // add transition
        el.style.transition = "transform 0.2s";

        // run the callback
        const y = endEvent.changedTouches[0].clientY;
        const dy = y - initialY;
        if (dy > TRIGGER_THRESHOLD) {
          onTrigger();
        }

        // listen for transition end event
        el.addEventListener("transitionend", onTransitionEnd);

        // cleanup
        el.removeEventListener("touchmove", handleTouchMove);
        el.removeEventListener("touchend", handleTouchEnd);
      }

      function onTransitionEnd() {
        const el = ref.current;
        if (!el) return;

        // remove transition
        el.style.transition = "";

        // cleanup
        el.removeEventListener("transitionend", onTransitionEnd);
      }
    }

    return () => {
      // let's not forget to cleanup
      el.removeEventListener("touchstart", handleTouchStart);
    };
  }, [ref.current]);
}
