"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import GoogleSearch from "@/components/ui/GoogleSearch";
import AIChatBox from "@/components/ui/aichat";
import ChatResponse from "@/components/ui/chatresponse";
import Drag from "@/components/ui/FishMotion";

export default function Page() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const [currentMode, setMode] = useState("Search Mode");
  const [response, setResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [userQuery, setQuery] = useState("");

  const changeMode = () => {
    if (currentMode === "Search Mode") {
      setMode("AI Mode");
    } else {
      setMode("Search Mode");
      setShowResponse(false);
    }
  };

  useEffect(() => {
    const initializeMetadata = async () => {
      try {
        await user?.update({
          unsafeMetadata: {
            points: 0,
            searchCount: 0,
          },
        });
      } catch (error) {
        console.error("Error initializing metadata:", error);
      }
    };

    if (user && !user.unsafeMetadata?.points) {
      initializeMetadata();
    }
  }, [user]);

  // Determine fish count
  const rawPoints = user?.unsafeMetadata?.points;
  const parsedPoints = Number(rawPoints);
  const validPoints = Number.isFinite(parsedPoints)
    ? Math.max(0, parsedPoints - 60)
    : 0;
  const FISH_COUNT = Math.floor(validPoints / 10);

  // Store fish data in state so it is only generated when FISH_COUNT changes
  const [fishData, setFishData] = useState([]);

  useEffect(() => {
    // Create a fresh array of fish with stable random values
    const newFish = Array.from({ length: FISH_COUNT }, (_, i) => {
      return {
        id: i,
        fishChoice: Math.floor(Math.random() * 5),
        xOffset: Math.random() * 300,
        yOffset: Math.random() * 300,
      };
    });
    setFishData(newFish);
  }, [FISH_COUNT]);

  const pondRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col justify-start items-center text-white">
      <div
        ref={pondRef}
        className="absolute w-full h-full z-[-300]"
        style={{ overflow: "hidden" }}
      >
        {fishData.map((fish) => (
          <Drag
            key={fish.id}
            fishChoice={fish.fishChoice}
            pondRef={pondRef}
            xOffset={fish.xOffset}
            yOffset={fish.yOffset}
          />
        ))}
      </div>

      {isSignedIn ? (
        <div className="flex flex-col items-center gap-10">
          <Image
            src="/coral.png"
            height={500}
            width={500}
            alt="coral"
            className="z-[-400]"
          />
          <div className="flex items-center gap-10">
            {currentMode === "AI Mode" && (
              <AIChatBox
                userQuery={userQuery}
                setQuery={setQuery}
                currentMode={currentMode}
                response={response}
                showResponse={showResponse}
                setResponse={setResponse}
                setShowResponse={setShowResponse}
              />
            )}
            {currentMode === "Search Mode" && <GoogleSearch />}

            <div className="flex gap-2 items-center">
              <Switch onCheckedChange={changeMode} />
              <Label className="w-24">{currentMode}</Label>
            </div>
          </div>
          {currentMode === "AI Mode" && showResponse && (
            <ChatResponse
              userQuery={userQuery}
              response={response}
              setResponse={setResponse}
              showResponse={showResponse}
              setShowResponse={setShowResponse}
            />
          )}
        </div>
      ) : (
        <RedirectToSignIn />
      )}
    </div>
  );
}
