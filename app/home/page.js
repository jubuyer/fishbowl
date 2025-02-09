"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GoogleSearch from "@/components/ui/GoogleSearch.jsx";

export default function Page() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const [currentMode, setMode] = useState("Search Mode");
  const [userQuery, setQuery] = useState("");

  const changeMode = () => {
    setMode(currentMode === "Search Mode" ? "AI Mode" : "Search Mode");
  };

  const changeQuery = (value) => {
    setQuery(value);
  };

  const querySubmit = async (e) => {
    if (e.key === "Enter") {
      try {
        console.log("in query submit");
        const checkCache = await fetch("/api/check_cache", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: userQuery }),
          method: "POST",
        });
        let data = await checkCache.json();
        console.log(data.result);
        if (!data.result) {
          const response = await fetch("/api/get_ai_response", {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userQuery }),
            method: "POST",
          });
          data = await response.json();
          console.log(data.completion);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="bg-white h-screen flex justify-center items-center text-black">
      {isSignedIn ? (
        <div className="flex flex-col items-center gap-10">
          <Image src="/coral.png" height={500} width={500} alt="coral" />
          <div className="flex items-center gap-10">
            {currentMode === "AI Mode" && (
              <Input
                onKeyDown={querySubmit}
                onChange={(e) => changeQuery(e.target.value)}
                type="input"
                placeholder="Enter your query"
                className="w-[50vw]"
              />
            )}
            {currentMode === "Search Mode" && <GoogleSearch />}

            <div className="flex gap-2 items-center">
              <Switch onCheckedChange={changeMode} />
              <Label className="w-24">{currentMode}</Label>
            </div>
          </div>
        </div>
      ) : (
        <RedirectToSignIn />
      )}
    </div>
  );
}
