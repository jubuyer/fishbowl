"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

const GoogleSearchBox = () => {
  const searchContainerRef = useRef(null);
  const { user } = useUser();

  const updateSearchPoints = async () => {
    try {
      const { searchCount, points } = user.unsafeMetadata;

      await user.update({
        unsafeMetadata: {
          searchCount: searchCount + 1,
          points: points + 10,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const searchStartingCallback = (gname, query) => {
      console.log("Search started with query:", query);
      updateSearchPoints();
      return query;
    };

    window.__gcse = {
      ...window.__gcse,
      searchCallbacks: {
        web: {
          starting: searchStartingCallback,
        },
      },
    };

    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=f0725e85992914228";
    script.async = true;
    document.head.appendChild(script);

    if (
      searchContainerRef.current &&
      !searchContainerRef.current.querySelector(".gcse-search")
    ) {
      const searchDiv = document.createElement("div");
      searchDiv.className = "gcse-search";
      searchContainerRef.current.appendChild(searchDiv);
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);


  return (
    <div ref={searchContainerRef} className="z-100 w-[50vw] rounded-md text-black"></div>
  );

};

export default GoogleSearchBox;
