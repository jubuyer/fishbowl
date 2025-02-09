"use client";

import { frame, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function Drag() {
  const ref = useRef(null);
  const { x, y, isFlipped } = useFollowPointer(ref);

  return (
    <motion.div
      ref={ref}
      style={{
        ...fishStyle,
        x,
        y,
        transform: isFlipped ? "scaleX(-1)" : "none",
      }}
    >
      <img
        src="/pink-fish.gif"
        alt="fish"
        className={"w-full h-full" + " " + (!isFlipped ? " -scale-x-100" : "")}
      />
    </motion.div>
  );
}

const spring = { damping: 30, stiffness: 10, restDelta: 1 };

export function useFollowPointer(ref) {
  const xPoint = useMotionValue(0);
  const yPoint = useMotionValue(0);
  const x = useSpring(xPoint, spring);
  const y = useSpring(yPoint, spring);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFollowingPath, setIsFollowingPath] = useState(true);

  useEffect(() => {
    if (!ref.current) return;

    const handlePointerMove = ({ clientX, clientY }) => {
      const element = ref.current;

      const rect = element.getBoundingClientRect();

      const isAboveMidpoint = clientY < window.innerHeight / 2;
      setIsFollowingPath(isAboveMidpoint);

      frame.read(() => {
        if (element) {
          if (isFollowingPath) {
            xPoint.set(clientX - rect.left - element.offsetWidth / 2);
            yPoint.set(clientY - rect.top - element.offsetHeight / 2);
          }
          setIsFlipped(clientX > window.innerWidth / 2);
        }
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [isFollowingPath]);

  return { x, y, isFlipped, isFollowingPath };
}

/**
 * ==============   Styles   ================
 */

const fishStyle = {
  width: 100,
  height: 100,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  position: "absolute",
};
