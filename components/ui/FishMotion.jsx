"use client";

import { frame, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

const fishSources = [
  "/pink-fish.gif",
  "/purple-fish.gif",
  "/red-fish.gif",
  "/yellow-fish.gif",
  "/red2-fish.gif",
];

/**
 * FishMotion Component
 *
 * Props:
 *  - pondRef: a ref to the container (the "pond") the fish should stay within
 *  - fishChoice: index to pick a fish image
 *  - xOffset, yOffset: optional initial position
 */
export default function Drag({
  pondRef,
  fishChoice,
  xOffset = 0,
  yOffset = 0,
}) {
  const fishRef = useRef(null);

  const { x, y, isFlipped } = useRandomWalker(
    fishRef,
    pondRef,
    xOffset,
    yOffset
  );

  return (
    <motion.div
      ref={fishRef}
      style={{
        ...fishStyle,
        x,
        y,
      }}
    >
      <img
        src={fishSources[fishChoice]}
        alt="fish"
        className={" w-full h-full" + (!isFlipped ? " -scale-x-100" : "")}
      />
    </motion.div>
  );
}

// A slightly random spring config so each fish moves a bit differently.
function createSpringConfig() {
  return {
    damping: 20 + 30 * Math.random(),
    stiffness: 10 + 15 * Math.random(),
    restDelta: 0.001,
  };
}

/**
 * Hook that:
 *  - Positions fish at (xOffset, yOffset) within the pond
 *  - Moves them to random points every 4s
 *  - Prevents them from going out of pond bounds
 */
function useRandomWalker(fishRef, pondRef, xOffset, yOffset) {
  const xPoint = useMotionValue(0);
  const yPoint = useMotionValue(0);

  const [springConfig] = useState(() => createSpringConfig());
  const x = useSpring(xPoint, springConfig);
  const y = useSpring(yPoint, springConfig);

  const [isFlipped, setIsFlipped] = useState(false);
  const intervalRef = useRef(null);

  // Clamps a value between min and max
  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }

  // Move to a new random point inside the pond
  function moveToRandomPoint() {
    if (!fishRef.current || !pondRef.current) return;

    const fishEl = fishRef.current;
    const pondEl = pondRef.current;

    // Measure the pond and fish dimensions
    const pondRect = pondEl.getBoundingClientRect();
    const fishWidth = fishEl.offsetWidth;
    const fishHeight = fishEl.offsetHeight;

    // The fish is absolutely positioned relative to the pond,
    // so we only need pondEl's "inner" dimensions (offsetWidth/Height).
    // getBoundingClientRect gives screen coords, but offsetWidth is simpler:
    const pondWidth = pondEl.offsetWidth;
    const pondHeight = pondEl.offsetHeight;

    // Our max is pond dimension minus fish dimension
    const maxX = pondWidth - fishWidth;
    const maxY = pondHeight - fishHeight;

    // Pick a random spot within [0, maxX], [0, maxY]
    const randX = Math.random() * (maxX > 0 ? maxX : 0);
    const randY = Math.random() * (maxY > 0 ? maxY : 0);

    // Flip if newX > currentX
    const currentX = x.get();
    setIsFlipped(randX > currentX);

    xPoint.set(randX);
    yPoint.set(randY);
  }

  // Set initial position
  useEffect(() => {
    if (fishRef.current && pondRef.current) {
      xPoint.set(xOffset);
      yPoint.set(yOffset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On mount: move once, then set interval
  useEffect(() => {
    moveToRandomPoint(); // move once immediately
    intervalRef.current = setInterval(moveToRandomPoint, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Clamping on each frame to keep fish inside the pond
  useEffect(() => {
    if (!fishRef.current || !pondRef.current) return;

    const fishEl = fishRef.current;
    const pondEl = pondRef.current;

    // For dynamic resizing, measure each frame if needed
    const pondWidth = pondEl.offsetWidth;
    const pondHeight = pondEl.offsetHeight;
    const fishWidth = fishEl.offsetWidth;
    const fishHeight = fishEl.offsetHeight;

    const maxX = pondWidth - fishWidth;
    const maxY = pondHeight - fishHeight;

    // X boundary
    const unsubX = x.onChange((latestX) => {
      if (latestX < 0) {
        x.set(0);
        xPoint.set(0);
      } else if (latestX > maxX) {
        x.set(maxX);
        xPoint.set(maxX);
      }
    });

    // Y boundary
    const unsubY = y.onChange((latestY) => {
      if (latestY < 0) {
        y.set(0);
        yPoint.set(0);
      } else if (latestY > maxY) {
        y.set(maxY);
        yPoint.set(maxY);
      }
    });

    return () => {
      unsubX();
      unsubY();
    };
  }, [x, y, xPoint, yPoint, fishRef, pondRef]);

  return { x, y, isFlipped };
}

const fishStyle = {
  width: 100,
  height: 100,
  position: "absolute",
};
