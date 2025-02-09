"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GoogleSearch from "@/components/ui/GoogleSearch.jsx";
import AIChatBox from "@/components/ui/aichat.jsx";
import ChatResponse from "@/components/ui/chatresponse.jsx";
import Drag from "@/components/ui/FishMotion.jsx";
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"


export default function Page() {
    const { isSignedIn } = useUser();
    const { user } = useUser();
    const router = useRouter();

    //   if (user) {
    //     console.log(user.unsafeMetadata);
    //   }

    const [currentMode, setMode] = useState("Search Mode");
    const [response, setResponse] = useState("");
    const [fishList, setFishList] = useState([]);
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
            console.log("here")
        }

    }, []);

    useEffect(() => {
        if (user && user.unsafeMetadata) {
            const points = user.unsafeMetadata.points || 0;
            const loops = Math.floor(points / 20);
            const currentFishList = [];

            for (let i = 0; i < loops; i++) {
                currentFishList.push(i % 5);
            }

            setFishList(currentFishList);
        }
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col justify-start items-center">
            <div className="relative -z-50">
                {fishList.map((fishNum, index) => (
                    <Drag key={index} fishNum={fishNum} />
                ))}
            </div>

            {console.log(fishList)}
            {isSignedIn ? (
                <div className="flex flex-col justify-center items-center gap-10 h-screen">
                    <Image src={`/${user?.unsafeMetadata.points > 100 ? 'coral' : 'small-coral'}.png`} height={user?.unsafeMetadata.points > 100 ? 500 : 100} width={user?.unsafeMetadata.points > 100 ? 500 : 100} alt="coral" />
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
                    <AnimatePresence
                        mode = "poplayout"
                    >
                        {currentMode === "AI Mode" && showResponse &&
                        <motion.div
                            className={`transition-opacity ease-in duration-700`}
                            initial={{ opacity: 0, scale: 0.5 }} 
                            exit={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }} 
                            transition={{duration: 1}}
                        >
                            <ChatResponse
                                userQuery={userQuery}
                                response={response}
                                setResponse={setResponse}
                                showResponse={showResponse}
                                setShowResponse={setShowResponse}
                            />
                        </motion.div>}
                    </AnimatePresence>
                </div>
            ) : (
                <RedirectToSignIn />
            )}
        </div>
    );
}
