"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"

export default function Page(){
    const [currentMode, setMode] = useState("Search Mode")

    const changeMode = () => {
        if(currentMode === "Search Mode"){
            setMode("AI Mode")
        }else{
            setMode("Search Mode")
        }
    }

    return (
        <div className="bg-white h-screen flex justify-center items-center text-black">
            <div className="flex flex-col items-center gap-10">
                <Image
                    src="/coral.png"
                    height= {500}
                    width={500}
                    alt="coral"
                />
                <div className="flex items-center gap-10">
                    <input type="text" placeholder="Enter a query!" className="w-[50vw] border border-black"></input>
                    <div className="flex gap-2 items-center">
                        <Switch
                            onCheckedChange = {changeMode}
                        />
                        <Label className="w-24">{currentMode}</Label>
                    </div>
                </div>
            </div>
        </div>
    )
}