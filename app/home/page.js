"use client";

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from "react"
import GoogleSearch from "@/components/ui/GoogleSearch.jsx"
import AIChatBox from "@/components/ui/aichat.jsx"
import ChatResponse from "@/components/ui/chatresponse.jsx"

export default function Page() {
  const { isSignedIn } = useUser();
  const router = useRouter();

    const [currentMode, setMode] = useState("Search Mode")
    const [response, setResponse] = useState("");
    const [showResponse, setShowResponse] = useState(false);

    const changeMode = () => {
        if (currentMode === "Search Mode") {
            setMode("AI Mode")
        } else {
            setMode("Search Mode")
            setShowResponse(false);
        }
  };

    return (
        <div className="bg-white h-screen flex justify-center items-center text-black">
            {isSignedIn ? (
            <div className="flex flex-col items-center gap-10">
                <Image
                    src="/coral.png"
                    height={500}
                    width={500}
                    alt="coral"
                />
                <div className="flex items-center gap-10">
                    {currentMode === "AI Mode" &&
                        <AIChatBox 
                            currentMode={currentMode}
                            response={response}
                            showResponse={showResponse}
                            setResponse={setResponse}
                            setShowResponse={setShowResponse}
                        />
                    }
                    {currentMode === "Search Mode" &&
                            <GoogleSearch/>
                    }

                    <div className="flex gap-2 items-center">
                        <Switch
                            onCheckedChange={changeMode}
                        />
                        <Label className="w-24">{currentMode}</Label>
                    </div>
                </div>
                {currentMode === "AI Mode" && showResponse && (
                    <ChatResponse
                        response={response}
                    />
                )}

            </div>
      ) : (
        <RedirectToSignIn />
      )}
    </div>
  );
}
