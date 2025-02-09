"use client";

import { frame, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function Drag({ fishNum }) {
    const ref = useRef(null)
    const { x, y, isFlipped } = useFollowPointer({ ref, fishNum })
    switch (fishNum) {
        case 0: return (
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
                    className={"w-full h-full" + " " + (!isFlipped ? " -scale-x-100" : "")}
                />
            </motion.div >
        )
        case 1: return (
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
                    className={"w-full h-full" + " " + (!isFlipped ? " -scale-x-100" : "")}
                />
            </motion.div >
        )
        case 2: return (
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
                    className={"w-full h-full" + " " + (!isFlipped ? " -scale-x-100" : "")}
                />
            </motion.div >
        )
        case 3: return (
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
                    className={"w-full h-full" + " " + (!isFlipped ? " -scale-x-100" : "")}
                />
            </motion.div >)
        case 4: return (
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
                    className={"w-full h-full" + " " + (!isFlipped ? " -scale-x-100" : "")}
                />
            </motion.div >)
    }
}


export function useFollowPointer({ref, fishNum}) {
    const initialX = Math.random() * window.innerWidth
    const initialY = Math.random() * window.innerHeight
    const xPoint = useMotionValue(initialX)
    const yPoint = useMotionValue(initialY)
    
    const fishParams = useRef({
        speed: 0.2 + Math.random() * 0.3,
        amplitude: window.innerWidth * 0.4,    // Make amplitude relative to window width
        verticalRange: 50 + Math.random() * 50,
        offset: Math.random() * Math.PI * 2,
        center: Math.random() * window.innerWidth,  // Random center point for each fish
        spring: {
            damping: 20 + Math.random() * 20,
            stiffness: 5 + Math.random() * 15,
            restDelta: 1
        }
    }).current;

    const x = useSpring(xPoint, fishParams.spring)
    const y = useSpring(yPoint, fishParams.spring)
    
    const [isFlipped, setIsFlipped] = useState(false)

    useEffect(() => {
        if (!ref.current) return

        let lastX = initialX;
        
        const swim = () => {
            const time = Date.now() * 0.001 * fishParams.speed;
            
            // Calculate new position with fish's own center point
            const newX = Math.sin(time + fishParams.offset) * fishParams.amplitude + fishParams.center;
            const newY = Math.cos(time * 0.5) * fishParams.verticalRange + initialY;
            
            // Update position
            xPoint.set(newX);
            yPoint.set(newY);
            
            // Update flip based on movement direction
            if (newX < lastX) {
                setIsFlipped(true);
            } else {
                setIsFlipped(false);
            }
            
            lastX = newX;
            
            requestAnimationFrame(swim);
        };

        const animation = requestAnimationFrame(swim);
        
        return () => cancelAnimationFrame(animation);
    }, []);

    return { x, y, isFlipped }
}
/**
 * ==============   Styles   ================
 */

const fishStyleZero = {
    width: 100,
    height: 100,
    position: "absolute",
}

const fishStyleOne = {
    width: 100,
    height: 100,
    position: "absolute",
}
const fishStyleTwo = {
    width: 100,
    height: 100,
    position: "absolute",
}
const fishStyleThree = {
    width: 100,
    height: 100,
    position: "absolute",
}

const fishStyleFour = {
    width: 100,
    height: 100,
    position: "absolute",
}
