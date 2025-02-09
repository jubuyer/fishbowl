"use client";

import { frame, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function Drag({ fishNum }) {
  const ref = useRef(null);
  const { x, y, isFlipped } = useFollowPointer({ ref, fishNum });
  switch (fishNum) {
    case 0:
      return (
        <motion.div
          ref={ref}
          style={{
            ...fishStyleZero,
            x,
            y,
            transform: isFlipped ? "scaleX(-1)" : "none",
          }}
        >
          <img
            src="/pink-fish.gif"
            alt="Second red fish"
            className={
              "w-full h-full" + " " + (!isFlipped ? " -scale-x-100" : "")
            }
          />
        </motion.div>
      );
    case 1:
      return (
        <motion.div
          ref={ref}
          style={{
            ...fishStyleOne,
            x,
            y,
            transform: isFlipped ? "scaleX(-1)" : "none",
          }}
        >
          <img
            src="/purple-fish.gif"
            alt="Second red fish"
            className={
              "w-full h-full" + " " + (!isFlipped ? " -scale-x-100" : "")
            }
          />
        </motion.div>
      );
    case 2:
      return (
        <motion.div
          ref={ref}
          style={{
            ...fishStyleTwo,
            x,
            y,
            transform: isFlipped ? "scaleX(-1)" : "none",
          }}
        >
          <img
            src="/red-fish.gif"
            alt="Second red fish"
            className={
              "w-full h-full" + " " + (!isFlipped ? " -scale-x-100" : "")
            }
          />
        </motion.div>
      );
    case 3:
      return (
        <motion.div
          ref={ref}
          style={{
            ...fishStyleThree,
            x,
            y,
            transform: isFlipped ? "scaleX(-1)" : "none",
          }}
        >
          <img
            src="/red2-fish.gif"
            alt="Second red fish"
            className={
              "w-full h-full" + " " + (!isFlipped ? " -scale-x-100" : "")
            }
          />
        </motion.div>
      );
    case 4:
      return (
        <motion.div
          ref={ref}
          style={{
            ...fishStyleFour,
            x,
            y,
            transform: isFlipped ? "scaleX(-1)" : "none",
          }}
        >
          <img
            src="/yellow-fish.gif"
            alt="Yellow fish"
            className={
              "w-full h-full" + " " + (!isFlipped ? " -scale-x-100" : "")
            }
          />
        </motion.div>
      );
  }
}
export function useFollowPointer({ref, fishNum}) {
    const xPoint = useMotionValue(0);
    const yPoint = useMotionValue(0);
    
    const fishParams = useRef({
        spring: {
            damping: 20 + 30 * Math.random(),
            stiffness: 10 + 15 * Math.random(),
            restDelta: 0.001
        }
    }).current;

    const x = useSpring(xPoint, fishParams.spring)
    const y = useSpring(yPoint, fishParams.spring)
    
    const [isFlipped, setIsFlipped] = useState(false)
    const intervalRef = useRef(null);

    function moveToRandomPoint() {
        if (!ref.current) return;
        
        const fishEl = ref.current;
        const fishWidth = fishEl.offsetWidth;
        const fishHeight = fishEl.offsetHeight;
        const maxX = window.innerWidth - fishWidth;
        const maxY = window.innerHeight - fishHeight;

        const randX = Math.random() * (maxX > 0 ? maxX : 0);
        const randY = Math.random() * (maxY > 0 ? maxY : 0);
        
        const currentX = x.get();
        setIsFlipped(randX > currentX);
        
        xPoint.set(randX);
        yPoint.set(randY);
    }

    useEffect(() => {
        if (ref.current) {
            const maxX = window.innerWidth - 100; 
            const maxY = window.innerHeight - 100; 
            xPoint.set(Math.random() * maxX);
            yPoint.set(Math.random() * maxY);
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
        if (!ref.current) return;

        const fishEl = ref.current;
        const fishWidth = fishEl.offsetWidth;
        const fishHeight = fishEl.offsetHeight;
        const maxX = window.innerWidth - fishWidth;
        const maxY = window.innerHeight - fishHeight;

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
    }, [x, y, xPoint, yPoint]);

    return { x, y, isFlipped }
}
/**
 * ==============   Styles   ================
 */

const fishStyleZero = {
  width: 100,
  height: 100,
  position: "absolute",
};

const fishStyleOne = {
  width: 100,
  height: 100,
  position: "absolute",
};
const fishStyleTwo = {
  width: 100,
  height: 100,
  position: "absolute",
};
const fishStyleThree = {
  width: 100,
  height: 100,
  position: "absolute",
};

const fishStyleFour = {
  width: 100,
  height: 100,
  position: "absolute",
};
