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

function createSpringConfig() {
  return {
    damping: 20 + 30 * Math.random(),
    stiffness: 10 + 15 * Math.random(),
    restDelta: 0.001,
  };
}


function useRandomWalker(fishRef, pondRef, xOffset, yOffset) {
  const xPoint = useMotionValue(0);
  const yPoint = useMotionValue(0);

  const [springConfig] = useState(() => createSpringConfig());
  const x = useSpring(xPoint, springConfig);
  const y = useSpring(yPoint, springConfig);

  const [isFlipped, setIsFlipped] = useState(false);
  const intervalRef = useRef(null);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }

  function moveToRandomPoint() {
    if (!fishRef.current || !pondRef.current) return;

    const fishEl = fishRef.current;
    const pondEl = pondRef.current;

    const pondRect = pondEl.getBoundingClientRect();
    const fishWidth = fishEl.offsetWidth;
    const fishHeight = fishEl.offsetHeight;

    const pondWidth = pondEl.offsetWidth;
    const pondHeight = pondEl.offsetHeight;

    const maxX = pondWidth - fishWidth;
    const maxY = pondHeight - fishHeight;

    const randX = Math.random() * (maxX > 0 ? maxX : 0);
    const randY = Math.random() * (maxY > 0 ? maxY : 0);

    const currentX = x.get();
    setIsFlipped(randX > currentX);

    xPoint.set(randX);
    yPoint.set(randY);
  }

  useEffect(() => {
    if (fishRef.current && pondRef.current) {
      xPoint.set(xOffset);
      yPoint.set(yOffset);
    }
  }, []);

  useEffect(() => {
    moveToRandomPoint(); 
    intervalRef.current = setInterval(moveToRandomPoint, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!fishRef.current || !pondRef.current) return;

    const fishEl = fishRef.current;
    const pondEl = pondRef.current;

    const pondWidth = pondEl.offsetWidth;
    const pondHeight = pondEl.offsetHeight;
    const fishWidth = fishEl.offsetWidth;
    const fishHeight = fishEl.offsetHeight;

    const maxX = pondWidth - fishWidth;
    const maxY = pondHeight - fishHeight;

    const unsubX = x.onChange((latestX) => {
      if (latestX < 0) {
        x.set(0);
        xPoint.set(0);
      } else if (latestX > maxX) {
        x.set(maxX);
        xPoint.set(maxX);
      }
    });

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
