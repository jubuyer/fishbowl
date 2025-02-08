"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from "react"
import GoogleSearch from "@/components/ui/GoogleSearch.jsx"

export default function Page() {
    const { isSignedIn } = useUser();
    const router = useRouter();

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }


    const [currentMode, setMode] = useState("Search Mode")
    const [userQuery, setQuery] = useState("")

    const changeMode = () => {
        if (currentMode === "Search Mode") {
            setMode("AI Mode")
        } else {
            setMode("Search Mode")
        }
    }

    const changeQuery = (value) => {
        setQuery(value)
    }

    const querySubmit = async (e) => {
        if (e.key === "Enter") {
            try {
                const response = await fetch("/get_embeddings", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ query: userQuery }),
                    method: "POST"
                })

                if (response.ok) {
                    try {
                        const embeddingVal = await response.value
                        const checkCache = await fetch("check_cache", {
                            headers: {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ embedding: embeddingVal }),
                                method: "POST"
                            }
                        })


                    } catch (error) {

                    }
                }
            } catch (error) {

            }
        }
    }

    return (
        <div className="bg-white h-screen flex justify-center items-center text-black">
            <div className="flex flex-col items-center gap-10">
                <Image
                    src="/coral.png"
                    height={500}
                    width={500}
                    alt="coral"
                />
                <div className="flex items-center gap-10">
                    {currentMode === "AI Mode" &&
                        <Input
                            onKeyDown={querySubmit}
                            onChange={(e) => changeQuery(e.target.value)}
                            type="input"
                            placeholder="Enter your query"
                            className="w-[50vw]" />
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
            </div>
        </div>
    )
}